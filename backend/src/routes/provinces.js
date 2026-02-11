const express = require('express');
const { supabase } = require('../db/client');

const router = express.Router();

/** GET /provinces — liste des provinces */
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('provinces')
      .select('id, nom, gouvernement')
      .order('nom');
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data || []);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
