// ✅ Nouveau backend conversationnel /api/message.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { history } = req.body;

  if (!history || !Array.isArray(history)) {
    return res.status(400).json({ message: 'Historique invalide' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `Tu es un expert auto Re-FAP, direct et pro. Ton job est d’identifier la panne probable en discutant comme un mécano expérimenté. Tu poses des questions si besoin et tu expliques simplement. Si c’est lié au FAP, tu proposes une prise de rendez-vous chez un garage partenaire.`
          },
          ...history
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    console.log('Réponse OpenAI complète :', JSON.stringify(data, null, 2));

    if (response.ok) {
      const botReply = data.choices[0]?.message?.content || 'Je n’ai pas bien compris, tu peux reformuler ?';
      return res.status(200).json({ message: botReply });
    } else {
      return res.status(500).json({ message: 'Erreur OpenAI', data });
    }
  } catch (error) {
    console.error('Erreur serveur :', error);
    return res.status(500).json({ message: 'Erreur interne', error: error.toString() });
  }
}
