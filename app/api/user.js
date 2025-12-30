// Vercel Serverless Function - User Management
import { getOrCreateUser } from './_data.js';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-session-id');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const sessionId = req.headers['x-session-id'] || req.query.session_id || `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  if (req.method === 'GET') {
    const user = getOrCreateUser(sessionId);
    return res.status(200).json({
      id: user.id,
      session_id: user.session_id,
      preferences: user.preferences,
      created_at: user.created_at
    });
  }
  
  if (req.method === 'POST') {
    const { session_id } = req.body || {};
    const sid = session_id || sessionId;
    const user = getOrCreateUser(sid);
    return res.status(200).json(user);
  }
  
  res.status(405).json({ error: 'Method not allowed' });
}
