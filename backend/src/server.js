// Entry point backend — charger .env en premier depuis backend/
const path = require('path');
const envPath = path.resolve(__dirname, '..', '.env');
require('dotenv').config({ path: envPath });

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const { supabase, testConnection } = require('./db/client');
const authRoutes = require('./routes/auth');

if (!supabase) {
  console.warn('⚠️  Supabase non configuré : vérifiez SUPABASE_URL et SUPABASE_ANON_KEY (ou SUPABASE_SERVICE_ROLE_KEY) dans backend/.env');
} else {
  const hasServiceRole = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  console.log('✓ Supabase configuré', hasServiceRole ? '(clé service_role — écriture BDD OK)' : '(clé anon — exécutez supabase_rls_policies.sql si votes/commentaires ne s\'enregistrent pas)');
}
const { MODERATION_ENABLED, MODERATION_URL } = require('./lib/moderation');
const ministriesRoutes = require('./routes/ministries');
const provincesRoutes = require('./routes/provinces');
const proposalsRoutes = require('./routes/proposals');
const adminProposalsRoutes = require('./routes/adminProposals');

if (MODERATION_ENABLED) {
  console.log('✓ Modération IA activée →', MODERATION_URL, '(démarrer avec: python moderation_server.py)');
} else {
  console.log('○ Modération IA désactivée (MODERATION_DISABLED=1)');
}

// Routes (ordre important)
app.get('/auth', (req, res) => res.json({ ok: true, message: 'Auth routes OK' }));
app.use('/auth', authRoutes);
app.use('/ministries', ministriesRoutes);
app.use('/provinces', provincesRoutes);
app.use('/proposals', proposalsRoutes);
app.use('/admin/proposals', adminProposalsRoutes);

// Diagnostic votes/commentaires : GET http://localhost:3000/proposals-votes-test
app.get('/proposals-votes-test', async (req, res) => {
  const { supabase } = require('./db/client');
  if (!supabase) return res.status(503).json({ error: 'Supabase non configuré' });
  try {
    const { data, error } = await supabase.from('votes').select('id').limit(1);
    const { data: cData, error: cError } = await supabase.from('commentaires').select('id').limit(1);
    return res.json({
      votes: error ? { error: error.message, code: error.code } : { ok: true, count: (data || []).length },
      commentaires: cError ? { error: cError.message, code: cError.code } : { ok: true, count: (cData || []).length },
      hint: 'Si error = "relation \"votes\" does not exist" → exécutez supabase_tables_votes_commentaires.sql. Si permission denied → ajoutez SUPABASE_SERVICE_ROLE_KEY ou RLS.',
    });
  } catch (e) {
    return res.status(500).json({ error: String(e.message || e) });
  }
});

// Diagnostic : racine et health pour vérifier que c'est bien ce backend
app.get('/', (req, res) => {
  res.json({ app: 'CIVIC-DRC backend', auth: '/auth', health: '/health' });
});
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'CIVIC-DRC backend running' });
});

// Test connexion base Supabase (pour Postman)
app.get('/db-test', async (req, res) => {
  try {
    const result = await testConnection();
    if (result.ok) {
      return res.json({ ok: true, message: result.message });
    }
    const errorMsg = result.error || result.message || 'Erreur inconnue';
    return res.status(500).json({ ok: false, error: errorMsg });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

// Fallback 404 (si vous voyez ceci pour /auth, ce n'est pas le bon serveur sur le port 3000)
app.use((req, res) => {
  res.status(404).json({ error: 'Not found', app: 'CIVIC-DRC backend' });
});

// Éviter les sorties silencieuses en cas d'erreur
process.on('uncaughtException', (err) => {
  console.error('Erreur fatale:', err);
  process.exit(1);
});
process.on('unhandledRejection', (reason, p) => {
  console.error('Rejection non gérée:', reason);
});

app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
  console.log('→ Gardez ce terminal ouvert. Arrêt : Ctrl+C');
});
