export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { message } = req.body;

  if (!message || message.trim() === '') {
    return res.status(400).json({ error: 'Message vide' });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Clé API OpenAI manquante' });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `Tu es un expert automobile Re-FAP. Ton rôle est d'aider l'utilisateur à identifier l'origine probable d'un voyant moteur ou d’un problème moteur. Pose des questions si besoin, propose une hypothèse simple, et oriente vers un garage partenaire si nécessaire.`,
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 600,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message || "Erreur OpenAI" });
    }

    const reply = data.choices?.[0]?.message?.content || "Pas de réponse";

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("Erreur API OpenAI :", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
