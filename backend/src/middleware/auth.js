const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || '';
if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
  console.error('[auth] En production, JWT_SECRET doit être défini dans les variables d\'environnement (Render/Vercel).');
}
const JWT_SECRET_FINAL = JWT_SECRET || 'secret-dev-civic-drc';

/**
 * Middleware : vérifie le token JWT et attache req.user (id, nom, email, role).
 */
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token manquant. En-tête: Authorization: Bearer <token>' });
  }
  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET_FINAL);
    req.user = payload; // { id, nom, email, role }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalide ou expiré' });
  }
}

/**
 * Middleware : exige un des rôles donnés (ex: requireRole('admin'), requireRole('admin', 'responsable_ministere')).
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Non authentifié' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Droits insuffisants', role: req.user.role });
    }
    next();
  };
}

module.exports = { requireAuth, requireRole, JWT_SECRET: JWT_SECRET_FINAL };
