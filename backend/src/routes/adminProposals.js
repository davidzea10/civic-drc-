const express = require('express');
const { supabase } = require('../db/client');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();
const TABLE = 'propositions';
const PUBLIE_SANS_REPONSE = '— Publié sans réponse officielle.';

/** GET /admin/stats — statistiques pour l'admin (propositions, à modérer, etc.) */
router.get('/stats', requireAuth, requireRole('admin', 'responsable_ministere'), async (req, res) => {
  try {
    const { data: all, error: e1 } = await supabase.from(TABLE).select('id, statut, a_moderer, reponse_officielle');
    if (e1) return res.status(500).json({ error: e1.message });
    const total = (all || []).length;
    const byStatut = (all || []).reduce((acc, p) => {
      acc[p.statut] = (acc[p.statut] || 0) + 1;
      return acc;
    }, {});
    const aModerer = (all || []).filter((p) => p.a_moderer === true).length;
    const publiees = (all || []).filter((p) => p.reponse_officielle != null && p.reponse_officielle.trim() !== '').length;
    const { data: comments, error: e2 } = await supabase.from('commentaires').select('id, a_moderer');
    if (e2) return res.status(500).json({ error: e2.message });
    const commentairesTotal = (comments || []).length;
    const commentairesAModerer = (comments || []).filter((c) => c.a_moderer === true).length;
    return res.json({
      propositions: { total, a_moderer: aModerer, publiees, par_statut: byStatut },
      commentaires: { total: commentairesTotal, a_moderer: commentairesAModerer },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/** PATCH /admin/proposals/:id/publish — publier sans réponse officielle (visible en liste publique) */
router.patch('/:id/publish', requireAuth, requireRole('admin', 'responsable_ministere'), async (req, res) => {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .update({ reponse_officielle: PUBLIE_SANS_REPONSE })
      .eq('id', req.params.id)
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    if (!data) return res.status(404).json({ error: 'Proposition introuvable' });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/** DELETE /admin/proposals/:id — supprimer une proposition (admin / responsable_ministere) */
router.delete('/:id', requireAuth, requireRole('admin', 'responsable_ministere'), async (req, res) => {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .delete()
      .eq('id', req.params.id)
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    if (!data) return res.status(404).json({ error: 'Proposition introuvable' });
    return res.json({ deleted: true, id: req.params.id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/** PATCH /admin/proposals/:id/status */
router.patch('/:id/status', requireAuth, requireRole('admin', 'responsable_ministere'), async (req, res) => {
  try {
    const { statut } = req.body;
    const allowed = ['reçue', 'en_analyse', 'retenue', 'en_cours_execution'];
    if (!statut || !allowed.includes(statut)) {
      return res.status(400).json({ error: 'statut invalide', allowed });
    }
    const { data, error } = await supabase
      .from(TABLE)
      .update({ statut })
      .eq('id', req.params.id)
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    if (!data) return res.status(404).json({ error: 'Proposition introuvable' });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/** POST /admin/proposals/:id/response */
router.post('/:id/response', requireAuth, requireRole('admin', 'responsable_ministere'), async (req, res) => {
  try {
    const { reponse_officielle } = req.body;
    if (typeof reponse_officielle !== 'string') {
      return res.status(400).json({ error: 'reponse_officielle (texte) requis' });
    }
    const { data, error } = await supabase
      .from(TABLE)
      .update({ reponse_officielle: reponse_officielle.trim() })
      .eq('id', req.params.id)
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    if (!data) return res.status(404).json({ error: 'Proposition introuvable' });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
