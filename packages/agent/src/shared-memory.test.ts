import { describe, expect, it } from "vitest";
import { compactContextHistory, SessionWatchdog, SharedMemoryStore } from "./shared-memory.js";

describe("Shared Memory Store, Watchdog & Context Compaction", () => {
  it("manages codebase TODO items and decisions in shared memory store", () => {
    const memory = new SharedMemoryStore();
    const todo = memory.addTodo("Implement Android build script", "dev-agent-1");

    expect(todo.status).toBe("pending");
    expect(todo.title).toBe("Implement Android build script");

    memory.updateTodoStatus(todo.id, "completed");
    memory.recordDecision("architecture", "monorepo_pnpm");
    memory.saveLastLeftSession("session-123", "Setup Capacitor");

    const snapshot = memory.getSnapshot();
    expect(snapshot.todos[0]?.status).toBe("completed");
    expect(snapshot.decisions[0]?.value).toBe("monorepo_pnpm");
    expect(snapshot.lastLeftSession?.sessionId).toBe("session-123");
  });

  it("monitors session health via SessionWatchdog heartbeat", () => {
    const watchdog = new SessionWatchdog();
    watchdog.heartbeat("session-abc");

    expect(watchdog.isHealthy("session-abc")).toBe(true);
    expect(watchdog.isHealthy("session-xyz")).toBe(false);
  });

  it("compacts context history into summary and recent turns", () => {
    const messages = [
      { role: "user", content: "Turn 1" },
      { role: "assistant", content: "Turn 1 reply" },
      { role: "user", content: "Turn 2" },
      { role: "assistant", content: "Turn 2 reply" },
      { role: "user", content: "Turn 3" },
      { role: "assistant", content: "Turn 3 reply" }
    ];

    const compacted = compactContextHistory(messages);

    expect(compacted.length).toBe(3);
    expect(compacted[0]?.role).toBe("system");
    expect(compacted[0]?.content).toContain("Summary of 4 earlier context turns");
    expect(compacted[1]?.content).toBe("Turn 3");
    expect(compacted[2]?.content).toBe("Turn 3 reply");
  });
});
