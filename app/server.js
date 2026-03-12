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
    });

    // Quiz questions table
    db.run(`
      CREATE TABLE IF NOT EXISTS quiz_questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        lesson_id INTEGER NOT NULL,
        question TEXT NOT NULL,
        options TEXT NOT NULL,
        correct_answer INTEGER NOT NULL,
        explanation TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (lesson_id) REFERENCES lessons(id)
      )
    `, (err) => {
      if (err) console.error('Error creating quiz_questions table:', err);
      else console.log('✓ Quiz questions table ready');
    });

    // Quiz attempts table
    db.run(`
      CREATE TABLE IF NOT EXISTS quiz_attempts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        question_id INTEGER NOT NULL,
        selected_answer INTEGER NOT NULL,
        is_correct BOOLEAN NOT NULL,
        attempted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (question_id) REFERENCES quiz_questions(id)
      )
    `, (err) => {
      if (err) console.error('Error creating quiz_attempts table:', err);
      else console.log('✓ Quiz attempts table ready');
      
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
    
    // Seed modules - comprehensive course based on official GitHub docs
    const modules = [
      { title: 'Getting Started', description: 'Install Copilot CLI, authenticate, and run your first session', order: 1 },
      { title: 'Interactive Mode Essentials', description: 'Master file references, shell commands, and tool approvals', order: 2 },
      { title: 'Slash Commands & Features', description: 'Learn all slash commands and directory management', order: 3 },
      { title: 'Custom Agents & MCP', description: 'Extend Copilot with custom agents and MCP servers', order: 4 },
      { title: 'Advanced Workflows', description: 'Sessions, delegation, custom instructions, and best practices', order: 5 }
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
          
          // Lessons based on official GitHub Copilot CLI documentation
          if (module.title === 'Getting Started') {
            lessons = [
              {
                title: 'What is Copilot CLI?',
                content: '# What is GitHub Copilot CLI?\n\nGitHub Copilot CLI is a standalone command-line tool that brings AI-powered assistance directly to your terminal.\n\n## Who Can Use It?\n\nCopilot CLI is available with:\n- GitHub Copilot Pro\n- GitHub Copilot Pro+\n- GitHub Copilot Business\n- GitHub Copilot Enterprise\n\n> **Note**: If you receive Copilot from an organization, the Copilot CLI policy must be enabled in your organization\'s settings.\n\n## What Can It Do?\n\n- **Natural Language Commands**: Describe what you need in plain English\n- **File Context**: Reference files with `@path/to/file` syntax\n- **Tool Integration**: Extend capabilities with MCP servers\n- **Custom Agents**: Create specialized AI assistants\n- **Delegate Work**: Hand off tasks to Copilot coding agent on GitHub\n\n## Important Note\n\nGitHub Copilot CLI is in **public preview** with data protection and is subject to change.',
                duration: 5,
                difficulty: 'beginner',
                order: 1
              },
              {
                title: 'Installation',
                content: '# Installing GitHub Copilot CLI\n\n## Prerequisites\n\n- GitHub account with an active Copilot subscription\n- Administrator access on your machine\n\n## Installation Methods\n\n### Windows (WinGet)\n```bash\nwinget install GitHub.Copilot\n```\n\n### macOS (Homebrew)\n```bash\nbrew install copilot-cli\n```\n\n### Linux (Homebrew)\n```bash\nbrew install copilot-cli\n```\n\n### npm (Cross-Platform)\n```bash\n# Requires Node.js 22 or later\nnpm install -g @github/copilot\n```\n\n### Direct Download\n\nAlternatively, download the binary directly from the [GitHub releases page](https://github.com/githubnext/copilot-cli/releases).\n\n## Verify Installation\n\n```bash\ncopilot --version\n```\n\n## Getting Help\n\n```bash\ncopilot help\ncopilot help config\ncopilot help environment\ncopilot help logging\ncopilot help permissions\n```',
                duration: 10,
                difficulty: 'beginner',
                order: 2
              },
              {
                title: 'Starting Your First Session',
                content: '# Starting Your First Session\n\n## Launch Copilot CLI\n\n1. Navigate to a folder with code you want to work with:\n```bash\ncd ~/my-project\n```\n\n2. Start Copilot CLI:\n```bash\ncopilot\n```\n\n## Trust Folder Prompt\n\nCopilot will ask you to confirm that you trust the files in this folder:\n\n> **Important**: During this session, Copilot may attempt to read, modify, and execute files in and below this folder.\n\nChoose one option:\n\n1. **Yes, proceed** - Trust for this session only\n2. **Yes, and remember this folder** - Trust for all future sessions\n3. **No, exit (Esc)** - End the session\n\n## Authentication\n\nIf not logged in, you\'ll be prompted to authenticate:\n\n```bash\n/login\n```\n\nFollow the on-screen instructions to complete GitHub authentication.\n\n## Alternative: Token Authentication\n\nYou can also authenticate using environment variables:\n- `GH_TOKEN` - Fine-grained personal access token\n- `GITHUB_TOKEN` - Alternative token variable\n\n## Getting Help in Interactive Mode\n\nType `?` in the prompt box to see all available commands and options.',
                duration: 8,
                difficulty: 'beginner',
                order: 3
              },
              {
                title: 'Basic Usage Patterns',
                content: '# Basic Usage Patterns\n\n## Understanding Copilot CLI Modes\n\nCopilot CLI has two primary interaction modes:\n\n### Direct Mode\nExecute a single command and exit:\n```bash\ncopilot "your question or command"\n```\n\n### Interactive Mode\nStart a persistent session:\n```bash\ncopilot\n# Now you can ask multiple questions\n```\n\n## Common Usage Patterns\n\n### Ask Questions\n```bash\n> Explain this error message\n> How do I fix merge conflicts?\n> What does this code do?\n```\n\n### Generate Commands\n```bash\n> Find all JavaScript files modified in the last week\n> Create a new React component\n> Update all dependencies\n```\n\n### Reference Files\n```bash\n> Explain @src/app.js\n> What\'s the difference between @file1.js and @file2.js?\n> Refactor @utils/helper.js\n```\n\n### Chain Operations\nYou can build on previous responses:\n```bash\n> List all TypeScript files in src/\n> Now check which ones need type fixes\n> Fix the first one\n```\n\n## Tips for Best Results\n\n1. **Be Specific**: "Explain the authentication flow in @src/auth.js" is better than "Explain this"\n2. **Use Context**: Reference files with @ syntax\n3. **Iterate**: Build on Copilot\'s responses\n4. **Verify**: Always review generated commands before executing\n\n## Next Steps\n\nNow that you understand the basics, explore:\n- Slash commands for advanced features\n- Custom agents for specialized tasks\n- MCP servers for tool integration',
                duration: 8,
                difficulty: 'beginner',
                order: 4
              }
            ];
          } else if (module.title === 'Interactive Mode Essentials') {
            lessons = [
              {
                title: 'Natural Language Prompts',
                content: '# Natural Language Prompts\n\n## How It Works\n\nSimply type what you want in plain English. Copilot understands context and generates appropriate commands.\n\n## Example Prompts\n\n### File Operations\n```\nfind all JavaScript files larger than 1MB\nlist files modified in the last 24 hours\ncreate a new directory called components\n```\n\n### Git Operations\n```\nshow commits from last week\ncreate a new branch called feature/login\nstage and commit all changes with message "Fix bug"\n```\n\n### System Tasks\n```\nwhich process is using port 3000?\nshow disk usage for current directory\nfind and kill zombie processes\n```\n\n### Docker\n```\nlist all running containers\nstop all containers using more than 1GB memory\nbuild and run this Dockerfile\n```\n\n## Tips for Better Results\n\n1. **Be Specific**: "find PNG files > 5MB in /images" beats "find big files"\n2. **Add Context**: Mention your OS or preferred tools\n3. **Iterate**: Refine your prompt based on results',
                duration: 10,
                difficulty: 'beginner',
                order: 1
              },
              {
                title: 'File References with @',
                content: '# File References with @\n\n## Overview\n\nUse the `@` symbol followed by a file path to include file contents as context in your prompt.\n\n## Syntax\n\n```\n@path/to/file\n```\n\n## Auto-Complete\n\nWhen you start typing a file path after `@`, matching paths appear below the prompt box. Use:\n- **Arrow keys** to navigate\n- **Tab** to complete the path\n\n## Examples\n\n### Explain a File\n```\nExplain @config/ci/ci-required-checks.yml\n```\n\n### Fix Code\n```\nFix the bug in @src/app.js\n```\n\n### Compare Files\n```\nWhat\'s different between @old.js and @new.js?\n```\n\n### Summarize Multiple Files\n```\nSummarize @README.md and @CONTRIBUTING.md\n```\n\n### Review Dependencies\n```\nWhat dependencies are in @package.json that I should update?\n```\n\n## Why Use File References?\n\n- **Accuracy**: Copilot sees actual file contents\n- **Context**: Better understanding of your project\n- **Efficiency**: No need to copy-paste code',
                duration: 8,
                difficulty: 'beginner',
                order: 2
              },
              {
                title: 'Tool Approvals',
                content: '# Tool Approvals\n\n## Why Approvals Exist\n\nWhen Copilot wants to use a tool that could modify or execute files (like `touch`, `chmod`, `node`, or `sed`), it asks for your approval first.\n\n## Approval Options\n\nWhen prompted, choose one:\n\n### 1. Yes\n- Allow Copilot to use this tool once\n- Next time it wants to use this tool, it will ask again\n\n### 2. Yes, and approve TOOL for the rest of the running session\n- Allow this tool (with any options) without asking again\n- Approval only lasts for current session\n- **Use with caution**: Approving `rm` would let Copilot delete any file!\n\n### 3. No, and tell Copilot what to do differently (Esc)\n- Copilot won\'t run the command\n- You can provide alternative instructions\n\n## Example Workflow\n\n```\nYou: Create a script that backs up my database\n\nCopilot: I\'ll create a backup script. \n[Tool: touch backup.sh]\nApprove? [Yes / Yes for session / No (Esc)]\n```\n\n## Recovering from a Denial\n\nIf you press Esc, you can refine your request:\n```\nContinue the previous task but use a Python script instead\n```\n\n## Stopping Operations\n\nPress **Esc** while Copilot is "Thinking" to stop the current operation.',
                duration: 10,
                difficulty: 'beginner',
                order: 3
              },
              {
                title: 'Shell Commands with !',
                content: '# Direct Shell Commands with !\n\n## Overview\n\nPrepend your input with `!` to run shell commands directly, without making a call to the AI model.\n\n## Syntax\n\n```\n!command\n```\n\n## Examples\n\n### Clone a Repository\n```\n!git clone https://github.com/user/repo\n```\n\n### Check Status\n```\n!git status\n```\n\n### List Files\n```\n!ls -la\n```\n\n### Run Scripts\n```\n!npm install\n!python script.py\n```\n\n## When to Use !\n\n- **Known commands**: When you already know exactly what to run\n- **Quick operations**: Faster than waiting for AI response\n- **System checks**: `!pwd`, `!whoami`, `!which node`\n\n## When NOT to Use !\n\n- When you need help figuring out the right command\n- When you want Copilot to explain what a command does\n- When you need multi-step assistance',
                duration: 5,
                difficulty: 'beginner',
                order: 4
              }
            ];
          } else if (module.title === 'Slash Commands & Features') {
            lessons = [
              {
                title: 'Essential Slash Commands',
                content: '# Essential Slash Commands\n\n## Overview\n\nSlash commands are quick actions you can use in interactive mode.\n\n## Authentication\n\n```bash\n/login          # Authenticate with GitHub\n/logout         # Sign out of GitHub\n```\n\n## Getting Help\n\n```bash\n?               # Show available commands (type in prompt)\n/feedback       # Submit feedback, bug reports, or feature requests\n```\n\n## Session Management\n\n```bash\n/usage          # View context and usage statistics\nexit            # Exit interactive mode\nCtrl+C          # Also exits interactive mode\n```\n\n## What /usage Shows\n\n- Premium requests used in current session\n- Session duration\n- Lines of code edited\n- Token usage breakdown per model\n\n> **Warning**: When you have less than 20% of a model\'s token limit remaining, Copilot CLI displays a warning that context will be truncated.',
                duration: 8,
                difficulty: 'beginner',
                order: 1
              },
              {
                title: 'Directory Management',
                content: '# Directory Management\n\n## Working with Files Outside Current Directory\n\nCopilot may need to work with files outside your current location. It will ask for approval to access those directories.\n\n## /add-dir - Add Trusted Directory\n\nManually add a trusted directory:\n\n```bash\n/add-dir /path/to/directory\n```\n\nThis lets Copilot work with files in that location.\n\n## /cwd - Change Working Directory\n\nSwitch to a different working directory without starting a new session:\n\n```bash\n/cwd /path/to/directory\n```\n\n## Use Cases\n\n### Multi-Project Work\n```bash\n# Start in one project\ncopilot\n\n# Switch to another project\n/cwd ~/other-project\n\n# Add a shared utilities folder\n/add-dir ~/shared/utils\n```\n\n### Monorepo Navigation\n```bash\n# Working in packages/frontend\n/add-dir ../backend\n/add-dir ../shared\n```',
                duration: 6,
                difficulty: 'intermediate',
                order: 2
              },
              {
                title: 'Agent Commands',
                content: '# Agent Commands\n\n## /agent - Select Custom Agent\n\nSwitch to a custom agent for specialized tasks:\n\n```bash\n/agent\n```\n\nThis shows a list of available custom agents to choose from.\n\n## /delegate - Hand Off to Copilot Coding Agent\n\nDelegates your current session to Copilot coding agent on GitHub:\n\n```bash\n/delegate complete the API integration tests and fix any failing edge cases\n```\n\n## How /delegate Works\n\n1. Copilot asks to commit unstaged changes as a checkpoint\n2. Creates a new branch for the work\n3. Opens a **draft pull request** on GitHub\n4. Copilot coding agent works in the background\n5. Requests a review from you when complete\n6. Provides a link to the PR and agent session\n\n## When to Use /delegate\n\n- Long-running tasks you don\'t want to wait for\n- Complex multi-file changes\n- Test writing and debugging\n- When you want work to continue while you do other things\n\n## Important Notes\n\n- Your local context is preserved for the agent\n- Work happens on GitHub, not locally\n- You\'ll get notifications when review is needed',
                duration: 10,
                difficulty: 'intermediate',
                order: 3
              },
              {
                title: 'MCP Commands',
                content: '# MCP Commands\n\n## What is MCP?\n\nModel Context Protocol (MCP) extends Copilot CLI with external tools and services.\n\n## Built-in MCP Server\n\nCopilot CLI comes with the **GitHub MCP server** pre-configured, allowing you to:\n- Interact with GitHub.com resources\n- Merge pull requests from CLI\n- Manage issues and discussions\n\n## /mcp add - Add New Server\n\n```bash\n/mcp add\n```\n\n1. Fill in the MCP server details\n2. Use **Tab** to move between fields\n3. Press **Ctrl+S** to save\n\n## /mcp list - View Configured Servers\n\n```bash\n/mcp list\n```\n\n## Configuration File\n\nMCP server configurations are stored in:\n```\n~/.copilot/mcp-config.json\n```\n\nYou can change this location with the `XDG_CONFIG_HOME` environment variable.\n\n## Popular MCP Servers\n\n- **Playwright**: Browser automation and testing\n- **Filesystem**: Enhanced file operations\n- **Database**: Direct database queries\n- **Custom**: Build your own for specific tools',
                duration: 10,
                difficulty: 'intermediate',
                order: 4
              }
            ];
          } else if (module.title === 'Custom Agents & MCP') {
            lessons = [
              {
                title: 'Understanding Custom Agents',
                content: '# Understanding Custom Agents\n\n## What Are Custom Agents?\n\nCustom agents are specialized versions of Copilot coding agent tailored to your unique:\n- Workflows\n- Coding conventions\n- Use cases\n\nThey\'re defined using Markdown files called **agent profiles** that specify prompts, tools, and MCP servers.\n\n## Agent Profile Locations\n\n| Level | Location | Scope |\n|-------|----------|-------|\n| User-level | `~/.copilot/agents/` | All projects |\n| Repository-level | `.github/agents/` | Current project |\n| Organization-level | `.github-private/agents/` | All org projects |\n\n## Priority Order\n\nWhen agents have the same name:\n1. **User-level** overrides repository-level\n2. **Repository-level** overrides organization-level\n\n## Agent Profile Contents\n\nAn agent profile (`.md` file) typically includes:\n- Agent name and description\n- Specialized instructions\n- Tool preferences\n- MCP server configurations',
                duration: 8,
                difficulty: 'intermediate',
                order: 1
              },
              {
                title: 'Using Custom Agents',
                content: '# Using Custom Agents\n\n## Three Ways to Use Custom Agents\n\n### 1. Interactive Selection\n\nUse the slash command to see available agents:\n\n```bash\n/agent\n```\n\nSelect from the list of configured agents.\n\n### 2. Natural Language Inference\n\nMention the agent in your prompt:\n\n```bash\nUse the refactoring agent to refactor this code block\n```\n\nCopilot automatically infers which agent you mean.\n\n### 3. Command-Line Option\n\nSpecify the agent when starting Copilot:\n\n```bash\ncopilot --agent=refactor-agent --prompt "Refactor this code block"\n```\n\n## Example Agent Use Cases\n\n### DevOps Agent\n- Deployment automation\n- Infrastructure monitoring\n- Container management\n\n### Code Review Agent\n- PR reviews\n- Style enforcement\n- Bug detection\n\n### Documentation Agent\n- README generation\n- API documentation\n- Changelog updates',
                duration: 8,
                difficulty: 'intermediate',
                order: 2
              },
              {
                title: 'Configuring MCP Servers',
                content: '# Configuring MCP Servers\n\n## Adding an MCP Server\n\n1. Start interactive mode:\n```bash\ncopilot\n```\n\n2. Use the add command:\n```bash\n/mcp add\n```\n\n3. Fill in server details (use Tab to navigate)\n\n4. Save with **Ctrl+S**\n\n## Configuration File Structure\n\nServers are stored in `~/.copilot/mcp-config.json`:\n\n```json\n{\n  "mcpServers": {\n    "github": {\n      "command": "npx",\n      "args": ["@github/mcp-server"]\n    },\n    "playwright": {\n      "command": "npx",\n      "args": ["@playwright/mcp@latest"]\n    }\n  }\n}\n```\n\n## Server Types\n\n### stdio Servers\nCommunicate via standard input/output:\n```json\n{\n  "command": "npx",\n  "args": ["@some/mcp-server"]\n}\n```\n\n### HTTP Servers\nCommunicate over HTTP:\n```json\n{\n  "url": "http://localhost:3100"\n}\n```\n\n## Environment Variables\n\nYou can include environment variables:\n```json\n{\n  "command": "node",\n  "args": ["server.js"],\n  "env": {\n    "API_KEY": "your-key"\n  }\n}\n```',
                duration: 12,
                difficulty: 'advanced',
                order: 3
              },
              {
                title: 'Skills',
                content: '# Skills\n\n## What Are Skills?\n\nSkills enhance Copilot\'s ability to perform specialized tasks with:\n- Custom instructions\n- Scripts\n- Resources\n\n## How Skills Work\n\nSkills are reusable components that agents can leverage for specific capabilities:\n\n- **Code Generation Skills**: Language-specific patterns\n- **Testing Skills**: Test framework conventions\n- **Deployment Skills**: CI/CD workflows\n- **Documentation Skills**: Doc generation patterns\n\n## Skill Benefits\n\n1. **Consistency**: Same approach across projects\n2. **Reusability**: Write once, use everywhere\n3. **Specialization**: Deep expertise in specific areas\n4. **Maintainability**: Update skills centrally\n\n## Learning More\n\nSkills are an advanced feature. For detailed information, see the official GitHub documentation on Agent Skills.',
                duration: 6,
                difficulty: 'advanced',
                order: 4
              }
            ];
          } else if (module.title === 'Advanced Workflows') {
            lessons = [
              {
                title: 'Session Management',
                content: '# Session Management\n\n## Resuming Previous Sessions\n\nCopilot CLI saves your session history so you can return to previous conversations.\n\n### List Previous Sessions\n\n```bash\ncopilot --resume\n```\n\nThis shows a list of your previous sessions. Select one to continue.\n\n### Quick Resume Last Session\n\n```bash\ncopilot --continue\n```\n\nThis immediately resumes your most recently closed session.\n\n## Why Resume Sessions?\n\n- **Context Preservation**: Continue where you left off\n- **Long-Running Tasks**: Break up complex work\n- **Reference**: Review what you discussed before\n\n## Session Tips\n\n1. Use `/usage` to check remaining context before long tasks\n2. Exit gracefully with `exit` or Ctrl+C to save session state\n3. Use `--resume` to find that command you used last week',
                duration: 6,
                difficulty: 'intermediate',
                order: 1
              },
              {
                title: 'Custom Instructions',
                content: '# Custom Instructions\n\n## Overview\n\nCustom instructions are natural language descriptions in Markdown files that are automatically included in your prompts. They help Copilot understand your project context.\n\n## Supported Instruction Files\n\n### Repository-Wide Instructions\n```\n.github/copilot-instructions.md\n```\nApply to all prompts in this repository.\n\n### Path-Specific Instructions\n```\n.github/copilot-instructions/**/*.instructions.md\n```\nApply to specific directories or file types.\n\n### Agent Files\n```\nAGENTS.md\n```\nSpecial instructions for agent behavior.\n\n## Example Instructions File\n\n```markdown\n# Project Guidelines\n\n## Code Style\n- Use TypeScript with strict mode\n- Prefer functional components in React\n- Always include error handling\n\n## Testing\n- Write tests for all new functions\n- Use Jest and React Testing Library\n\n## Git Commits\n- Use conventional commit format\n- Keep commits atomic\n```\n\n## Benefits\n\n- **Consistency**: Copilot follows your team\'s conventions\n- **Context**: Better understanding of project structure\n- **Quality**: Suggestions match your standards',
                duration: 10,
                difficulty: 'intermediate',
                order: 2
              },
              {
                title: 'Configuration & Environment',
                content: '# Configuration & Environment\n\n## Configuration File\n\nAdjust settings in `~/.copilot/config.json` (or location set by `XDG_CONFIG_HOME`).\n\n## Getting Configuration Help\n\n```bash\ncopilot help config\n```\n\n## Environment Variables\n\n```bash\ncopilot help environment\n```\n\nKey environment variables:\n- `GH_TOKEN` / `GITHUB_TOKEN`: Authentication token\n- `XDG_CONFIG_HOME`: Custom config directory\n\n## Logging\n\n```bash\ncopilot help logging\n```\n\nConfigure log levels for debugging.\n\n## Permissions\n\n```bash\ncopilot help permissions\n```\n\nManage tool allow/deny lists.\n\n## Key Config Options\n\n- Model preferences\n- Default MCP servers\n- Trusted directories\n- Tool permissions',
                duration: 8,
                difficulty: 'advanced',
                order: 3
              },
              {
                title: 'Best Practices & Safety',
                content: '# Best Practices & Safety\n\n## Safety First\n\n### 1. Review Tool Actions\n- Always check what tools want to do before approving\n- Be cautious with session-wide approvals\n- Never approve unknown operations on production systems\n\n### 2. Trust Carefully\n- Only trust folders you control\n- Be careful with cloned repositories from unknown sources\n- Review files before trusting new directories\n\n### 3. Use Safe Environments\n- Test destructive commands in containers or VMs\n- Have backups before system-wide changes\n- Use version control\n\n## Effective Prompting\n\n### Be Specific\n✅ "Find log files larger than 100MB in /var/log"\n❌ "Find big files"\n\n### Use File References\n✅ "Explain @src/auth.js and suggest improvements"\n❌ "Explain my auth code"\n\n### Iterate\n- Start with simple prompts\n- Refine based on results\n- Use `/usage` to track context\n\n## Providing Feedback\n\n```bash\n/feedback\n```\n\nOptions:\n- Private feedback survey\n- Bug reports\n- Feature suggestions\n\n## Remember\n\nCopilot CLI is a powerful tool. With great power comes responsibility. Always review before approving!',
                duration: 12,
                difficulty: 'advanced',
                order: 4
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
    
    // Seed commands - based on official GitHub Copilot CLI documentation
    const commands = [
      // Core Commands
      {
        name: 'copilot',
        syntax: 'copilot [options]',
        description: 'Start Copilot CLI in interactive mode',
        category: 'Core Commands',
        examples: JSON.stringify([
          { description: 'Start interactive mode', command: 'copilot' },
          { description: 'Resume a previous session', command: 'copilot --resume' },
          { description: 'Continue last session', command: 'copilot --continue' },
          { description: 'Start with specific agent', command: 'copilot --agent=refactor-agent' }
        ])
      },
      {
        name: 'copilot help',
        syntax: 'copilot help [topic]',
        description: 'Get help about Copilot CLI commands and configuration',
        category: 'Core Commands',
        examples: JSON.stringify([
          { description: 'General help', command: 'copilot help' },
          { description: 'Configuration settings', command: 'copilot help config' },
          { description: 'Environment variables', command: 'copilot help environment' },
          { description: 'Logging options', command: 'copilot help logging' },
          { description: 'Tool permissions', command: 'copilot help permissions' }
        ])
      },
      // Installation Commands
      {
        name: 'brew install copilot-cli',
        syntax: 'brew install copilot-cli',
        description: 'Install Copilot CLI on macOS/Linux via Homebrew',
        category: 'Installation',
        examples: JSON.stringify([
          { description: 'Install on macOS or Linux', command: 'brew install copilot-cli' }
        ])
      },
      {
        name: 'winget install GitHub.Copilot',
        syntax: 'winget install GitHub.Copilot',
        description: 'Install Copilot CLI on Windows via WinGet',
        category: 'Installation',
        examples: JSON.stringify([
          { description: 'Install on Windows', command: 'winget install GitHub.Copilot' }
        ])
      },
      {
        name: 'npm install -g @github/copilot',
        syntax: 'npm install -g @github/copilot',
        description: 'Install Copilot CLI via npm (requires Node.js 22+)',
        category: 'Installation',
        examples: JSON.stringify([
          { description: 'Install via npm', command: 'npm install -g @github/copilot' }
        ])
      },
      // Authentication Slash Commands
      {
        name: '/login',
        syntax: '/login',
        description: 'Authenticate with GitHub to use Copilot CLI',
        category: 'Authentication',
        examples: JSON.stringify([
          { description: 'Login to GitHub', command: '/login' }
        ])
      },
      {
        name: '/logout',
        syntax: '/logout',
        description: 'Sign out of your GitHub account',
        category: 'Authentication',
        examples: JSON.stringify([
          { description: 'Sign out', command: '/logout' }
        ])
      },
      // Directory Management
      {
        name: '/add-dir',
        syntax: '/add-dir <path>',
        description: 'Add a trusted directory for Copilot to access',
        category: 'Directory Management',
        examples: JSON.stringify([
          { description: 'Trust another directory', command: '/add-dir /path/to/directory' },
          { description: 'Add parent directory', command: '/add-dir ..' }
        ])
      },
      {
        name: '/cwd',
        syntax: '/cwd <path>',
        description: 'Change working directory without starting a new session',
        category: 'Directory Management',
        examples: JSON.stringify([
          { description: 'Switch to another project', command: '/cwd ~/other-project' },
          { description: 'Go to subdirectory', command: '/cwd ./src' }
        ])
      },
      // Agent Commands
      {
        name: '/agent',
        syntax: '/agent',
        description: 'Select from available custom agents',
        category: 'Agent Commands',
        examples: JSON.stringify([
          { description: 'Show available agents', command: '/agent' }
        ])
      },
      {
        name: '/delegate',
        syntax: '/delegate <task description>',
        description: 'Delegate task to Copilot coding agent on GitHub (creates PR)',
        category: 'Agent Commands',
        examples: JSON.stringify([
          { description: 'Delegate test writing', command: '/delegate complete the API integration tests and fix any failing edge cases' },
          { description: 'Delegate feature work', command: '/delegate add input validation to the user registration form' }
        ])
      },
      // MCP Commands
      {
        name: '/mcp add',
        syntax: '/mcp add',
        description: 'Add an MCP server to extend Copilot CLI capabilities',
        category: 'MCP Commands',
        examples: JSON.stringify([
          { description: 'Add a new MCP server', command: '/mcp add' }
        ])
      },
      {
        name: '/mcp list',
        syntax: '/mcp list',
        description: 'List all configured MCP servers',
        category: 'MCP Commands',
        examples: JSON.stringify([
          { description: 'View configured servers', command: '/mcp list' }
        ])
      },
      // Session & Info Commands
      {
        name: '/usage',
        syntax: '/usage',
        description: 'View context and usage statistics for current session',
        category: 'Session Commands',
        examples: JSON.stringify([
          { description: 'Check token usage', command: '/usage' }
        ])
      },
      {
        name: '/feedback',
        syntax: '/feedback',
        description: 'Submit feedback, bug reports, or feature suggestions',
        category: 'Session Commands',
        examples: JSON.stringify([
          { description: 'Give feedback', command: '/feedback' }
        ])
      },
      // Special Syntax
      {
        name: '@filepath',
        syntax: '@path/to/file',
        description: 'Reference a file to include its contents as context',
        category: 'Special Syntax',
        examples: JSON.stringify([
          { description: 'Explain a config file', command: 'Explain @config/ci/ci-required-checks.yml' },
          { description: 'Fix a bug', command: 'Fix the bug in @src/app.js' },
          { description: 'Compare files', command: 'What is different between @old.js and @new.js?' }
        ])
      },
      {
        name: '!command',
        syntax: '!<shell command>',
        description: 'Run shell command directly without AI model call',
        category: 'Special Syntax',
        examples: JSON.stringify([
          { description: 'Clone a repo', command: '!git clone https://github.com/user/repo' },
          { description: 'Check git status', command: '!git status' },
          { description: 'List files', command: '!ls -la' }
        ])
      },
      {
        name: '?',
        syntax: '?',
        description: 'Show all available commands and options in interactive mode',
        category: 'Help',
        examples: JSON.stringify([
          { description: 'Get in-session help', command: '?' }
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
    
    // Seed examples - comprehensive examples for GitHub Copilot CLI
    const examples = [
      // Getting Started
      {
        title: 'Start Interactive Mode',
        code: 'copilot',
        category: 'Getting Started',
        difficulty: 'beginner',
        language: 'shell'
      },
      {
        title: 'Resume Previous Session',
        code: 'copilot --resume',
        category: 'Getting Started',
        difficulty: 'beginner',
        language: 'shell'
      },
      {
        title: 'Continue Last Session',
        code: 'copilot --continue',
        category: 'Getting Started',
        difficulty: 'beginner',
        language: 'shell'
      },
      // File References with @
      {
        title: 'Explain a Config File',
        code: 'Explain @config/ci/ci-required-checks.yml',
        category: 'File References',
        difficulty: 'beginner',
        language: 'natural'
      },
      {
        title: 'Fix a Bug in Code',
        code: 'Fix the bug in @src/app.js',
        category: 'File References',
        difficulty: 'beginner',
        language: 'natural'
      },
      {
        title: 'Compare Two Files',
        code: 'What is different between @old.js and @new.js?',
        category: 'File References',
        difficulty: 'intermediate',
        language: 'natural'
      },
      {
        title: 'Review Dependencies',
        code: 'What dependencies in @package.json should I update?',
        category: 'File References',
        difficulty: 'beginner',
        language: 'natural'
      },
      // Direct Shell Commands with !
      {
        title: 'Run Git Status Directly',
        code: '!git status',
        category: 'Shell Commands',
        difficulty: 'beginner',
        language: 'shell'
      },
      {
        title: 'Clone Repository Directly',
        code: '!git clone https://github.com/user/repo',
        category: 'Shell Commands',
        difficulty: 'beginner',
        language: 'shell'
      },
      // Natural Language Prompts
      {
        title: 'Find Large Files',
        code: 'find all files larger than 100MB in this directory',
        category: 'Natural Language',
        difficulty: 'beginner',
        language: 'natural'
      },
      {
        title: 'Check Port Usage',
        code: 'which process is using port 3000?',
        category: 'Natural Language',
        difficulty: 'intermediate',
        language: 'natural'
      },
      {
        title: 'Git Commit All Changes',
        code: 'stage and commit all changes with message "Fix authentication bug"',
        category: 'Natural Language',
        difficulty: 'beginner',
        language: 'natural'
      },
      {
        title: 'Docker Container Management',
        code: 'stop all running docker containers',
        category: 'Natural Language',
        difficulty: 'intermediate',
        language: 'natural'
      },
      {
        title: 'Search in Files',
        code: 'search for TODO comments in all JavaScript files',
        category: 'Natural Language',
        difficulty: 'beginner',
        language: 'natural'
      },
      // Slash Commands
      {
        title: 'Authenticate with GitHub',
        code: '/login',
        category: 'Slash Commands',
        difficulty: 'beginner',
        language: 'slash'
      },
      {
        title: 'Add Trusted Directory',
        code: '/add-dir ../shared-utils',
        category: 'Slash Commands',
        difficulty: 'intermediate',
        language: 'slash'
      },
      {
        title: 'Change Working Directory',
        code: '/cwd ~/other-project',
        category: 'Slash Commands',
        difficulty: 'intermediate',
        language: 'slash'
      },
      {
        title: 'View Session Usage',
        code: '/usage',
        category: 'Slash Commands',
        difficulty: 'beginner',
        language: 'slash'
      },
      // Delegation
      {
        title: 'Delegate Test Writing',
        code: '/delegate complete the API integration tests and fix any failing edge cases',
        category: 'Delegation',
        difficulty: 'advanced',
        language: 'slash'
      },
      {
        title: 'Delegate Feature Work',
        code: '/delegate add input validation to the user registration form',
        category: 'Delegation',
        difficulty: 'advanced',
        language: 'slash'
      },
      // Agents
      {
        title: 'Select Custom Agent',
        code: '/agent',
        category: 'Custom Agents',
        difficulty: 'intermediate',
        language: 'slash'
      },
      {
        title: 'Use Agent in Prompt',
        code: 'Use the refactoring agent to refactor this code block',
        category: 'Custom Agents',
        difficulty: 'intermediate',
        language: 'natural'
      },
      // MCP
      {
        title: 'Add MCP Server',
        code: '/mcp add',
        category: 'MCP Integration',
        difficulty: 'advanced',
        language: 'slash'
      },
      {
        title: 'List MCP Servers',
        code: '/mcp list',
        category: 'MCP Integration',
        difficulty: 'intermediate',
        language: 'slash'
      },
      // Help
      {
        title: 'In-Session Help',
        code: '?',
        category: 'Help',
        difficulty: 'beginner',
        language: 'slash'
      },
      {
        title: 'Configuration Help',
        code: 'copilot help config',
        category: 'Help',
        difficulty: 'beginner',
        language: 'shell'
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
    
    // Seed quiz questions
    const quizQuestions = [
      {
        lesson_id: 1, // Essential Slash Commands
        question: 'Which command shows available slash commands in an interactive session?',
        options: JSON.stringify(['?', '/help', '/commands', '/list']),
        correct_answer: 0,
        explanation: 'The "?" command displays all available slash commands during an interactive session.'
      },
      {
        lesson_id: 1,
        question: 'What does the /clear command do?',
        options: JSON.stringify(['Deletes all files', 'Clears conversation history', 'Resets terminal', 'Exits session']),
        correct_answer: 1,
        explanation: 'The /clear command clears the current conversation history from memory.'
      },
      {
        lesson_id: 2, // Agent Commands
        question: 'How do you select a custom agent to use?',
        options: JSON.stringify(['/agent', '/select-agent', '@agent', '/custom']),
        correct_answer: 0,
        explanation: 'Use the /agent command to see and select from available custom agents.'
      },
      {
        lesson_id: 3, // Directory Management
        question: 'Which command adds a trusted directory for Copilot to access?',
        options: JSON.stringify(['/trust', '/add-dir', '/directory', '/allow']),
        correct_answer: 1,
        explanation: 'The /add-dir command lets you add directories that Copilot can access without asking for approval.'
      },
      {
        lesson_id: 3,
        question: 'What does /cwd do?',
        options: JSON.stringify(['Creates new directory', 'Changes working directory', 'Copies working directory', 'Current workspace details']),
        correct_answer: 1,
        explanation: '/cwd changes the current working directory without starting a new session.'
      },
      {
        lesson_id: 4, // MCP Commands
        question: 'What command lists all configured MCP servers?',
        options: JSON.stringify(['/mcp show', '/mcp list', '/servers', '/mcp']),
        correct_answer: 1,
        explanation: 'Use /mcp list to see all configured Model Context Protocol servers.'
      }
    ];
    
    quizQuestions.forEach(quiz => {
      db.run(
        'INSERT INTO quiz_questions (lesson_id, question, options, correct_answer, explanation) VALUES (?, ?, ?, ?, ?)',
        [quiz.lesson_id, quiz.question, quiz.options, quiz.correct_answer, quiz.explanation],
        (err) => {
          if (err) console.error('Error seeding quiz question:', err);
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

// Get single command by name
app.get('/api/commands/:name', (req, res) => {
  const commandName = decodeURIComponent(req.params.name);
  
  db.get('SELECT * FROM commands WHERE name = ?', [commandName], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Command not found' });
      return;
    }
    
    // Parse related commands and fetch their details
    if (row.related_commands) {
      try {
        const relatedNames = JSON.parse(row.related_commands);
        if (relatedNames && relatedNames.length > 0) {
          const placeholders = relatedNames.map(() => '?').join(',');
          db.all(
            `SELECT name, description, category FROM commands WHERE name IN (${placeholders})`,
            relatedNames,
            (err, relatedCommands) => {
              if (err) {
                console.error('Error fetching related commands:', err);
                row.relatedCommands = [];
              } else {
                row.relatedCommands = relatedCommands;
              }
              res.json(row);
            }
          );
        } else {
          row.relatedCommands = [];
          res.json(row);
        }
      } catch (e) {
        console.error('Error parsing related_commands:', e);
        row.relatedCommands = [];
        res.json(row);
      }
    } else {
      row.relatedCommands = [];
      res.json(row);
    }
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

// Get or create user session (both /api/user and /api/user/session for compatibility)
app.post('/api/user', (req, res) => {
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
        // User exists, return it with parsed preferences
        return res.json({
          ...user,
          preferences: JSON.parse(user.preferences || '{}')
        });
      }
      
      // Create new user with default preferences
      const defaultPreferences = {
        theme: 'light',
        fontSize: 'medium',
        codeTheme: 'vs-dark'
      };
      
      db.run(
        'INSERT INTO users (session_id, preferences) VALUES (?, ?)',
        [session_id, JSON.stringify(defaultPreferences)],
        function(err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          
          // Return newly created user
          res.json({
            id: this.lastID,
            session_id,
            preferences: defaultPreferences,
            created_at: new Date().toISOString()
          });
        }
      );
    }
  );
});

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

// Get current user (creates session if none exists)
app.get('/api/user', (req, res) => {
  // Get session ID from header or cookie, or generate new one
  const sessionId = req.headers['x-session-id'] || req.query.session_id || `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Check if user exists
  db.get(
    'SELECT * FROM users WHERE session_id = ?',
    [sessionId],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (user) {
        // User exists, return it
        const preferences = user.preferences ? JSON.parse(user.preferences) : {};
        res.json({
          id: user.id,
          session_id: user.session_id,
          preferences,
          created_at: user.created_at
        });
      } else {
        // User doesn't exist, create new session
        const defaultPreferences = JSON.stringify({
          theme: 'light',
          fontSize: 'medium',
          codeTheme: 'vs-dark'
        });
        
        db.run(
          'INSERT INTO users (session_id, preferences) VALUES (?, ?)',
          [sessionId, defaultPreferences],
          function(err) {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
            
            res.json({
              id: this.lastID,
              session_id: sessionId,
              preferences: JSON.parse(defaultPreferences),
              created_at: new Date().toISOString()
            });
          }
        );
      }
    }
  );
});

// Update user preferences
app.put('/api/user/preferences', (req, res) => {
  const sessionId = req.headers['x-session-id'] || req.query.session_id;
  const { preferences } = req.body;
  
  // Validate inputs
  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID required' });
  }
  
  if (!preferences || typeof preferences !== 'object') {
    return res.status(400).json({ error: 'Invalid preferences data' });
  }
  
  // Find user
  db.get(
    'SELECT id FROM users WHERE session_id = ?',
    [sessionId],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Update preferences
      db.run(
        'UPDATE users SET preferences = ? WHERE id = ?',
        [JSON.stringify(preferences), user.id],
        (err) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          
          res.json({
            success: true,
            preferences
          });
        }
      );
    }
  );
});

// Export all user data (MUST come before :session_id route!)
app.get('/api/user/export', (req, res) => {
  const sessionId = req.headers['x-session-id'] || req.query.session_id;
  
  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID required' });
  }
  
  // Get user info - FIRST, create user if doesn't exist
  db.get(
    'SELECT * FROM users WHERE session_id = ?',
    [sessionId],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      // If user doesn't exist, create one
      if (!user) {
        db.run(
          'INSERT INTO users (session_id, preferences, created_at) VALUES (?, ?, datetime("now"))',
          [sessionId, JSON.stringify({ theme: 'light', fontSize: 'medium', codeTheme: 'vscode-dark' })],
          function(insertErr) {
            if (insertErr) {
              return res.status(500).json({ error: insertErr.message });
            }
            
            // Return empty export data for new user
            const exportData = {
              export_date: new Date().toISOString(),
              app_version: '1.0.0',
              user: {
                session_id: sessionId,
                preferences: { theme: 'light', fontSize: 'medium', codeTheme: 'vscode-dark' },
                created_at: new Date().toISOString()
              },
              progress: [],
              bookmarks: [],
              achievements: []
            };
            
            return res.json(exportData);
          }
        );
        return; // Exit early for new user creation
      }
      
      // Get user progress
      db.all(
        'SELECT * FROM progress WHERE user_id = ?',
        [user.id],
        (err, progress) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          
          // Get user bookmarks
          db.all(
            'SELECT * FROM bookmarks WHERE user_id = ?',
            [user.id],
            (err, bookmarks) => {
              if (err) {
                return res.status(500).json({ error: err.message });
              }
              
              // Get user achievements
              db.all(
                'SELECT * FROM user_achievements WHERE user_id = ?',
                [user.id],
                (err, achievements) => {
                  if (err) {
                    return res.status(500).json({ error: err.message });
                  }
                  
                  // Compile all data
                  const exportData = {
                    export_date: new Date().toISOString(),
                    app_version: '1.0.0',
                    user: {
                      session_id: user.session_id,
                      preferences: user.preferences ? JSON.parse(user.preferences) : {},
                      created_at: user.created_at
                    },
                    progress: progress || [],
                    bookmarks: bookmarks || [],
                    achievements: achievements || []
                  };
                  
                  res.json(exportData);
                }
              );
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
// Get bookmarks with query parameter (for frontend compatibility)
app.get('/api/bookmarks', (req, res) => {
  const sessionId = req.query.session_id;
  
  if (!sessionId) {
    return res.status(400).json({ error: 'session_id query parameter required' });
  }
  
  db.get(
    'SELECT id FROM users WHERE session_id = ?',
    [sessionId],
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

// Quiz API endpoints

// Get quiz questions for a lesson
app.get('/api/lessons/:id/quiz', (req, res) => {
  db.all(
    'SELECT * FROM quiz_questions WHERE lesson_id = ?',
    [req.params.id],
    (err, questions) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      // Parse options from JSON string
      const parsedQuestions = questions.map(q => ({
        ...q,
        options: JSON.parse(q.options)
      }));
      
      res.json(parsedQuestions);
    }
  );
});

// Submit quiz answer
app.post('/api/quiz/submit', (req, res) => {
  const { user_id, question_id, selected_answer } = req.body;
  
  if (!user_id || !question_id || selected_answer === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  // Get the correct answer
  db.get(
    'SELECT correct_answer, explanation FROM quiz_questions WHERE id = ?',
    [question_id],
    (err, question) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (!question) {
        return res.status(404).json({ error: 'Question not found' });
      }
      
      const isCorrect = selected_answer === question.correct_answer;
      
      // Record the attempt
      db.run(
        'INSERT INTO quiz_attempts (user_id, question_id, selected_answer, is_correct) VALUES (?, ?, ?, ?)',
        [user_id, question_id, selected_answer, isCorrect],
        function(err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          
          res.json({
            is_correct: isCorrect,
            explanation: question.explanation,
            correct_answer: question.correct_answer
          });
        }
      );
    }
  );
});

// Get user quiz attempts for a lesson
app.get('/api/quiz/attempts/:user_id/:lesson_id', (req, res) => {
  db.all(
    `SELECT qa.*, qq.question, qq.correct_answer 
     FROM quiz_attempts qa
     JOIN quiz_questions qq ON qa.question_id = qq.id
     WHERE qa.user_id = ? AND qq.lesson_id = ?
     ORDER BY qa.attempted_at DESC`,
    [req.params.user_id, req.params.lesson_id],
    (err, attempts) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(attempts);
    }
  );
});

// Terminal Simulator

// Execute simulated terminal command
app.post('/api/terminal/execute', (req, res) => {
  const { command } = req.body;
  
  if (!command) {
    return res.status(400).json({ error: 'command required' });
  }
  
  const cmd = command.trim().toLowerCase();
  let output = '';
  let exitCode = 0;
  
  // Simulate Copilot CLI commands
  if (cmd === 'copilot' || cmd === 'copilot help') {
    output = `GitHub Copilot CLI - Your AI pair programmer in the terminal

Usage: copilot [options]

Options:
  --version    Show version number
  --help       Show help

Interactive Mode:
  copilot      Start an interactive session

Slash Commands:
  /login       Authenticate with GitHub
  /logout      Sign out
  /add-dir     Add a trusted directory
  /cwd         Change working directory
  /agent       Work with custom agents
  /delegate    Delegate work to Copilot on GitHub
  /mcp         Manage MCP servers
  /feedback    Send feedback to GitHub
  /usage       View API usage

Type '?' in interactive mode for more help.`;
  } else if (cmd === '/help' || cmd === '?') {
    output = `Available Commands:

Slash Commands:
  /login       - Authenticate with GitHub
  /logout      - Sign out  
  /add-dir     - Add a trusted directory
  /cwd         - Change working directory
  /agent       - Work with custom agents
  /delegate    - Delegate work to Copilot
  /mcp         - Manage MCP servers
  /feedback    - Send feedback
  /usage       - View API usage

Special Syntax:
  @file        - Reference a file
  !command     - Run shell command directly

Press Esc to cancel the current operation.`;
  } else if (cmd.startsWith('/login')) {
    output = `Authenticating with GitHub...

✓ Successfully authenticated as demo-user
✓ Copilot subscription: Active
✓ Ready to assist!`;
  } else if (cmd.startsWith('/add-dir')) {
    const path = cmd.replace('/add-dir', '').trim() || '/example/path';
    output = `✓ Added trusted directory: ${path}

Copilot can now access files in this directory without asking for approval.`;
  } else if (cmd.startsWith('/cwd')) {
    const path = cmd.replace('/cwd', '').trim() || '/example/path';
    output = `✓ Changed working directory to: ${path}

Current directory: ${path}`;
  } else if (cmd.startsWith('/agent')) {
    output = `Available Agents:

  - @workspace   Work with your codebase
  - @terminal    Terminal command expert
  - @vscode      VS Code extension help
  - @github      GitHub operations

Use: /agent <name> <your question>`;
  } else if (cmd.startsWith('/mcp list')) {
    output = `Installed MCP Servers:

  ✓ filesystem      - File operations
  ✓ brave-search    - Web search
  ✓ sqlite          - Database queries
  ✓ playwright      - Browser automation

Use: /mcp add <server-name> to install more servers.`;
  } else if (cmd.startsWith('/usage')) {
    output = `API Usage Statistics:

Requests this month: 1,247 / 5,000
Code completions:    856
Chat messages:       391

Current plan: Copilot Pro
Resets: January 1, 2025`;
  } else if (cmd === 'clear') {
    output = '[Terminal cleared]';
  } else {
    // Simulate natural language response
    output = `💡 Copilot suggests:

I understand you want to: "${command}"

Here's what I recommend:
  1. Verify your current directory
  2. Check file permissions
  3. Review relevant documentation

Would you like me to help with any specific step?`;
  }
  
  res.json({
    command,
    output,
    exitCode,
    timestamp: new Date().toISOString()
  });
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

// Achievements API

// Get all achievements
app.get('/api/achievements', (req, res) => {
  db.all(
    'SELECT id, title, description, criteria, icon FROM achievements ORDER BY id',
    [],
    (err, achievements) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(achievements);
    }
  );
});

// Get user's unlocked achievements
app.get('/api/achievements/user', (req, res) => {
  const sessionId = req.headers['x-session-id'] || req.query.session_id;
  
  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID required' });
  }
  
  // Get user ID from session
  db.get(
    'SELECT id FROM users WHERE session_id = ?',
    [sessionId],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Get user's achievements with details
      db.all(
        `SELECT 
          a.id, 
          a.title, 
          a.description, 
          a.criteria,
          a.icon,
          ua.unlocked_at 
        FROM user_achievements ua 
        JOIN achievements a ON ua.achievement_id = a.id 
        WHERE ua.user_id = ?
        ORDER BY ua.unlocked_at DESC`,
        [user.id],
        (err, achievements) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.json(achievements);
        }
      );
    }
  );
});

// Check and unlock achievements
app.post('/api/achievements/check', (req, res) => {
  const sessionId = req.headers['x-session-id'] || req.body.session_id;
  
  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID required' });
  }
  
  // Get user ID from session
  db.get(
    'SELECT id FROM users WHERE session_id = ?',
    [sessionId],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const userId = user.id;
      const newlyUnlocked = [];
      
      // Check all achievements
      db.all('SELECT id, criteria FROM achievements', [], (err, achievements) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        
        let checksCompleted = 0;
        const totalChecks = achievements.length;
        
        achievements.forEach(achievement => {
          checkAchievement(userId, achievement, (unlocked) => {
            if (unlocked) {
              newlyUnlocked.push(unlocked);
            }
            checksCompleted++;
            
            if (checksCompleted === totalChecks) {
              res.json({ 
                checked: totalChecks,
                unlocked: newlyUnlocked 
              });
            }
          });
        });
        
        if (totalChecks === 0) {
          res.json({ checked: 0, unlocked: [] });
        }
      });
    }
  );
});

// Helper function to check and unlock a specific achievement
function checkAchievement(userId, achievement, callback) {
  const criteria = achievement.criteria;
  
  // Check if already unlocked
  db.get(
    'SELECT id FROM user_achievements WHERE user_id = ? AND achievement_id = ?',
    [userId, achievement.id],
    (err, existing) => {
      if (err || existing) {
        return callback(null);
      }
      
      // Check criteria
      
      if (criteria === 'complete_lesson_1') {
        // Check if user has completed at least 1 lesson
        db.get(
          'SELECT COUNT(*) as count FROM progress WHERE user_id = ?',
          [userId],
          (err, result) => {
            if (!err && result.count >= 1) {
              unlockAchievement(userId, achievement.id, achievement, callback);
            } else {
              callback(null);
            }
          }
        );
      } else if (criteria === 'complete_lesson_5') {
        db.get(
          'SELECT COUNT(*) as count FROM progress WHERE user_id = ?',
          [userId],
          (err, result) => {
            if (!err && result.count >= 5) {
              unlockAchievement(userId, achievement.id, achievement, callback);
            } else {
              callback(null);
            }
          }
        );
      } else if (criteria === 'complete_lesson_10') {
        db.get(
          'SELECT COUNT(*) as count FROM progress WHERE user_id = ?',
          [userId],
          (err, result) => {
            if (!err && result.count >= 10) {
              unlockAchievement(userId, achievement.id, achievement, callback);
            } else {
              callback(null);
            }
          }
        );
      } else if (criteria === 'complete_module_1') {
        // Check if user has completed all lessons in at least one module
        db.all(
          `SELECT m.id, m.title,
            (SELECT COUNT(*) FROM lessons WHERE module_id = m.id) as total_lessons,
            (SELECT COUNT(*) FROM progress p 
             JOIN lessons l ON p.lesson_id = l.id 
             WHERE l.module_id = m.id AND p.user_id = ?) as completed_lessons
          FROM modules m`,
          [userId],
          (err, modules) => {
            if (!err) {
              const hasCompleteModule = modules.some(m => m.total_lessons > 0 && m.completed_lessons === m.total_lessons);
              if (hasCompleteModule) {
                unlockAchievement(userId, achievement.id, achievement, callback);
              } else {
                callback(null);
              }
            } else {
              callback(null);
            }
          }
        );
      } else if (criteria === 'bookmark_5') {
        db.get(
          'SELECT COUNT(*) as count FROM bookmarks WHERE user_id = ?',
          [userId],
          (err, result) => {
            if (!err && result.count >= 5) {
              unlockAchievement(userId, achievement.id, achievement, callback);
            } else {
              callback(null);
            }
          }
        );
      } else if (criteria === 'complete_all') {
        // Check if user completed all lessons
        db.get(
          `SELECT 
            (SELECT COUNT(*) FROM lessons) as total,
            (SELECT COUNT(*) FROM progress WHERE user_id = ?) as completed`,
          [userId],
          (err, result) => {
            if (!err && result.total > 0 && result.completed === result.total) {
              unlockAchievement(userId, achievement.id, achievement, callback);
            } else {
              callback(null);
            }
          }
        );
      } else {
        // Criteria not yet implemented
        callback(null);
      }
    }
  );
}

// Helper to unlock an achievement
function unlockAchievement(userId, achievementId, achievement, callback) {
  db.run(
    'INSERT OR IGNORE INTO user_achievements (user_id, achievement_id) VALUES (?, ?)',
    [userId, achievementId],
    function(err) {
      if (err) {
        callback(null);
      } else if (this.changes > 0) {
        // Achievement was newly unlocked
        callback({
          id: achievement.id,
          title: achievement.title,
          description: achievement.description,
          icon: achievement.icon
        });
      } else {
        callback(null);
      }
    }
  );
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
