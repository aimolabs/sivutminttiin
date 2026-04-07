import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function generateCompanyBriefFromUrl(url: string) {
  const prompt = `
You are analyzing a Finnish construction or renovation company website.

URL: ${url}

Your task:
1. Identify what the company actually sells
2. Identify their target customer
3. Extract or infer their core services
4. Identify weaknesses in their current website (clarity, trust, CTA, structure)
5. Propose a BETTER homepage structure

Return ONLY valid JSON:

{
  "companyName": "",
  "coreOffer": {
    "title": "",
    "description": ""
  },
  "services": [
    { "title": "", "description": "" }
  ],
  "targetAudience": "",
  "trustStrategy": "",
  "primaryCTA": "",
  "problemsOnCurrentSite": [],
  "improvedHomepage": {
    "hero": {
      "heading": "",
      "subheading": ""
    },
    "sections": [
      { "type": "services", "heading": "" },
      { "type": "trust", "heading": "" },
      { "type": "cta", "heading": "" }
    ]
  }
}
`;

  const response = await client.chat.completions.create({
    model: "gpt-5",
    temperature: 0.4,
    messages: [
      {
        role: "system",
        content: "You are a senior conversion-focused web strategist."
      },
      {
        role: "user",
        content: prompt
      }
    ],
  });

  const text = response.choices[0]?.message?.content ?? "{}";

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("AI parse failed:", text);
    return null;
  }
}
