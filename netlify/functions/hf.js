exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { system, message } = JSON.parse(event.body);
    const apiKey = process.env.HF_API_KEY;

    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/mistralai/Mistral-7B-Instruct-v0.2/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mistralai/Mistral-7B-Instruct-v0.2",
          messages: [
            { role: "system", content: system },
            { role: "user", content: message }
          ],
          max_tokens: 800,
          temperature: 0.7,
        }),
      }
    );

    const data = await response.json();
    console.log("HF RESPONSE:", JSON.stringify(data));

    const text = data.choices && data.choices[0] && data.choices[0].message
      ? data.choices[0].message.content
      : "{}";

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: text }),
    };
  } catch(err) {
    console.log("ERRO:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
