import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ message: 'Requête invalide' });
  }

  try {
    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
      temperature: 0.7,
      max_tokens: 700
    });

    const reply = chatResponse.choices[0].message.content;
    res.status(200).json({ message: reply });
  } catch (error) {
    console.error('Erreur OpenAI :', error);
    res.status(500).json({ message: "Erreur lors de la génération de la réponse" });
  }
}
