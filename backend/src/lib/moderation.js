/**
 * Appel au service de modération IA (Python Flask).
 * Si MODERATION_URL n'est pas défini dans .env, la modération est désactivée (on accepte tout).
 */

const MODERATION_URL = process.env.MODERATION_URL || 'http://localhost:5001';
const MODERATION_ENABLED = process.env.MODERATION_DISABLED !== '1';

/**
 * Vérifie un ou plusieurs textes auprès du modèle de modération.
 * @param {string|string[]} text - Texte ou tableau de textes (problème + solution + impact)
 * @returns {Promise<{ a_signer: boolean, proba: number }>} - a_signer true = contenu à signaler (refuser)
 */
async function checkModeration(text) {
  if (!MODERATION_ENABLED) {
    return { a_signer: false, proba: 0 };
  }
  const toSend = Array.isArray(text) ? text.join('\n') : String(text || '');
  try {
    const res = await fetch(`${MODERATION_URL}/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: toSend }),
    });
    if (!res.ok) {
      console.warn('[moderation] Service returned', res.status);
      return { a_signer: false, proba: 0 };
    }
    const data = await res.json();
    return { a_signer: Boolean(data.a_signer), proba: Number(data.proba) || 0 };
  } catch (err) {
    console.warn('[moderation] Service unavailable:', err.message);
    return { a_signer: false, proba: 0 };
  }
}

module.exports = { checkModeration, MODERATION_ENABLED, MODERATION_URL };
