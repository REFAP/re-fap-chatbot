export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Aucun message reçu' });
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
          content: `Tu es un expert automobile Re-FAP, ton rôle est d’aider l’utilisateur à identifier la cause probable de sa panne moteur et de l’orienter avec clarté.`,
        },
        {
          role: 'user',
          content: message,
        },
      ],
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  console.log('Réponse OpenAI complète :', JSON.stringify(data, null, 2)); // ← AJOUTE ÇA

  if (response.ok) {
    const botReply = data.choices[0]?.message?.content || 'Je n’ai pas bien compris, peux-tu reformuler ?';
    return res.status(200).json({ message: botReply });
  } else {
    return res.status(500).json({ message: 'Erreur OpenAI', data });
  }
} catch (error) {
  console.error('Erreur serveur :', error);
  return res.status(500).json({ message: 'Erreur interne', error: error.toString() });
}


    const data = await response.json();

    if (response.ok) {
      const botReply = data.choices[0]?.message?.content || 'Je n’ai pas bien compris, peux-tu reformuler ?';
      return res.status(200).json({ message: botReply });
    } else {
      console.error('Erreur OpenAI :', data);
      return res.status(500).json({ message: 'Erreur lors de la génération de la réponse' });
    }
  } catch (error) {
    console.error('Erreur serveur :', error);
    return res.status(500).json({ message: 'Erreur interne du serveur' });
  }
}
