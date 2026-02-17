const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { requireAuth, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();
const TABLE = 'utilisateurs';

function sendError(res, status, message) {
  return res.status(status).json({ error: message });
}

function getSupabase() {
  return require('../db/client').supabase;
}

/**
 * POST /auth/register
 * Body: { name, email, password }
 */
// Vérification que les routes auth sont bien montées (GET /auth → 200)
router.get('/', (req, res) => res.json({ ok: true, message: 'Auth routes OK' }));

router.post('/register', async (req, res) => {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return sendError(res, 503, 'Configuration serveur manquante (Supabase). Vérifiez SUPABASE_URL et SUPABASE_ANON_KEY dans backend/.env');
    }
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
      const msg = error.message || error.code || 'Erreur Supabase';
      console.error('[auth/register] Supabase:', msg, error);
      return res.status(500).json({ error: msg });
    }
    const token = jwt.sign(
      { id: data.id, nom: data.nom, email: data.email, role: data.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    return res.status(201).json({ user: data, token });
  } catch (err) {
    const isNullError = err?.message && String(err.message).includes("Cannot read properties of null");
    const status = isNullError ? 503 : 500;
    const msg = isNullError
      ? 'Supabase non initialisé. Redémarrez le backend depuis le dossier backend/ (npm start).'
      : (err?.message || String(err) || 'Erreur serveur');
    console.error('[auth/register]', err?.message || err);
    return res.status(status).json({ error: msg });
  }
});

/**
 * POST /auth/login
 * Body: { email, password }
 */
router.post('/login', async (req, res) => {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return sendError(res, 503, 'Configuration serveur manquante (Supabase). Vérifiez backend/.env');
    }
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
    console.error('[auth/login]', err);
    return res.status(500).json({ error: err.message || 'Erreur serveur' });
  }
});

/**
 * GET /auth/me — protégé par JWT
 */
router.get('/me', requireAuth, (req, res) => {
  return res.json({ user: req.user });
});

module.exports = router;
