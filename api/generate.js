export const config = { runtime: 'edge' };
const ORIGINS = ['https://www.lyricistharrydhaliwal.com','https://lyricistharrydhaliwal.com'];
export default async function handler(req) {
  const origin = req.headers.get('origin') || '';
  const ao = ORIGINS.includes(origin) ? origin : ORIGINS[0];
  const ch = {'Access-Control-Allow-Origin':ao,'Access-Control-Allow-Methods':'POST,OPTIONS','Access-Control-Allow-Headers':'Content-Type'};
  if(req.method==='OPTIONS') return new Response(null,{status:204,headers:ch});
  if(req.method!=='POST') return new Response('Not allowed',{status:405,headers:ch});
  try {
    const {type,lang,tone,topic} = await req.json();
    if(!topic||!topic.trim()) return new Response(JSON.stringify({error:'Topic required'}),{status:400,headers:{...ch,'Content-Type':'application/json'}});
    const lm={punjabi:'Write entirely in Punjabi Gurmukhi script',mixed:'Mix Punjabi Gurmukhi and English naturally',english:'Write in English'};
    const tm={emotional:'deeply emotional and heartfelt',motivational:'motivational and uplifting',nostalgic:'nostalgic and warm',romantic:'romantic and poetic',funny:'funny and relatable'};
    const pm={blog:'a blog post 300-400 words',shayri:'a beautiful shayri with 4-6 verses',story:'a mini story 200-300 words',caption:'3 social media captions for Instagram Facebook TikTok'};
    const prompt = 'You are a creative writing assistant for Harry Dhaliwal Shamashpuria, a Punjabi lyricist from Winnipeg Canada. Write ' + (pm[type]||pm.blog) + ' about: "' + topic.trim() + '". Language: ' + (lm[lang]||lm.punjabi) + '. Tone: ' + (tm[tone]||tm.emotional) + '. End with: via HarryDhaliwal.com';
    const r = await fetch('https://api.anthropic.com/v1/messages',{
      method:'POST',
      headers:{'Content-Type':'application/json','anthropic-version':'2023-06-01','x-api-key':process.env.ANTHROPIC_API_KEY},
      body:JSON.stringify({model:'claude-haiku-4-5-20251001',max_tokens:1000,messages:[{role:'user',content:prompt}]})
    });
    if(!r.ok){const e=await r.json();return new Response(JSON.stringify({error:e.error?.message||'API error'}),{status:500,headers:{...ch,'Content-Type':'application/json'}});}
    const d=await r.json();
    return new Response(JSON.stringify({text:d.content[0].text}),{status:200,headers:{...ch,'Content-Type':'application/json'}});
  } catch(e) {
    return new Response(JSON.stringify({error:'Error: '+e.message}),{status:500,headers:{...ch,'Content-Type':'application/json'}});
  }
}
