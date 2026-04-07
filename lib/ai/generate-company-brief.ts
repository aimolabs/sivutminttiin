export async function generateCompanyBriefFromUrl(url: string) {
  const prompt = `
You are analyzing a Finnish construction or renovation company website.

URL: ${url}

Your task:
1. Identify what the company actually sells
2. Identify their target customer
3. Extract or infer their core services
4. Identify weaknesses in their current website
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
    }
  }
}
`;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
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
        ]
      })
    });

    const data = await res.json();

    const text =
      data?.choices?.[0]?.message?.content ?? "{}";

    return JSON.parse(text);
  } catch (err) {
    console.error("AI fetch failed:", err);
    return null;
  }
}
