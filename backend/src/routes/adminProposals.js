const express = require('express');
const { supabase } = require('../db/client');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();
const TABLE = 'propositions';

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
