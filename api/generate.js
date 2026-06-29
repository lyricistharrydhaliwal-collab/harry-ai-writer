export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': 'https://www.lyricistharrydhaliwal.com',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const body = await req.json();
    const { type, lang, tone, topic } = body;

    if (!topic || topic.length > 500) {
      return new Response(JSON.stringify({ error: 'Invalid topic' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
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
Write ${typeMap[type] || typeMap.blog} about: "${topic}"
Language: ${langMap[lang] || langMap.punjabi}
Tone: ${toneMap[tone] || toneMap.emotional}
Write authentic, heartfelt content that resonates with Punjabi diaspora.
End with: ✍🏽 via HarryDhaliwal.com`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
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

    if (!response.ok) {
      const err = await response.json();
      return new Response(JSON.stringify({ error: err.error?.message || 'API error' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'https://www.lyricistharrydhaliwal.com'
        }
      });
    }

    const data = await response.json();
    const text = data.content[0].text;

    return new Response(JSON.stringify({ text }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://www.lyricistharrydhaliwal.com'
      }
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://www.lyricistharrydhaliwal.com'
      }
    });
  }
}
