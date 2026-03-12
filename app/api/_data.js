// Shared data for Vercel Serverless Functions
// This replaces SQLite with in-memory data for serverless deployment


export const modules = [
  { id: 1, title: 'Getting Started', description: 'Install Copilot CLI, authenticate, and run your first session', order_index: 1 },
  { id: 2, title: 'Interactive Mode Essentials', description: 'Master file references, shell commands, and tool approvals', order_index: 2 },
  { id: 3, title: 'Slash Commands & Features', description: 'Learn all slash commands and directory management', order_index: 3 },
  { id: 4, title: 'Custom Agents & MCP', description: 'Extend Copilot with custom agents and MCP servers', order_index: 4 },
  { id: 5, title: 'Advanced Workflows', description: 'Sessions, delegation, custom instructions, and best practices', order_index: 5 }
];

export const lessons = [
  {
    id: 1,
    module_id: 1,
    title: 'Essential Slash Commands',
    content: '# Essential Slash Commands\n\n## Overview\nSlash commands provide direct control over Copilot CLI. Type `/` to see autocomplete suggestions.\n\n## Session Management\n```bash\n/clear          # Clear conversation history\n/compact        # Summarize conversation to reduce context\n/context        # Show context window token usage\n/session        # Show session info and workspace summary\n/resume         # Switch to a different session\n/rename <name>  # Rename current session\n/share          # Share session to markdown or GitHub gist\n/copy           # Copy last response to clipboard\n/exit           # Exit the CLI (also /quit)\n/restart        # Restart CLI, preserving session\n```\n\n## Model & Agent Commands\n```bash\n/model          # Select AI model (Claude, GPT-5, Gemini)\n/model gpt-5    # Switch to specific model\n/fleet          # Enable fleet mode for parallel subagents\n/tasks          # View and manage background tasks\n/agent          # Browse and select custom agents\n/delegate       # Delegate task to cloud coding agent\n```\n\n## Code & Review\n```bash\n/diff           # Review changes with syntax-highlighted diffs\n/review         # Run code review agent on staged/unstaged changes\n/plan           # Create implementation plan before coding\n/research       # Deep research using GitHub search and web\n/init           # Initialize Copilot instructions for repo\n/lsp            # Manage language server configuration\n/ide            # Connect to an IDE workspace\n/terminal-setup # Configure multiline input (shift+enter)\n```\n\n## Permissions\n```bash\n/allow-all      # Enable all permissions (also /yolo)\n/add-dir <path> # Add directory to allowed list\n/list-dirs      # Display all allowed directories\n/cwd <path>     # Change working directory\n/reset-allowed-tools  # Reset allowed tools list\n```\n\n## Authentication & User\n```bash\n/login          # Authenticate with GitHub\n/logout         # Sign out\n/user           # Manage GitHub user list\n```\n\n## Help & Configuration\n```bash\n/help           # Show all commands\n/feedback       # Submit feedback\n/theme          # View/configure terminal theme\n/changelog      # Display version changelog\n/update         # Update CLI to latest version\n/experimental   # Toggle experimental features\n/instructions   # View custom instruction files\n/streamer-mode  # Toggle streamer mode\n/usage          # Display usage metrics\n```\n\n## Plugins & Skills\n```bash\n/plugin install owner/repo  # Install a plugin\n/plugin list                # List installed plugins\n/skills                     # Manage skills\n/mcp add                    # Add MCP server\n/mcp list                   # List MCP servers\n```',
    duration: 8,
    difficulty: 'beginner',
    order_index: 1
  },
  {
    id: 2,
    module_id: 1,
    title: 'Agent Commands',
    content: '# Agent Commands\n\n## /agent - Select Custom Agent\n\nSwitch to a custom agent for specialized tasks:\n\n```bash\n/agent\n```\n\nThis shows a list of available custom agents to choose from.\n\n## /delegate - Hand Off to Copilot Coding Agent\n\nDelegates your current session to Copilot coding agent on GitHub:\n\n```bash\n/delegate complete the API integration tests and fix any failing edge cases\n```\n\n## How /delegate Works\n\n1. Copilot asks to commit unstaged changes as a checkpoint\n2. Creates a new branch for the work\n3. Opens a **draft pull request** on GitHub\n4. Copilot coding agent works in the background\n5. Requests a review from you when complete\n6. Provides a link to the PR and agent session\n\n## When to Use /delegate\n\n- Long-running tasks you don\'t want to wait for\n- Complex multi-file changes\n- Test writing and debugging\n- When you want work to continue while you do other things\n\n## Important Notes\n\n- Your local context is preserved for the agent\n- Work happens on GitHub, not locally\n- You\'ll get notifications when review is needed',
    duration: 10,
    difficulty: 'intermediate',
    order_index: 3
  },
  {
    id: 3,
    module_id: 1,
    title: 'Directory Management',
    content: '# Directory Management\n\n## Working with Files Outside Current Directory\n\nCopilot may need to work with files outside your current location. It will ask for approval to access those directories.\n\n## /add-dir - Add Trusted Directory\n\nManually add a trusted directory:\n\n```bash\n/add-dir /path/to/directory\n```\n\nThis lets Copilot work with files in that location.\n\n## /cwd - Change Working Directory\n\nSwitch to a different working directory without starting a new session:\n\n```bash\n/cwd /path/to/directory\n```\n\n## Use Cases\n\n### Multi-Project Work\n```bash\n# Start in one project\ncopilot\n\n# Switch to another project\n/cwd ~/other-project\n\n# Add a shared utilities folder\n/add-dir ~/shared/utils\n```\n\n### Monorepo Navigation\n```bash\n# Working in packages/frontend\n/add-dir ../backend\n/add-dir ../shared\n```',
    duration: 6,
    difficulty: 'intermediate',
    order_index: 2
  },
  {
    id: 4,
    module_id: 1,
    title: 'MCP Commands',
    content: '# MCP Commands\n\n## What is MCP?\n\nModel Context Protocol (MCP) extends Copilot CLI with external tools and services.\n\n## Built-in MCP Server\n\nCopilot CLI comes with the **GitHub MCP server** pre-configured, allowing you to:\n- Interact with GitHub.com resources\n- Merge pull requests from CLI\n- Manage issues and discussions\n\n## /mcp add - Add New Server\n\n```bash\n/mcp add\n```\n\n1. Fill in the MCP server details\n2. Use **Tab** to move between fields\n3. Press **Ctrl+S** to save\n\n## /mcp list - View Configured Servers\n\n```bash\n/mcp list\n```\n\n## Configuration File\n\nMCP server configurations are stored in:\n```\n~/.copilot/mcp-config.json\n```\n\nYou can change this location with the `XDG_CONFIG_HOME` environment variable.\n\n## Popular MCP Servers\n\n- **Playwright**: Browser automation and testing\n- **Filesystem**: Enhanced file operations\n- **Database**: Direct database queries\n- **Custom**: Build your own for specific tools',
    duration: 10,
    difficulty: 'intermediate',
    order_index: 4
  },
  {
    id: 5,
    module_id: 2,
    title: 'Session Management',
    content: '# Session Management\n\n## Resuming Previous Sessions\n\nCopilot CLI saves your session history so you can return to previous conversations.\n\n### List Previous Sessions\n\n```bash\ncopilot --resume\n```\n\nThis shows a list of your previous sessions. Select one to continue.\n\n### Quick Resume Last Session\n\n```bash\ncopilot --continue\n```\n\nThis immediately resumes your most recently closed session.\n\n## Why Resume Sessions?\n\n- **Context Preservation**: Continue where you left off\n- **Long-Running Tasks**: Break up complex work\n- **Reference**: Review what you discussed before\n\n## Session Tips\n\n1. Use `/usage` to check remaining context before long tasks\n2. Exit gracefully with `exit` or Ctrl+C to save session state\n3. Use `--resume` to find that command you used last week',
    duration: 6,
    difficulty: 'intermediate',
    order_index: 1
  },
  {
    id: 6,
    module_id: 2,
    title: 'Custom Instructions',
    content: '# Custom Instructions\n\n## Overview\n\nCustom instructions are natural language descriptions in Markdown files that are automatically included in your prompts. They help Copilot understand your project context.\n\n## Supported Instruction Files\n\n### Repository-Wide Instructions\n```\n.github/copilot-instructions.md\n```\nApply to all prompts in this repository.\n\n### Path-Specific Instructions\n```\n.github/copilot-instructions/**/*.instructions.md\n```\nApply to specific directories or file types.\n\n### Agent Files\n```\nAGENTS.md\n```\nSpecial instructions for agent behavior.\n\n## Example Instructions File\n\n```markdown\n# Project Guidelines\n\n## Code Style\n- Use TypeScript with strict mode\n- Prefer functional components in React\n- Always include error handling\n\n## Testing\n- Write tests for all new functions\n- Use Jest and React Testing Library\n\n## Git Commits\n- Use conventional commit format\n- Keep commits atomic\n```\n\n## Benefits\n\n- **Consistency**: Copilot follows your team\'s conventions\n- **Context**: Better understanding of project structure\n- **Quality**: Suggestions match your standards',
    duration: 10,
    difficulty: 'intermediate',
    order_index: 2
  },
  {
    id: 7,
    module_id: 2,
    title: 'Configuration & Environment',
    content: '# Configuration & Environment\n\n## Configuration File\n\nAdjust settings in `~/.copilot/config.json` (or location set by `XDG_CONFIG_HOME`).\n\n## Getting Configuration Help\n\n```bash\ncopilot help config\n```\n\n## Environment Variables\n\n```bash\ncopilot help environment\n```\n\nKey environment variables:\n- `GH_TOKEN` / `GITHUB_TOKEN`: Authentication token\n- `XDG_CONFIG_HOME`: Custom config directory\n\n## Logging\n\n```bash\ncopilot help logging\n```\n\nConfigure log levels for debugging.\n\n## Permissions\n\n```bash\ncopilot help permissions\n```\n\nManage tool allow/deny lists.\n\n## Key Config Options\n\n- Model preferences\n- Default MCP servers\n- Trusted directories\n- Tool permissions',
    duration: 8,
    difficulty: 'advanced',
    order_index: 3
  },
  {
    id: 8,
    module_id: 2,
    title: 'Best Practices & Safety',
    content: '# Best Practices & Safety\n\n## Safety First\n\n### 1. Review Tool Actions\n- Always check what tools want to do before approving\n- Be cautious with session-wide approvals\n- Never approve unknown operations on production systems\n\n### 2. Trust Carefully\n- Only trust folders you control\n- Be careful with cloned repositories from unknown sources\n- Review files before trusting new directories\n\n### 3. Use Safe Environments\n- Test destructive commands in containers or VMs\n- Have backups before system-wide changes\n- Use version control\n\n## Effective Prompting\n\n### Be Specific\n✅ "Find log files larger than 100MB in /var/log"\n❌ "Find big files"\n\n### Use File References\n✅ "Explain @src/auth.js and suggest improvements"\n❌ "Explain my auth code"\n\n### Iterate\n- Start with simple prompts\n- Refine based on results\n- Use `/usage` to track context\n\n## Providing Feedback\n\n```bash\n/feedback\n```\n\nOptions:\n- Private feedback survey\n- Bug reports\n- Feature suggestions\n\n## Remember\n\nCopilot CLI is a powerful tool. With great power comes responsibility. Always review before approving!',
    duration: 12,
    difficulty: 'advanced',
    order_index: 4
  },
  {
    id: 9,
    module_id: 3,
    title: 'Understanding Custom Agents',
    content: '# Understanding Custom Agents\n\n## What Are Custom Agents?\n\nCustom agents are specialized versions of Copilot coding agent tailored to your unique:\n- Workflows\n- Coding conventions\n- Use cases\n\nThey\'re defined using Markdown files called **agent profiles** that specify prompts, tools, and MCP servers.\n\n## Agent Profile Locations\n\n| Level | Location | Scope |\n|-------|----------|-------|\n| User-level | `~/.copilot/agents/` | All projects |\n| Repository-level | `.github/agents/` | Current project |\n| Organization-level | `.github-private/agents/` | All org projects |\n\n## Priority Order\n\nWhen agents have the same name:\n1. **User-level** overrides repository-level\n2. **Repository-level** overrides organization-level\n\n## Agent Profile Contents\n\nAn agent profile (`.md` file) typically includes:\n- Agent name and description\n- Specialized instructions\n- Tool preferences\n- MCP server configurations',
    duration: 8,
    difficulty: 'intermediate',
    order_index: 1
  },
  {
    id: 10,
    module_id: 3,
    title: 'Using Custom Agents',
    content: '# Using Custom Agents\n\n## Three Ways to Use Custom Agents\n\n### 1. Interactive Selection\n\nUse the slash command to see available agents:\n\n```bash\n/agent\n```\n\nSelect from the list of configured agents.\n\n### 2. Natural Language Inference\n\nMention the agent in your prompt:\n\n```bash\nUse the refactoring agent to refactor this code block\n```\n\nCopilot automatically infers which agent you mean.\n\n### 3. Command-Line Option\n\nSpecify the agent when starting Copilot:\n\n```bash\ncopilot --agent=refactor-agent --prompt "Refactor this code block"\n```\n\n## Example Agent Use Cases\n\n### DevOps Agent\n- Deployment automation\n- Infrastructure monitoring\n- Container management\n\n### Code Review Agent\n- PR reviews\n- Style enforcement\n- Bug detection\n\n### Documentation Agent\n- README generation\n- API documentation\n- Changelog updates',
    duration: 8,
    difficulty: 'intermediate',
    order_index: 2
  },
  {
    id: 11,
    module_id: 3,
    title: 'Skills',
    content: '# Skills\n\n## What Are Skills?\n\nSkills enhance Copilot\'s ability to perform specialized tasks with:\n- Custom instructions\n- Scripts\n- Resources\n\n## How Skills Work\n\nSkills are reusable components that agents can leverage for specific capabilities:\n\n- **Code Generation Skills**: Language-specific patterns\n- **Testing Skills**: Test framework conventions\n- **Deployment Skills**: CI/CD workflows\n- **Documentation Skills**: Doc generation patterns\n\n## Skill Benefits\n\n1. **Consistency**: Same approach across projects\n2. **Reusability**: Write once, use everywhere\n3. **Specialization**: Deep expertise in specific areas\n4. **Maintainability**: Update skills centrally\n\n## Learning More\n\nSkills are an advanced feature. For detailed information, see the official GitHub documentation on Agent Skills.',
    duration: 6,
    difficulty: 'advanced',
    order_index: 4
  },
  {
    id: 12,
    module_id: 3,
    title: 'Configuring MCP Servers',
    content: '# Configuring MCP Servers\n\n## Adding an MCP Server\n\n1. Start interactive mode:\n```bash\ncopilot\n```\n\n2. Use the add command:\n```bash\n/mcp add\n```\n\n3. Fill in server details (use Tab to navigate)\n\n4. Save with **Ctrl+S**\n\n## Configuration File Structure\n\nServers are stored in `~/.copilot/mcp-config.json`:\n\n```json\n{\n  "mcpServers": {\n    "github": {\n      "command": "npx",\n      "args": ["@github/mcp-server"]\n    },\n    "playwright": {\n      "command": "npx",\n      "args": ["@playwright/mcp@latest"]\n    }\n  }\n}\n```\n\n## Server Types\n\n### stdio Servers\nCommunicate via standard input/output:\n```json\n{\n  "command": "npx",\n  "args": ["@some/mcp-server"]\n}\n```\n\n### HTTP Servers\nCommunicate over HTTP:\n```json\n{\n  "url": "http://localhost:3100"\n}\n```\n\n## Environment Variables\n\nYou can include environment variables:\n```json\n{\n  "command": "node",\n  "args": ["server.js"],\n  "env": {\n    "API_KEY": "your-key"\n  }\n}\n```',
    duration: 12,
    difficulty: 'advanced',
    order_index: 3
  },
  {
    id: 13,
    module_id: 5,
    title: 'Natural Language Prompts',
    content: '# Natural Language Prompts\n\n## How It Works\n\nSimply type what you want in plain English. Copilot understands context and generates appropriate commands.\n\n## Example Prompts\n\n### File Operations\n```\nfind all JavaScript files larger than 1MB\nlist files modified in the last 24 hours\ncreate a new directory called components\n```\n\n### Git Operations\n```\nshow commits from last week\ncreate a new branch called feature/login\nstage and commit all changes with message "Fix bug"\n```\n\n### System Tasks\n```\nwhich process is using port 3000?\nshow disk usage for current directory\nfind and kill zombie processes\n```\n\n### Docker\n```\nlist all running containers\nstop all containers using more than 1GB memory\nbuild and run this Dockerfile\n```\n\n## Tips for Better Results\n\n1. **Be Specific**: "find PNG files > 5MB in /images" beats "find big files"\n2. **Add Context**: Mention your OS or preferred tools\n3. **Iterate**: Refine your prompt based on results',
    duration: 10,
    difficulty: 'beginner',
    order_index: 1
  },
  {
    id: 14,
    module_id: 5,
    title: 'File References with @',
    content: '# File References with @\n\n## Overview\n\nUse the `@` symbol followed by a file path to include file contents as context in your prompt.\n\n## Syntax\n\n```\n@path/to/file\n```\n\n## Auto-Complete\n\nWhen you start typing a file path after `@`, matching paths appear below the prompt box. Use:\n- **Arrow keys** to navigate\n- **Tab** to complete the path\n\n## Examples\n\n### Explain a File\n```\nExplain @config/ci/ci-required-checks.yml\n```\n\n### Fix Code\n```\nFix the bug in @src/app.js\n```\n\n### Compare Files\n```\nWhat\'s different between @old.js and @new.js?\n```\n\n### Summarize Multiple Files\n```\nSummarize @README.md and @CONTRIBUTING.md\n```\n\n### Review Dependencies\n```\nWhat dependencies are in @package.json that I should update?\n```\n\n## Why Use File References?\n\n- **Accuracy**: Copilot sees actual file contents\n- **Context**: Better understanding of your project\n- **Efficiency**: No need to copy-paste code',
    duration: 8,
    difficulty: 'beginner',
    order_index: 2
  },
  {
    id: 15,
    module_id: 5,
    title: 'Tool Approvals',
    content: '# Tool Approvals\n\n## Why Approvals Exist\n\nWhen Copilot wants to use a tool that could modify or execute files (like `touch`, `chmod`, `node`, or `sed`), it asks for your approval first.\n\n## Approval Options\n\nWhen prompted, choose one:\n\n### 1. Yes\n- Allow Copilot to use this tool once\n- Next time it wants to use this tool, it will ask again\n\n### 2. Yes, and approve TOOL for the rest of the running session\n- Allow this tool (with any options) without asking again\n- Approval only lasts for current session\n- **Use with caution**: Approving `rm` would let Copilot delete any file!\n\n### 3. No, and tell Copilot what to do differently (Esc)\n- Copilot won\'t run the command\n- You can provide alternative instructions\n\n## Example Workflow\n\n```\nYou: Create a script that backs up my database\n\nCopilot: I\'ll create a backup script. \n[Tool: touch backup.sh]\nApprove? [Yes / Yes for session / No (Esc)]\n```\n\n## Recovering from a Denial\n\nIf you press Esc, you can refine your request:\n```\nContinue the previous task but use a Python script instead\n```\n\n## Stopping Operations\n\nPress **Esc** while Copilot is "Thinking" to stop the current operation.',
    duration: 10,
    difficulty: 'beginner',
    order_index: 3
  },
  {
    id: 16,
    module_id: 5,
    title: 'Shell Commands with !',
    content: '# Direct Shell Commands with !\n\n## Overview\n\nPrepend your input with `!` to run shell commands directly, without making a call to the AI model.\n\n## Syntax\n\n```\n!command\n```\n\n## Examples\n\n### Clone a Repository\n```\n!git clone https://github.com/user/repo\n```\n\n### Check Status\n```\n!git status\n```\n\n### List Files\n```\n!ls -la\n```\n\n### Run Scripts\n```\n!npm install\n!python script.py\n```\n\n## When to Use !\n\n- **Known commands**: When you already know exactly what to run\n- **Quick operations**: Faster than waiting for AI response\n- **System checks**: `!pwd`, `!whoami`, `!which node`\n\n## When NOT to Use !\n\n- When you need help figuring out the right command\n- When you want Copilot to explain what a command does\n- When you need multi-step assistance',
    duration: 5,
    difficulty: 'beginner',
    order_index: 4
  },
  {
    id: 17,
    module_id: 4,
    title: 'What is Copilot CLI?',
    content: '# What is GitHub Copilot CLI?\n\nGitHub Copilot CLI is a standalone command-line tool that brings AI-powered assistance directly to your terminal.\n\n## Who Can Use It?\n\nCopilot CLI is available with:\n- GitHub Copilot Pro\n- GitHub Copilot Pro+\n- GitHub Copilot Business\n- GitHub Copilot Enterprise\n\n> **Note**: If you receive Copilot from an organization, the Copilot CLI policy must be enabled in your organization\'s settings.\n\n## What Can It Do?\n\n- **Natural Language Commands**: Describe what you need in plain English\n- **File Context**: Reference files with `@path/to/file` syntax\n- **Tool Integration**: Extend capabilities with MCP servers\n- **Custom Agents**: Create specialized AI assistants\n- **Delegate Work**: Hand off tasks to Copilot coding agent on GitHub\n\n## Important Note\n\nGitHub Copilot CLI is now **generally available (GA)** as of February 25, 2026.',
    duration: 5,
    difficulty: 'beginner',
    order_index: 1
  },
  {
    id: 18,
    module_id: 4,
    title: 'Installation',
    content: '# Installing GitHub Copilot CLI\n\n## Prerequisites\n- GitHub account with an active Copilot subscription (Pro, Pro+, Business, or Enterprise)\n- Administrator access on your machine\n- (Windows) PowerShell v6 or higher\n\n## Installation Methods\n\n### Install Script (macOS and Linux) — Recommended\n```bash\ncurl -fsSL https://gh.io/copilot-install | bash\n```\nOr with wget:\n```bash\nwget -qO- https://gh.io/copilot-install | bash\n```\nUse `| sudo bash` to install to `/usr/local/bin`. Homebrew and install script installations **automatically update**.\n\n### macOS/Linux (Homebrew)\n```bash\nbrew install copilot-cli\n```\nFor prerelease:\n```bash\nbrew install copilot-cli@prerelease\n```\n\n### Windows (WinGet)\n```bash\nwinget install GitHub.Copilot\n```\nFor prerelease:\n```bash\nwinget install GitHub.Copilot.Prerelease\n```\n\n### Cross-Platform (npm)\n```bash\nnpm install -g @github/copilot\n```\nFor prerelease:\n```bash\nnpm install -g @github/copilot@prerelease\n```\n\n## First Launch\n```bash\ncopilot\n```\nOn first launch, you\'ll see an animated welcome banner. Use `/login` to authenticate with GitHub.\n\n## Authentication Options\n1. **OAuth device flow**: Use `/login` and follow browser prompts\n2. **Personal Access Token**: Set `GH_TOKEN` or `GITHUB_TOKEN` environment variable with a fine-grained PAT that has "Copilot Requests" permission\n3. **GitHub CLI token reuse**: If you\'re authenticated with `gh`, Copilot CLI can reuse that token\n\n## Initialize Your Repository\n```bash\n/init\n```\nThis generates Copilot instructions tailored to your project (creates `.github/copilot-instructions.md`).',
    duration: 10,
    difficulty: 'beginner',
    order_index: 2
  },
  {
    id: 19,
    module_id: 4,
    title: 'Starting Your First Session',
    content: '# Starting Your First Session\n\n## Launch Copilot CLI\n\n1. Navigate to a folder with code you want to work with:\n```bash\ncd ~/my-project\n```\n\n2. Start Copilot CLI:\n```bash\ncopilot\n```\n\n## Trust Folder Prompt\n\nCopilot will ask you to confirm that you trust the files in this folder:\n\n> **Important**: During this session, Copilot may attempt to read, modify, and execute files in and below this folder.\n\nChoose one option:\n\n1. **Yes, proceed** - Trust for this session only\n2. **Yes, and remember this folder** - Trust for all future sessions\n3. **No, exit (Esc)** - End the session\n\n## Authentication\n\nIf not logged in, you\'ll be prompted to authenticate:\n\n```bash\n/login\n```\n\nFollow the on-screen instructions to complete GitHub authentication.\n\n## Alternative: Token Authentication\n\nYou can also authenticate using environment variables:\n- `GH_TOKEN` - Fine-grained personal access token\n- `GITHUB_TOKEN` - Alternative token variable\n\n## Getting Help in Interactive Mode\n\nType `?` in the prompt box to see all available commands and options.',
    duration: 8,
    difficulty: 'beginner',
    order_index: 3
  },
  {
    id: 20,
    module_id: 4,
    title: 'Basic Usage Patterns',
    content: '# Basic Usage Patterns\n\n## Understanding Copilot CLI Modes\n\nCopilot CLI has multiple interaction modes. Press **Shift+Tab** to cycle between them.\n\n### Interactive Mode (Default)\nStandard conversational mode. Type prompts and Copilot responds.\n```bash\ncopilot\n> Help me refactor the auth module\n```\n\n### Plan Mode\nCopilot analyzes your request, asks clarifying questions, and builds a structured plan before writing code.\n```bash\n# Press Shift+Tab to enter plan mode\n> Add user authentication with JWT tokens\n# Copilot creates a plan, you review, then it executes\n```\n\n### Autopilot Mode (Experimental)\nEnable with `/experimental`. Copilot works autonomously — executing tools, running commands, and iterating without approval.\n```bash\n/experimental\n# Press Shift+Tab to cycle to autopilot mode\n> Fix all failing tests and update documentation\n```\n\n## Input Prefixes\n\n| Prefix | Purpose | Example |\n|--------|---------|---------|\n| (none) | Natural language prompt | `Find bugs in the auth module` |\n| `/` | Slash command | `/model gpt-5` |\n| `!` | Direct shell command | `!git status` |\n| `@` | File reference | `@src/app.js` |\n| `&` | Background delegation | `& Write tests for the API` |\n\n## Model Selection\n\nChoose from multiple AI models:\n```bash\n/model              # Open model picker\n/model gpt-5        # Switch to GPT-5\n/model claude-opus-4.6  # Use Claude Opus\n```\nGPT-5 mini and GPT-4.1 are included at no additional premium request cost.\n\n## Key Keyboard Shortcuts\n\n| Shortcut | Action |\n|----------|--------|\n| Shift+Tab | Cycle modes (interactive → plan → autopilot) |\n| Ctrl+T | Toggle model reasoning display |\n| Ctrl+S | Run command while preserving input |\n| Ctrl+X, Ctrl+E | Open external editor for long prompts |\n| Esc-Esc | Undo/rewind file changes |\n| Ctrl+O | Expand recent timeline |\n| Ctrl+Z | Suspend/resume |\n| ? | Show all commands |\n\n## Direct Mode\nExecute a single prompt and exit:\n```bash\ncopilot "explain this error message"\n```\n\n## Session Persistence\nSessions are automatically saved. Resume later:\n```bash\ncopilot --resume     # Pick from previous sessions\ncopilot --continue   # Continue last session\n```',
    duration: 8,
    difficulty: 'beginner',
    order_index: 4
  },
  {
    id: 21,
    module_id: 2,
    title: 'Model Selection & Configuration',
    content: '# Model Selection & Configuration\n\n## Available Models\n\nCopilot CLI supports multiple AI models from different providers:\n\n### Anthropic\n- **Claude Opus 4.6** — Most capable, best for complex reasoning and architecture\n- **Claude Sonnet 4.6** / **Claude Sonnet 4.5** / **Claude Sonnet 4** — Balanced performance\n- **Claude Haiku 4.5** — Fast and efficient for quick tasks\n\n### OpenAI\n- **GPT-5.4** / **GPT-5.3-Codex** / **GPT-5.2** / **GPT-5.1** — Latest generation\n- **GPT-5 mini** — Included at no additional premium cost\n- **GPT-4.1** — Included at no additional premium cost\n\n### Google\n- **Gemini 3 Pro (Preview)** — Google\'s latest model\n\n## Switching Models\n\n### Interactive Picker\n```bash\n/model\n```\nOpens a model selection menu.\n\n### Direct Selection\n```bash\n/model claude-opus-4.6\n/model gpt-5\n/model claude-haiku-4.5\n```\n\n### Mid-Session Switching\nYou can change models at any point during a session. This is useful for:\n- Starting with a fast model for exploration\n- Switching to a powerful model for complex implementation\n- Using cost-effective models for routine tasks\n\n## Reasoning Display\n\nFor models with extended thinking (like Claude Opus):\n```\nCtrl+T    # Toggle reasoning visibility\n```\n\n## Configuration\n\nDefault model can be set in `~/.copilot/config.json`:\n```json\n{\n  "model": "claude-sonnet-4.5"\n}\n```\n\n## Cost Considerations\n\n- Each prompt uses one premium request from your monthly quota\n- GPT-5 mini and GPT-4.1 are **free** (no premium request cost)\n- More capable models may use additional premium requests\n- Use `/usage` to monitor your consumption',
    duration: 10,
    difficulty: 'intermediate',
    order_index: 6
  },
  {
    id: 22,
    module_id: 2,
    title: 'Plan Mode & Autopilot',
    content: '# Plan Mode & Autopilot\n\n## Plan Mode\n\nPlan mode lets Copilot analyze your request and create a structured implementation plan before writing any code.\n\n### Entering Plan Mode\nPress **Shift+Tab** to cycle from interactive mode to plan mode. The mode indicator in the footer changes.\n\n### How It Works\n1. You describe what you want to build\n2. Copilot asks clarifying questions if needed\n3. Copilot creates a structured plan with todos\n4. You review and can edit the plan\n5. Approve and Copilot executes step by step\n\n### When to Use Plan Mode\n- Multi-file changes or new features\n- Refactoring across the codebase\n- Tasks with architectural decisions\n- When you want to review the approach before implementation\n\n### Example\n```bash\n# In plan mode:\n> Add rate limiting to all API endpoints with Redis caching\n# Copilot will:\n# 1. Ask about rate limits, Redis config, etc.\n# 2. Create a plan with specific files and changes\n# 3. Execute after your approval\n```\n\n### Using /plan Command\nYou can also use the `/plan` slash command directly:\n```bash\n/plan Migrate the database from SQLite to PostgreSQL\n```\n\n## Autopilot Mode (Experimental)\n\nAutopilot mode lets Copilot work autonomously until a task is completed.\n\n### Enabling Autopilot\n```bash\n/experimental    # Enable experimental features\n# Then press Shift+Tab to cycle to autopilot mode\n```\n\n### How It Works\n- Copilot executes tools, runs commands, and iterates without stopping for approval\n- It continues until the task is done or it encounters an issue\n- You can interrupt at any time with Ctrl+C\n\n### When to Use Autopilot\n- Well-defined tasks with clear success criteria\n- Running and fixing tests iteratively\n- Applying a pattern across many files\n- Tasks where you trust Copilot to make good decisions\n\n### Safety Considerations\n- Review changes after completion with `/diff`\n- Use Esc-Esc to undo if something goes wrong\n- Start with smaller tasks to build confidence',
    duration: 8,
    difficulty: 'intermediate',
    order_index: 7
  },
  {
    id: 23,
    module_id: 1,
    title: 'Review, Diff & Undo',
    content: '# Review, Diff & Undo\n\n## Reviewing Changes\n\n### /diff — Session Diff Review\nView all changes made during your session with syntax-highlighted inline diffs:\n```bash\n/diff\n```\n\nFeatures:\n- Syntax-highlighted diffs for all modified files\n- Add line-specific comments as structured feedback\n- Toggle between session changes and branch diffs\n- Navigate between changed files\n\n### /review — Code Review Agent\nRun an AI code review on your changes:\n```bash\n/review\n```\n\nThe review agent:\n- Analyzes staged or unstaged git changes\n- Only surfaces genuine issues (bugs, security, logic errors)\n- Never comments on style or formatting\n- Provides actionable suggestions\n\n## Undoing Changes\n\n### Esc-Esc — Rewind Changes\nPress **Esc** twice quickly to rewind file changes to any previous snapshot in the session.\n\nThis lets you:\n- Undo the last set of file modifications\n- Step back through multiple change snapshots\n- Restore files to any point in the session\n\n### Git-Based Undo\nYou can also use git commands directly:\n```bash\n!git checkout -- <file>     # Discard changes to a file\n!git stash                  # Stash all changes\n!git diff                   # Review changes before committing\n```\n\n## Best Practices\n1. Use `/diff` frequently to track what\'s changed\n2. Run `/review` before committing important changes\n3. Use Esc-Esc immediately if something looks wrong\n4. Commit working states regularly so you have restore points',
    duration: 6,
    difficulty: 'intermediate',
    order_index: 5
  },
  {
    id: 24,
    module_id: 3,
    title: 'Plugins',
    content: '# Plugins\n\n## What Are Plugins?\n\nPlugins extend Copilot CLI with additional capabilities. They can bundle:\n- MCP servers (external tools and services)\n- Custom agents\n- Skills (specialized workflows)\n- Hooks (lifecycle extensions)\n\n## Managing Plugins\n\n### Install a Plugin\n```bash\n/plugin install owner/repo\n```\nInstalls a plugin directly from a GitHub repository.\n\n### List Installed Plugins\n```bash\n/plugin list\n```\n\n### Remove a Plugin\n```bash\n/plugin remove owner/repo\n```\n\n## Plugin Sources\n\nPlugins are installed from GitHub repositories. The repository must contain a valid plugin manifest that describes:\n- What MCP servers to configure\n- What agents to register\n- What skills to enable\n- What hooks to install\n\n## Hooks\n\nHooks extend Copilot\'s behavior at key lifecycle points:\n\n### preToolUse Hooks\nRun before a tool is executed. Can:\n- Deny tool calls based on custom policies\n- Modify tool arguments\n- Add approval workflows\n\n### postToolUse Hooks\nRun after a tool completes. Can:\n- Process tool output\n- Trigger follow-up actions\n- Log or audit tool usage\n\n## Custom Instructions\n\nCopilot respects instructions from these locations (in order):\n```\nCLAUDE.md\nGEMINI.md\nAGENTS.md (in git root & cwd)\n.github/instructions/**/*.instructions.md\n.github/copilot-instructions.md\n$HOME/.copilot/copilot-instructions.md\n```\n\nUse `/instructions` to view and toggle which instruction files are active.',
    duration: 8,
    difficulty: 'advanced',
    order_index: 5
  },
  {
    id: 25,
    module_id: 3,
    title: 'LSP Configuration',
    content: '# LSP Configuration\n\n## What is LSP?\n\nLanguage Server Protocol (LSP) gives Copilot CLI enhanced code intelligence:\n- Go-to-definition\n- Hover information\n- Diagnostics and errors\n- Symbol search\n\n## Installing Language Servers\n\nCopilot CLI doesn\'t bundle LSP servers. Install them separately:\n\n### TypeScript/JavaScript\n```bash\nnpm install -g typescript-language-server\n```\n\n### Python\n```bash\npip install python-lsp-server\n```\n\n### Go\n```bash\ngo install golang.org/x/tools/gopls@latest\n```\n\n### Rust\n```bash\nrustup component add rust-analyzer\n```\n\n## Configuration\n\n### User-Level (all projects)\nEdit `~/.copilot/lsp-config.json`:\n```json\n{\n  "lspServers": {\n    "typescript": {\n      "command": "typescript-language-server",\n      "args": ["--stdio"],\n      "fileExtensions": {\n        ".ts": "typescript",\n        ".tsx": "typescript"\n      }\n    }\n  }\n}\n```\n\n### Repository-Level (specific project)\nCreate `.github/lsp.json` in your repository root with the same format.\n\n## Viewing LSP Status\n```bash\n/lsp\n```\nShows configured LSP servers and their connection status.\n\n## Benefits for Copilot\n\nWith LSP configured, Copilot can:\n- Navigate code more accurately\n- Understand type information\n- Find references and definitions\n- Provide more precise suggestions',
    duration: 6,
    difficulty: 'advanced',
    order_index: 6
  }
];

export const commands = [
  {
    id: 1,
    name: 'copilot',
    syntax: 'copilot [options]',
    description: 'Start Copilot CLI in interactive mode. The default model is Claude Sonnet 4.5. Use /model to switch. GA version 1.0 (March 2026).',
    category: 'Core Commands',
    examples: [
      { description: 'Start interactive mode', command: 'copilot' },
      { description: 'Resume a previous session', command: 'copilot --resume' },
      { description: 'Continue last session', command: 'copilot --continue' },
      { description: 'Start with specific agent', command: 'copilot --agent=refactor-agent' },
      { description: 'Show welcome banner', command: 'copilot --banner' },
      { description: 'Start in experimental mode', command: 'copilot --experimental' }
    ],
    related_commands: ['copilot help', '/login', '/logout']
  },
  {
    id: 2,
    name: 'copilot help',
    syntax: 'copilot help [topic]',
    description: 'Get help about Copilot CLI commands and configuration',
    category: 'Core Commands',
    examples: [
      { description: 'General help', command: 'copilot help' },
      { description: 'Configuration settings', command: 'copilot help config' },
      { description: 'Environment variables', command: 'copilot help environment' },
      { description: 'Logging options', command: 'copilot help logging' },
      { description: 'Tool permissions', command: 'copilot help permissions' }
    ],
    related_commands: ['copilot', '/agent', '/mcp add']
  },
  {
    id: 3,
    name: 'brew install copilot-cli',
    syntax: 'brew install copilot-cli',
    description: 'Install Copilot CLI on macOS/Linux via Homebrew',
    category: 'Installation',
    examples: [
      { description: 'Install on macOS or Linux', command: 'brew install copilot-cli' }
    ],
    related_commands: ['winget install GitHub.Copilot', 'npm install -g @github/copilot']
  },
  {
    id: 4,
    name: 'winget install GitHub.Copilot',
    syntax: 'winget install GitHub.Copilot',
    description: 'Install Copilot CLI on Windows via WinGet',
    category: 'Installation',
    examples: [
      { description: 'Install on Windows', command: 'winget install GitHub.Copilot' }
    ],
    related_commands: ['brew install copilot-cli', 'npm install -g @github/copilot']
  },
  {
    id: 5,
    name: 'npm install -g @github/copilot',
    syntax: 'npm install -g @github/copilot',
    description: 'Install Copilot CLI via npm (cross-platform, requires Node.js). For prerelease: npm install -g @github/copilot@prerelease',
    category: 'Installation',
    examples: [
      { description: 'Install via npm', command: 'npm install -g @github/copilot' }
    ],
    related_commands: ['brew install copilot-cli', 'winget install GitHub.Copilot']
  },
  {
    id: 6,
    name: '/login',
    syntax: '/login',
    description: 'Authenticate with GitHub to use Copilot CLI',
    category: 'Authentication',
    examples: [
      { description: 'Login to GitHub', command: '/login' }
    ],
    related_commands: ['copilot', '/logout', 'copilot help']
  },
  {
    id: 7,
    name: '/logout',
    syntax: '/logout',
    description: 'Sign out of your GitHub account',
    category: 'Authentication',
    examples: [
      { description: 'Sign out', command: '/logout' }
    ],
    related_commands: ['copilot', '/login']
  },
  {
    id: 8,
    name: '/add-dir',
    syntax: '/add-dir <path>',
    description: 'Add a trusted directory for Copilot to access',
    category: 'Directory Management',
    examples: [
      { description: 'Trust another directory', command: '/add-dir /path/to/directory' },
      { description: 'Add parent directory', command: '/add-dir ..' }
    ],
    related_commands: ['/cwd', '/agent']
  },
  {
    id: 9,
    name: '/cwd',
    syntax: '/cwd <path>',
    description: 'Change working directory without starting a new session',
    category: 'Directory Management',
    examples: [
      { description: 'Switch to another project', command: '/cwd ~/other-project' },
      { description: 'Go to subdirectory', command: '/cwd ./src' }
    ],
    related_commands: ['/add-dir', '/agent']
  },
  {
    id: 10,
    name: '/agent',
    syntax: '/agent',
    description: 'Select from available custom agents',
    category: 'Agent Commands',
    examples: [
      { description: 'Show available agents', command: '/agent' }
    ],
    related_commands: ['/add-dir', '/cwd', '/mcp add']
  },
  {
    id: 11,
    name: '/delegate',
    syntax: '/delegate <task description>',
    description: 'Delegate task to Copilot coding agent on GitHub (creates PR)',
    category: 'Agent Commands',
    examples: [
      { description: 'Delegate test writing', command: '/delegate complete the API integration tests and fix any failing edge cases' },
      { description: 'Delegate feature work', command: '/delegate add input validation to the user registration form' }
    ],
    related_commands: []
  },
  {
    id: 12,
    name: '/mcp add',
    syntax: '/mcp add',
    description: 'Add an MCP server to extend Copilot CLI capabilities',
    category: 'MCP Commands',
    examples: [
      { description: 'Add a new MCP server', command: '/mcp add' }
    ],
    related_commands: []
  },
  {
    id: 13,
    name: '/mcp list',
    syntax: '/mcp list',
    description: 'List all configured MCP servers',
    category: 'MCP Commands',
    examples: [
      { description: 'View configured servers', command: '/mcp list' }
    ],
    related_commands: []
  },
  {
    id: 14,
    name: '/usage',
    syntax: '/usage',
    description: 'View context and usage statistics for current session',
    category: 'Session Commands',
    examples: [
      { description: 'Check token usage', command: '/usage' }
    ],
    related_commands: []
  },
  {
    id: 15,
    name: '/feedback',
    syntax: '/feedback',
    description: 'Submit feedback, bug reports, or feature suggestions',
    category: 'Session Commands',
    examples: [
      { description: 'Give feedback', command: '/feedback' }
    ],
    related_commands: []
  },
  {
    id: 16,
    name: '@filepath',
    syntax: '@path/to/file',
    description: 'Reference a file to include its contents as context',
    category: 'Special Syntax',
    examples: [
      { description: 'Explain a config file', command: 'Explain @config/ci/ci-required-checks.yml' },
      { description: 'Fix a bug', command: 'Fix the bug in @src/app.js' },
      { description: 'Compare files', command: 'What is different between @old.js and @new.js?' }
    ],
    related_commands: []
  },
  {
    id: 17,
    name: '!command',
    syntax: '!<shell command>',
    description: 'Run shell command directly without AI model call',
    category: 'Special Syntax',
    examples: [
      { description: 'Clone a repo', command: '!git clone https://github.com/user/repo' },
      { description: 'Check git status', command: '!git status' },
      { description: 'List files', command: '!ls -la' }
    ],
    related_commands: []
  },
  {
    id: 18,
    name: '?',
    syntax: '?',
    description: 'Show all available commands and options in interactive mode',
    category: 'Help',
    examples: [
      { description: 'Get in-session help', command: '?' }
    ],
    related_commands: []
  },
  {
    id: 19,
    name: 'curl install script',
    syntax: 'curl -fsSL https://gh.io/copilot-install | bash',
    description: 'Install Copilot CLI on macOS/Linux using the official install script. Automatically updates. Recommended method.',
    category: 'Installation',
    examples: [
      { description: 'Install via curl', command: 'curl -fsSL https://gh.io/copilot-install | bash' },
      { description: 'Install via wget', command: 'wget -qO- https://gh.io/copilot-install | bash' },
      { description: 'Install as root', command: 'curl -fsSL https://gh.io/copilot-install | sudo bash' },
      { description: 'Install specific version', command: 'curl -fsSL https://gh.io/copilot-install | VERSION="v1.0.3" bash' }
    ],
    related_commands: ['brew install copilot-cli', 'winget install GitHub.Copilot', 'npm install -g @github/copilot']
  },
  {
    id: 20,
    name: '/clear',
    syntax: '/clear',
    description: 'Clear the conversation history and start fresh. Useful when context becomes cluttered or you want to change topics.',
    category: 'Session Commands',
    examples: [
      { description: 'Clear conversation history', command: '/clear' }
    ],
    related_commands: ['/compact', '/restart', '/session']
  },
  {
    id: 21,
    name: '/compact',
    syntax: '/compact [instructions]',
    description: 'Summarize the current conversation to reduce context window usage. Optional instructions guide what information to preserve in the summary.',
    category: 'Session Commands',
    examples: [
      { description: 'Compact with default summarization', command: '/compact' },
      { description: 'Compact preserving architecture decisions', command: '/compact keep all architecture decisions and code changes' },
      { description: 'Compact focusing on test results', command: '/compact preserve test results and error messages' }
    ],
    related_commands: ['/clear', '/context', '/session']
  },
  {
    id: 22,
    name: '/context',
    syntax: '/context',
    description: 'Show context window token usage and a visual representation of how much context is being used. Helps monitor when compaction may be needed.',
    category: 'Session Commands',
    examples: [
      { description: 'Check context usage', command: '/context' }
    ],
    related_commands: ['/compact', '/model', '/clear']
  },
  {
    id: 23,
    name: '/session',
    syntax: '/session [subcommand]',
    description: 'Show session info and workspace summary including current directory, git branch, and active tools.',
    category: 'Session Commands',
    examples: [
      { description: 'Show current session info', command: '/session' },
      { description: 'List all sessions', command: '/session list' }
    ],
    related_commands: ['/resume', '/rename', '/share']
  },
  {
    id: 24,
    name: '/resume',
    syntax: '/resume [session-id]',
    description: 'Switch to a different session. Without arguments, shows a session picker. Optionally specify a session ID to resume directly.',
    category: 'Session Commands',
    examples: [
      { description: 'Open session picker', command: '/resume' },
      { description: 'Resume a specific session', command: '/resume abc-123-def' }
    ],
    related_commands: ['/session', '/rename', '/clear']
  },
  {
    id: 25,
    name: '/rename',
    syntax: '/rename <name>',
    description: 'Rename the current session to a descriptive name for easier identification later.',
    category: 'Session Commands',
    examples: [
      { description: 'Rename session', command: '/rename auth-refactor' },
      { description: 'Rename with spaces', command: '/rename fix login bug' }
    ],
    related_commands: ['/session', '/resume', '/share']
  },
  {
    id: 26,
    name: '/share',
    syntax: '/share',
    description: 'Share the current session or research report. Can export to a markdown file or publish as a GitHub gist.',
    category: 'Session Commands',
    examples: [
      { description: 'Share session', command: '/share' }
    ],
    related_commands: ['/session', '/copy', '/research']
  },
  {
    id: 27,
    name: '/copy',
    syntax: '/copy',
    description: 'Copy the last assistant response to the system clipboard for easy pasting elsewhere.',
    category: 'Session Commands',
    examples: [
      { description: 'Copy last response', command: '/copy' }
    ],
    related_commands: ['/share', '/clear']
  },
  {
    id: 28,
    name: '/exit',
    syntax: '/exit or /quit',
    description: 'Exit the Copilot CLI. Can also use /quit as an alias. Session state is preserved for resumption.',
    category: 'Session Commands',
    examples: [
      { description: 'Exit the CLI', command: '/exit' },
      { description: 'Quit the CLI', command: '/quit' }
    ],
    related_commands: ['/restart', '/session', '/resume']
  },
  {
    id: 29,
    name: '/restart',
    syntax: '/restart',
    description: 'Restart the CLI process while preserving the current session. Useful after configuration changes or plugin installations.',
    category: 'Session Commands',
    examples: [
      { description: 'Restart CLI', command: '/restart' }
    ],
    related_commands: ['/exit', '/clear', '/session']
  },
  {
    id: 30,
    name: '/model',
    syntax: '/model [model-name]',
    description: 'Select the AI model to use. Without arguments, opens an interactive model picker. Supports Claude Sonnet, GPT-5, Gemini, and other available models.',
    category: 'Model & Agent Commands',
    examples: [
      { description: 'Open model picker', command: '/model' },
      { description: 'Switch to Claude Sonnet', command: '/model claude-sonnet-4' },
      { description: 'Switch to GPT-5', command: '/model gpt-5' }
    ],
    related_commands: ['/agent', '/fleet', '/context']
  },
  {
    id: 31,
    name: '/fleet',
    syntax: '/fleet',
    description: 'Enable fleet mode for parallel subagent execution. Launches multiple specialized agents simultaneously to tackle complex tasks faster.',
    category: 'Model & Agent Commands',
    examples: [
      { description: 'Enable fleet mode', command: '/fleet' }
    ],
    related_commands: ['/agent', '/delegate', '/tasks', '/model']
  },
  {
    id: 32,
    name: '/tasks',
    syntax: '/tasks',
    description: 'View and manage background tasks including running subagents and shell sessions. Shows task status, allows reading results or stopping tasks.',
    category: 'Model & Agent Commands',
    examples: [
      { description: 'View background tasks', command: '/tasks' }
    ],
    related_commands: ['/fleet', '/agent', '/delegate']
  },
  {
    id: 33,
    name: '/diff',
    syntax: '/diff',
    description: 'Review all changes made in the current directory with syntax-highlighted diffs. Allows adding line-specific comments and reviewing modifications.',
    category: 'Code & Review Commands',
    examples: [
      { description: 'Review all changes', command: '/diff' },
      { description: 'Review changes in working directory', command: '/diff' }
    ],
    related_commands: ['/review', '/plan', '!command']
  },
  {
    id: 34,
    name: '/review',
    syntax: '/review',
    description: 'Run the code review agent to analyze staged or unstaged changes. Provides high-signal feedback on bugs, security issues, and logic errors.',
    category: 'Code & Review Commands',
    examples: [
      { description: 'Run code review', command: '/review' }
    ],
    related_commands: ['/diff', '/plan', '/init']
  },
  {
    id: 35,
    name: '/init',
    syntax: '/init',
    description: 'Initialize Copilot instructions for this repository. Creates configuration files that customize Copilot behavior for the project.',
    category: 'Code & Review Commands',
    examples: [
      { description: 'Initialize Copilot for repo', command: '/init' }
    ],
    related_commands: ['/instructions', '/cwd', '/add-dir']
  },
  {
    id: 36,
    name: '/lsp',
    syntax: '/lsp',
    description: 'Manage language server configuration. Configure language servers for enhanced code intelligence, diagnostics, and navigation.',
    category: 'Code & Review Commands',
    examples: [
      { description: 'Manage LSP config', command: '/lsp' }
    ],
    related_commands: ['/ide', '/init', '/terminal-setup']
  },
  {
    id: 37,
    name: '/ide',
    syntax: '/ide',
    description: 'Connect to an IDE workspace for enhanced code editing capabilities. Links the CLI to a running IDE instance.',
    category: 'Code & Review Commands',
    examples: [
      { description: 'Connect to IDE', command: '/ide' }
    ],
    related_commands: ['/lsp', '/terminal-setup', '/init']
  },
  {
    id: 38,
    name: '/terminal-setup',
    syntax: '/terminal-setup',
    description: 'Configure terminal for multiline input support using shift+enter. Sets up proper key bindings for the current terminal emulator.',
    category: 'Code & Review Commands',
    examples: [
      { description: 'Setup terminal', command: '/terminal-setup' }
    ],
    related_commands: ['/ide', '/lsp', '/theme']
  },
  {
    id: 39,
    name: '/plan',
    syntax: '/plan',
    description: 'Create an implementation plan before coding. Analyzes the task, breaks it into steps, and outlines the approach before making changes.',
    category: 'Code & Review Commands',
    examples: [
      { description: 'Create implementation plan', command: '/plan' }
    ],
    related_commands: ['/review', '/diff', '/research']
  },
  {
    id: 40,
    name: '/research',
    syntax: '/research',
    description: 'Run a deep research investigation using GitHub search and web sources. Produces a comprehensive research report on a topic.',
    category: 'Code & Review Commands',
    examples: [
      { description: 'Start research investigation', command: '/research' }
    ],
    related_commands: ['/plan', '/share', '/review']
  },
  {
    id: 41,
    name: '/allow-all',
    syntax: '/allow-all',
    description: 'Enable all permissions including tools, file paths, and URLs. Bypasses confirmation prompts. Also known as /yolo. Use with caution.',
    category: 'Permission Commands',
    examples: [
      { description: 'Enable all permissions', command: '/allow-all' },
      { description: 'Alias command', command: '/yolo' }
    ],
    related_commands: ['/list-dirs', '/reset-allowed-tools', '/add-dir']
  },
  {
    id: 42,
    name: '/list-dirs',
    syntax: '/list-dirs',
    description: 'Display all directories currently allowed for file access. Shows the permission scope for file operations.',
    category: 'Permission Commands',
    examples: [
      { description: 'List allowed directories', command: '/list-dirs' }
    ],
    related_commands: ['/add-dir', '/allow-all', '/cwd']
  },
  {
    id: 43,
    name: '/reset-allowed-tools',
    syntax: '/reset-allowed-tools',
    description: 'Reset the list of allowed tools back to defaults. Revokes any previously granted tool permissions.',
    category: 'Permission Commands',
    examples: [
      { description: 'Reset tool permissions', command: '/reset-allowed-tools' }
    ],
    related_commands: ['/allow-all', '/list-dirs', '/mcp list']
  },
  {
    id: 44,
    name: '/theme',
    syntax: '/theme [theme-name]',
    description: 'View or configure the terminal color theme. Options include GitHub Dark, GitHub Light, and colorblind-accessible variants.',
    category: 'Help & Configuration',
    examples: [
      { description: 'Open theme picker', command: '/theme' },
      { description: 'Set dark theme', command: '/theme github-dark' },
      { description: 'Set colorblind theme', command: '/theme github-colorblind' }
    ],
    related_commands: ['/streamer-mode', '/terminal-setup', '/instructions']
  },
  {
    id: 45,
    name: '/changelog',
    syntax: '/changelog',
    description: 'Display the changelog showing what is new in recent CLI versions. Lists features, fixes, and improvements.',
    category: 'Help & Configuration',
    examples: [
      { description: 'View changelog', command: '/changelog' }
    ],
    related_commands: ['/update', '/experimental', 'copilot help']
  },
  {
    id: 46,
    name: '/update',
    syntax: '/update',
    description: 'Update the Copilot CLI to the latest available version. Downloads and installs the newest release.',
    category: 'Help & Configuration',
    examples: [
      { description: 'Update CLI', command: '/update' }
    ],
    related_commands: ['/changelog', '/restart', '/experimental']
  },
  {
    id: 47,
    name: '/experimental',
    syntax: '/experimental',
    description: 'Show available experimental features and toggle experimental mode on or off. Enables access to preview features.',
    category: 'Help & Configuration',
    examples: [
      { description: 'View experimental features', command: '/experimental' }
    ],
    related_commands: ['/changelog', '/update', '/model']
  },
  {
    id: 48,
    name: '/instructions',
    syntax: '/instructions',
    description: 'View and toggle custom instruction files. Shows which instruction files are active and allows enabling or disabling them.',
    category: 'Help & Configuration',
    examples: [
      { description: 'View custom instructions', command: '/instructions' }
    ],
    related_commands: ['/init', '/theme', '/session']
  },
  {
    id: 49,
    name: '/streamer-mode',
    syntax: '/streamer-mode',
    description: 'Toggle streamer mode which hides preview model names and quota details. Useful when streaming or screen sharing.',
    category: 'Help & Configuration',
    examples: [
      { description: 'Toggle streamer mode', command: '/streamer-mode' }
    ],
    related_commands: ['/theme', '/instructions', '/user']
  },
  {
    id: 50,
    name: '/user',
    syntax: '/user',
    description: 'Manage the GitHub user list. View and switch between authenticated GitHub accounts.',
    category: 'Help & Configuration',
    examples: [
      { description: 'Manage users', command: '/user' }
    ],
    related_commands: ['/login', '/logout', '/streamer-mode']
  },
  {
    id: 51,
    name: '/plugin',
    syntax: '/plugin [install|list|remove] [owner/repo]',
    description: 'Manage plugins and plugin marketplaces. Plugins bundle MCP servers, agents, skills, and hooks for extended functionality.',
    category: 'Plugin & Skills Commands',
    examples: [
      { description: 'List installed plugins', command: '/plugin list' },
      { description: 'Install a plugin', command: '/plugin install owner/repo' },
      { description: 'Remove a plugin', command: '/plugin remove owner/repo' }
    ],
    related_commands: ['/skills', '/mcp add', '/mcp list']
  },
  {
    id: 52,
    name: '/skills',
    syntax: '/skills',
    description: 'Manage skills for enhanced capabilities. Skills provide specialized domain knowledge and workflows that improve task execution.',
    category: 'Plugin & Skills Commands',
    examples: [
      { description: 'List available skills', command: '/skills' }
    ],
    related_commands: ['/plugin', '/agent', '/mcp list']
  },
  {
    id: 53,
    name: '& (background)',
    syntax: '& <prompt>',
    description: 'Prefix any prompt with & to delegate it to a cloud coding agent, freeing your terminal for other work. The task runs in the background.',
    category: 'Special Syntax',
    examples: [
      { description: 'Background a coding task', command: '& refactor the auth module to use JWT' },
      { description: 'Background a test fix', command: '& fix all failing tests in src/' }
    ],
    related_commands: ['!command', '/fleet', '/tasks', '/delegate']
  },
  {
    id: 54,
    name: 'Shift+Tab',
    syntax: 'Shift+Tab',
    description: 'Cycle between input modes: interactive → plan → autopilot (if experimental mode is enabled). Changes how the agent approaches tasks.',
    category: 'Special Syntax',
    examples: [
      { description: 'Cycle to plan mode', command: 'Shift+Tab' },
      { description: 'Cycle to autopilot mode', command: 'Shift+Tab Shift+Tab' }
    ],
    related_commands: ['?', '/plan', '/experimental']
  },
  {
    id: 55,
    name: 'Ctrl+T',
    syntax: 'Ctrl+T',
    description: 'Toggle model reasoning display for extended thinking models. Shows or hides the chain-of-thought reasoning process.',
    category: 'Special Syntax',
    examples: [
      { description: 'Toggle reasoning display', command: 'Ctrl+T' }
    ],
    related_commands: ['?', '/model', '/context']
  }
];

export const examples = [
  {
    id: 1,
    title: 'Start Interactive Mode',
    code: 'copilot',
    category: 'Getting Started',
    difficulty: 'beginner',
    language: 'shell'
  },
  {
    id: 2,
    title: 'Resume Previous Session',
    code: 'copilot --resume',
    category: 'Getting Started',
    difficulty: 'beginner',
    language: 'shell'
  },
  {
    id: 3,
    title: 'Continue Last Session',
    code: 'copilot --continue',
    category: 'Getting Started',
    difficulty: 'beginner',
    language: 'shell'
  },
  {
    id: 4,
    title: 'Explain a Config File',
    code: 'Explain @config/ci/ci-required-checks.yml',
    category: 'File References',
    difficulty: 'beginner',
    language: 'natural'
  },
  {
    id: 5,
    title: 'Fix a Bug in Code',
    code: 'Fix the bug in @src/app.js',
    category: 'File References',
    difficulty: 'beginner',
    language: 'natural'
  },
  {
    id: 6,
    title: 'Compare Two Files',
    code: 'What is different between @old.js and @new.js?',
    category: 'File References',
    difficulty: 'intermediate',
    language: 'natural'
  },
  {
    id: 7,
    title: 'Review Dependencies',
    code: 'What dependencies in @package.json should I update?',
    category: 'File References',
    difficulty: 'beginner',
    language: 'natural'
  },
  {
    id: 8,
    title: 'Run Git Status Directly',
    code: '!git status',
    category: 'Shell Commands',
    difficulty: 'beginner',
    language: 'shell'
  },
  {
    id: 9,
    title: 'Clone Repository Directly',
    code: '!git clone https://github.com/user/repo',
    category: 'Shell Commands',
    difficulty: 'beginner',
    language: 'shell'
  },
  {
    id: 10,
    title: 'Find Large Files',
    code: 'find all files larger than 100MB in this directory',
    category: 'Natural Language',
    difficulty: 'beginner',
    language: 'natural'
  },
  {
    id: 11,
    title: 'Docker Container Management',
    code: 'stop all running docker containers',
    category: 'Natural Language',
    difficulty: 'intermediate',
    language: 'natural'
  },
  {
    id: 12,
    title: 'Authenticate with GitHub',
    code: '/login',
    category: 'Slash Commands',
    difficulty: 'beginner',
    language: 'slash'
  },
  {
    id: 13,
    title: 'Add Trusted Directory',
    code: '/add-dir ../shared-utils',
    category: 'Slash Commands',
    difficulty: 'intermediate',
    language: 'slash'
  },
  {
    id: 14,
    title: 'Change Working Directory',
    code: '/cwd ~/other-project',
    category: 'Slash Commands',
    difficulty: 'intermediate',
    language: 'slash'
  },
  {
    id: 15,
    title: 'View Session Usage',
    code: '/usage',
    category: 'Slash Commands',
    difficulty: 'beginner',
    language: 'slash'
  },
  {
    id: 16,
    title: 'Delegate Test Writing',
    code: '/delegate complete the API integration tests and fix any failing edge cases',
    category: 'Delegation',
    difficulty: 'advanced',
    language: 'slash'
  },
  {
    id: 17,
    title: 'Delegate Feature Work',
    code: '/delegate add input validation to the user registration form',
    category: 'Delegation',
    difficulty: 'advanced',
    language: 'slash'
  },
  {
    id: 18,
    title: 'Select Custom Agent',
    code: '/agent',
    category: 'Custom Agents',
    difficulty: 'intermediate',
    language: 'slash'
  },
  {
    id: 19,
    title: 'Use Agent in Prompt',
    code: 'Use the refactoring agent to refactor this code block',
    category: 'Custom Agents',
    difficulty: 'intermediate',
    language: 'natural'
  },
  {
    id: 20,
    title: 'Add MCP Server',
    code: '/mcp add',
    category: 'MCP Integration',
    difficulty: 'advanced',
    language: 'slash'
  },
  {
    id: 21,
    title: 'List MCP Servers',
    code: '/mcp list',
    category: 'MCP Integration',
    difficulty: 'intermediate',
    language: 'slash'
  },
  {
    id: 22,
    title: 'In-Session Help',
    code: '?',
    category: 'Help',
    difficulty: 'beginner',
    language: 'slash'
  },
  {
    id: 23,
    title: 'Configuration Help',
    code: 'copilot help config',
    category: 'Help',
    difficulty: 'beginner',
    language: 'shell'
  },
  {
    id: 24,
    title: 'Search in Files',
    code: 'search for TODO comments in all JavaScript files',
    category: 'Natural Language',
    difficulty: 'beginner',
    language: 'natural'
  },
  {
    id: 25,
    title: 'Check Port Usage',
    code: 'which process is using port 3000?',
    category: 'Natural Language',
    difficulty: 'intermediate',
    language: 'natural'
  },
  {
    id: 26,
    title: 'Git Commit All Changes',
    code: 'stage and commit all changes with message "Fix authentication bug"',
    category: 'Natural Language',
    difficulty: 'beginner',
    language: 'natural'
  },
  {
    id: 27,
    title: 'Switch to GPT-5',
    code: '/model gpt-5',
    category: 'Model Selection',
    difficulty: 'beginner',
    language: 'null'
  },
  {
    id: 28,
    title: 'Use Claude Opus for Complex Tasks',
    code: '/model claude-opus-4.6',
    category: 'Model Selection',
    difficulty: 'intermediate',
    language: 'null'
  },
  {
    id: 29,
    title: 'Switch to Fast Model',
    code: '/model claude-haiku-4.5',
    category: 'Model Selection',
    difficulty: 'beginner',
    language: 'null'
  },
  {
    id: 30,
    title: 'Enter Plan Mode',
    code: 'Press Shift+Tab to switch to plan mode, then type your request. Copilot will create a structured implementation plan before writing code.',
    category: 'Plan Mode',
    difficulty: 'intermediate',
    language: 'null'
  },
  {
    id: 31,
    title: 'Create Implementation Plan',
    code: '/plan Add user authentication with JWT tokens',
    category: 'Plan Mode',
    difficulty: 'intermediate',
    language: 'null'
  },
  {
    id: 32,
    title: 'Plan a Refactor',
    code: '/plan Refactor the database layer to use connection pooling',
    category: 'Plan Mode',
    difficulty: 'advanced',
    language: 'null'
  },
  {
    id: 33,
    title: 'Review Current Changes',
    code: '/review',
    category: 'Code Review',
    difficulty: 'beginner',
    language: 'null'
  },
  {
    id: 34,
    title: 'View Session Diff',
    code: '/diff',
    category: 'Code Review',
    difficulty: 'beginner',
    language: 'null'
  },
  {
    id: 35,
    title: 'Undo Recent Changes',
    code: 'Press Esc-Esc to rewind file changes to any previous snapshot',
    category: 'Code Review',
    difficulty: 'intermediate',
    language: 'null'
  },
  {
    id: 36,
    title: 'Deep Research Investigation',
    code: '/research What are the best practices for rate limiting in Node.js APIs?',
    category: 'Research',
    difficulty: 'intermediate',
    language: 'null'
  },
  {
    id: 37,
    title: 'Research a Technology',
    code: '/research Compare WebSocket vs SSE for real-time features',
    category: 'Research',
    difficulty: 'intermediate',
    language: 'null'
  },
  {
    id: 38,
    title: 'Resume a Previous Session',
    code: '/resume',
    category: 'Session Management',
    difficulty: 'beginner',
    language: 'null'
  },
  {
    id: 39,
    title: 'Share Session as Gist',
    code: '/share',
    category: 'Session Management',
    difficulty: 'beginner',
    language: 'null'
  },
  {
    id: 40,
    title: 'Compact Long Conversation',
    code: '/compact',
    category: 'Session Management',
    difficulty: 'intermediate',
    language: 'null'
  },
  {
    id: 41,
    title: 'View Context Usage',
    code: '/context',
    category: 'Session Management',
    difficulty: 'beginner',
    language: 'null'
  },
  {
    id: 42,
    title: 'Rename Current Session',
    code: '/rename feature-auth-implementation',
    category: 'Session Management',
    difficulty: 'beginner',
    language: 'null'
  },
  {
    id: 43,
    title: 'Install a Plugin',
    code: '/plugin install owner/repo',
    category: 'Plugins & Skills',
    difficulty: 'intermediate',
    language: 'null'
  },
  {
    id: 44,
    title: 'List Installed Plugins',
    code: '/plugin list',
    category: 'Plugins & Skills',
    difficulty: 'beginner',
    language: 'null'
  },
  {
    id: 45,
    title: 'View Active Skills',
    code: '/skills',
    category: 'Plugins & Skills',
    difficulty: 'intermediate',
    language: 'null'
  },
  {
    id: 46,
    title: 'Delegate to Cloud Agent',
    code: '& Write comprehensive tests for the auth module',
    category: 'Background Delegation',
    difficulty: 'advanced',
    language: 'null'
  },
  {
    id: 47,
    title: 'Switch Between Local and Remote',
    code: '/resume',
    category: 'Background Delegation',
    difficulty: 'advanced',
    language: 'null'
  },
  {
    id: 48,
    title: 'Initialize Repository',
    code: '/init',
    category: 'Configuration',
    difficulty: 'beginner',
    language: 'null'
  },
  {
    id: 49,
    title: 'Set Terminal Theme',
    code: '/theme github-dark',
    category: 'Configuration',
    difficulty: 'beginner',
    language: 'null'
  },
  {
    id: 50,
    title: 'Enable Experimental Features',
    code: '/experimental',
    category: 'Configuration',
    difficulty: 'intermediate',
    language: 'null'
  },
  {
    id: 51,
    title: 'Toggle Reasoning Display',
    code: 'Press Ctrl+T to toggle visibility of model reasoning/thinking',
    category: 'Configuration',
    difficulty: 'intermediate',
    language: 'null'
  },
  {
    id: 52,
    title: 'View Custom Instructions',
    code: '/instructions',
    category: 'Configuration',
    difficulty: 'intermediate',
    language: 'null'
  },
  {
    id: 53,
    title: 'Open External Editor',
    code: 'Press Ctrl+X, Ctrl+E to open your preferred terminal editor for composing longer prompts',
    category: 'Keyboard Shortcuts',
    difficulty: 'intermediate',
    language: 'null'
  },
  {
    id: 54,
    title: 'Cycle Through Modes',
    code: 'Press Shift+Tab to cycle: interactive → plan → autopilot',
    category: 'Keyboard Shortcuts',
    difficulty: 'beginner',
    language: 'null'
  },
  {
    id: 55,
    title: 'Quick Help Overlay',
    code: 'Press ? to see all available commands and keyboard shortcuts',
    category: 'Keyboard Shortcuts',
    difficulty: 'beginner',
    language: 'null'
  }
];

export const quizQuestions = [
  // Lesson 1: What is Copilot CLI?
  { id: 1, lesson_id: 1, question: 'What type of tool is GitHub Copilot CLI?', options: ['Web application', 'IDE plugin', 'Standalone command-line tool', 'Mobile app'], correct_answer: 2, explanation: 'GitHub Copilot CLI is a standalone command-line tool that brings AI-powered assistance directly to your terminal.' },
  { id: 2, lesson_id: 1, question: 'Which subscription plans include Copilot CLI access?', options: ['Only Enterprise', 'Pro, Pro+, Business, and Enterprise', 'Free tier only', 'Only Business'], correct_answer: 1, explanation: 'Copilot CLI is available with GitHub Copilot Pro, Pro+, Business, and Enterprise subscriptions.' },
  // Lesson 2: Installation
  { id: 3, lesson_id: 2, question: 'Which package manager is used to install Copilot CLI on macOS?', options: ['npm', 'apt', 'Homebrew', 'WinGet'], correct_answer: 2, explanation: 'On macOS, you use Homebrew with the command: brew install copilot-cli' },
  { id: 4, lesson_id: 2, question: 'What command verifies Copilot CLI installation?', options: ['copilot check', 'copilot --version', 'copilot verify', 'copilot status'], correct_answer: 1, explanation: 'Use copilot --version to verify your installation is working correctly.' },
  // Lesson 3: Starting Your First Session
  { id: 5, lesson_id: 3, question: 'What command starts Copilot CLI?', options: ['gh copilot', 'copilot start', 'copilot', 'start-copilot'], correct_answer: 2, explanation: 'Simply type "copilot" in your terminal to start an interactive session.' },
  { id: 6, lesson_id: 3, question: 'What happens when you select "Yes, and remember this folder"?', options: ['Folder is trusted for this session only', 'Folder is trusted for all future sessions', 'All folders become trusted', 'Nothing changes'], correct_answer: 1, explanation: 'Selecting "Yes, and remember this folder" trusts the folder for all future Copilot CLI sessions.' },
  // Lesson 4: Basic Usage Patterns
  { id: 7, lesson_id: 4, question: 'How do you reference a file in your prompt?', options: ['#filename', '@filename', '$filename', '&filename'], correct_answer: 1, explanation: 'Use the @ symbol followed by the file path to reference files in your prompts.' },
  { id: 8, lesson_id: 4, question: 'What is the difference between Direct Mode and Interactive Mode?', options: ['No difference', 'Direct mode runs one command and exits, Interactive stays open', 'Interactive mode is faster', 'Direct mode requires authentication'], correct_answer: 1, explanation: 'Direct mode executes a single command and exits, while Interactive mode starts a persistent session for multiple interactions.' },
  // Lesson 5: Natural Language Prompts
  { id: 9, lesson_id: 5, question: 'What makes a good natural language prompt?', options: ['Being vague', 'Being specific about what you want', 'Using technical jargon only', 'Keeping it as short as possible'], correct_answer: 1, explanation: 'Being specific helps Copilot understand exactly what you need and provide better results.' },
  // Lesson 6: File References
  { id: 10, lesson_id: 6, question: 'What key completes a file path when typing @?', options: ['Enter', 'Space', 'Tab', 'Escape'], correct_answer: 2, explanation: 'Use Tab to autocomplete file paths when using the @ reference syntax.' },
  // Lesson 7: Tool Approvals
  { id: 11, lesson_id: 7, question: 'Why does Copilot ask for tool approvals?', options: ['To slow you down', 'For security - some tools can modify or execute files', 'It is optional', 'Only for premium users'], correct_answer: 1, explanation: 'Tool approvals exist for security - they prevent unintended modifications or executions.' },
  // Lesson 8: Shell Commands
  { id: 12, lesson_id: 8, question: 'What prefix runs a shell command directly without AI?', options: ['#', '@', '!', '/'], correct_answer: 2, explanation: 'Prepend your command with ! to run it directly in the shell without calling the AI model.' },
  // Lesson 9: Essential Slash Commands
  { id: 13, lesson_id: 9, question: 'What does the /usage command show?', options: ['Billing information', 'Context and usage statistics', 'User profile', 'Available commands'], correct_answer: 1, explanation: '/usage shows context and usage statistics including premium requests used and token usage.' },
  // Lesson 10: Directory Management
  { id: 14, lesson_id: 10, question: 'What command changes your working directory in Copilot CLI?', options: ['cd', '/cwd', '/dir', '/change'], correct_answer: 1, explanation: 'Use /cwd to change your working directory without starting a new session.' },
  // Lesson 11: Agent Commands
  { id: 15, lesson_id: 11, question: 'What does the /delegate command do?', options: ['Deletes files', 'Hands off tasks to Copilot coding agent on GitHub', 'Delegates to another user', 'Exits the session'], correct_answer: 1, explanation: '/delegate hands off your current session to Copilot coding agent on GitHub, which works in the background and creates a PR.' },
  // Lesson 12: MCP Commands
  { id: 16, lesson_id: 12, question: 'What is MCP in Copilot CLI?', options: ['Model Context Protocol - extends capabilities', 'Main Configuration Panel', 'Multiple Command Processor', 'Manual Control Program'], correct_answer: 0, explanation: 'MCP (Model Context Protocol) extends Copilot CLI with external tools and services.' },
  // Lesson 13: Understanding Custom Agents
  { id: 17, lesson_id: 13, question: 'Where are user-level agent profiles stored?', options: ['.github/agents/', '~/.copilot/agents/', '/etc/copilot/', '~/.agents/'], correct_answer: 1, explanation: 'User-level agent profiles are stored in ~/.copilot/agents/ and apply to all projects.' },
  // Lesson 14: Using Custom Agents
  { id: 18, lesson_id: 14, question: 'How do you select a custom agent in interactive mode?', options: ['/select-agent', '/use-agent', '/agent', '!agent'], correct_answer: 2, explanation: 'Use the /agent command to see and select from available custom agents.' },
  // Lesson 15: Configuring MCP Servers
  { id: 19, lesson_id: 15, question: 'Where are MCP server configurations stored?', options: ['~/.copilot/mcp-config.json', '/etc/mcp.conf', '~/.mcp/servers.json', 'package.json'], correct_answer: 0, explanation: 'MCP server configurations are stored in ~/.copilot/mcp-config.json.' },
  // Lesson 17: Session Management
  { id: 20, lesson_id: 17, question: 'What command resumes the most recent session?', options: ['copilot --resume', 'copilot --continue', 'copilot --last', 'copilot --restore'], correct_answer: 1, explanation: 'Use copilot --continue to immediately resume your most recently closed session.' },
  // Lesson 18: Custom Instructions
  { id: 21, lesson_id: 18, question: 'Where do repository-wide custom instructions go?', options: ['.github/copilot-instructions.md', 'README.md', '.copilot/instructions.md', 'package.json'], correct_answer: 0, explanation: 'Repository-wide instructions are stored in .github/copilot-instructions.md.' },
  // Lesson 20: Best Practices
  { id: 22, lesson_id: 20, question: 'What should you always do before approving a tool action?', options: ['Approve immediately', 'Review what the tool wants to do', 'Exit the session', 'Restart Copilot'], correct_answer: 1, explanation: 'Always review what tools want to do before approving, especially for destructive operations.' }
];

// In-memory storage for user sessions (resets on cold start - acceptable for demo)
export const userSessions = new Map();

export function getOrCreateUser(sessionId) {
  if (!userSessions.has(sessionId)) {
    userSessions.set(sessionId, {
      id: sessionId,
      session_id: sessionId,
      preferences: { theme: 'light', fontSize: 'medium', codeTheme: 'vscode-dark' },
      progress: [],
      bookmarks: [],
      achievements: [],
      created_at: new Date().toISOString()
    });
  }
  return userSessions.get(sessionId);
}
