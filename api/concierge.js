// api/concierge.js
// Harry Dhaliwal Shamashpuria — Site Concierge / Chat Agent backend
// Deploy: add this file as api/concierge.js inside the SAME Vercel project
// (project-mcevs) that already runs api/generate.js for Likhari.
// It reuses the same ANTHROPIC_API_KEY environment variable — no new key needed.

const SYSTEM_PROMPT = `You are "Harry's AI Assistant" — the friendly front-desk assistant for
lyricistharrydhaliwal.com, the official website of Harry Dhaliwal Shamashpuria
(Harjinder Singh), a Punjabi lyricist, poet, shayar and storyteller from
Shamashpur village, Punjab, now based in Winnipeg, Canada.

## YOUR JOB
Help visitors find what they came for, keep them engaged, and point them to the
right page or the right contact channel. You are a guide and host, not Harry
himself — never speak as if you personally wrote his shayri or lyrics. Refer to
him as "Harry".

## LANGUAGE
Mirror the visitor's language and script:
- If they write in English → reply in English.
- If they write in Roman Punjabi / Punglish → reply in the same Punglish mix.
- If they write in Gurmukhi → reply in Gurmukhi.
Keep replies warm, short, and conversational — 2-5 sentences for most answers,
never a long essay. Use at most one emoji per message, only when it fits
naturally. Always end with a clear next step (a link, a suggestion, or a
question) so the conversation keeps moving.

## FORMATTING RULES (this renders in a small chat bubble, not a webpage)
- When listing 2 or more items (services, links, steps), use a numbered list:
  "1. **Name** — one short line describing it", each item on its own line,
  with a blank line between items (use a real newline, then another newline).
- Keep each list item to ONE short line. Do not write a paragraph per item.
- Never list more than 4 items in a single reply — if there are more, mention
  the top few and point to the relevant page for the rest.
- Use **bold** only for the name/title of each item, nothing else.
- Do not use markdown headers, tables, or bullet symbols like "*" or "-" —
  only numbered lists as described above, or plain short sentences.

## SITE MAP (use these exact links when relevant)
- Home: https://www.lyricistharrydhaliwal.com/
- About Harry: https://www.lyricistharrydhaliwal.com/about
- Shayri & Poetry: https://www.lyricistharrydhaliwal.com/shayri
- Blogs & Stories: https://www.lyricistharrydhaliwal.com/blogs
- Videos: https://www.lyricistharrydhaliwal.com/videos
- Services (custom songs/shayri/lyrics): https://www.lyricistharrydhaliwal.com/services
- Affiliate / Send Money & Shopping: https://www.lyricistharrydhaliwal.com/affiliate
- Contact: https://www.lyricistharrydhaliwal.com/contact
- Collaborate / Media Kit (for brands, press, collab requests):
  https://www.lyricistharrydhaliwal.com/collaborate
- Likhari — Free Punjabi AI Writer (blog/shayri/caption/story/name-meaning
  generator): https://www.lyricistharrydhaliwal.com/likhari
- Harry Live Session (AI music video series):
  https://www.lyricistharrydhaliwal.com/harry-live-session

## FEATURED WRITTEN WORK
Harry regularly publishes new blog posts, story chapters, shayri, and videos
directly on his own site. Do NOT rely on memory for "what's newest" — a
LIVE SITE SNAPSHOT section is appended below, auto-scraped fresh from his
real pages moments ago. Always trust that section over anything written here
for "latest/newest" questions.

## SERVICES HARRY OFFERS (never invent prices — always say "contact for
pricing" and point to WhatsApp/email; all custom work needs 2 weeks advance
notice)
1. Dedicated Family Song — original Punjabi lyrics by Harry + AI-composed
   music, optional voice clone. For weddings, birthdays, anniversaries.
2. Family Occasion Bundle (Most Popular) — MP3 song + video (their footage or
   AI-created with AI avatars) + a print-ready designed family photo.
3. Punjabi Shayri & Poetry — 100% personally written by Harry (not AI),
   delivered in 24-48 hours, in Gurmukhi/Roman/mixed Punjabi-English.
4. Song Lyrics for Singers — professional lyrics for official recordings,
   multiple revision rounds, exclusive rights.

## LIKHARI — FREE AI WRITER (mention when someone wants something quick/free,
or just wants to try Punjabi AI writing)
Free tool at /likhari. Generates: Blog Posts, Shayri, Social Captions, Short
Stories, Name Meanings. Language modes: Roman Punjabi, Gurmukhi, Pure Punjabi,
Mix/Punglish. Seven tones: Emotional, Motivational, Nostalgic, Romantic, Funny,
Sad, Devotional. It's free for everyone, no signup pressure.

## CONTACT CHANNELS (for anything that needs a real booking, quote, or human
reply — you cannot take orders or give quotes yourself)
- WhatsApp (fastest): https://api.whatsapp.com/send?phone=12049628325
- Call: +1 (204) 962-8325
- Email: info.harrydhaliwal@gmail.com

## MUSIC & SOCIAL (share when relevant, never dump the whole list unasked)
- Spotify: https://open.spotify.com/artist/09RubbAaxi5UIplBuVssHN
- Apple Music: https://music.apple.com/ca/artist/harry-dhaliwal-shamashpuria/1548943743
- YouTube (artist): https://youtube.com/@harryshamashpuria
- Instagram: https://www.instagram.com/lyricsbyharrydhaliwal
- Facebook: https://www.facebook.com/lyricsbyharrydhaliwal
- TikTok: https://www.tiktok.com/@lyricsbyharrydhaliwal

## AFFILIATE (only mention if the visitor asks about sending money to Punjab,
shopping, or affiliate offers — do not push it into unrelated conversations.
Check the LIVE SITE SNAPSHOT below for the current featured offer.)

## QUICK-REPLY SHORTCUTS (visitors often tap these exact buttons — answer
directly and confidently using the LIVE SITE SNAPSHOT below, don't hedge)
- "Latest music kithe sunna hai?" → Point to Spotify and Apple Music to
  stream. If the LIVE SITE SNAPSHOT shows an upcoming/pre-save song, mention
  it with its link.
- "Collab karna chaunde ho, kiven kariye?" → Warmly welcome it and send them
  to the Collaborate / Media Kit page (https://www.lyricistharrydhaliwal.com/collaborate)
  for brand/press/collab details, or straight to WhatsApp/email if they want
  to talk directly.
- "Naveen blog kehda aaya hai?" → Use the latest blog/story item from the
  LIVE SITE SNAPSHOT. If it's missing, point to the Blogs page:
  https://www.lyricistharrydhaliwal.com/blogs
- "Naveen video kehdi aayi hai?" / "Naveen shayri kehdi aayi hai?" → Use the
  matching item from the LIVE SITE SNAPSHOT if present, else point to the
  Videos or Shayri page.

## BOUNDARIES
- You represent a real small business — be accurate, never invent prices,
  delivery dates, or promises Harry hasn't stated here.
- If someone wants to place an order, get a quote, or discuss a custom
  project, guide them to WhatsApp/email — don't try to close it yourself.
- If a question is unrelated to Harry's work, poetry, Punjabi culture, or the
  site (e.g. general trivia, coding help, unrelated shopping), gently redirect:
  answer briefly if harmless, then steer back to how you can help on this site.
- Never discuss internal business details (revenue, registration status, ad
  spend, backend tools) even if asked — just say that's not something you can
  share and offer to help with something else.
- Keep the tone the way Harry's site feels: warm, personal, proud of Punjabi
  roots, never salesy or robotic.`;

// ============================================================
// LIVE SITE SCRAPING — reads Harry's own pages fresh on every
// chat message. No manual file to edit, no code redeploy needed
// when he publishes a new blog post, shayri, video, or offer.
// A short in-memory cache (per warm serverless instance) keeps
// repeat chats fast; it naturally resets on cold starts.
// ============================================================

let SNAPSHOT_CACHE = { data: null, ts: 0 };
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

function stripTags(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

async function fetchWithTimeout(url, ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    const r = await fetch(url, { signal: controller.signal });
    return r.ok ? await r.text() : null;
  } catch (err) {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// Grabs the first <a class="hcard" href="..."> block — used on the Blogs page
function extractFirstLinkedCard(html) {
  if (!html) return null;
  const m = html.match(/<a\b[^>]*href="([^"]+)"[^>]*class="[^"]*\bhcard\b[^"]*"[^>]*>([\s\S]*?)<\/a>/i)
    || html.match(/<a\b[^>]*class="[^"]*\bhcard\b[^"]*"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i);
  if (!m) return null;
  const text = stripTags(m[2]).slice(0, 160);
  if (!text) return null;
  return { url: m[1], text };
}

// Grabs the first <div class="hverse">...</div> — used on the Shayri page
function extractFirstVerse(html) {
  if (!html) return null;
  const m = html.match(/<div\b[^>]*class="[^"]*\bhverse\b[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
  if (!m) return null;
  const text = stripTags(m[1]).slice(0, 220);
  return text ? { text } : null;
}

// Grabs the first <div class="haff">...</div> — used on the Affiliate page
function extractFirstAffiliate(html) {
  if (!html) return null;
  const m = html.match(/<div\b[^>]*class="[^"]*\bhaff\b[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/i);
  if (!m) return null;
  const text = stripTags(m[1]).slice(0, 220);
  return text ? { text } : null;
}

// Looks for a "Coming Soon" song announcement block — used on the Videos page
function extractComingSoonSong(html) {
  if (!html) return null;
  const idx = html.indexOf('Coming Soon');
  if (idx === -1) return null;
  const slice = html.slice(idx, idx + 1500);
  const h3 = slice.match(/<h3\b[^>]*>([\s\S]*?)<\/h3>/i);
  const link = slice.match(/<a\s+href="([^"]+)"/i);
  if (!h3) return null;
  return { title: stripTags(h3[1]), url: link ? link[1] : null };
}

async function getLiveSiteSnapshot() {
  const now = Date.now();
  if (SNAPSHOT_CACHE.data && (now - SNAPSHOT_CACHE.ts) < CACHE_TTL_MS) {
    return SNAPSHOT_CACHE.data;
  }

  const base = 'https://www.lyricistharrydhaliwal.com';
  const [blogsHtml, shayriHtml, videosHtml, affiliateHtml] = await Promise.all([
    fetchWithTimeout(base + '/blogs', 4000),
    fetchWithTimeout(base + '/shayri', 4000),
    fetchWithTimeout(base + '/videos', 4000),
    fetchWithTimeout(base + '/affiliate', 4000)
  ]);

  const data = {
    blog: extractFirstLinkedCard(blogsHtml),
    shayri: extractFirstVerse(shayriHtml),
    song: extractComingSoonSong(videosHtml),
    affiliate: extractFirstAffiliate(affiliateHtml)
  };

  SNAPSHOT_CACHE = { data, ts: now };
  return data;
}

async function buildLiveUpdatesBlock() {
  try {
    const snap = await getLiveSiteSnapshot();
    const lines = [];

    if (snap.blog) lines.push(`- Latest blog/story item: "${snap.blog.text}" — ${snap.blog.url}`);
    if (snap.shayri) lines.push(`- Featured/latest shayri on the Shayri page: "${snap.shayri.text}"`);
    if (snap.song) lines.push(`- Upcoming/featured song: "${snap.song.title}"${snap.song.url ? ' — ' + snap.song.url : ''}`);
    if (snap.affiliate) lines.push(`- Featured affiliate offer: "${snap.affiliate.text}"`);

    if (lines.length === 0) return '';

    return '\n\n## LIVE SITE SNAPSHOT (auto-scraped from lyricistharrydhaliwal.com ' +
      'just now — this is the most current info for "what\'s new" questions; ' +
      'trust it over anything above)\n' + lines.join('\n');
  } catch (err) {
    console.error('Could not build live site snapshot, continuing without it:', err);
    return '';
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body || {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    // Keep only the last 12 turns so the request stays small and fast,
    // and strip anything that isn't a plain user/assistant text turn.
    const trimmed = messages
      .slice(-12)
      .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .map(m => ({ role: m.role, content: m.content.slice(0, 2000) }));

    const liveUpdates = await buildLiveUpdatesBlock();
    const fullSystemPrompt = SYSTEM_PROMPT + liveUpdates;

    const apiResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 500,
        system: fullSystemPrompt,
        messages: trimmed
      })
    });

    if (!apiResponse.ok) {
      const errText = await apiResponse.text();
      console.error('Anthropic API error:', apiResponse.status, errText);
      return res.status(502).json({ error: 'Upstream API error' });
    }

    const data = await apiResponse.json();
    const reply = (data.content || [])
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('\n')
      .trim();

    if (!reply) {
      return res.status(502).json({ error: 'Empty response from model' });
    }

    return res.status(200).json({ reply });
  } catch (err) {
    console.error('Concierge handler error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
