exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { system, message } = JSON.parse(event.body);
    const apiKey = process.env.HF_API_KEY;

    const prompt = system + "\n\n" + message;

    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: "<s>[INST] " + prompt + " [/INST]",
          parameters: {
            max_new_tokens: 800,
            temperature: 0.7,
            return_full_text: false,
          },
        }),
      }
    );

    const data = await response.json();
    console.log("HF RESPONSE:", JSON.stringify(data));

    const text = Array.isArray(data) && data[0] && data[0].generated_text
      ? data[0].generated_text
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
