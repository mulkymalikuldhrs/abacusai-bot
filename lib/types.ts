export type AvatarShape = "circle" | "square" | "squircle" | "hexagon";

export interface BotMemoryItem {
  id: string;
  category: "fact" | "preference" | "rule" | "contact";
  content: string;
  updatedAt: string;
}

export interface BotToolsConfig {
  webSearch: boolean;
  bashCommands: boolean;
  fileOperations: boolean;
  messaging: boolean;
  memory: boolean;
  connectors: boolean;
}

export interface Bot {
  id: string;
  name: string;
  title: string;
  description: string;
  persona: string;
  avatarColor: string;
  avatarShape: AvatarShape;
  avatarIcon: string;
  model: string;
  workspacePath: string;
  tools: BotToolsConfig;
  memory: BotMemoryItem[];
  createdAt: string;
  updatedAt: string;
  scheduledCheckIn?: string;
  isFavorite?: boolean;
}

export interface ToolStep {
  id: string;
  toolName: string;
  displayName: string;
  inputArgs: Record<string, any>;
  outputResult?: string;
  status: "pending" | "running" | "completed" | "failed" | "waiting_approval" | "rejected";
  durationMs?: number;
}

export interface ChatMessage {
  id: string;
  botId: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  toolSteps?: ToolStep[];
  modelUsed?: string;
  needsApproval?: boolean;
  channel?: "desktop" | "whatsapp" | "telegram" | "discord" | "routine";
  senderName?: string;
}

export interface Connector {
  id: string;
  slug: string;
  name: string;
  category: "google" | "communication" | "development" | "productivity" | "storage";
  description: string;
  isConnected: boolean;
  connectedAccount?: string;
  scopes: string[];
  toolsProvided: string[];
}

export interface McpServer {
  id: string;
  name: string;
  transport: "stdio" | "sse";
  command: string;
  args: string[];
  url?: string;
  status: "connected" | "disconnected" | "error";
  toolsList: string[];
}

export type ScheduleFrequency = "hourly" | "daily" | "weekdays" | "weekly" | "cron" | "webhook";

export interface Routine {
  id: string;
  name: string;
  botId: string;
  scheduleType: ScheduleFrequency;
  cronExpression?: string;
  webhookUrl?: string;
  prompt: string;
  workspacePath: string;
  notifyChannels: {
    desktop: boolean;
    whatsapp: boolean;
    telegram: boolean;
    email: boolean;
  };
  enabled: boolean;
  lastRunAt?: string;
  nextRunAt?: string;
  totalRuns: number;
}

export interface RoutineRun {
  id: string;
  routineId: string;
  routineName: string;
  botName: string;
  startedAt: string;
  completedAt?: string;
  status: "running" | "success" | "failed";
  logs: string[];
  outputSummary: string;
  deliverableType?: "pdf" | "deck" | "report";
  deliverableTitle?: string;
}

export interface MessagingChannel {
  id: string;
  type: "whatsapp" | "telegram" | "discord";
  name: string;
  status: "connected" | "disconnected" | "pairing";
  accountIdentifier?: string;
  autoReplyEnabled: boolean;
  allowUnattendedTools: boolean;
  allowedSenders: string[];
  pendingSenders: string[];
  pairingCode?: string;
}

export interface DeliverableTemplate {
  slug: string;
  name: string;
  type: "deck" | "pdf" | "skill";
  tagline: string;
  mood?: string;
  bestFor?: string;
  slideCount?: number;
  tags?: string[];
  contentSample?: string;
}

export interface AppSettings {
  defaultModel: string;
  approvalMode: "supervised" | "unattended";
  notifyDesktop: boolean;
  freeCreditsRemaining: number;
  freeCreditsTotal: number;
  monthlySpendLimit: number;
  theme: "dark";
}
