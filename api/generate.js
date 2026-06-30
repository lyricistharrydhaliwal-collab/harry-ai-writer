export const config = {
  maxDuration: 60,
};

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt, language } = req.body;

  if (!prompt || prompt.trim() === "") {
    return res.status(400).json({ error: "Prompt is required" });
  }

  // Language-specific instructions
  const languageInstructions = {
    roman: `Hamesha SIRF Roman Punjabi vich likho (Punjabi words, Roman script).
Misal: "Dil nu chain nahi, teri yaad satandi hai..."
Koi Gurmukhi nahi, koi English nahi — sirf Roman Punjabi.`,

    gurmukhi: `ਹਮੇਸ਼ਾ ਸਿਰਫ਼ ਗੁਰਮੁਖੀ ਲਿਪੀ ਵਿੱਚ ਲਿਖੋ।
ਮਿਸਾਲ: "ਦਿਲ ਨੂੰ ਚੈਨ ਨਹੀਂ, ਤੇਰੀ ਯਾਦ ਸਤਾਉਂਦੀ ਹੈ..."
ਕੋਈ Roman ਨਹੀਂ, ਕੋਈ English ਨਹੀਂ — ਸਿਰਫ਼ ਗੁਰਮੁਖੀ।`,

    punjabi: `Write in pure Punjabi language using natural Punjabi words and expressions.
You may use either Gurmukhi or Roman script as fits the content.
Focus on authentic Punjabi poetic tradition — tappa, mahiya, ghazal style.`,

    mix: `Write in a natural Punjabi + English mix (Punglish style) that modern Punjabi youth use.
Mix English words naturally into Punjabi sentences.
Example: "Dil da Wi-Fi teri taraf connect rehnda hai, signal strong hai par response nahi..."
Keep it real, relatable, and modern — not forced translation.`,
  };

  const selectedLanguage = language || "roman";
  const languageGuide =
    languageInstructions[selectedLanguage] || languageInstructions["roman"];

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1500,
        system: `Tu ik mashoor Punjabi lyricist ate shayar hain — Harry Dhaliwal Shamashpuria di taraf ton likhda hain.

Tera kaam hai sunder, dil nu chhandiya wali poetry likhna — shayri, ghazal, geet, ya kavita — jo bande de dil nu chhu jaave.

LANGUAGE RULE (MOST IMPORTANT):
${languageGuide}

POETRY RULES:
- Har line vich gehri feeling honi chahidi
- Shayri natural honi chahidi, jive asli Punjabi poets likhde ne
- Ek complete shayri/poem likho — adhi nahi
- Koi explanation nahi, seedha poetry shuru karo
- End vich — Harry Dhaliwal Shamashpuria likh ke sign karo`,

        messages: [
          {
            role: "user",
            content: prompt.trim(),
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Anthropic API error:", errorData);
      return res.status(response.status).json({
        error: "API error",
        details: errorData?.error?.message || "Unknown error",
      });
    }

    const data = await response.json();
    const text = data?.content?.[0]?.text || "";

    if (!text) {
      return res.status(500).json({ error: "Empty response from AI" });
    }

    return res.status(200).json({ result: text });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
}
