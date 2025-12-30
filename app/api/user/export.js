// Vercel Serverless Function - User Export
import { getOrCreateUser } from '../_data.js';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-session-id');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const sessionId = req.headers['x-session-id'] || req.query.session_id;
  
  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID required' });
  }
  
  const user = getOrCreateUser(sessionId);
  
  const exportData = {
    export_date: new Date().toISOString(),
    app_version: '1.0.0',
    user: {
      session_id: user.session_id,
      preferences: user.preferences,
      created_at: user.created_at
    },
    progress: user.progress.map(id => ({ lesson_id: id })),
    bookmarks: user.bookmarks.map(id => ({ resource_type: 'lesson', resource_id: id })),
    achievements: user.achievements
  };
  
  res.status(200).json(exportData);
}
