// Fichier : /api/message.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Aucun message fourni' });
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
            content:
              "Tu es un expert automobile Re-FAP. Tu poses des questions précises, tu identifies les pannes probables, tu expliques simplement. Tu parles comme un mécano expérimenté, direct, pro et bienveillant."
          },
          {
            role: 'user',
            content: message,
          },
        ],
        temperature: 0.5,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      const botReply = data.choices[0]?.message?.content || '❌ Réponse vide. Reformule ton souci ?';
      return res.status(200).json({ message: botReply });
    } else {
      return res.status(500).json({ message: '❌ Erreur OpenAI', data });
    }
  } catch (error) {
    console.error('Erreur serveur :', error);
    return res.status(500).json({ message: '❌ Erreur serveur', error: error.toString() });
    // Trigger redeploy 
    
  }
}


