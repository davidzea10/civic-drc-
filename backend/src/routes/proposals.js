const express = require('express');
const { supabase } = require('../db/client');
const { requireAuth } = require('../middleware/auth');
const { checkModeration } = require('../lib/moderation');

const router = express.Router();
const TABLE = 'propositions';

/** GET /proposals — liste avec filtres */
router.get('/', async (req, res) => {
  try {
    let query = supabase
      .from(TABLE)
      .select(`
        id, probleme, solution, impact, statut, reponse_officielle, cree_le, taux_moderation, a_moderer,
        utilisateur_id, ministere_id, province_id,
        ministeres(nom),
        provinces(nom, gouvernement),
        utilisateurs(nom)
      `);
    const { ministere_id, province_id, statut, sort, officielles, mes_en_attente } = req.query;

    if (mes_en_attente === '1' && req.headers.authorization?.startsWith('Bearer ')) {
      try {
        const jwt = require('jsonwebtoken');
        const token = req.headers.authorization.slice(7);
        const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret-dev-civic-drc');
        query = query.eq('utilisateur_id', payload.id).is('reponse_officielle', null);
      } catch (_) {
        return res.status(401).json({ error: 'Token invalide pour mes_en_attente' });
      }
    } else if (officielles !== '0') {
      query = query.not('reponse_officielle', 'is', null);
    }

    if (ministere_id) query = query.eq('ministere_id', ministere_id);
    if (province_id) query = query.eq('province_id', province_id);
    if (statut) query = query.eq('statut', statut);
    if (sort === 'recent') query = query.order('cree_le', { ascending: false });
    else query = query.order('cree_le', { ascending: false });
    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data || []);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/** POST /proposals — créer une proposition (authentifié) */
router.post('/', requireAuth, async (req, res) => {
  try {
    const { ministere_id, province_id, probleme, solution, impact } = req.body;
    if (!probleme || !solution) {
      return res.status(400).json({ error: 'probleme et solution requis' });
    }
    if (!ministere_id && !province_id) {
      return res.status(400).json({ error: 'ministere_id ou province_id requis' });
    }
    const textToModerate = [probleme, solution, impact].filter(Boolean).join('\n');
    const { a_signer, proba } = await checkModeration(textToModerate);
    const taux_moderation = Math.round((proba || 0) * 100);
    const payload = {
      utilisateur_id: req.user.id,
      ministere_id: ministere_id || null,
      province_id: province_id || null,
      probleme,
      solution,
      impact: impact || null,
      statut: 'reçue',
      taux_moderation,
      a_moderer: Boolean(a_signer),
    };
    const { data, error } = await supabase
      .from(TABLE)
      .insert(payload)
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ ...data, taux_moderation: data.taux_moderation ?? taux_moderation, a_moderer: data.a_moderer ?? Boolean(a_signer) });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Sous-router pour /proposals/:id (détail, votes, commentaires) — évite confusion de routes
const byIdRouter = express.Router({ mergeParams: true });

/** GET /proposals/:id/votes */
byIdRouter.get('/votes', async (req, res) => {
  try {
    const id = req.params.id;
    if (!supabase) return res.status(503).json({ error: 'Base de données non configurée' });
    const { data: votes, error } = await supabase
      .from('votes')
      .select('type_vote, utilisateur_id')
      .eq('proposition_id', id);
    if (error) return res.status(500).json({ error: error.message });
    const likes = (votes || []).filter((v) => v.type_vote === 'like').length;
    const dislikes = (votes || []).filter((v) => v.type_vote === 'dislike').length;
    let userVote = null;
    if (req.headers.authorization?.startsWith('Bearer ')) {
      try {
        const jwt = require('jsonwebtoken');
        const token = req.headers.authorization.slice(7);
        const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret-dev-civic-drc');
        const my = (votes || []).find((v) => String(v.utilisateur_id) === String(payload.id));
        if (my) userVote = my.type_vote;
      } catch (_) {}
    }
    return res.json({ likes, dislikes, userVote });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/** POST /proposals/:id/votes — like/dislike, enregistré en BDD */
byIdRouter.post('/votes', requireAuth, async (req, res) => {
  const id = req.params.id;
  const { type_vote } = req.body;

  console.log('[POST /proposals/:id/votes] reçu', { id, type_vote, userId: req.user?.id });

  if (!supabase) {
    return res.status(503).json({ error: 'Base de données non configurée. Vérifiez backend/.env (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY).' });
  }
  if (!type_vote || !['like', 'dislike'].includes(type_vote)) {
    return res.status(400).json({ error: 'type_vote requis: "like" ou "dislike"' });
  }

  try {
    const { data: prop, error: propError } = await supabase.from(TABLE).select('id').eq('id', id).single();
    if (propError || !prop) return res.status(404).json({ error: 'Proposition introuvable' });

    const utilisateur_id = req.user.id;
    const proposition_id = id;

    const { data: existing } = await supabase
      .from('votes')
      .select('id, type_vote')
      .eq('utilisateur_id', utilisateur_id)
      .eq('proposition_id', proposition_id)
      .maybeSingle();

    let result;
    if (existing) {
      const { data, error } = await supabase
        .from('votes')
        .update({ type_vote })
        .eq('utilisateur_id', utilisateur_id)
        .eq('proposition_id', proposition_id)
        .select()
        .single();
      if (error) {
        console.error('[POST votes] update error', error);
        return res.status(500).json({ error: error.message, code: error.code, detail: error.details });
      }
      result = data;
      console.log('[POST votes] mis à jour OK');
    } else {
      const { data, error } = await supabase
        .from('votes')
        .insert({ utilisateur_id, proposition_id, type_vote })
        .select()
        .single();
      if (error) {
        console.error('[POST votes] insert error', error);
        return res.status(500).json({ error: error.message, code: error.code, detail: error.details });
      }
      result = data;
      console.log('[POST votes] inséré OK');
    }
    return res.json(result);
  } catch (err) {
    console.error('[POST votes]', err);
    return res.status(500).json({ error: err.message || 'Erreur serveur' });
  }
});

/** GET /proposals/:id/comments */
byIdRouter.get('/comments', async (req, res) => {
  try {
    const id = req.params.id;
    if (!supabase) return res.status(503).json({ error: 'Base de données non configurée' });
    const { data, error } = await supabase
      .from('commentaires')
      .select('id, contenu, cree_le, taux_moderation, a_moderer, utilisateurs(nom)')
      .eq('proposition_id', id)
      .order('cree_le', { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data || []);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/** POST /proposals/:id/comments */
byIdRouter.post('/comments', requireAuth, async (req, res) => {
  const id = req.params.id;
  const { contenu } = req.body;

  console.log('[POST /proposals/:id/comments] reçu', { id, userId: req.user?.id });

  if (!supabase) {
    return res.status(503).json({ error: 'Base de données non configurée. Vérifiez backend/.env (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY).' });
  }
  if (!contenu || typeof contenu !== 'string' || !contenu.trim()) {
    return res.status(400).json({ error: 'contenu requis' });
  }

  const { a_signer, proba } = await checkModeration(contenu.trim());
  const taux_moderation = Math.round((proba || 0) * 100);

  try {
    const { data: prop, error: propError } = await supabase.from(TABLE).select('id').eq('id', id).single();
    if (propError || !prop) return res.status(404).json({ error: 'Proposition introuvable' });

    const { data, error } = await supabase
      .from('commentaires')
      .insert({
        utilisateur_id: req.user.id,
        proposition_id: id,
        contenu: contenu.trim(),
        taux_moderation,
        a_moderer: Boolean(a_signer),
      })
      .select('id, contenu, cree_le, taux_moderation, a_moderer')
      .single();

    if (error) {
      console.error('[POST comments]', error);
      return res.status(500).json({ error: error.message, code: error.code, detail: error.details });
    }
    console.log('[POST comments] inséré OK');
    return res.status(201).json({
      ...data,
      utilisateur_nom: req.user.nom,
      taux_moderation: data.taux_moderation ?? taux_moderation,
      a_moderer: data.a_moderer ?? Boolean(a_signer),
    });
  } catch (err) {
    console.error('[POST comments]', err);
    return res.status(500).json({ error: err.message || 'Erreur serveur' });
  }
});

/** GET /proposals/:id — détail */
byIdRouter.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select(`
        id, probleme, solution, impact, statut, reponse_officielle, cree_le, taux_moderation, a_moderer,
        utilisateur_id, ministere_id, province_id,
        ministeres(nom, description, attributions),
        provinces(nom, gouvernement),
        utilisateurs(nom, email)
      `)
      .eq('id', req.params.id)
      .single();
    if (error) {
      if (error.code === 'PGRST116') return res.status(404).json({ error: 'Proposition introuvable' });
      return res.status(500).json({ error: error.message });
    }
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.use('/:id', byIdRouter);

module.exports = router;
