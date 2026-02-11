const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const { createClient } = require('@supabase/supabase-js');

// Comme d'habitude : URL du projet + clé anon (Settings → API)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

/**
 * Teste la connexion à Supabase (avec URL + anon key uniquement).
 * @returns {Promise<{ ok: boolean, message?: string, error?: string }>}
 */
async function testConnection() {
  if (!supabaseUrl || !supabaseKey) {
    return {
      ok: false,
      error: 'SUPABASE_URL et SUPABASE_ANON_KEY (ou SUPABASE_KEY) requis dans .env (Settings → API)',
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
