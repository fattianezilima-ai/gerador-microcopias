exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { system, message } = JSON.parse(event.body);
    const apiKey = process.env.GEMINI_API_KEY;

    console.log("API KEY exists:", !!apiKey);
    console.log("API KEY length:", apiKey ? apiKey.length : 0);

    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: system }] },
        contents: [{ parts: [{ text: message }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 1000 }
      }),
    });

    const data = await response.json();
    console.log("GEMINI RESPONSE STATUS:", response.status);
    console.log("GEMINI RESPONSE:", JSON.stringify(data));

    const text = data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]
      ? data.candidates[0].content.parts[0].text
      : "{}";

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: text, debug: data }),
    };
  } catch(err) {
    console.log("ERRO:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
