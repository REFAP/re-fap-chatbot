import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Requête invalide" }), {
        status: 400,
      });
    }

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o", // ou "gpt-3.5-turbo" si tu veux économiser
      messages: [
        {
          role: "system",
          content:
            "Tu es un expert automobile expérimenté. Tu parles comme un mécano : direct, pro, rassurant. Ton objectif est de poser des hypothèses de panne claires à partir des symptômes décrits, et d’orienter vers un diagnostic fiable, de préférence dans un garage partenaire Re-FAP ou via une solution économique.",
        },
        ...messages,
      ],
      temperature: 0.7,
    });

    const result = chatCompletion.choices[0]?.message?.content;

    return new Response(JSON.stringify({ message: result }), {
      status: 200,
    });
  } catch (error) {
    console.error("Erreur OpenAI:", error);
    return new Response(JSON.stringify({ error: "Erreur serveur GPT." }), {
      status: 500,
    });
  }
}
