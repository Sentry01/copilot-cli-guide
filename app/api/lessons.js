// Vercel Serverless Function - Get Lessons
import { lessons, modules, quizQuestions } from './_data.js';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const { module_id, lesson_id, quiz } = req.query;
  
  // Get quiz questions for a lesson
  if (lesson_id && quiz === 'true') {
    const lessonQuestions = quizQuestions.filter(q => q.lesson_id === parseInt(lesson_id));
    return res.status(200).json(lessonQuestions);
  }
  
  // Get single lesson by lesson_id
  if (lesson_id) {
    const lesson = lessons.find(l => l.id === parseInt(lesson_id));
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    const module = modules.find(m => m.id === lesson.module_id);
    return res.status(200).json({
      ...lesson,
      module_name: module?.title || 'Unknown',
      module_id: lesson.module_id,
      has_terminal: 1
    });
  }
  
  // Filter by module_id if provided
  let result = lessons;
  if (module_id) {
    result = lessons.filter(l => l.module_id === parseInt(module_id));
  }
  
  res.status(200).json(result);
}
