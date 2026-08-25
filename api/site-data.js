// api/site-data.js
// Serves the same live site-knowledge.json to the browser widget, so it can
// build promo chips (new song, new chapter, etc.) without exposing GitHub
// directly to visitors and without CORS issues.

const SITE_DATA_URL = 'https://raw.githubusercontent.com/lyricistharrydhaliwal-collab/harry-ai-writer/main/data/site-knowledge.json';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 'public, max-age=120'); // 2 min edge cache is plenty

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const r = await fetch(SITE_DATA_URL, { cache: 'no-store' });
    if (!r.ok) {
      return res.status(200).json({ promotions: [] });
    }
    const data = await r.json();
    return res.status(200).json({
      promotions: Array.isArray(data.promotions) ? data.promotions : []
    });
  } catch (err) {
    console.error('site-data handler error:', err);
    return res.status(200).json({ promotions: [] });
  }
}
