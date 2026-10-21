"use client";

import React, { useState } from "react";
import {
  Bot as BotIcon,
  Plus,
  MessageSquare,
  Settings2,
  Trash2,
  Sparkles,
  Search,
  Terminal,
  Folder,
  Send,
  Brain,
  Layers,
  Clock,
  Check,
  X,
  ExternalLink,
  Shield,
  Briefcase,
  Compass,
  Code,
  Sun,
} from "lucide-react";
import { Bot, AvatarShape, BotMemoryItem } from "@/lib/types";

interface BotsViewProps {
  bots: Bot[];
  onSelectBotForChat: (botId: string) => void;
  onCreateBot: (bot: Bot) => void;
  onUpdateBot: (botId: string, updates: Partial<Bot>) => void;
  onDeleteBot: (botId: string) => void;
  onAddMemory: (botId: string, item: Omit<BotMemoryItem, "id" | "updatedAt">) => void;
  onDeleteMemory: (botId: string, memId: string) => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
}

const TEMPLATES: Array<{
  name: string;
  title: string;
  description: string;
  persona: string;
  avatarColor: string;
  avatarShape: AvatarShape;
  model: string;
}> = [
  {
    name: "Chief of Staff",
    title: "Executive Personal Assistant & Task Orchestrator",
    description: "Synthesizes priorities, manages inbox escalations, prepares briefings.",
    persona: "You are an exceptional Chief of Staff. You are concise, hyper-organized, and proactive. Prioritize ruthlessly and extract clear next steps.",
    avatarColor: "#6366f1",
    avatarShape: "squircle",
    model: "gemini-2.5-flash",
  },
  {
    name: "WhatsApp Assistant",
    title: "Mobile Messenger Dispatcher",
    description: "Optimized for short chats, voice memos, and mobile task replies.",
    persona: "You are a mobile-first personal bot running on WhatsApp. Keep answers concise, formatted cleanly for phone screens.",
    avatarColor: "#10b981",
    avatarShape: "circle",
    model: "gemini-2.5-flash",
  },
  {
    name: "Research Scout",
    title: "Deep Technical & Market Intelligence",
    description: "Surveys the web, crawls papers, and extracts primary citations.",
    persona: "You are an elite research analyst. Corroborate claims across sources, structure tables for comparison, and cite primary URLs.",
    avatarColor: "#0284c7",
    avatarShape: "hexagon",
    model: "gemini-2.5-flash",
  },
  {
    name: "Code Reviewer",
    title: "Security, Performance & Static Analysis",
    description: "Inspects pull requests, analyzes diffs, and flags regressions.",
    persona: "You are a principal engineer and code reviewer. Be specific, suggest exact diff replacements, and enforce security boundaries.",
    avatarColor: "#8b5cf6",
    avatarShape: "square",
    model: "gemini-2.5-flash",
  },
  {
    name: "Morning Briefing",
    title: "Daily Digest & Calendar Harmonizer",
    description: "Runs every morning at 7:00 AM, pulling meetings and VIP messages.",
    persona: "You prepare the ultimate morning executive briefing. Keep it energetic, clear, and highlight the single most important objective.",
    avatarColor: "#f59e0b",
    avatarShape: "squircle",
    model: "gemini-2.5-flash",
  },
];

const COLORS = ["#6366f1", "#10b981", "#0284c7", "#8b5cf6", "#f59e0b", "#ec4899", "#ef4444", "#14b8a6"];
const SHAPES: AvatarShape[] = ["circle", "squircle", "square", "hexagon"];

export function BotsView({
  bots,
  onSelectBotForChat,
  onCreateBot,
  onUpdateBot,
  onDeleteBot,
  onAddMemory,
  onDeleteMemory,
  isCreateModalOpen,
  setIsCreateModalOpen,
}: BotsViewProps) {
  const [editingBot, setEditingBot] = useState<Bot | null>(null);
  const [activeTabInEdit, setActiveTabInEdit] = useState<"general" | "persona" | "tools" | "memory">("general");

  // Memory form state
  const [newMemoryCategory, setNewMemoryCategory] = useState<"rule" | "preference" | "fact" | "contact">("rule");
  const [newMemoryContent, setNewMemoryContent] = useState("");

  // Create form state
  const [newBotName, setNewBotName] = useState("");
  const [newBotTitle, setNewBotTitle] = useState("");
  const [newBotDescription, setNewBotDescription] = useState("");
  const [newBotPersona, setNewBotPersona] = useState("");
  const [newBotColor, setNewBotColor] = useState(COLORS[0]);
  const [newBotShape, setNewBotShape] = useState<AvatarShape>("squircle");
  const [newBotModel, setNewBotModel] = useState("gemini-2.5-flash");

  const handleApplyTemplate = (tpl: typeof TEMPLATES[0]) => {
    setNewBotName(tpl.name);
    setNewBotTitle(tpl.title);
    setNewBotDescription(tpl.description);
    setNewBotPersona(tpl.persona);
    setNewBotColor(tpl.avatarColor);
    setNewBotShape(tpl.avatarShape);
    setNewBotModel(tpl.model);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBotName.trim()) return;

    const newBot: Bot = {
      id: "bot-" + Date.now(),
      name: newBotName.trim(),
      title: newBotTitle.trim() || "Autonomous Personal Agent",
      description: newBotDescription.trim() || "Standing agent with dedicated tools and memory.",
      persona: newBotPersona.trim() || "You are an autonomous AI agent assisting your user.",
      avatarColor: newBotColor,
      avatarShape: newBotShape,
      avatarIcon: "Bot",
      model: newBotModel,
      workspacePath: `~/.abacusai-bot/workspaces/${newBotName.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
      tools: {
        webSearch: true,
        bashCommands: true,
        fileOperations: true,
        messaging: true,
        memory: true,
        connectors: true,
      },
      memory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onCreateBot(newBot);
    setIsCreateModalOpen(false);
    resetNewForm();
  };

  const resetNewForm = () => {
    setNewBotName("");
    setNewBotTitle("");
    setNewBotDescription("");
    setNewBotPersona("");
    setNewBotColor(COLORS[0]);
    setNewBotShape("squircle");
  };

  const getShapeClasses = (shape: AvatarShape) => {
    switch (shape) {
      case "circle":
        return "rounded-full";
      case "square":
        return "rounded-md";
      case "hexagon":
        return "rounded-xl rotate-45";
      case "squircle":
      default:
        return "rounded-2xl";
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#090d16] p-4 md:p-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <span>Personal Bots</span>
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {bots.length} active
            </span>
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Standing autonomous agents with dedicated memory, tool access, and remote messaging lanes.
          </p>
        </div>

        <button
          onClick={() => {
            resetNewForm();
            setIsCreateModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/20 transition self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Bot</span>
        </button>
      </div>

      {/* Bot Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bots.map((bot) => (
          <div
            key={bot.id}
            className="group relative bg-[#0e1422] border border-slate-800/80 hover:border-indigo-500/50 rounded-xl p-5 flex flex-col justify-between transition-all shadow-sm hover:shadow-indigo-950/30"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 flex items-center justify-center text-white shadow-md font-bold text-lg ${getShapeClasses(
                      bot.avatarShape
                    )}`}
                    style={{ backgroundColor: bot.avatarColor }}
                  >
                    {bot.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-100 text-base group-hover:text-indigo-400 transition">
                      {bot.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-1">{bot.title}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingBot(bot)}
                    className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition"
                    title="Configure bot"
                  >
                    <Settings2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete bot "${bot.name}"?`)) {
                        onDeleteBot(bot.id);
                      }
                    }}
                    className="p-1.5 rounded-md text-slate-500 hover:text-red-400 hover:bg-slate-800 transition"
                    title="Delete bot"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                {bot.description}
              </p>

              {/* Bot Meta Badges */}
              <div className="flex flex-wrap items-center gap-1.5 mb-4">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-indigo-300">
                  {bot.model}
                </span>

                {bot.scheduledCheckIn && (
                  <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-800/40 text-emerald-400">
                    <Clock className="w-3 h-3" />
                    <span>{bot.scheduledCheckIn}</span>
                  </span>
                )}

                <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                  <Brain className="w-3 h-3 text-amber-400" />
                  <span>{bot.memory?.length || 0} facts</span>
                </span>
              </div>

              {/* Enabled Tools Row */}
              <div className="pt-3 border-t border-slate-800/60 flex items-center gap-2 text-slate-400 text-xs">
                <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                  Tools:
                </span>
                <div className="flex items-center gap-1.5">
                  {bot.tools.webSearch && (
                    <span title="Web Search" className="p-1 rounded bg-slate-800/80 text-blue-400">
                      <Search className="w-3 h-3" />
                    </span>
                  )}
                  {bot.tools.bashCommands && (
                    <span title="Terminal Commands" className="p-1 rounded bg-slate-800/80 text-emerald-400">
                      <Terminal className="w-3 h-3" />
                    </span>
                  )}
                  {bot.tools.fileOperations && (
                    <span title="Workspace Files" className="p-1 rounded bg-slate-800/80 text-amber-400">
                      <Folder className="w-3 h-3" />
                    </span>
                  )}
                  {bot.tools.messaging && (
                    <span title="Mobile Messaging" className="p-1 rounded bg-slate-800/80 text-green-400">
                      <Send className="w-3 h-3" />
                    </span>
                  )}
                  {bot.tools.connectors && (
                    <span title="External Connectors" className="p-1 rounded bg-slate-800/80 text-indigo-400">
                      <Layers className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-3 flex items-center justify-between border-t border-slate-800/60">
              <span className="text-[11px] text-slate-500 truncate max-w-[140px]">
                {bot.workspacePath.replace("~/.abacusai-bot/", "")}
              </span>

              <button
                onClick={() => onSelectBotForChat(bot.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-semibold border border-indigo-500/30 transition"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Open Chat</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE NEW BOT MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0e1422] border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h2 className="text-lg font-bold text-white">Create New Personal Bot</h2>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Template Quick Picks */}
            <div className="mt-4 mb-5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 block">
                Quick Start from Template
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.name}
                    type="button"
                    onClick={() => handleApplyTemplate(tpl)}
                    className="p-2.5 rounded-lg border border-slate-800 hover:border-indigo-500 bg-slate-900/50 hover:bg-slate-900 text-left transition flex flex-col gap-1"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: tpl.avatarColor }}
                      />
                      <span className="text-xs font-semibold text-slate-200 truncate">
                        {tpl.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 line-clamp-1">
                      {tpl.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Bot Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newBotName}
                    onChange={(e) => setNewBotName(e.target.value)}
                    placeholder="e.g. Chief of Staff"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Role / Title
                  </label>
                  <input
                    type="text"
                    value={newBotTitle}
                    onChange={(e) => setNewBotTitle(e.target.value)}
                    placeholder="e.g. Executive Task Assistant"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={newBotDescription}
                  onChange={(e) => setNewBotDescription(e.target.value)}
                  placeholder="Summary of what this bot handles"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Persona & Core Instructions
                </label>
                <textarea
                  rows={4}
                  value={newBotPersona}
                  onChange={(e) => setNewBotPersona(e.target.value)}
                  placeholder="Define mission, tone, constraints, and standard operating procedures..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono text-xs"
                />
              </div>

              {/* Avatar Appearance & Model */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1.5">
                    Avatar Color
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setNewBotColor(c)}
                        className={`w-6 h-6 rounded-full border-2 transition ${
                          newBotColor === c ? "border-white scale-110" : "border-transparent"
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1.5">
                    Avatar Shape
                  </label>
                  <div className="flex gap-1.5">
                    {SHAPES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setNewBotShape(s)}
                        className={`px-2 py-1 text-xs rounded border capitalize transition ${
                          newBotShape === s
                            ? "bg-indigo-600/30 border-indigo-500 text-indigo-300 font-semibold"
                            : "bg-slate-900 border-slate-800 text-slate-400"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1.5">
                    Model
                  </label>
                  <select
                    value={newBotModel}
                    onChange={(e) => setNewBotModel(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                    <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
                    <option value="routellm-open">RouteLLM - Open (Free pool)</option>
                    <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
                    <option value="gpt-4o">GPT-4o</option>
                  </select>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition"
                >
                  Save & Launch Bot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT / BOT STUDIO MODAL */}
      {editingBot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0e1422] border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 flex items-center justify-center text-white font-bold text-base ${getShapeClasses(
                    editingBot.avatarShape
                  )}`}
                  style={{ backgroundColor: editingBot.avatarColor }}
                >
                  {editingBot.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Configure: {editingBot.name}</span>
                  </h2>
                  <p className="text-xs text-slate-400">{editingBot.title}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingBot(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs in Drawer */}
            <div className="flex items-center gap-2 py-3 border-b border-slate-800/80 text-xs">
              {(["general", "persona", "tools", "memory"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTabInEdit(tab)}
                  className={`px-3 py-1.5 rounded-md font-medium capitalize transition ${
                    activeTabInEdit === tab
                      ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {activeTabInEdit === "general" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={editingBot.name}
                      onChange={(e) =>
                        setEditingBot({ ...editingBot, name: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Role / Title
                    </label>
                    <input
                      type="text"
                      value={editingBot.title}
                      onChange={(e) =>
                        setEditingBot({ ...editingBot, title: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={editingBot.description}
                      onChange={(e) =>
                        setEditingBot({ ...editingBot, description: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Workspace Path
                    </label>
                    <input
                      type="text"
                      value={editingBot.workspacePath}
                      onChange={(e) =>
                        setEditingBot({ ...editingBot, workspacePath: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-300 font-mono text-xs"
                    />
                  </div>
                </div>
              )}

              {activeTabInEdit === "persona" && (
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1.5">
                    Persona & System Prompt
                  </label>
                  <textarea
                    rows={8}
                    value={editingBot.persona}
                    onChange={(e) =>
                      setEditingBot({ ...editingBot, persona: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}

              {activeTabInEdit === "tools" && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-400">
                    Enable or disable tools this bot is authorized to invoke autonomously:
                  </p>
                  {(
                    [
                      { key: "webSearch", label: "Web Search & Extraction", icon: Search },
                      { key: "bashCommands", label: "Terminal Command Execution", icon: Terminal },
                      { key: "fileOperations", label: "Workspace File I/O", icon: Folder },
                      { key: "messaging", label: "Remote Messaging (WhatsApp/Telegram)", icon: Send },
                      { key: "memory", label: "Bot Memory Persistence", icon: Brain },
                      { key: "connectors", label: "External Connectors (Gmail, Drive, etc.)", icon: Layers },
                    ] as const
                  ).map((tool) => {
                    const Icon = tool.icon;
                    const isChecked = editingBot.tools[tool.key];

                    return (
                      <label
                        key={tool.key}
                        className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4 text-indigo-400" />
                          <span className="text-xs font-medium text-slate-200">
                            {tool.label}
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) =>
                            setEditingBot({
                              ...editingBot,
                              tools: {
                                ...editingBot.tools,
                                [tool.key]: e.target.checked,
                              },
                            })
                          }
                          className="w-4 h-4 rounded text-indigo-600 focus:ring-0 bg-slate-800 border-slate-700"
                        />
                      </label>
                    );
                  })}
                </div>
              )}

              {activeTabInEdit === "memory" && (
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800 space-y-2">
                    <span className="text-xs font-semibold text-slate-200 block">
                      Add New Memory Item
                    </span>
                    <div className="flex gap-2">
                      <select
                        value={newMemoryCategory}
                        onChange={(e: any) => setNewMemoryCategory(e.target.value)}
                        className="px-2 py-1.5 rounded bg-slate-800 border border-slate-700 text-xs text-slate-300"
                      >
                        <option value="rule">Rule</option>
                        <option value="preference">Preference</option>
                        <option value="fact">Fact</option>
                        <option value="contact">Contact</option>
                      </select>
                      <input
                        type="text"
                        value={newMemoryContent}
                        onChange={(e) => setNewMemoryContent(e.target.value)}
                        placeholder="e.g. Always format deliverables in Slate PDF"
                        className="flex-1 px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-xs text-white"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!newMemoryContent.trim()) return;
                          onAddMemory(editingBot.id, {
                            category: newMemoryCategory,
                            content: newMemoryContent.trim(),
                          });
                          setNewMemoryContent("");
                          // update local editingBot state
                          setEditingBot({
                            ...editingBot,
                            memory: [
                              {
                                id: "mem-" + Date.now(),
                                category: newMemoryCategory,
                                content: newMemoryContent.trim(),
                                updatedAt: new Date().toISOString(),
                              },
                              ...editingBot.memory,
                            ],
                          });
                        }}
                        className="px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {editingBot.memory.length === 0 ? (
                      <p className="text-xs text-slate-500 italic py-2 text-center">
                        No memory items recorded for this bot yet.
                      </p>
                    ) : (
                      editingBot.memory.map((mem) => (
                        <div
                          key={mem.id}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/80 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-bold">
                              {mem.category}
                            </span>
                            <span className="text-slate-300">{mem.content}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              onDeleteMemory(editingBot.id, mem.id);
                              setEditingBot({
                                ...editingBot,
                                memory: editingBot.memory.filter((m) => m.id !== mem.id),
                              });
                            }}
                            className="text-slate-500 hover:text-red-400 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingBot(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  onUpdateBot(editingBot.id, editingBot);
                  setEditingBot(null);
                }}
                className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
