// Vercel Serverless Function - Progress Tracking
import { getOrCreateUser } from '../_data.js';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-session-id');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Parse URL: /api/progress/[session_id] or /api/progress/[session_id]/lesson/[lesson_id]
  const urlParts = req.url.split('?')[0].split('/').filter(Boolean);
  const sessionId = urlParts[2] || req.headers['x-session-id'];
  // Support lesson_id from URL path, query param, or request body
  let lessonId = urlParts[4] ? parseInt(urlParts[4]) : null;
  if (!lessonId && req.query?.lesson_id) lessonId = parseInt(req.query.lesson_id);
  if (!lessonId && req.body?.lesson_id) lessonId = parseInt(req.body.lesson_id);
  
  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID required' });
  }
  
  const user = getOrCreateUser(sessionId);
  
  if (req.method === 'GET') {
    return res.status(200).json(user.progress.map(lessonId => ({ lesson_id: lessonId })));
  }
  
  if (req.method === 'POST' && lessonId) {
    if (!user.progress.includes(lessonId)) {
      user.progress.push(lessonId);
    }
    return res.status(200).json({ success: true, lesson_id: lessonId });
  }
  
  if (req.method === 'DELETE' && lessonId) {
    user.progress = user.progress.filter(id => id !== lessonId);
    return res.status(200).json({ success: true, lesson_id: lessonId });
  }
  
  res.status(405).json({ error: 'Method not allowed' });
}
