export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ message: 'Format incorrect : messages[] attendu' });
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
        messages,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    console.log('Réponse OpenAI :', JSON.stringify(data, null, 2));

    if (response.ok) {
      const botReply = data.choices[0]?.message?.content || 'Je n’ai pas bien compris, peux-tu reformuler ?';
      return res.status(200).json({ reply: botReply });
    } else {
      console.error('Erreur OpenAI :', data);
      return res.status(500).json({ message: 'Erreur OpenAI', data });
    }
  } catch (error) {
    console.error('Erreur serveur :', error);
    return res.status(500).json({ message: 'Erreur interne', error: error.toString() });
  }
}
