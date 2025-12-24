import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const db = new sqlite3.Database(join(__dirname, 'copilot-cli-guide.db'), (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('✓ Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  db.serialize(() => {
    // Modules table
    db.run(`
      CREATE TABLE IF NOT EXISTS modules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        order_index INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) console.error('Error creating modules table:', err);
      else console.log('✓ Modules table ready');
    });

    // Lessons table
    db.run(`
      CREATE TABLE IF NOT EXISTS lessons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        module_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        content TEXT,
        duration INTEGER,
        difficulty TEXT,
        order_index INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (module_id) REFERENCES modules(id)
      )
    `, (err) => {
      if (err) console.error('Error creating lessons table:', err);
      else console.log('✓ Lessons table ready');
    });

    // Commands table
    db.run(`
      CREATE TABLE IF NOT EXISTS commands (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        syntax TEXT NOT NULL,
        description TEXT,
        category TEXT,
        examples TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) console.error('Error creating commands table:', err);
      else console.log('✓ Commands table ready');
    });

    // Examples table
    db.run(`
      CREATE TABLE IF NOT EXISTS examples (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        code TEXT NOT NULL,
        category TEXT,
        difficulty TEXT,
        language TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) console.error('Error creating examples table:', err);
      else console.log('✓ Examples table ready');
    });

    // Users/Sessions table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT UNIQUE NOT NULL,
        preferences TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) console.error('Error creating users table:', err);
      else console.log('✓ Users table ready');
    });

    // Progress table
    db.run(`
      CREATE TABLE IF NOT EXISTS progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        lesson_id INTEGER NOT NULL,
        completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (lesson_id) REFERENCES lessons(id),
        UNIQUE(user_id, lesson_id)
      )
    `, (err) => {
      if (err) console.error('Error creating progress table:', err);
      else console.log('✓ Progress table ready');
    });

    // Bookmarks table
    db.run(`
      CREATE TABLE IF NOT EXISTS bookmarks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        resource_type TEXT NOT NULL,
        resource_id INTEGER NOT NULL,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `, (err) => {
      if (err) console.error('Error creating bookmarks table:', err);
      else console.log('✓ Bookmarks table ready');
    });

    // Achievements table
    db.run(`
      CREATE TABLE IF NOT EXISTS achievements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        criteria TEXT,
        icon TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) console.error('Error creating achievements table:', err);
      else console.log('✓ Achievements table ready');
    });

    // User achievements table
    db.run(`
      CREATE TABLE IF NOT EXISTS user_achievements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        achievement_id INTEGER NOT NULL,
        unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (achievement_id) REFERENCES achievements(id),
        UNIQUE(user_id, achievement_id)
      )
    `, (err) => {
      if (err) console.error('Error creating user_achievements table:', err);
      else console.log('✓ User achievements table ready');
      
      // Seed initial data after all tables are created
      seedInitialData();
    });
  });
}

// Seed initial data
function seedInitialData() {
  // Check if data already exists
  db.get('SELECT COUNT(*) as count FROM modules', [], (err, row) => {
    if (err || row.count > 0) return;
    
    console.log('📦 Seeding initial data...');
    
    // Seed modules
    const modules = [
      { title: 'Getting Started', description: 'Learn the basics of GitHub Copilot CLI', order: 1 },
      { title: 'Basic Commands', description: 'Master essential Copilot CLI commands', order: 2 },
      { title: 'Advanced Topics', description: 'Advanced usage and best practices', order: 3 }
    ];
    
    modules.forEach(module => {
      db.run(
        'INSERT INTO modules (title, description, order_index) VALUES (?, ?, ?)',
        [module.title, module.description, module.order],
        function(err) {
          if (err) {
            console.error('Error seeding module:', err);
            return;
          }
          
          const moduleId = this.lastID;
          let lessons = [];
          
          // Lessons for each module
          if (module.title === 'Getting Started') {
            lessons = [
              {
                title: 'Introduction',
                content: '# Introduction to GitHub Copilot CLI\n\nGitHub Copilot CLI is a powerful command-line tool that brings AI-powered assistance directly to your terminal.\n\n## What is Copilot CLI?\n\nCopilot CLI helps you:\n- Generate shell commands from natural language\n- Explain complex commands\n- Learn new CLI tools faster\n\n## Key Features\n\n- **Natural Language to Commands**: Describe what you want in plain English\n- **Command Explanations**: Understand what commands do before running them\n- **Context-Aware**: Learns from your environment and history',
                duration: 5,
                difficulty: 'beginner',
                order: 1
              },
              {
                title: 'Installation',
                content: '# Installing GitHub Copilot CLI\n\n## Prerequisites\n\n- GitHub account with Copilot access\n- GitHub CLI (`gh`) installed\n\n## Installation Steps\n\n```bash\n# Install GitHub CLI if not already installed\nbrew install gh\n\n# Install Copilot CLI extension\ngh extension install github/gh-copilot\n\n# Verify installation\ngh copilot --version\n```\n\n## Authentication\n\n```bash\n# Authenticate with GitHub\ngh auth login\n```',
                duration: 10,
                difficulty: 'beginner',
                order: 2
              },
              {
                title: 'First Command',
                content: '# Your First Copilot CLI Command\n\nLet\'s try generating your first command!\n\n## Using `gh copilot suggest`\n\n```bash\n# Ask Copilot to suggest a command\ngh copilot suggest "find all javascript files"\n```\n\nCopilot will analyze your request and provide relevant command suggestions.\n\n## Interactive Mode\n\nYou can refine suggestions interactively:\n1. Review the suggested command\n2. Execute, revise, or explain\n3. Learn as you go!\n\n## Try It Yourself\n\nAsk Copilot to help with:\n- File operations\n- Git commands\n- System administration tasks',
                duration: 8,
                difficulty: 'beginner',
                order: 3
              }
            ];
          } else if (module.title === 'Basic Commands') {
            lessons = [
              {
                title: 'gh copilot suggest',
                content: '# gh copilot suggest\n\n## Overview\n\nThe `suggest` command generates shell commands from natural language descriptions.\n\n## Syntax\n\n```bash\ngh copilot suggest [options] "<description>"\n```\n\n## Common Usage\n\n```bash\n# Generate command suggestion\ngh copilot suggest "list all running docker containers"\n\n# With target shell\ngh copilot suggest -t powershell "get system info"\n```\n\n## Flags\n\n- `-t, --target` - Target shell (bash, zsh, powershell, etc.)\n- `-h, --help` - Show help information',
                duration: 12,
                difficulty: 'beginner',
                order: 1
              },
              {
                title: 'gh copilot explain',
                content: '# gh copilot explain\n\n## Overview\n\nThe `explain` command helps you understand what a command does.\n\n## Syntax\n\n```bash\ngh copilot explain "<command>"\n```\n\n## Examples\n\n```bash\n# Explain a complex command\ngh copilot explain "find . -name \'*.js\' -type f -exec grep -l \'TODO\' {} \\;"\n\n# Understand git commands\ngh copilot explain "git rebase -i HEAD~3"\n\n# Learn new tools\ngh copilot explain "docker run -d -p 8080:80 nginx"\n```\n\n## Benefits\n\n- Learn unfamiliar syntax\n- Understand flags and options\n- Gain confidence before executing',
                duration: 10,
                difficulty: 'beginner',
                order: 2
              },
              {
                title: 'Common Flags',
                content: '# Common Flags and Options\n\n## Global Flags\n\nFlags available across all Copilot CLI commands:\n\n### `--help` / `-h`\nShow help information\n```bash\ngh copilot --help\ngh copilot suggest --help\n```\n\n### `--version`\nDisplay version information\n```bash\ngh copilot --version\n```\n\n## Command-Specific Flags\n\n### For `suggest`\n\n- `--target` / `-t` - Specify target shell\n- `--shell-out` - Execute command directly\n\n### For `explain`\n\n- `--web` - Open explanation in browser\n\n## Tips\n\n- Use tab completion for flags\n- Combine flags for precise control\n- Check help for latest options',
                duration: 8,
                difficulty: 'beginner',
                order: 3
              }
            ];
          } else if (module.title === 'Advanced Topics') {
            lessons = [
              {
                title: 'Workflow Integration',
                content: '# Workflow Integration\n\n## Shell Aliases\n\nCreate shortcuts for common operations:\n\n```bash\n# Add to .bashrc or .zshrc\nalias gcs="gh copilot suggest"\nalias gce="gh copilot explain"\n```\n\n## Script Integration\n\nUse Copilot CLI in scripts:\n\n```bash\n#!/bin/bash\n# Get command suggestion and execute\nCMD=$(gh copilot suggest --shell-out "list processes using port 3000")\neval "$CMD"\n```\n\n## CI/CD Integration\n\n- Generate deployment commands\n- Explain pipeline failures\n- Automate complex operations',
                duration: 15,
                difficulty: 'advanced',
                order: 1
              },
              {
                title: 'Custom Prompts',
                content: '# Custom Prompts and Context\n\n## Providing Context\n\nGive Copilot more context for better suggestions:\n\n```bash\ngh copilot suggest "optimize this for production:\n  node server.js\n  running on Ubuntu 22.04\n  need PM2 process manager"\n```\n\n## Domain-Specific Queries\n\n### DevOps\n```bash\ngh copilot suggest "kubernetes deploy app with 3 replicas"\n```\n\n### Data Processing\n```bash\ngh copilot suggest "convert CSV to JSON with jq"\n```\n\n### System Administration\n```bash\ngh copilot suggest "monitor disk usage and alert if over 90%"\n```',
                duration: 12,
                difficulty: 'advanced',
                order: 2
              },
              {
                title: 'Best Practices',
                content: '# Best Practices\n\n## Safety First\n\n1. **Always review before executing**\n   - Read suggested commands carefully\n   - Understand what they do\n   - Check for destructive operations\n\n2. **Test in safe environments**\n   - Use containers or VMs for testing\n   - Have backups before system changes\n\n## Effective Prompting\n\n1. **Be specific**\n   - Good: "find large log files over 100MB in /var/log"\n   - Poor: "find big files"\n\n2. **Include constraints**\n   - Specify OS, tools available\n   - Mention performance requirements\n   - State security considerations\n\n## Learning Loop\n\n1. Generate command\n2. Explain command\n3. Execute and observe\n4. Iterate and improve\n\nRemember: Copilot CLI is a learning tool, not a replacement for understanding!',
                duration: 20,
                difficulty: 'advanced',
                order: 3
              }
            ];
          }
          
          // Insert lessons for this module
          lessons.forEach(lesson => {
            db.run(
              'INSERT INTO lessons (module_id, title, content, duration, difficulty, order_index) VALUES (?, ?, ?, ?, ?, ?)',
              [moduleId, lesson.title, lesson.content, lesson.duration, lesson.difficulty, lesson.order],
              (err) => {
                if (err) console.error('Error seeding lesson:', err);
              }
            );
          });
        }
      );
    });
    
    console.log('✓ Initial data seeded');
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'GitHub Copilot CLI Guide API is running',
    timestamp: new Date().toISOString()
  });
});

// Get all modules
app.get('/api/modules', (req, res) => {
  db.all('SELECT * FROM modules ORDER BY order_index', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get all lessons (with optional module filter)
app.get('/api/lessons', (req, res) => {
  const { module_id } = req.query;
  let query = 'SELECT * FROM lessons';
  let params = [];
  
  if (module_id) {
    query += ' WHERE module_id = ? ORDER BY order_index';
    params = [module_id];
  } else {
    query += ' ORDER BY module_id, order_index';
  }
  
  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get single lesson
app.get('/api/lessons/:id', (req, res) => {
  db.get(
    `SELECT lessons.*, modules.title as module_name, modules.id as module_id
     FROM lessons 
     LEFT JOIN modules ON lessons.module_id = modules.id
     WHERE lessons.id = ?`,
    [req.params.id],
    (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (!row) {
        res.status(404).json({ error: 'Lesson not found' });
        return;
      }
      res.json(row);
    }
  );
});

// Get all commands
app.get('/api/commands', (req, res) => {
  const { category } = req.query;
  let query = 'SELECT * FROM commands';
  let params = [];
  
  if (category) {
    query += ' WHERE category = ?';
    params = [category];
  }
  
  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health\n`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('\n✓ Database connection closed');
    process.exit(0);
  });
});
