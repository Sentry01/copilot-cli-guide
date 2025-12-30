// Vercel Serverless Function - User Preferences
import { getOrCreateUser } from '../_data.js';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-session-id');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const sessionId = req.headers['x-session-id'] || req.query.session_id;
  
  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID required' });
  }
  
  const user = getOrCreateUser(sessionId);
  
  if (req.method === 'GET') {
    return res.status(200).json({ preferences: user.preferences });
  }
  
  if (req.method === 'PUT') {
    const { preferences } = req.body || {};
    if (preferences && typeof preferences === 'object') {
      user.preferences = { ...user.preferences, ...preferences };
    }
    return res.status(200).json({ success: true, preferences: user.preferences });
  }
  
  res.status(405).json({ error: 'Method not allowed' });
}
