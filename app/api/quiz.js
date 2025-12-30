// Quiz API - Vercel Serverless Function
import { quizQuestions } from './_data.js';

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-session-id');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    // Submit answer
    const { question_id, selected_answer } = req.body;
    
    const question = quizQuestions.find(q => q.id === question_id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    const isCorrect = selected_answer === question.correct_answer;
    
    return res.status(200).json({
      is_correct: isCorrect,
      correct_answer: question.correct_answer,
      explanation: question.explanation || (isCorrect ? 'Correct!' : 'Incorrect. Try again!')
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
