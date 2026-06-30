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

  const { prompt, language, category, tone } = req.body;

  if (!prompt || prompt.trim() === "") {
    return res.status(400).json({ error: "Prompt is required" });
  }

  const selectedLanguage = language || "roman";
  const selectedCategory = category || "shayri";
  const selectedTone = tone || "emotional";

  // ===== LANGUAGE INSTRUCTIONS =====
  const languageInstructions = {
    roman: `Hamesha SIRF Roman Punjabi vich likho (Punjabi words, Roman script).
Misal: "Dil nu chain nahi, teri yaad satandi hai..."
Koi Gurmukhi nahi, koi English nahi — sirf Roman Punjabi.`,

    gurmukhi: `ਹਮੇਸ਼ਾ ਸਿਰਫ਼ ਗੁਰਮੁਖੀ ਲਿਪੀ ਵਿੱਚ ਲਿਖੋ।
ਮਿਸਾਲ: "ਦਿਲ ਨੂੰ ਚੈਨ ਨਹੀਂ, ਤੇਰੀ ਯਾਦ ਸਤਾਉਂਦੀ ਹੈ..."
ਕੋਈ Roman ਨਹੀਂ, ਕੋਈ English ਨਹੀਂ — ਸਿਰਫ਼ ਗੁਰਮੁਖੀ।`,

    punjabi: `Write in pure Punjabi language using natural Punjabi words and expressions.
You may use either Gurmukhi or Roman script as fits the content.
Focus on authentic Punjabi poetic tradition.`,

    mix: `Write in a natural Punjabi + English mix (Punglish style) that modern Punjabi youth use.
Mix English words naturally into Punjabi sentences.
Example: "Dil da Wi-Fi teri taraf connect rehnda hai, signal strong hai par response nahi..."
Keep it real, relatable, and modern — not forced translation.`,
  };

  // ===== CATEGORY INSTRUCTIONS =====
  const categoryInstructions = {
    blog: `Tu ik blog post likh rahaa hain. Likho:
- Ik catchy title
- 3-5 paragraphs wala well-structured blog
- Reader nu engage karan wala tone
- Natural flow, jiwe ik real lyricist/storyteller likhda hai`,

    shayri: `Tu shayri/poetry likh rahaa hain. Likho:
- Ik complete shayri ya ghazal — adhi nahi
- Har line vich gehri feeling
- Natural rhythm jiwe asli Punjabi poets likhde ne`,

    caption: `Tu social media caption likh rahaa hain. Likho:
- Ik short, catchy caption (1-3 lines)
- Uske baad 8-12 relevant hashtags (Punjabi + trending English hashtags mix)
- Hashtags vakhre line te #hashtag format vich`,

    story: `Tu ik short story likh rahaa hain. Likho:
- Ik chhoti par complete kahani (beginning, middle, end)
- Emotional ya relatable Punjabi characters/setting
- 150-300 words de vich complete karo`,

    name: `Tu naam da matlab dasan wala kaam kar rahaa hain. Likho:
- Naam da origin (Punjabi/Sikh/Sanskrit jo v ho)
- Naam da meaning/matlab
- Naam naal judiya ik positive quality ya gun
- 2-4 lines vich short aur sweet rakkho`,
  };

  // ===== TONE INSTRUCTIONS =====
  const toneInstructions = {
    emotional: "Tone: Deeply emotional, dil nu chhu jaan wala.",
    motivational: "Tone: Motivational aur inspiring, padhan wale nu uth khalon da hosla de.",
    nostalgic: "Tone: Nostalgic, purane dina di yaad dilaan wala, bachpan/pind/yaarana jihi feel.",
    romantic: "Tone: Romantic aur pyaar bhariya, dil de jazbaat nu khubsurati naal pesh karo.",
    funny: "Tone: Halka-phulka aur funny, hasi aaye par tameez wala.",
    sad: "Tone: Sad/heartbreak, dard aur judaai da ehsaas.",
    devotional: "Tone: Devotional aur spiritual, shraddha aur vishvaas naal bhariya.",
  };

  const languageGuide = languageInstructions[selectedLanguage] || languageInstructions["roman"];
  const categoryGuide = categoryInstructions[selectedCategory] || categoryInstructions["shayri"];
  const toneGuide = toneInstructions[selectedTone] || toneInstructions["emotional"];

  // ===== SIGNATURE RULE =====
  // English/Roman content -> English signature
  // Gurmukhi/Pure Punjabi content -> Gurmukhi signature
  // EXACT spelling is hardcoded here — never let the model paraphrase or
  // "correct" it, since that's what caused spelling mistakes before.
  const ENGLISH_SIGNATURE = "Harry Dhaliwal Shamashpuria";
  const GURMUKHI_SIGNATURE = "ਹੈਰੀ ਧਾਲੀਵਾਲ ਸ਼ਮਸ਼ਪੁਰੀਆ";

  const signatureRule =
    selectedLanguage === "gurmukhi" || selectedLanguage === "punjabi"
      ? `End vich naveen line te EXACTLY ehi text copy karke sign karo, ik akhar v idhar-udhar nahi karna: — ${GURMUKHI_SIGNATURE}`
      : `End vich naveen line te EXACTLY ehi text copy karke sign karo, ik letter v idhar-udhar nahi karna: — ${ENGLISH_SIGNATURE}`;

  // Name-meaning and captions don't always need a poetic signature block,
  // but Harry asked for consistent signing across content, so we keep it
  // except where it would look odd (hashtags). We skip signature for captions.
  const includeSignature = selectedCategory !== "caption";

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

CONTENT TYPE RULE:
${categoryGuide}

LANGUAGE RULE (MOST IMPORTANT):
${languageGuide}

TONE RULE:
${toneGuide}

GENERAL RULES:
- Content natural hona chahida, jiwe asli Punjabi writer likhda hai
- Koi extra explanation nahi, seedha content shuru karo
- Koi preamble jiwe "Here is your..." nahi likhna
${includeSignature ? signatureRule : "- Hashtags wala caption hai, koi signature nahi chahida"}`,

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
    let text = data?.content?.[0]?.text || "";

    if (!text) {
      return res.status(500).json({ error: "Empty response from AI" });
    }

    // ===== SAFETY NET =====
    // Even with strict instructions, models can occasionally drift on
    // spelling. This catches common near-miss variants of the signature
    // and force-corrects them to the exact approved spelling, so a wrong
    // signature can never reach the visitor.
    if (includeSignature) {
      if (selectedLanguage === "gurmukhi" || selectedLanguage === "punjabi") {
        const gurmukhiVariants = [
          /ਹੈਰੀ\s+ਧਾਲੀਵਾਲ\s+ਸ਼ਮਸ਼ਾਪੁਰੀਆ/g,
          /ਹੈਰੀ\s+ਧਾਲੀਵਾਲ\s+ਸ਼ਮਸ਼ਪੁਰੀਏ/g,
          /ਹੈਰੀ\s+ਧਾਲੀਵਾਲ\s+ਸ਼ੰਮਸ਼ਪੁਰੀਆ/g,
          /ਹੈਰੀ\s+ਦਲੀਵਾਲ\s+ਸ਼ਮਸ਼ਪੁਰੀਆ/g,
          /ਹੈਰੀ\s+ਧਾਲੀਵਾਲ\s+ਸ਼ਮਸ਼ਪੁਰਿਆ/g,
        ];
        gurmukhiVariants.forEach((re) => {
          text = text.replace(re, GURMUKHI_SIGNATURE);
        });
      } else {
        const englishVariants = [
          /Harry\s+Dhaliwal\s+Shamshpuria/gi,
          /Harry\s+Dhaliwal\s+Shamaspuria/gi,
          /Harry\s+Dhalliwal\s+Shamashpuria/gi,
          /Harry\s+Dhaliwal\s+Shamashpuriya/gi,
          /Harry\s+Dhaliwal\s+Shamashpooria/gi,
        ];
        englishVariants.forEach((re) => {
          text = text.replace(re, ENGLISH_SIGNATURE);
        });
      }
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
