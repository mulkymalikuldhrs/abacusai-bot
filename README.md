# AbacusAI Bot (Next.js Edition)

> 100% free, open-source personal AI agents for your messaging apps, connected tools, and automated routines.

Rewritten as a full-stack **Next.js 15+ App Router** application with server-side Google Gemini integration, interactive agent execution, remote messaging channels, and scheduled routines.

---

## Features

### 1. Autonomous Personal Bots & Bot Studio
- **Standing Agents**: Create, configure, and manage personal agents (Chief of Staff, WhatsApp Assistant, Research Scout, Code Reviewer, Morning Brief).
- **Custom Personas & Memory Banks**: Define mission instructions, system prompts, and persistent knowledge facts, rules, and user preferences.
- **Custom Avatars & Models**: Configure avatar colors, shapes (circle, square, squircle, hexagon), and model selection (Google Gemini 2.5 Flash, Gemini 2.5 Pro, RouteLLM Open, Claude 3.5 Sonnet, GPT-4o).

### 2. Live Agent Workspace & Tool Execution
- **Streaming Chat**: Interactive conversational interface with markdown support.
- **Tool Calling Pipeline**: Real-time visualization of agent tool steps (Web Search, Gmail threads, Google Calendar agendas, GitHub PR scans, Terminal execution).
- **Supervised Mode**: Approval gates for sensitive actions (destructive commands, external communications) with one-click Authorize / Reject actions.

### 3. Remote Messaging Bridges (WhatsApp, Telegram, Discord)
- **WhatsApp Web Bridge**: Interactive QR code pairing canvas and pairing code verification.
- **Sender Allowlist**: Granular sender permissions, pending inbound request approvals, and unattended remote tool permissions.
- **Mobile Inbound Simulator**: Test how bots receive, verify sender authorization, and reply to mobile messages.

### 4. Connectors & Model Context Protocol (MCP)
- **Built-in Connectors**: Google Workspace (Gmail, Drive, Calendar), Slack, GitHub, Jira, Notion, Dropbox.
- **MCP Server Registry**: Register and manage Model Context Protocol servers via stdio or SSE with exposed tool schemas.

### 5. Automated Routines & Cron Workflows
- **Scheduled Triggers**: Hourly, Daily, Weekdays, Weekly, custom Cron, and Webhook triggers.
- **One-click "Run Now"**: Execute automated pipelines immediately with live status logs.
- **Execution Run History**: Detailed logs, timestamps, output memos, and deliverable attachments.

### 6. Deliverable Templates & Skills
- **Slide Decks**: 8-Bit Orbit, Biennale Yellow, BlockFrame, Blue Professional, Editorial Forest.
- **PDF Layouts**: Ledger, Signal, Press, Slate, Atlas.
- **Agent Skills**: code-review, web-research, data-analysis, debugging, docx, frontend-design, testing, xlsx.

---

## Development

```bash
# Install dependencies
npm install

# Start development server on port 3000
npm run dev

# Build for production
npm run build
```

## Environment Variables

Copy `.env.example` to `.env.local`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```
