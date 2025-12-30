// Vercel Serverless Function - Achievements
import { getOrCreateUser } from './_data.js';

const achievements = [
  { id: 1, title: 'First Steps', description: 'Complete your first lesson', criteria: 'complete_lesson_1', icon: '🎯' },
  { id: 2, title: 'Getting Warmed Up', description: 'Complete 5 lessons', criteria: 'complete_lesson_5', icon: '🔥' },
  { id: 3, title: 'Dedicated Learner', description: 'Complete 10 lessons', criteria: 'complete_lesson_10', icon: '📚' },
  { id: 4, title: 'Module Master', description: 'Complete all lessons in a module', criteria: 'complete_module_1', icon: '🏆' }
];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-session-id');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Handle /api/achievements/check
  if (req.url.includes('/check') && req.method === 'POST') {
    const sessionId = req.headers['x-session-id'] || req.body?.session_id;
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID required' });
    }
    
    const user = getOrCreateUser(sessionId);
    const progressCount = user.progress.length;
    const newlyUnlocked = [];
    
    // Check each achievement
    if (progressCount >= 1 && !user.achievements.includes(1)) {
      user.achievements.push(1);
      newlyUnlocked.push(achievements[0]);
    }
    if (progressCount >= 5 && !user.achievements.includes(2)) {
      user.achievements.push(2);
      newlyUnlocked.push(achievements[1]);
    }
    if (progressCount >= 10 && !user.achievements.includes(3)) {
      user.achievements.push(3);
      newlyUnlocked.push(achievements[2]);
    }
    
    return res.status(200).json({ checked: achievements.length, unlocked: newlyUnlocked });
  }
  
  // Handle /api/achievements/user
  if (req.url.includes('/user')) {
    const sessionId = req.headers['x-session-id'] || req.query.session_id;
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID required' });
    }
    
    const user = getOrCreateUser(sessionId);
    const userAchievements = achievements
      .filter(a => user.achievements.includes(a.id))
      .map(a => ({ ...a, unlocked_at: new Date().toISOString() }));
    
    return res.status(200).json(userAchievements);
  }
  
  // Return all achievements
  res.status(200).json(achievements);
}
