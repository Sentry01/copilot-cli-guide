// Vercel Serverless Function - Search
import { lessons, commands, examples, modules } from './_data.js';

function extractSnippet(text, searchTerm) {
  if (!text) return '';
  
  const lowerText = text.toLowerCase();
  const lowerTerm = searchTerm.toLowerCase();
  const index = lowerText.indexOf(lowerTerm);
  
  if (index === -1) {
    return text.substring(0, 150) + '...';
  }
  
  const start = Math.max(0, index - 60);
  const end = Math.min(text.length, index + searchTerm.length + 90);
  const snippet = text.substring(start, end);
  
  return (start > 0 ? '...' : '') + snippet + (end < text.length ? '...' : '');
}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const { q } = req.query;
  
  if (!q || q.trim().length === 0) {
    return res.status(200).json({ results: [] });
  }
  
  const searchTerm = q.toLowerCase();
  
  // Search lessons
  const lessonResults = lessons
    .filter(l => l.title.toLowerCase().includes(searchTerm) || l.content.toLowerCase().includes(searchTerm))
    .slice(0, 10)
    .map(lesson => {
      const module = modules.find(m => m.id === lesson.module_id);
      return {
        ...lesson,
        type: 'lesson',
        module_name: module?.title || 'Unknown',
        snippet: extractSnippet(lesson.content, q)
      };
    });
  
  // Search commands
  const commandResults = commands
    .filter(c => c.name.toLowerCase().includes(searchTerm) || c.description.toLowerCase().includes(searchTerm))
    .slice(0, 10)
    .map(cmd => ({
      ...cmd,
      type: 'command',
      snippet: cmd.description ? cmd.description.substring(0, 150) : ''
    }));
  
  // Search examples
  const exampleResults = examples
    .filter(e => e.title.toLowerCase().includes(searchTerm) || e.code.toLowerCase().includes(searchTerm))
    .slice(0, 10)
    .map(ex => ({
      ...ex,
      type: 'example',
      snippet: ex.code ? ex.code.substring(0, 150) : ''
    }));
  
  const allResults = [...lessonResults, ...commandResults, ...exampleResults];
  
  res.status(200).json({
    results: allResults,
    count: allResults.length,
    query: q
  });
}
