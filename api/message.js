import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Requête invalide : "messages" est requis.' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            "Tu es un expert automobile spécialisé en diagnostic moteur. Tu poses des questions précises pour comprendre la panne. Tu réponds toujours en français dans un style clair, structuré, avec des emojis et des explications professionnelles mais accessibles.",
        },
        ...messages,
      ],
      temperature: 0.7,
    });

    const reply = response.choices?.[0]?.message?.content;

    return new Response(
      JSON.stringify({ reply }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Erreur dans /api/message :', error);

    return new Response(
      JSON.stringify({
        error: 'Erreur serveur GPT',
        details: error.message || 'Erreur inconnue',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

