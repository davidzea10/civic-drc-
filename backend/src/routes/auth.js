const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { supabase } = require('../db/client');
const { requireAuth, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();
const TABLE = 'utilisateurs';

/**
 * POST /auth/register
 * Body: { name, email, password }
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email et password requis' });
    }
    const mot_de_passe_hash = await bcrypt.hash(password, 10);
    const { data, error } = await supabase
      .from(TABLE)
      .insert({ nom: name, email: email.trim().toLowerCase(), mot_de_passe_hash, role: 'citoyen' })
      .select('id, nom, email, role, cree_le')
      .single();
    if (error) {
      if (error.code === '23505') return res.status(409).json({ error: 'Cet email est déjà utilisé' });
      return res.status(500).json({ error: error.message });
    }
    const token = jwt.sign(
      { id: data.id, nom: data.nom, email: data.email, role: data.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    return res.status(201).json({ user: data, token });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * POST /auth/login
 * Body: { email, password }
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'email et password requis' });
    }
    const { data: user, error } = await supabase
      .from(TABLE)
      .select('id, nom, email, mot_de_passe_hash, role')
      .eq('email', email.trim().toLowerCase())
      .single();
    if (error || !user) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }
    const ok = await bcrypt.compare(password, user.mot_de_passe_hash);
    if (!ok) return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    const token = jwt.sign(
      { id: user.id, nom: user.nom, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    const { mot_de_passe_hash: _, ...safe } = user;
    return res.json({ user: safe, token });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * GET /auth/me — protégé par JWT
 */
router.get('/me', requireAuth, (req, res) => {
  return res.json({ user: req.user });
});

module.exports = router;
