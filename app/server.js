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
    
    // Seed commands
    const commands = [
      {
        name: 'gh copilot suggest',
        syntax: 'gh copilot suggest [options] "<description>"',
        description: 'Generate shell commands from natural language descriptions',
        category: 'Core Commands',
        examples: JSON.stringify([
          {
            description: 'Find all JavaScript files',
            command: 'gh copilot suggest "find all javascript files"'
          },
          {
            description: 'List running Docker containers',
            command: 'gh copilot suggest "list all running docker containers"'
          },
          {
            description: 'Search for text in files',
            command: 'gh copilot suggest "search for TODO in all js files"'
          }
        ])
      },
      {
        name: 'gh copilot explain',
        syntax: 'gh copilot explain "<command>"',
        description: 'Explain what a command does in plain English',
        category: 'Core Commands',
        examples: JSON.stringify([
          {
            description: 'Explain a find command',
            command: 'gh copilot explain "find . -name \'*.js\' -type f"'
          },
          {
            description: 'Understand git rebase',
            command: 'gh copilot explain "git rebase -i HEAD~3"'
          },
          {
            description: 'Docker command explanation',
            command: 'gh copilot explain "docker run -d -p 8080:80 nginx"'
          }
        ])
      },
      {
        name: 'gh copilot --version',
        syntax: 'gh copilot --version',
        description: 'Display version information for GitHub Copilot CLI',
        category: 'Info Commands',
        examples: JSON.stringify([
          {
            description: 'Check installed version',
            command: 'gh copilot --version'
          }
        ])
      },
      {
        name: 'gh copilot --help',
        syntax: 'gh copilot --help',
        description: 'Show help information and available commands',
        category: 'Info Commands',
        examples: JSON.stringify([
          {
            description: 'Get general help',
            command: 'gh copilot --help'
          },
          {
            description: 'Get help for suggest command',
            command: 'gh copilot suggest --help'
          },
          {
            description: 'Get help for explain command',
            command: 'gh copilot explain --help'
          }
        ])
      },
      {
        name: 'gh extension install',
        syntax: 'gh extension install github/gh-copilot',
        description: 'Install the GitHub Copilot CLI extension',
        category: 'Setup',
        examples: JSON.stringify([
          {
            description: 'Install Copilot CLI extension',
            command: 'gh extension install github/gh-copilot'
          }
        ])
      },
      {
        name: 'gh extension upgrade',
        syntax: 'gh extension upgrade gh-copilot',
        description: 'Upgrade the GitHub Copilot CLI extension to the latest version',
        category: 'Setup',
        examples: JSON.stringify([
          {
            description: 'Upgrade to latest version',
            command: 'gh extension upgrade gh-copilot'
          }
        ])
      },
      {
        name: 'gh auth login',
        syntax: 'gh auth login',
        description: 'Authenticate with GitHub (required for Copilot CLI)',
        category: 'Setup',
        examples: JSON.stringify([
          {
            description: 'Login to GitHub',
            command: 'gh auth login'
          }
        ])
      }
    ];
    
    commands.forEach(cmd => {
      db.run(
        'INSERT INTO commands (name, syntax, description, category, examples) VALUES (?, ?, ?, ?, ?)',
        [cmd.name, cmd.syntax, cmd.description, cmd.category, cmd.examples],
        (err) => {
          if (err) console.error('Error seeding command:', err);
        }
      );
    });
    
    // Seed examples
    const examples = [
      {
        title: 'Find Large Files',
        code: 'gh copilot suggest "find files larger than 100MB"',
        category: 'File Operations',
        difficulty: 'beginner',
        language: 'bash'
      },
      {
        title: 'Git Commit with Message',
        code: 'gh copilot suggest "commit all changes with message \'Fix bug\'"',
        category: 'Git',
        difficulty: 'beginner',
        language: 'bash'
      },
      {
        title: 'Docker Container Management',
        code: 'gh copilot suggest "stop all running docker containers"',
        category: 'Docker',
        difficulty: 'intermediate',
        language: 'bash'
      },
      {
        title: 'Network Diagnostics',
        code: 'gh copilot suggest "check which process is using port 3000"',
        category: 'System',
        difficulty: 'intermediate',
        language: 'bash'
      },
      {
        title: 'Archive Directory',
        code: 'gh copilot suggest "create tar.gz archive of src folder"',
        category: 'File Operations',
        difficulty: 'beginner',
        language: 'bash'
      },
      {
        title: 'Search in Files',
        code: 'gh copilot suggest "search for TODO comments in all js files"',
        category: 'File Operations',
        difficulty: 'beginner',
        language: 'bash'
      },
      {
        title: 'Process Management',
        code: 'gh copilot suggest "kill all node processes"',
        category: 'System',
        difficulty: 'intermediate',
        language: 'bash'
      },
      {
        title: 'Git Branch Operations',
        code: 'gh copilot suggest "delete all local branches except main"',
        category: 'Git',
        difficulty: 'advanced',
        language: 'bash'
      },
      {
        title: 'Log Analysis',
        code: 'gh copilot suggest "find errors in last 100 lines of system log"',
        category: 'System',
        difficulty: 'intermediate',
        language: 'bash'
      },
      {
        title: 'Permission Changes',
        code: 'gh copilot suggest "make all shell scripts executable"',
        category: 'File Operations',
        difficulty: 'beginner',
        language: 'bash'
      },
      {
        title: 'Database Backup',
        code: 'gh copilot suggest "backup postgres database to file"',
        category: 'Database',
        difficulty: 'intermediate',
        language: 'bash'
      },
      {
        title: 'Kubernetes Pods',
        code: 'gh copilot suggest "list all pods in namespace production"',
        category: 'Kubernetes',
        difficulty: 'advanced',
        language: 'bash'
      }
    ];
    
    examples.forEach(ex => {
      db.run(
        'INSERT INTO examples (title, code, category, difficulty, language) VALUES (?, ?, ?, ?, ?)',
        [ex.title, ex.code, ex.category, ex.difficulty, ex.language],
        (err) => {
          if (err) console.error('Error seeding example:', err);
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

// Get all examples (with optional category/difficulty filter)
app.get('/api/examples', (req, res) => {
  const { category, difficulty } = req.query;
  let query = 'SELECT * FROM examples';
  let params = [];
  let conditions = [];
  
  if (category) {
    conditions.push('category = ?');
    params.push(category);
  }
  
  if (difficulty) {
    conditions.push('difficulty = ?');
    params.push(difficulty);
  }
  
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  
  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// User/Session Management

// Get or create user session
app.post('/api/user/session', (req, res) => {
  const { session_id } = req.body;
  
  if (!session_id) {
    return res.status(400).json({ error: 'session_id required' });
  }
  
  // Check if user exists
  db.get(
    'SELECT * FROM users WHERE session_id = ?',
    [session_id],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (user) {
        // User exists, return it
        return res.json(user);
      }
      
      // Create new user
      db.run(
        'INSERT INTO users (session_id, preferences) VALUES (?, ?)',
        [session_id, JSON.stringify({})],
        function(err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          
          // Return newly created user
          db.get(
            'SELECT * FROM users WHERE id = ?',
            [this.lastID],
            (err, newUser) => {
              if (err) {
                return res.status(500).json({ error: err.message });
              }
              res.json(newUser);
            }
          );
        }
      );
    }
  );
});

// Get user by session ID
app.get('/api/user/:session_id', (req, res) => {
  db.get(
    'SELECT * FROM users WHERE session_id = ?',
    [req.params.session_id],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    }
  );
});

// Progress Tracking

// Get user's progress
app.get('/api/progress/:session_id', (req, res) => {
  db.get(
    'SELECT id FROM users WHERE session_id = ?',
    [req.params.session_id],
    (err, user) => {
      if (err || !user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      db.all(
        'SELECT * FROM progress WHERE user_id = ?',
        [user.id],
        (err, rows) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.json(rows);
        }
      );
    }
  );
});

// Mark lesson as complete
app.post('/api/progress/:session_id/lesson/:lesson_id', (req, res) => {
  db.get(
    'SELECT id FROM users WHERE session_id = ?',
    [req.params.session_id],
    (err, user) => {
      if (err || !user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      db.run(
        'INSERT OR REPLACE INTO progress (user_id, lesson_id) VALUES (?, ?)',
        [user.id, req.params.lesson_id],
        function(err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.json({ success: true, lesson_id: req.params.lesson_id });
        }
      );
    }
  );
});

// Remove lesson completion
app.delete('/api/progress/:session_id/lesson/:lesson_id', (req, res) => {
  db.get(
    'SELECT id FROM users WHERE session_id = ?',
    [req.params.session_id],
    (err, user) => {
      if (err || !user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      db.run(
        'DELETE FROM progress WHERE user_id = ? AND lesson_id = ?',
        [user.id, req.params.lesson_id],
        function(err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.json({ success: true, lesson_id: req.params.lesson_id });
        }
      );
    }
  );
});

// Get user bookmarks
app.get('/api/bookmarks/:session_id', (req, res) => {
  db.get(
    'SELECT id FROM users WHERE session_id = ?',
    [req.params.session_id],
    (err, user) => {
      if (err || !user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      db.all(
        `SELECT b.*, l.title, l.duration, l.difficulty, m.title as module_name, b.resource_id as lesson_id
         FROM bookmarks b
         JOIN lessons l ON b.resource_id = l.id AND b.resource_type = 'lesson'
         JOIN modules m ON l.module_id = m.id
         WHERE b.user_id = ?
         ORDER BY b.created_at DESC`,
        [user.id],
        (err, bookmarks) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.json({ bookmarks });
        }
      );
    }
  );
});

// Add bookmark
app.post('/api/bookmarks/:session_id/lesson/:lesson_id', (req, res) => {
  db.get(
    'SELECT id FROM users WHERE session_id = ?',
    [req.params.session_id],
    (err, user) => {
      if (err || !user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Check if bookmark already exists
      db.get(
        'SELECT id FROM bookmarks WHERE user_id = ? AND resource_type = ? AND resource_id = ?',
        [user.id, 'lesson', req.params.lesson_id],
        (err, existing) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          
          if (existing) {
            return res.json({ success: true, already_bookmarked: true });
          }
          
          db.run(
            'INSERT INTO bookmarks (user_id, resource_type, resource_id) VALUES (?, ?, ?)',
            [user.id, 'lesson', req.params.lesson_id],
            function(err) {
              if (err) {
                return res.status(500).json({ error: err.message });
              }
              res.json({ success: true, lesson_id: req.params.lesson_id });
            }
          );
        }
      );
    }
  );
});

// Remove bookmark
app.delete('/api/bookmarks/:session_id/lesson/:lesson_id', (req, res) => {
  db.get(
    'SELECT id FROM users WHERE session_id = ?',
    [req.params.session_id],
    (err, user) => {
      if (err || !user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      db.run(
        'DELETE FROM bookmarks WHERE user_id = ? AND resource_type = ? AND resource_id = ?',
        [user.id, 'lesson', req.params.lesson_id],
        function(err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.json({ success: true, lesson_id: req.params.lesson_id });
        }
      );
    }
  );
});

// Update bookmark notes
app.put('/api/bookmarks/:id/notes', (req, res) => {
  const { notes } = req.body;
  
  db.run(
    'UPDATE bookmarks SET notes = ? WHERE id = ?',
    [notes, req.params.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Bookmark not found' });
      }
      res.json({ success: true, bookmark_id: req.params.id, notes });
    }
  );
});

// Global search endpoint
app.get('/api/search', (req, res) => {
  const { q } = req.query;
  
  if (!q || q.trim().length === 0) {
    return res.json({ results: [] });
  }
  
  const searchTerm = `%${q}%`;
  const results = {
    lessons: [],
    commands: [],
    examples: []
  };
  
  // Search lessons
  db.all(
    `SELECT l.id, l.title, l.content, l.difficulty, l.duration, m.title as module_name, m.id as module_id
     FROM lessons l
     JOIN modules m ON l.module_id = m.id
     WHERE l.title LIKE ? OR l.content LIKE ?
     ORDER BY l.title
     LIMIT 10`,
    [searchTerm, searchTerm],
    (err, lessons) => {
      if (err) {
        console.error('Error searching lessons:', err);
      } else {
        results.lessons = lessons.map(lesson => ({
          ...lesson,
          type: 'lesson',
          snippet: extractSnippet(lesson.content, q)
        }));
      }
      
      // Search commands
      db.all(
        `SELECT id, name, syntax, description, category
         FROM commands
         WHERE name LIKE ? OR description LIKE ? OR syntax LIKE ?
         ORDER BY name
         LIMIT 10`,
        [searchTerm, searchTerm, searchTerm],
        (err, commands) => {
          if (err) {
            console.error('Error searching commands:', err);
          } else {
            results.commands = commands.map(cmd => ({
              ...cmd,
              type: 'command',
              snippet: cmd.description ? cmd.description.substring(0, 150) : ''
            }));
          }
          
          // Search examples
          db.all(
            `SELECT id, title, code, category, difficulty, language
             FROM examples
             WHERE title LIKE ? OR code LIKE ?
             ORDER BY title
             LIMIT 10`,
            [searchTerm, searchTerm],
            (err, examples) => {
              if (err) {
                console.error('Error searching examples:', err);
              } else {
                results.examples = examples.map(ex => ({
                  ...ex,
                  type: 'example',
                  snippet: ex.code ? ex.code.substring(0, 150) : ''
                }));
              }
              
              // Combine all results
              const allResults = [
                ...results.lessons,
                ...results.commands,
                ...results.examples
              ];
              
              res.json({ 
                results: allResults,
                count: allResults.length,
                query: q
              });
            }
          );
        }
      );
    }
  );
});

// Helper function to extract snippet with search term context
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
