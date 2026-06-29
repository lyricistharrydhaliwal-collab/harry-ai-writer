export const config = { runtime: 'edge' };

const ALLOWED_ORIGINS = [
  'https://www.lyricistharrydhaliwal.com',
  'https://lyricistharrydhaliwal.com',
  'http://localhost:3000'
];

export default async function handler(req) {
  const origin = req.headers.get('origin') || '';
  const allowOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

  const corsHeaders = {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { type, lang, tone, topic } = body;

    if (!topic || topic.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Topic is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const langMap = {
      punjabi: 'Write entirely in Punjabi Gurmukhi script (ਗੁਰਮੁਖੀ)',
      mixed: 'Write in natural mix of Punjabi Gurmukhi and English',
      english: 'Write in English'
    };
    const toneMap = {
      emotional: 'deeply emotional and heartfelt',
      motivational: 'motivational and uplifting',
      nostalgic: 'nostalgic and warm',
      romantic: 'romantic and poetic',
      funny: 'funny and relatable'
    };
    const typeMap = {
      blog: 'a blog post (300-400 words)',
      shayri: 'a beautiful shayri with 4-6 verses',
      story: 'a mini story (200-300 words)',
      caption: '3 social media captions for Instagram, Facebook, and TikTok'
    };

    const prompt = `You are a creative writing assistant for Harry Dhaliwal Shamashpuria, a Punjabi lyricist from Winnipeg, Canada.
Write ${typeMap[type] || typeMap.blog} about: "${topic.trim()}"
Language: ${langMap[lang] || langMap.punjabi}
Tone: ${toneMap[tone] || toneMap.emotional}
Write authentic, heartfelt content that resonates with Punjabi diaspora.
End with: ✍🏽 via HarryDhaliwal.com`;

    const apiResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!apiResponse.ok) {
      const errData = await apiResponse.json();
      return new Response(JSON.stringify({ error: errData.error?.message || 'API error' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const data = await apiResponse.json();
    const text = data.content[0].text;

    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: 'Server error: ' + e.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }\
    });
  }
}
