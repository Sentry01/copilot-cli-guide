// Vercel Serverless Function - Achievements (base route)
// Handles /api/achievements — lists all achievements
// getOrCreateUser available from '../_data.js' if needed

const achievements = [
  { id: 1, title: 'First Steps', description: 'Complete your first lesson', criteria: 'complete_lesson_1', icon: '🎯' },
  { id: 2, title: 'Getting Warmed Up', description: 'Complete 5 lessons', criteria: 'complete_lesson_5', icon: '🔥' },
  { id: 3, title: 'Dedicated Learner', description: 'Complete 10 lessons', criteria: 'complete_lesson_10', icon: '📚' },
  { id: 4, title: 'Module Master', description: 'Complete all lessons in a module', criteria: 'complete_module_1', icon: '🏆' }
];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-session-id');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Return all achievements
  res.status(200).json(achievements);
}
