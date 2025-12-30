// Vercel Serverless Function - Get Examples
import { examples } from './_data.js';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const { category, difficulty } = req.query;
  
  let result = examples;
  
  if (category) {
    result = result.filter(e => e.category === category);
  }
  
  if (difficulty) {
    result = result.filter(e => e.difficulty === difficulty);
  }
  
  res.status(200).json(result);
}
