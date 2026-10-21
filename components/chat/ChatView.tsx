"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot as BotIcon,
  User,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Terminal,
  Search,
  Folder,
  Layers,
  Sparkles,
  Trash2,
  ChevronDown,
  ChevronRight,
  Clock,
  Check,
  Brain,
  AlertTriangle,
  RotateCw,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Bot, ChatMessage, ToolStep, Connector, AppSettings } from "@/lib/types";

interface ChatViewProps {
  bots: Bot[];
  activeBot: Bot;
  onSelectBot: (botId: string) => void;
  messages: ChatMessage[];
  onSendMessage: (content: string) => Promise<void>;
  onClearChat: (botId: string) => void;
  onApproveTool: (botId: string, messageId: string, toolStepId: string) => void;
  onRejectTool: (botId: string, messageId: string, toolStepId: string) => void;
  connectors: Connector[];
  settings: AppSettings;
  isSending: boolean;
}

export function ChatView({
  bots,
  activeBot,
  onSelectBot,
  messages,
  onSendMessage,
  onClearChat,
  onApproveTool,
  onRejectTool,
  connectors,
  settings,
  isSending,
}: ChatViewProps) {
  const [inputText, setInputText] = useState("");
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;
    const text = inputText;
    setInputText("");
    await onSendMessage(text);
  };

  const toggleStep = (stepId: string) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  };

  const getToolIcon = (toolName: string) => {
    if (toolName.includes("search")) return <Search className="w-3.5 h-3.5 text-blue-400" />;
    if (toolName.includes("bash") || toolName.includes("terminal")) return <Terminal className="w-3.5 h-3.5 text-emerald-400" />;
    if (toolName.includes("file") || toolName.includes("drive")) return <Folder className="w-3.5 h-3.5 text-amber-400" />;
    if (toolName.includes("gmail") || toolName.includes("slack")) return <Layers className="w-3.5 h-3.5 text-purple-400" />;
    return <Sparkles className="w-3.5 h-3.5 text-indigo-400" />;
  };

  const promptSuggestions = [
    "Summarize my calendar and top priorities for today",
    "Scan open GitHub PRs and verify security diffs",
    "Check Gmail inbox for unread messages from VIP senders",
    "Run terminal check on workspace git status",
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#090d16] overflow-hidden">
      {/* Top Bot Selection Bar */}
      <div className="h-14 border-b border-slate-800 bg-[#0d131f] px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={activeBot.id}
              onChange={(e) => onSelectBot(e.target.value)}
              className="appearance-none bg-slate-900 border border-slate-800 text-slate-100 font-semibold text-sm rounded-lg pl-9 pr-8 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              {bots.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.model})
                </option>
              ))}
            </select>
            <div
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full"
              style={{ backgroundColor: activeBot.avatarColor }}
            />
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <span className="hidden sm:inline-block text-xs text-slate-400 truncate max-w-xs">
            {activeBot.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Active Tool Indicators */}
          <div className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
            <span className="text-slate-500 font-medium">Tools:</span>
            <span className="text-indigo-400 font-mono">
              {Object.values(activeBot.tools).filter(Boolean).length}/6
            </span>
          </div>

          <button
            onClick={() => {
              if (confirm("Clear transcript for this bot?")) {
                onClearChat(activeBot.id);
              }
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs text-slate-400 hover:text-red-400 hover:bg-slate-800/80 transition"
            title="Clear Chat"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 max-w-md mx-auto">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-4"
              style={{ backgroundColor: activeBot.avatarColor }}
            >
              {activeBot.name.charAt(0)}
            </div>
            <h3 className="text-lg font-bold text-white mb-1">{activeBot.name}</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              {activeBot.description}
            </p>

            <div className="w-full space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block text-left">
                Try asking:
              </span>
              {promptSuggestions.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendMessage(prompt)}
                  className="w-full text-left p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/60 text-xs text-slate-300 transition flex items-center justify-between group"
                >
                  <span className="truncate">{prompt}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-400 shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${
                msg.role === "user" ? "ml-auto justify-end" : "mr-auto justify-start"
              }`}
            >
              {msg.role !== "user" && (
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5 shadow-md"
                  style={{ backgroundColor: activeBot.avatarColor }}
                >
                  {activeBot.name.charAt(0)}
                </div>
              )}

              <div
                className={`flex flex-col space-y-2 max-w-[85%] md:max-w-[78%] ${
                  msg.role === "user" ? "items-end" : "items-start"
                }`}
              >
                {/* Channel / Sender Notice */}
                {msg.channel && msg.channel !== "desktop" && (
                  <div className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 flex items-center gap-1">
                    <span>via {msg.channel}</span>
                    {msg.senderName && <span>· {msg.senderName}</span>}
                  </div>
                )}

                {/* Tool Execution Steps Visualization */}
                {msg.toolSteps && msg.toolSteps.length > 0 && (
                  <div className="w-full space-y-1.5 my-1">
                    {msg.toolSteps.map((step) => {
                      const isExpanded = !!expandedSteps[step.id];
                      return (
                        <div
                          key={step.id}
                          className="rounded-lg border border-slate-800/90 bg-[#0e1422] overflow-hidden text-xs"
                        >
                          <button
                            type="button"
                            onClick={() => toggleStep(step.id)}
                            className="w-full px-3 py-2 flex items-center justify-between text-left hover:bg-slate-800/40 transition"
                          >
                            <div className="flex items-center gap-2">
                              {getToolIcon(step.toolName)}
                              <span className="font-semibold text-slate-200">
                                {step.displayName}
                              </span>
                              {step.durationMs ? (
                                <span className="text-[10px] text-slate-500 font-mono">
                                  {step.durationMs}ms
                                </span>
                              ) : null}
                            </div>

                            <div className="flex items-center gap-2">
                              {step.status === "completed" && (
                                <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Completed</span>
                                </span>
                              )}
                              {step.status === "waiting_approval" && (
                                <span className="flex items-center gap-1 text-[10px] text-amber-400 font-medium animate-pulse">
                                  <ShieldAlert className="w-3.5 h-3.5" />
                                  <span>Approval Required</span>
                                </span>
                              )}
                              {step.status === "rejected" && (
                                <span className="flex items-center gap-1 text-[10px] text-red-400 font-medium">
                                  <XCircle className="w-3.5 h-3.5" />
                                  <span>Rejected</span>
                                </span>
                              )}
                              {isExpanded ? (
                                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                              ) : (
                                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                              )}
                            </div>
                          </button>

                          {/* Expandable Step Details */}
                          {isExpanded && (
                            <div className="p-3 bg-slate-950/80 border-t border-slate-800/80 space-y-2 font-mono text-[11px]">
                              <div>
                                <span className="text-slate-500 block mb-0.5">Input Arguments:</span>
                                <pre className="p-2 rounded bg-slate-900 text-indigo-300 overflow-x-auto whitespace-pre-wrap">
                                  {JSON.stringify(step.inputArgs, null, 2)}
                                </pre>
                              </div>

                              {step.outputResult && (
                                <div>
                                  <span className="text-slate-500 block mb-0.5">Execution Result:</span>
                                  <pre className="p-2 rounded bg-slate-900 text-slate-300 overflow-x-auto whitespace-pre-wrap">
                                    {step.outputResult}
                                  </pre>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Supervised Approval Banner */}
                {msg.needsApproval && msg.toolSteps && msg.toolSteps.some((s) => s.status === "waiting_approval") && (
                  <div className="w-full p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/60 space-y-3">
                    <div className="flex items-start gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-amber-200">
                          Supervised Execution Approval
                        </h4>
                        <p className="text-[11px] text-amber-300/80 mt-0.5 leading-relaxed">
                          The agent requested to invoke a privileged tool call. Review details before granting permission:
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => {
                          const step = msg.toolSteps?.find((s) => s.status === "waiting_approval");
                          if (step) onRejectTool(activeBot.id, msg.id, step.id);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => {
                          const step = msg.toolSteps?.find((s) => s.status === "waiting_approval");
                          if (step) onApproveTool(activeBot.id, msg.id, step.id);
                        }}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow transition"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Authorize Action</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                    msg.role === "user"
                      ? "bg-indigo-600 text-white rounded-br-sm"
                      : "bg-[#0e1422] border border-slate-800 text-slate-100 rounded-bl-sm"
                  }`}
                >
                  <div className="prose prose-invert prose-xs max-w-none break-words">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>

                {/* Timestamp & Model Tag */}
                <div className="flex items-center gap-2 text-[10px] text-slate-500 px-1">
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  {msg.modelUsed && (
                    <>
                      <span>·</span>
                      <span className="font-mono text-indigo-400">{msg.modelUsed}</span>
                    </>
                  )}
                </div>
              </div>

              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 text-xs shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))
        )}

        {isSending && (
          <div className="flex gap-3 mr-auto items-center">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-md"
              style={{ backgroundColor: activeBot.avatarColor }}
            >
              {activeBot.name.charAt(0)}
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-[#0e1422] border border-slate-800 text-slate-400 text-xs flex items-center gap-2">
              <RotateCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
              <span>{activeBot.name} is reasoning & executing tools...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 md:p-4 border-t border-slate-800 bg-[#0d131f] shrink-0">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isSending}
            placeholder={`Message ${activeBot.name} (e.g. "Review today's agenda", "Search latest AI papers")...`}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isSending}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-medium text-sm transition flex items-center justify-center shadow-md shadow-indigo-600/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 px-1">
          <span className="truncate">
            Target: <strong className="text-slate-400">{activeBot.name}</strong> · Workspace:{" "}
            <code className="text-slate-400 font-mono text-[10px]">{activeBot.workspacePath}</code>
          </span>
          <span className="hidden sm:inline">Press Enter to send</span>
        </div>
      </div>
    </div>
  );
}
