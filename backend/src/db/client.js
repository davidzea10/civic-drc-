// .env est chargé par server.js avant require de ce module.
// Si ce fichier est chargé seul (tests), charger .env ici :
if (!process.env.SUPABASE_URL) {
  const path = require('path');
  require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });
}

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = (process.env.SUPABASE_URL || '').trim();
const supabaseAnonKey = (process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || '').trim();
// Service role contourne RLS — indispensable pour votes/commentaires si RLS est actif
const supabaseServiceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
const supabaseKey = supabaseServiceKey || supabaseAnonKey;
const usingServiceRole = Boolean(supabaseServiceKey);

const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

if (!supabase && (supabaseUrl || supabaseKey)) {
  console.warn('[db/client] SUPABASE_URL ou clé invalide (vérifiez .env)');
} else if (supabase && !usingServiceRole) {
  console.warn('[db/client] Vous utilisez la clé anon. Pour enregistrer votes/commentaires, ajoutez SUPABASE_SERVICE_ROLE_KEY dans backend/.env OU exécutez les politiques RLS (votes/commentaires) dans supabase_rls_policies.sql');
}

/**
 * Teste la connexion à Supabase (avec URL + anon key uniquement).
 * @returns {Promise<{ ok: boolean, message?: string, error?: string }>}
 */
async function testConnection() {
  if (!supabaseUrl || !supabaseKey) {
    return {
      ok: false,
      error: 'SUPABASE_URL et SUPABASE_ANON_KEY (ou SUPABASE_SERVICE_ROLE_KEY) requis dans .env',
    };
  }
  if (!supabase) {
    return { ok: false, error: 'Client Supabase non initialisé' };
  }
  try {
    // Test simple via l'API (aucune table requise)
    const { error } = await supabase.auth.getSession();
    if (error) {
      return { ok: false, error: error.message };
    }
    return { ok: true, message: 'Connexion Supabase réussie' };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

module.exports = { supabase, testConnection };
