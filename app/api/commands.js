// Vercel Serverless Function - Get Commands
import { commands } from './_data.js';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const { category, name } = req.query;
  
  // Get single command by name
  if (name) {
    const command = commands.find(c => c.name === decodeURIComponent(name));
    if (!command) {
      return res.status(404).json({ error: 'Command not found' });
    }
    return res.status(200).json({
      ...command,
      relatedCommands: []
    });
  }
  
  // Filter by category if provided
  let result = commands;
  if (category) {
    result = commands.filter(c => c.category === category);
  }
  
  res.status(200).json(result);
}
