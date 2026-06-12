const crypto = require('crypto');

/* Proxy lecture seule vers l'API Pipedrive.
   Le token Pipedrive (PIPEDRIVE_API_TOKEN) et le mot de passe équipe
   (DASHBOARD_PASSWORD) sont des variables d'environnement Vercel —
   rien ne transite côté navigateur. */

const ALLOWED = [
  /^\/ping$/,
  /^\/deals$/,
  /^\/organizations$/,
  /^\/organizations\/\d+$/,
  /^\/organizationFields$/,
  /^\/notes$/
];

function safeEq(a, b) {
  const ba = Buffer.from(String(a)), bb = Buffer.from(String(b));
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
}

module.exports = async (req, res) => {
  const expected = process.env.DASHBOARD_PASSWORD || '';
  const key = req.headers['x-dash-key'] || '';
  if (!expected || !safeEq(key, expected)) {
    res.status(401).json({ success: false, error: 'Mot de passe incorrect' });
    return;
  }

  const { path = '', ...params } = req.query;
  if (!ALLOWED.some(rx => rx.test(path))) {
    res.status(400).json({ success: false, error: 'Endpoint non autorisé : ' + path });
    return;
  }
  if (path === '/ping') {
    res.status(200).json({ success: true });
    return;
  }

  const token = process.env.PIPEDRIVE_API_TOKEN;
  if (!token) {
    res.status(500).json({ success: false, error: 'PIPEDRIVE_API_TOKEN non configuré côté Vercel' });
    return;
  }

  const u = new URL('https://api.pipedrive.com/v1' + path);
  for (const [k, v] of Object.entries(params)) u.searchParams.set(k, Array.isArray(v) ? v[0] : v);
  u.searchParams.set('api_token', token);

  try {
    const r = await fetch(u);
    const body = await r.text();
    res.status(r.status).setHeader('content-type', 'application/json').send(body);
  } catch (e) {
    res.status(502).json({ success: false, error: 'Pipedrive injoignable : ' + e.message });
  }
};
