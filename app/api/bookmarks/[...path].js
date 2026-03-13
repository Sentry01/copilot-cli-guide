// Vercel Serverless Function - Bookmarks
import { getOrCreateUser, lessons, modules } from '../_data.js';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-session-id');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Parse URL: /api/bookmarks/[session_id] or /api/bookmarks/[session_id]/lesson/[lesson_id]
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
    const bookmarksWithDetails = user.bookmarks.map(lessonId => {
      const lesson = lessons.find(l => l.id === lessonId);
      const module = lesson ? modules.find(m => m.id === lesson.module_id) : null;
      return {
        lesson_id: lessonId,
        resource_type: 'lesson',
        resource_id: lessonId,
        title: lesson?.title || 'Unknown',
        duration: lesson?.duration || 0,
        difficulty: lesson?.difficulty || 'beginner',
        module_name: module?.title || 'Unknown'
      };
    });
    return res.status(200).json({ bookmarks: bookmarksWithDetails });
  }
  
  if (req.method === 'POST' && lessonId) {
    if (!user.bookmarks.includes(lessonId)) {
      user.bookmarks.push(lessonId);
    }
    return res.status(200).json({ success: true, lesson_id: lessonId });
  }
  
  if (req.method === 'DELETE' && lessonId) {
    user.bookmarks = user.bookmarks.filter(id => id !== lessonId);
    return res.status(200).json({ success: true, lesson_id: lessonId });
  }
  
  res.status(405).json({ error: 'Method not allowed' });
}
