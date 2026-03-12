#!/usr/bin/env node
/**
 * Regenerates api/_data.js from JSON exports and the existing _data.js file.
 * Reads: /tmp/commands_export.json, /tmp/examples_export.json, /tmp/lessons_export.json
 * Preserves: modules, quizQuestions, userSessions, getOrCreateUser from existing _data.js
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = join(__dirname, '..');

// --- Read JSON exports ---
const commands = JSON.parse(readFileSync('/tmp/commands_export.json', 'utf8'));
const examples = JSON.parse(readFileSync('/tmp/examples_export.json', 'utf8'));
const lessons = JSON.parse(readFileSync('/tmp/lessons_export.json', 'utf8'));

console.log(`Read ${commands.length} commands, ${examples.length} examples, ${lessons.length} lessons`);

// --- Read existing _data.js to extract quizQuestions and tail ---
const existingData = readFileSync(join(appDir, 'api', '_data.js'), 'utf8');

// Extract quizQuestions array and everything after it
const quizStart = existingData.indexOf('export const quizQuestions = [');
if (quizStart === -1) throw new Error('Could not find quizQuestions in existing _data.js');
const tailSection = existingData.slice(quizStart);

// --- Extract existing modules array ---
const modulesStart = existingData.indexOf('export const modules = [');
const modulesEnd = existingData.indexOf('];\n', modulesStart) + 2;
const modulesSection = existingData.slice(modulesStart, modulesEnd);

// --- Fix outdated content in lessons ---
for (const lesson of lessons) {
  // Fix "public preview" → "generally available (GA)"
  lesson.content = lesson.content.replace(
    /in \*\*public preview\*\* with data protection and is subject to change/g,
    'now **generally available (GA)** as of February 25, 2026'
  );
  lesson.content = lesson.content.replace(
    /is in public preview/g,
    'is generally available (GA)'
  );
  lesson.content = lesson.content.replace(
    /in public preview/g,
    'generally available (GA)'
  );
}

// --- Helper: escape a string value for JS single-quoted string ---
function escapeForJS(str) {
  if (str === null || str === undefined) return 'null';
  return str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n');
}

// --- Format a command object ---
function formatCommand(cmd) {
  let examplesArr;
  try {
    examplesArr = typeof cmd.examples === 'string' ? JSON.parse(cmd.examples) : cmd.examples;
  } catch { examplesArr = []; }

  let relatedArr;
  try {
    relatedArr = typeof cmd.related_commands === 'string' ? JSON.parse(cmd.related_commands) : cmd.related_commands;
  } catch { relatedArr = []; }

  const examplesStr = examplesArr && examplesArr.length > 0
    ? '[\n' + examplesArr.map(ex =>
        `      { description: '${escapeForJS(ex.description)}', command: '${escapeForJS(ex.command)}' }`
      ).join(',\n') + '\n    ]'
    : '[]';

  const relatedStr = relatedArr && relatedArr.length > 0
    ? '[' + relatedArr.map(r => `'${escapeForJS(r)}'`).join(', ') + ']'
    : '[]';

  return `  {
    id: ${cmd.id},
    name: '${escapeForJS(cmd.name)}',
    syntax: '${escapeForJS(cmd.syntax)}',
    description: '${escapeForJS(cmd.description)}',
    category: '${escapeForJS(cmd.category)}',
    examples: ${examplesStr},
    related_commands: ${relatedStr}
  }`;
}

// --- Format an example object ---
function formatExample(ex) {
  return `  {
    id: ${ex.id},
    title: '${escapeForJS(ex.title)}',
    code: '${escapeForJS(ex.code)}',
    category: '${escapeForJS(ex.category)}',
    difficulty: '${escapeForJS(ex.difficulty)}',
    language: '${escapeForJS(ex.language)}'
  }`;
}

// --- Format a lesson object ---
function formatLesson(lesson) {
  return `  {
    id: ${lesson.id},
    module_id: ${lesson.module_id},
    title: '${escapeForJS(lesson.title)}',
    content: '${escapeForJS(lesson.content)}',
    duration: ${lesson.duration},
    difficulty: '${escapeForJS(lesson.difficulty)}',
    order_index: ${lesson.order_index}
  }`;
}

// --- Build the output ---
const header = `// Shared data for Vercel Serverless Functions
// This replaces SQLite with in-memory data for serverless deployment

`;

const lessonsSection = `export const lessons = [\n${lessons.map(formatLesson).join(',\n')}\n];`;
const commandsSection = `export const commands = [\n${commands.map(formatCommand).join(',\n')}\n];`;
const examplesSection = `export const examples = [\n${examples.map(formatExample).join(',\n')}\n];`;

const output = [
  header,
  modulesSection,
  '',
  lessonsSection,
  '',
  commandsSection,
  '',
  examplesSection,
  '',
  tailSection
].join('\n');

writeFileSync(join(appDir, 'api', '_data.js'), output);
console.log('Generated api/_data.js successfully');
