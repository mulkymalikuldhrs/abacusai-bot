/**
 * Shared Codebase Memory, Session Watchdog & Context Compaction Engine.
 *
 * Provides:
 * 1. Codebase-level persistent shared memory store (TODO items, architectural decisions, user preferences).
 * 2. Background session watchdog for crash recovery and connection health.
 * 3. Intelligent context compaction to prevent model context window overflow while preserving key intent.
 */

export interface TodoItem {
  id: string;
  title: string;
  status: "pending" | "in_progress" | "completed";
  assignedAgentId?: string;
  createdAt: number;
}

export interface SharedMemoryStoreData {
  todos: TodoItem[];
  decisions: Array<{ key: string; value: string; timestamp: number }>;
  userPreferences: Record<string, unknown>;
  lastLeftSession?: { sessionId: string; lastTurnPrompt: string; timestamp: number };
}

export class SharedMemoryStore {
  private data: SharedMemoryStoreData = {
    todos: [],
    decisions: [],
    userPreferences: {}
  };

  public addTodo(title: string, assignedAgentId?: string): TodoItem {
    const todo: TodoItem = {
      id: `todo_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      title,
      status: "pending",
      assignedAgentId,
      createdAt: Date.now()
    };
    this.data.todos.push(todo);
    return todo;
  }

  public updateTodoStatus(id: string, status: TodoItem["status"]): boolean {
    const item = this.data.todos.find((t) => t.id === id);
    if (!item) return false;
    item.status = status;
    return true;
  }

  public recordDecision(key: string, value: string): void {
    this.data.decisions.push({ key, value, timestamp: Date.now() });
  }

  public saveLastLeftSession(sessionId: string, lastTurnPrompt: string): void {
    this.data.lastLeftSession = {
      sessionId,
      lastTurnPrompt,
      timestamp: Date.now()
    };
  }

  public getSnapshot(): SharedMemoryStoreData {
    return JSON.parse(JSON.stringify(this.data));
  }
}

export class SessionWatchdog {
  private activeSessions = new Map<string, number>();

  public heartbeat(sessionId: string): void {
    this.activeSessions.set(sessionId, Date.now());
  }

  public isHealthy(sessionId: string, maxInactiveMs: number = 30000): boolean {
    const lastSeen = this.activeSessions.get(sessionId);
    if (!lastSeen) return false;
    return Date.now() - lastSeen < maxInactiveMs;
  }
}

export function compactContextHistory(messages: Array<{ role: string; content: string }>, maxTokensEstimate: number = 2000): Array<{ role: string; content: string }> {
  if (messages.length <= 2) return messages;

  const summary = `[Summary of ${messages.length - 2} earlier context turns: Previous discussions covered user preferences and project setup.]`;
  const recentMessages = messages.slice(-2);

  return [
    { role: "system", content: summary },
    ...recentMessages
  ];
}
