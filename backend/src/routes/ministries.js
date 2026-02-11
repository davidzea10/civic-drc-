const express = require('express');
const { supabase } = require('../db/client');

const router = express.Router();

/** GET /ministries — liste des ministères */
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('ministeres')
      .select('id, nom, description, attributions')
      .order('nom');
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data || []);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
