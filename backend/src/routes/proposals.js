const express = require('express');
const { supabase } = require('../db/client');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
const TABLE = 'propositions';

/** GET /proposals — liste avec filtres optionnels (ministere_id, province_id, statut, sort=popular|recent) */
router.get('/', async (req, res) => {
  try {
    let query = supabase
      .from(TABLE)
      .select(`
        id, probleme, solution, impact, statut, reponse_officielle, cree_le,
        utilisateur_id, ministere_id, province_id,
        ministeres(nom),
        provinces(nom, gouvernement),
        utilisateurs(nom)
      `);
    const { ministere_id, province_id, statut, sort } = req.query;
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

/** GET /proposals/:id/votes — nombre de likes/dislikes + vote de l'utilisateur connecté (optionnel) */
router.get('/:id/votes', async (req, res) => {
  try {
    const { id } = req.params;
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
        const my = (votes || []).find((v) => v.utilisateur_id === payload.id);
        if (my) userVote = my.type_vote;
      } catch (_) {}
    }
    return res.json({ likes, dislikes, userVote });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/** POST /proposals/:id/votes — voter like ou dislike (un vote par utilisateur par proposition) */
router.post('/:id/votes', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { type_vote } = req.body;
    if (!type_vote || !['like', 'dislike'].includes(type_vote)) {
      return res.status(400).json({ error: 'type_vote requis: "like" ou "dislike"' });
    }
    const { data: prop } = await supabase.from(TABLE).select('id').eq('id', id).single();
    if (!prop) return res.status(404).json({ error: 'Proposition introuvable' });
    const payload = {
      utilisateur_id: req.user.id,
      proposition_id: id,
      type_vote,
    };
    const { data, error } = await supabase
      .from('votes')
      .upsert(payload, { onConflict: 'utilisateur_id,proposition_id' })
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/** GET /proposals/:id/comments — liste des commentaires */
router.get('/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('commentaires')
      .select('id, contenu, cree_le, utilisateurs(nom)')
      .eq('proposition_id', id)
      .order('cree_le', { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data || []);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/** POST /proposals/:id/comments — ajouter un commentaire (authentifié) */
router.post('/:id/comments', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { contenu } = req.body;
    if (!contenu || typeof contenu !== 'string' || !contenu.trim()) {
      return res.status(400).json({ error: 'contenu requis' });
    }
    const { data: prop } = await supabase.from(TABLE).select('id').eq('id', id).single();
    if (!prop) return res.status(404).json({ error: 'Proposition introuvable' });
    const payload = {
      utilisateur_id: req.user.id,
      proposition_id: id,
      contenu: contenu.trim(),
    };
    const { data, error } = await supabase
      .from('commentaires')
      .insert(payload)
      .select('id, contenu, cree_le')
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ ...data, utilisateur_nom: req.user.nom });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/** GET /proposals/:id — détail d'une proposition */
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select(`
        id, probleme, solution, impact, statut, reponse_officielle, cree_le,
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
    const payload = {
      utilisateur_id: req.user.id,
      ministere_id: ministere_id || null,
      province_id: province_id || null,
      probleme,
      solution,
      impact: impact || null,
      statut: 'reçue',
    };
    const { data, error } = await supabase
      .from(TABLE)
      .insert(payload)
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
