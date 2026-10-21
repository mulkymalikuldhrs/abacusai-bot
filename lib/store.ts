"use client";

import { useState, useEffect } from "react";
import {
  Bot,
  Connector,
  McpServer,
  Routine,
  RoutineRun,
  MessagingChannel,
  AppSettings,
  ChatMessage,
  BotMemoryItem,
} from "./types";
import {
  INITIAL_BOTS,
  INITIAL_CONNECTORS,
  INITIAL_MCP_SERVERS,
  INITIAL_ROUTINES,
  INITIAL_ROUTINE_RUNS,
  INITIAL_MESSAGING_CHANNELS,
  INITIAL_SETTINGS,
  INITIAL_CHAT_MESSAGES,
} from "./initial-data";

const STORAGE_KEYS = {
  BOTS: "abacus_bots_v1",
  CONNECTORS: "abacus_connectors_v1",
  MCP_SERVERS: "abacus_mcp_servers_v1",
  ROUTINES: "abacus_routines_v1",
  ROUTINE_RUNS: "abacus_routine_runs_v1",
  MESSAGING: "abacus_messaging_v1",
  SETTINGS: "abacus_settings_v1",
  CHATS: "abacus_chats_v1",
};

function getStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to read storage key:", key, e);
    return fallback;
  }
}

function setStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Failed to write storage key:", key, e);
  }
}

export function useAppStore() {
  const [bots, setBotsState] = useState<Bot[]>(INITIAL_BOTS);
  const [activeBotId, setActiveBotId] = useState<string>("bot-chief-of-staff");
  const [connectors, setConnectorsState] = useState<Connector[]>(INITIAL_CONNECTORS);
  const [mcpServers, setMcpServersState] = useState<McpServer[]>(INITIAL_MCP_SERVERS);
  const [routines, setRoutinesState] = useState<Routine[]>(INITIAL_ROUTINES);
  const [routineRuns, setRoutineRunsState] = useState<RoutineRun[]>(INITIAL_ROUTINE_RUNS);
  const [messagingChannels, setMessagingChannelsState] = useState<MessagingChannel[]>(INITIAL_MESSAGING_CHANNELS);
  const [settings, setSettingsState] = useState<AppSettings>(INITIAL_SETTINGS);
  const [chats, setChatsState] = useState<Record<string, ChatMessage[]>>(INITIAL_CHAT_MESSAGES);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize from LocalStorage
  useEffect(() => {
    const storedBots = getStorage(STORAGE_KEYS.BOTS, INITIAL_BOTS);
    const storedConnectors = getStorage(STORAGE_KEYS.CONNECTORS, INITIAL_CONNECTORS);
    const storedMcp = getStorage(STORAGE_KEYS.MCP_SERVERS, INITIAL_MCP_SERVERS);
    const storedRoutines = getStorage(STORAGE_KEYS.ROUTINES, INITIAL_ROUTINES);
    const storedRuns = getStorage(STORAGE_KEYS.ROUTINE_RUNS, INITIAL_ROUTINE_RUNS);
    const storedMsg = getStorage(STORAGE_KEYS.MESSAGING, INITIAL_MESSAGING_CHANNELS);
    const storedSettings = getStorage(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    const storedChats = getStorage(STORAGE_KEYS.CHATS, INITIAL_CHAT_MESSAGES);

    setBotsState(storedBots);
    setConnectorsState(storedConnectors);
    setMcpServersState(storedMcp);
    setRoutinesState(storedRoutines);
    setRoutineRunsState(storedRuns);
    setMessagingChannelsState(storedMsg);
    setSettingsState(storedSettings);
    setChatsState(storedChats);

    if (storedBots.length > 0) {
      setActiveBotId(storedBots[0].id);
    }
    setIsLoaded(true);
  }, []);

  const saveBots = (newBots: Bot[]) => {
    setBotsState(newBots);
    setStorage(STORAGE_KEYS.BOTS, newBots);
  };

  const createBot = (bot: Bot) => {
    const updated = [bot, ...bots];
    saveBots(updated);
    setActiveBotId(bot.id);
  };

  const updateBot = (botId: string, updates: Partial<Bot>) => {
    const updated = bots.map((b) =>
      b.id === botId ? { ...b, ...updates, updatedAt: new Date().toISOString() } : b
    );
    saveBots(updated);
  };

  const deleteBot = (botId: string) => {
    const updated = bots.filter((b) => b.id !== botId);
    saveBots(updated);
    if (activeBotId === botId && updated.length > 0) {
      setActiveBotId(updated[0].id);
    }
  };

  const addBotMemory = (botId: string, item: Omit<BotMemoryItem, "id" | "updatedAt">) => {
    const newItem: BotMemoryItem = {
      ...item,
      id: "mem-" + Date.now(),
      updatedAt: new Date().toISOString(),
    };
    const updated = bots.map((b) => {
      if (b.id === botId) {
        return {
          ...b,
          memory: [newItem, ...b.memory],
          updatedAt: new Date().toISOString(),
        };
      }
      return b;
    });
    saveBots(updated);
  };

  const deleteBotMemory = (botId: string, memId: string) => {
    const updated = bots.map((b) => {
      if (b.id === botId) {
        return {
          ...b,
          memory: b.memory.filter((m) => m.id !== memId),
          updatedAt: new Date().toISOString(),
        };
      }
      return b;
    });
    saveBots(updated);
  };

  const saveChats = (newChats: Record<string, ChatMessage[]>) => {
    setChatsState(newChats);
    setStorage(STORAGE_KEYS.CHATS, newChats);
  };

  const addChatMessage = (botId: string, message: ChatMessage) => {
    const current = chats[botId] || [];
    const updated = {
      ...chats,
      [botId]: [...current, message],
    };
    saveChats(updated);
  };

  const updateChatMessage = (botId: string, messageId: string, updates: Partial<ChatMessage>) => {
    const current = chats[botId] || [];
    const updatedMessages = current.map((m) => (m.id === messageId ? { ...m, ...updates } : m));
    const updated = {
      ...chats,
      [botId]: updatedMessages,
    };
    saveChats(updated);
  };

  const clearChat = (botId: string) => {
    const updated = {
      ...chats,
      [botId]: [],
    };
    saveChats(updated);
  };

  const toggleConnector = (connectorId: string) => {
    const updated = connectors.map((c) =>
      c.id === connectorId ? { ...c, isConnected: !c.isConnected } : c
    );
    setConnectorsState(updated);
    setStorage(STORAGE_KEYS.CONNECTORS, updated);
  };

  const addMcpServer = (server: McpServer) => {
    const updated = [server, ...mcpServers];
    setMcpServersState(updated);
    setStorage(STORAGE_KEYS.MCP_SERVERS, updated);
  };

  const deleteMcpServer = (serverId: string) => {
    const updated = mcpServers.filter((s) => s.id !== serverId);
    setMcpServersState(updated);
    setStorage(STORAGE_KEYS.MCP_SERVERS, updated);
  };

  const saveRoutines = (newRoutines: Routine[]) => {
    setRoutinesState(newRoutines);
    setStorage(STORAGE_KEYS.ROUTINES, newRoutines);
  };

  const createRoutine = (routine: Routine) => {
    const updated = [routine, ...routines];
    saveRoutines(updated);
  };

  const toggleRoutine = (routineId: string) => {
    const updated = routines.map((r) =>
      r.id === routineId ? { ...r, enabled: !r.enabled } : r
    );
    saveRoutines(updated);
  };

  const deleteRoutine = (routineId: string) => {
    const updated = routines.filter((r) => r.id !== routineId);
    saveRoutines(updated);
  };

  const addRoutineRun = (run: RoutineRun) => {
    const updated = [run, ...routineRuns];
    setRoutineRunsState(updated);
    setStorage(STORAGE_KEYS.ROUTINE_RUNS, updated);

    // update routine's lastRunAt & totalRuns
    const updatedRoutines = routines.map((r) => {
      if (r.id === run.routineId) {
        return {
          ...r,
          lastRunAt: run.startedAt,
          totalRuns: (r.totalRuns || 0) + 1,
        };
      }
      return r;
    });
    saveRoutines(updatedRoutines);
  };

  const updateMessagingChannel = (channelId: string, updates: Partial<MessagingChannel>) => {
    const updated = messagingChannels.map((c) =>
      c.id === channelId ? { ...c, ...updates } : c
    );
    setMessagingChannelsState(updated);
    setStorage(STORAGE_KEYS.MESSAGING, updated);
  };

  const updateSettings = (updates: Partial<AppSettings>) => {
    const updated = { ...settings, ...updates };
    setSettingsState(updated);
    setStorage(STORAGE_KEYS.SETTINGS, updated);
  };

  const activeBot = bots.find((b) => b.id === activeBotId) || bots[0];
  const activeChatMessages = (activeBot ? chats[activeBot.id] : []) || [];

  return {
    isLoaded,
    bots,
    activeBot,
    activeBotId,
    setActiveBotId,
    createBot,
    updateBot,
    deleteBot,
    addBotMemory,
    deleteBotMemory,
    chats,
    activeChatMessages,
    addChatMessage,
    updateChatMessage,
    clearChat,
    connectors,
    toggleConnector,
    mcpServers,
    addMcpServer,
    deleteMcpServer,
    routines,
    createRoutine,
    toggleRoutine,
    deleteRoutine,
    routineRuns,
    addRoutineRun,
    messagingChannels,
    updateMessagingChannel,
    settings,
    updateSettings,
  };
}
