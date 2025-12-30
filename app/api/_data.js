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
  // Module 1: Getting Started
  {
    id: 1,
    module_id: 1,
    title: 'What is Copilot CLI?',
    content: '# What is GitHub Copilot CLI?\n\nGitHub Copilot CLI is a standalone command-line tool that brings AI-powered assistance directly to your terminal.\n\n## Who Can Use It?\n\nCopilot CLI is available with:\n- GitHub Copilot Pro\n- GitHub Copilot Pro+\n- GitHub Copilot Business\n- GitHub Copilot Enterprise\n\n> **Note**: If you receive Copilot from an organization, the Copilot CLI policy must be enabled in your organization\'s settings.\n\n## What Can It Do?\n\n- **Natural Language Commands**: Describe what you need in plain English\n- **File Context**: Reference files with `@path/to/file` syntax\n- **Tool Integration**: Extend capabilities with MCP servers\n- **Custom Agents**: Create specialized AI assistants\n- **Delegate Work**: Hand off tasks to Copilot coding agent on GitHub\n\n## Important Note\n\nGitHub Copilot CLI is in **public preview** with data protection and is subject to change.',
    duration: 5,
    difficulty: 'beginner',
    order_index: 1
  },
  {
    id: 2,
    module_id: 1,
    title: 'Installation',
    content: '# Installing GitHub Copilot CLI\n\n## Prerequisites\n\n- GitHub account with an active Copilot subscription\n- Administrator access on your machine\n\n## Installation Methods\n\n### Windows (WinGet)\n```bash\nwinget install GitHub.Copilot\n```\n\n### macOS (Homebrew)\n```bash\nbrew install copilot-cli\n```\n\n### Linux (Homebrew)\n```bash\nbrew install copilot-cli\n```\n\n### npm (Cross-Platform)\n```bash\n# Requires Node.js 22 or later\nnpm install -g @github/copilot\n```\n\n### Direct Download\n\nAlternatively, download the binary directly from the [GitHub releases page](https://github.com/githubnext/copilot-cli/releases).\n\n## Verify Installation\n\n```bash\ncopilot --version\n```\n\n## Getting Help\n\n```bash\ncopilot help\ncopilot help config\ncopilot help environment\ncopilot help logging\ncopilot help permissions\n```',
    duration: 10,
    difficulty: 'beginner',
    order_index: 2
  },
  {
    id: 3,
    module_id: 1,
    title: 'Starting Your First Session',
    content: '# Starting Your First Session\n\n## Launch Copilot CLI\n\n1. Navigate to a folder with code you want to work with:\n```bash\ncd ~/my-project\n```\n\n2. Start Copilot CLI:\n```bash\ncopilot\n```\n\n## Trust Folder Prompt\n\nCopilot will ask you to confirm that you trust the files in this folder:\n\n> **Important**: During this session, Copilot may attempt to read, modify, and execute files in and below this folder.\n\nChoose one option:\n\n1. **Yes, proceed** - Trust for this session only\n2. **Yes, and remember this folder** - Trust for all future sessions\n3. **No, exit (Esc)** - End the session\n\n## Authentication\n\nIf not logged in, you\'ll be prompted to authenticate:\n\n```bash\n/login\n```\n\nFollow the on-screen instructions to complete GitHub authentication.\n\n## Alternative: Token Authentication\n\nYou can also authenticate using environment variables:\n- `GH_TOKEN` - Fine-grained personal access token\n- `GITHUB_TOKEN` - Alternative token variable\n\n## Getting Help in Interactive Mode\n\nType `?` in the prompt box to see all available commands and options.',
    duration: 8,
    difficulty: 'beginner',
    order_index: 3
  },
  {
    id: 4,
    module_id: 1,
    title: 'Basic Usage Patterns',
    content: '# Basic Usage Patterns\n\n## Understanding Copilot CLI Modes\n\nCopilot CLI has two primary interaction modes:\n\n### Direct Mode\nExecute a single command and exit:\n```bash\ncopilot "your question or command"\n```\n\n### Interactive Mode\nStart a persistent session:\n```bash\ncopilot\n# Now you can ask multiple questions\n```\n\n## Common Usage Patterns\n\n### Ask Questions\n```bash\n> Explain this error message\n> How do I fix merge conflicts?\n> What does this code do?\n```\n\n### Generate Commands\n```bash\n> Find all JavaScript files modified in the last week\n> Create a new React component\n> Update all dependencies\n```\n\n### Reference Files\n```bash\n> Explain @src/app.js\n> What\'s the difference between @file1.js and @file2.js?\n> Refactor @utils/helper.js\n```\n\n### Chain Operations\nYou can build on previous responses:\n```bash\n> List all TypeScript files in src/\n> Now check which ones need type fixes\n> Fix the first one\n```\n\n## Tips for Best Results\n\n1. **Be Specific**: "Explain the authentication flow in @src/auth.js" is better than "Explain this"\n2. **Use Context**: Reference files with @ syntax\n3. **Iterate**: Build on Copilot\'s responses\n4. **Verify**: Always review generated commands before executing',
    duration: 8,
    difficulty: 'beginner',
    order_index: 4
  },
  // Module 2: Interactive Mode Essentials
  {
    id: 5,
    module_id: 2,
    title: 'Natural Language Prompts',
    content: '# Natural Language Prompts\n\n## How It Works\n\nSimply type what you want in plain English. Copilot understands context and generates appropriate commands.\n\n## Example Prompts\n\n### File Operations\n```\nfind all JavaScript files larger than 1MB\nlist files modified in the last 24 hours\ncreate a new directory called components\n```\n\n### Git Operations\n```\nshow commits from last week\ncreate a new branch called feature/login\nstage and commit all changes with message "Fix bug"\n```\n\n### System Tasks\n```\nwhich process is using port 3000?\nshow disk usage for current directory\nfind and kill zombie processes\n```\n\n### Docker\n```\nlist all running containers\nstop all containers using more than 1GB memory\nbuild and run this Dockerfile\n```\n\n## Tips for Better Results\n\n1. **Be Specific**: "find PNG files > 5MB in /images" beats "find big files"\n2. **Add Context**: Mention your OS or preferred tools\n3. **Iterate**: Refine your prompt based on results',
    duration: 10,
    difficulty: 'beginner',
    order_index: 1
  },
  {
    id: 6,
    module_id: 2,
    title: 'File References with @',
    content: '# File References with @\n\n## Overview\n\nUse the `@` symbol followed by a file path to include file contents as context in your prompt.\n\n## Syntax\n\n```\n@path/to/file\n```\n\n## Auto-Complete\n\nWhen you start typing a file path after `@`, matching paths appear below the prompt box. Use:\n- **Arrow keys** to navigate\n- **Tab** to complete the path\n\n## Examples\n\n### Explain a File\n```\nExplain @config/ci/ci-required-checks.yml\n```\n\n### Fix Code\n```\nFix the bug in @src/app.js\n```\n\n### Compare Files\n```\nWhat\'s different between @old.js and @new.js?\n```\n\n### Summarize Multiple Files\n```\nSummarize @README.md and @CONTRIBUTING.md\n```\n\n### Review Dependencies\n```\nWhat dependencies are in @package.json that I should update?\n```\n\n## Why Use File References?\n\n- **Accuracy**: Copilot sees actual file contents\n- **Context**: Better understanding of your project\n- **Efficiency**: No need to copy-paste code',
    duration: 8,
    difficulty: 'beginner',
    order_index: 2
  },
  {
    id: 7,
    module_id: 2,
    title: 'Tool Approvals',
    content: '# Tool Approvals\n\n## Why Approvals Exist\n\nWhen Copilot wants to use a tool that could modify or execute files (like `touch`, `chmod`, `node`, or `sed`), it asks for your approval first.\n\n## Approval Options\n\nWhen prompted, choose one:\n\n### 1. Yes\n- Allow Copilot to use this tool once\n- Next time it wants to use this tool, it will ask again\n\n### 2. Yes, and approve TOOL for the rest of the running session\n- Allow this tool (with any options) without asking again\n- Approval only lasts for current session\n- **Use with caution**: Approving `rm` would let Copilot delete any file!\n\n### 3. No, and tell Copilot what to do differently (Esc)\n- Copilot won\'t run the command\n- You can provide alternative instructions\n\n## Example Workflow\n\n```\nYou: Create a script that backs up my database\n\nCopilot: I\'ll create a backup script. \n[Tool: touch backup.sh]\nApprove? [Yes / Yes for session / No (Esc)]\n```\n\n## Recovering from a Denial\n\nIf you press Esc, you can refine your request:\n```\nContinue the previous task but use a Python script instead\n```\n\n## Stopping Operations\n\nPress **Esc** while Copilot is "Thinking" to stop the current operation.',
    duration: 10,
    difficulty: 'beginner',
    order_index: 3
  },
  {
    id: 8,
    module_id: 2,
    title: 'Shell Commands with !',
    content: '# Direct Shell Commands with !\n\n## Overview\n\nPrepend your input with `!` to run shell commands directly, without making a call to the AI model.\n\n## Syntax\n\n```\n!command\n```\n\n## Examples\n\n### Clone a Repository\n```\n!git clone https://github.com/user/repo\n```\n\n### Check Status\n```\n!git status\n```\n\n### List Files\n```\n!ls -la\n```\n\n### Run Scripts\n```\n!npm install\n!python script.py\n```\n\n## When to Use !\n\n- **Known commands**: When you already know exactly what to run\n- **Quick operations**: Faster than waiting for AI response\n- **System checks**: `!pwd`, `!whoami`, `!which node`\n\n## When NOT to Use !\n\n- When you need help figuring out the right command\n- When you want Copilot to explain what a command does\n- When you need multi-step assistance',
    duration: 5,
    difficulty: 'beginner',
    order_index: 4
  },
  // Module 3: Slash Commands & Features
  {
    id: 9,
    module_id: 3,
    title: 'Essential Slash Commands',
    content: '# Essential Slash Commands\n\n## Overview\n\nSlash commands are quick actions you can use in interactive mode.\n\n## Authentication\n\n```bash\n/login          # Authenticate with GitHub\n/logout         # Sign out of GitHub\n```\n\n## Getting Help\n\n```bash\n?               # Show available commands (type in prompt)\n/feedback       # Submit feedback, bug reports, or feature requests\n```\n\n## Session Management\n\n```bash\n/usage          # View context and usage statistics\nexit            # Exit interactive mode\nCtrl+C          # Also exits interactive mode\n```\n\n## What /usage Shows\n\n- Premium requests used in current session\n- Session duration\n- Lines of code edited\n- Token usage breakdown per model\n\n> **Warning**: When you have less than 20% of a model\'s token limit remaining, Copilot CLI displays a warning that context will be truncated.',
    duration: 8,
    difficulty: 'beginner',
    order_index: 1
  },
  {
    id: 10,
    module_id: 3,
    title: 'Directory Management',
    content: '# Directory Management\n\n## Working with Files Outside Current Directory\n\nCopilot may need to work with files outside your current location. It will ask for approval to access those directories.\n\n## /add-dir - Add Trusted Directory\n\nManually add a trusted directory:\n\n```bash\n/add-dir /path/to/directory\n```\n\nThis lets Copilot work with files in that location.\n\n## /cwd - Change Working Directory\n\nSwitch to a different working directory without starting a new session:\n\n```bash\n/cwd /path/to/directory\n```\n\n## Use Cases\n\n### Multi-Project Work\n```bash\n# Start in one project\ncopilot\n\n# Switch to another project\n/cwd ~/other-project\n\n# Add a shared utilities folder\n/add-dir ~/shared/utils\n```\n\n### Monorepo Navigation\n```bash\n# Working in packages/frontend\n/add-dir ../backend\n/add-dir ../shared\n```',
    duration: 6,
    difficulty: 'intermediate',
    order_index: 2
  },
  {
    id: 11,
    module_id: 3,
    title: 'Agent Commands',
    content: '# Agent Commands\n\n## /agent - Select Custom Agent\n\nSwitch to a custom agent for specialized tasks:\n\n```bash\n/agent\n```\n\nThis shows a list of available custom agents to choose from.\n\n## /delegate - Hand Off to Copilot Coding Agent\n\nDelegates your current session to Copilot coding agent on GitHub:\n\n```bash\n/delegate complete the API integration tests and fix any failing edge cases\n```\n\n## How /delegate Works\n\n1. Copilot asks to commit unstaged changes as a checkpoint\n2. Creates a new branch for the work\n3. Opens a **draft pull request** on GitHub\n4. Copilot coding agent works in the background\n5. Requests a review from you when complete\n6. Provides a link to the PR and agent session\n\n## When to Use /delegate\n\n- Long-running tasks you don\'t want to wait for\n- Complex multi-file changes\n- Test writing and debugging\n- When you want work to continue while you do other things\n\n## Important Notes\n\n- Your local context is preserved for the agent\n- Work happens on GitHub, not locally\n- You\'ll get notifications when review is needed',
    duration: 10,
    difficulty: 'intermediate',
    order_index: 3
  },
  {
    id: 12,
    module_id: 3,
    title: 'MCP Commands',
    content: '# MCP Commands\n\n## What is MCP?\n\nModel Context Protocol (MCP) extends Copilot CLI with external tools and services.\n\n## Built-in MCP Server\n\nCopilot CLI comes with the **GitHub MCP server** pre-configured, allowing you to:\n- Interact with GitHub.com resources\n- Merge pull requests from CLI\n- Manage issues and discussions\n\n## /mcp add - Add New Server\n\n```bash\n/mcp add\n```\n\n1. Fill in the MCP server details\n2. Use **Tab** to move between fields\n3. Press **Ctrl+S** to save\n\n## /mcp list - View Configured Servers\n\n```bash\n/mcp list\n```\n\n## Configuration File\n\nMCP server configurations are stored in:\n```\n~/.copilot/mcp-config.json\n```\n\nYou can change this location with the `XDG_CONFIG_HOME` environment variable.\n\n## Popular MCP Servers\n\n- **Playwright**: Browser automation and testing\n- **Filesystem**: Enhanced file operations\n- **Database**: Direct database queries\n- **Custom**: Build your own for specific tools',
    duration: 10,
    difficulty: 'intermediate',
    order_index: 4
  },
  // Module 4: Custom Agents & MCP
  {
    id: 13,
    module_id: 4,
    title: 'Understanding Custom Agents',
    content: '# Understanding Custom Agents\n\n## What Are Custom Agents?\n\nCustom agents are specialized versions of Copilot coding agent tailored to your unique:\n- Workflows\n- Coding conventions\n- Use cases\n\nThey\'re defined using Markdown files called **agent profiles** that specify prompts, tools, and MCP servers.\n\n## Agent Profile Locations\n\n| Level | Location | Scope |\n|-------|----------|-------|\n| User-level | `~/.copilot/agents/` | All projects |\n| Repository-level | `.github/agents/` | Current project |\n| Organization-level | `.github-private/agents/` | All org projects |\n\n## Priority Order\n\nWhen agents have the same name:\n1. **User-level** overrides repository-level\n2. **Repository-level** overrides organization-level\n\n## Agent Profile Contents\n\nAn agent profile (`.md` file) typically includes:\n- Agent name and description\n- Specialized instructions\n- Tool preferences\n- MCP server configurations',
    duration: 8,
    difficulty: 'intermediate',
    order_index: 1
  },
  {
    id: 14,
    module_id: 4,
    title: 'Using Custom Agents',
    content: '# Using Custom Agents\n\n## Three Ways to Use Custom Agents\n\n### 1. Interactive Selection\n\nUse the slash command to see available agents:\n\n```bash\n/agent\n```\n\nSelect from the list of configured agents.\n\n### 2. Natural Language Inference\n\nMention the agent in your prompt:\n\n```bash\nUse the refactoring agent to refactor this code block\n```\n\nCopilot automatically infers which agent you mean.\n\n### 3. Command-Line Option\n\nSpecify the agent when starting Copilot:\n\n```bash\ncopilot --agent=refactor-agent --prompt "Refactor this code block"\n```\n\n## Example Agent Use Cases\n\n### DevOps Agent\n- Deployment automation\n- Infrastructure monitoring\n- Container management\n\n### Code Review Agent\n- PR reviews\n- Style enforcement\n- Bug detection\n\n### Documentation Agent\n- README generation\n- API documentation\n- Changelog updates',
    duration: 8,
    difficulty: 'intermediate',
    order_index: 2
  },
  {
    id: 15,
    module_id: 4,
    title: 'Configuring MCP Servers',
    content: '# Configuring MCP Servers\n\n## Adding an MCP Server\n\n1. Start interactive mode:\n```bash\ncopilot\n```\n\n2. Use the add command:\n```bash\n/mcp add\n```\n\n3. Fill in server details (use Tab to navigate)\n\n4. Save with **Ctrl+S**\n\n## Configuration File Structure\n\nServers are stored in `~/.copilot/mcp-config.json`:\n\n```json\n{\n  "mcpServers": {\n    "github": {\n      "command": "npx",\n      "args": ["@github/mcp-server"]\n    },\n    "playwright": {\n      "command": "npx",\n      "args": ["@playwright/mcp@latest"]\n    }\n  }\n}\n```\n\n## Server Types\n\n### stdio Servers\nCommunicate via standard input/output:\n```json\n{\n  "command": "npx",\n  "args": ["@some/mcp-server"]\n}\n```\n\n### HTTP Servers\nCommunicate over HTTP:\n```json\n{\n  "url": "http://localhost:3100"\n}\n```\n\n## Environment Variables\n\nYou can include environment variables:\n```json\n{\n  "command": "node",\n  "args": ["server.js"],\n  "env": {\n    "API_KEY": "your-key"\n  }\n}\n```',
    duration: 12,
    difficulty: 'advanced',
    order_index: 3
  },
  {
    id: 16,
    module_id: 4,
    title: 'Skills',
    content: '# Skills\n\n## What Are Skills?\n\nSkills enhance Copilot\'s ability to perform specialized tasks with:\n- Custom instructions\n- Scripts\n- Resources\n\n## How Skills Work\n\nSkills are reusable components that agents can leverage for specific capabilities:\n\n- **Code Generation Skills**: Language-specific patterns\n- **Testing Skills**: Test framework conventions\n- **Deployment Skills**: CI/CD workflows\n- **Documentation Skills**: Doc generation patterns\n\n## Skill Benefits\n\n1. **Consistency**: Same approach across projects\n2. **Reusability**: Write once, use everywhere\n3. **Specialization**: Deep expertise in specific areas\n4. **Maintainability**: Update skills centrally\n\n## Learning More\n\nSkills are an advanced feature. For detailed information, see the official GitHub documentation on Agent Skills.',
    duration: 6,
    difficulty: 'advanced',
    order_index: 4
  },
  // Module 5: Advanced Workflows
  {
    id: 17,
    module_id: 5,
    title: 'Session Management',
    content: '# Session Management\n\n## Resuming Previous Sessions\n\nCopilot CLI saves your session history so you can return to previous conversations.\n\n### List Previous Sessions\n\n```bash\ncopilot --resume\n```\n\nThis shows a list of your previous sessions. Select one to continue.\n\n### Quick Resume Last Session\n\n```bash\ncopilot --continue\n```\n\nThis immediately resumes your most recently closed session.\n\n## Why Resume Sessions?\n\n- **Context Preservation**: Continue where you left off\n- **Long-Running Tasks**: Break up complex work\n- **Reference**: Review what you discussed before\n\n## Session Tips\n\n1. Use `/usage` to check remaining context before long tasks\n2. Exit gracefully with `exit` or Ctrl+C to save session state\n3. Use `--resume` to find that command you used last week',
    duration: 6,
    difficulty: 'intermediate',
    order_index: 1
  },
  {
    id: 18,
    module_id: 5,
    title: 'Custom Instructions',
    content: '# Custom Instructions\n\n## Overview\n\nCustom instructions are natural language descriptions in Markdown files that are automatically included in your prompts. They help Copilot understand your project context.\n\n## Supported Instruction Files\n\n### Repository-Wide Instructions\n```\n.github/copilot-instructions.md\n```\nApply to all prompts in this repository.\n\n### Path-Specific Instructions\n```\n.github/copilot-instructions/**/*.instructions.md\n```\nApply to specific directories or file types.\n\n### Agent Files\n```\nAGENTS.md\n```\nSpecial instructions for agent behavior.\n\n## Example Instructions File\n\n```markdown\n# Project Guidelines\n\n## Code Style\n- Use TypeScript with strict mode\n- Prefer functional components in React\n- Always include error handling\n\n## Testing\n- Write tests for all new functions\n- Use Jest and React Testing Library\n\n## Git Commits\n- Use conventional commit format\n- Keep commits atomic\n```\n\n## Benefits\n\n- **Consistency**: Copilot follows your team\'s conventions\n- **Context**: Better understanding of project structure\n- **Quality**: Suggestions match your standards',
    duration: 10,
    difficulty: 'intermediate',
    order_index: 2
  },
  {
    id: 19,
    module_id: 5,
    title: 'Configuration & Environment',
    content: '# Configuration & Environment\n\n## Configuration File\n\nAdjust settings in `~/.copilot/config.json` (or location set by `XDG_CONFIG_HOME`).\n\n## Getting Configuration Help\n\n```bash\ncopilot help config\n```\n\n## Environment Variables\n\n```bash\ncopilot help environment\n```\n\nKey environment variables:\n- `GH_TOKEN` / `GITHUB_TOKEN`: Authentication token\n- `XDG_CONFIG_HOME`: Custom config directory\n\n## Logging\n\n```bash\ncopilot help logging\n```\n\nConfigure log levels for debugging.\n\n## Permissions\n\n```bash\ncopilot help permissions\n```\n\nManage tool allow/deny lists.\n\n## Key Config Options\n\n- Model preferences\n- Default MCP servers\n- Trusted directories\n- Tool permissions',
    duration: 8,
    difficulty: 'advanced',
    order_index: 3
  },
  {
    id: 20,
    module_id: 5,
    title: 'Best Practices & Safety',
    content: '# Best Practices & Safety\n\n## Safety First\n\n### 1. Review Tool Actions\n- Always check what tools want to do before approving\n- Be cautious with session-wide approvals\n- Never approve unknown operations on production systems\n\n### 2. Trust Carefully\n- Only trust folders you control\n- Be careful with cloned repositories from unknown sources\n- Review files before trusting new directories\n\n### 3. Use Safe Environments\n- Test destructive commands in containers or VMs\n- Have backups before system-wide changes\n- Use version control\n\n## Effective Prompting\n\n### Be Specific\n✅ "Find log files larger than 100MB in /var/log"\n❌ "Find big files"\n\n### Use File References\n✅ "Explain @src/auth.js and suggest improvements"\n❌ "Explain my auth code"\n\n### Iterate\n- Start with simple prompts\n- Refine based on results\n- Use `/usage` to track context\n\n## Providing Feedback\n\n```bash\n/feedback\n```\n\nOptions:\n- Private feedback survey\n- Bug reports\n- Feature suggestions\n\n## Remember\n\nCopilot CLI is a powerful tool. With great power comes responsibility. Always review before approving!',
    duration: 12,
    difficulty: 'advanced',
    order_index: 4
  }
];

export const commands = [
  {
    id: 1,
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
    id: 2,
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
  {
    id: 3,
    name: '/login',
    syntax: '/login',
    description: 'Authenticate with GitHub to use Copilot CLI',
    category: 'Authentication',
    examples: JSON.stringify([{ description: 'Login to GitHub', command: '/login' }])
  },
  {
    id: 4,
    name: '/logout',
    syntax: '/logout',
    description: 'Sign out of your GitHub account',
    category: 'Authentication',
    examples: JSON.stringify([{ description: 'Sign out', command: '/logout' }])
  },
  {
    id: 5,
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
    id: 6,
    name: '/cwd',
    syntax: '/cwd <path>',
    description: 'Change working directory without starting a new session',
    category: 'Directory Management',
    examples: JSON.stringify([
      { description: 'Switch to another project', command: '/cwd ~/other-project' },
      { description: 'Go to subdirectory', command: '/cwd ./src' }
    ])
  },
  {
    id: 7,
    name: '/agent',
    syntax: '/agent',
    description: 'Select from available custom agents',
    category: 'Agent Commands',
    examples: JSON.stringify([{ description: 'Show available agents', command: '/agent' }])
  },
  {
    id: 8,
    name: '/delegate',
    syntax: '/delegate <task description>',
    description: 'Delegate task to Copilot coding agent on GitHub (creates PR)',
    category: 'Agent Commands',
    examples: JSON.stringify([
      { description: 'Delegate test writing', command: '/delegate complete the API integration tests' },
      { description: 'Delegate feature work', command: '/delegate add input validation to the user form' }
    ])
  },
  {
    id: 9,
    name: '/mcp add',
    syntax: '/mcp add',
    description: 'Add an MCP server to extend Copilot CLI capabilities',
    category: 'MCP Commands',
    examples: JSON.stringify([{ description: 'Add a new MCP server', command: '/mcp add' }])
  },
  {
    id: 10,
    name: '/mcp list',
    syntax: '/mcp list',
    description: 'List all configured MCP servers',
    category: 'MCP Commands',
    examples: JSON.stringify([{ description: 'View configured servers', command: '/mcp list' }])
  },
  {
    id: 11,
    name: '/usage',
    syntax: '/usage',
    description: 'View context and usage statistics for current session',
    category: 'Session Commands',
    examples: JSON.stringify([{ description: 'Check token usage', command: '/usage' }])
  },
  {
    id: 12,
    name: '/feedback',
    syntax: '/feedback',
    description: 'Submit feedback, bug reports, or feature suggestions',
    category: 'Session Commands',
    examples: JSON.stringify([{ description: 'Give feedback', command: '/feedback' }])
  },
  {
    id: 13,
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
    id: 14,
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
    id: 15,
    name: '?',
    syntax: '?',
    description: 'Show all available commands and options in interactive mode',
    category: 'Help',
    examples: JSON.stringify([{ description: 'Get in-session help', command: '?' }])
  }
];

export const examples = [
  { id: 1, title: 'Start Interactive Mode', code: 'copilot', category: 'Getting Started', difficulty: 'beginner', language: 'shell' },
  { id: 2, title: 'Resume Previous Session', code: 'copilot --resume', category: 'Getting Started', difficulty: 'beginner', language: 'shell' },
  { id: 3, title: 'Continue Last Session', code: 'copilot --continue', category: 'Getting Started', difficulty: 'beginner', language: 'shell' },
  { id: 4, title: 'Explain a Config File', code: 'Explain @config/ci/ci-required-checks.yml', category: 'File References', difficulty: 'beginner', language: 'natural' },
  { id: 5, title: 'Fix a Bug in Code', code: 'Fix the bug in @src/app.js', category: 'File References', difficulty: 'beginner', language: 'natural' },
  { id: 6, title: 'Compare Two Files', code: 'What is different between @old.js and @new.js?', category: 'File References', difficulty: 'intermediate', language: 'natural' },
  { id: 7, title: 'Run Git Status Directly', code: '!git status', category: 'Shell Commands', difficulty: 'beginner', language: 'shell' },
  { id: 8, title: 'Clone Repository Directly', code: '!git clone https://github.com/user/repo', category: 'Shell Commands', difficulty: 'beginner', language: 'shell' },
  { id: 9, title: 'Find Large Files', code: 'find all files larger than 100MB in this directory', category: 'Natural Language', difficulty: 'beginner', language: 'natural' },
  { id: 10, title: 'Check Port Usage', code: 'which process is using port 3000?', category: 'Natural Language', difficulty: 'intermediate', language: 'natural' },
  { id: 11, title: 'Authenticate with GitHub', code: '/login', category: 'Slash Commands', difficulty: 'beginner', language: 'slash' },
  { id: 12, title: 'Add Trusted Directory', code: '/add-dir ../shared-utils', category: 'Slash Commands', difficulty: 'intermediate', language: 'slash' },
  { id: 13, title: 'Change Working Directory', code: '/cwd ~/other-project', category: 'Slash Commands', difficulty: 'intermediate', language: 'slash' },
  { id: 14, title: 'View Session Usage', code: '/usage', category: 'Slash Commands', difficulty: 'beginner', language: 'slash' },
  { id: 15, title: 'Delegate Test Writing', code: '/delegate complete the API integration tests', category: 'Delegation', difficulty: 'advanced', language: 'slash' },
  { id: 16, title: 'Select Custom Agent', code: '/agent', category: 'Custom Agents', difficulty: 'intermediate', language: 'slash' },
  { id: 17, title: 'Add MCP Server', code: '/mcp add', category: 'MCP Integration', difficulty: 'advanced', language: 'slash' },
  { id: 18, title: 'List MCP Servers', code: '/mcp list', category: 'MCP Integration', difficulty: 'intermediate', language: 'slash' },
  { id: 19, title: 'In-Session Help', code: '?', category: 'Help', difficulty: 'beginner', language: 'slash' },
  { id: 20, title: 'Configuration Help', code: 'copilot help config', category: 'Help', difficulty: 'beginner', language: 'shell' }
];

// Quiz questions per lesson
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
