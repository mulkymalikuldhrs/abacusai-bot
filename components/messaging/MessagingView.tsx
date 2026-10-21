"use client";

import React, { useState } from "react";
import {
  Smartphone,
  QrCode,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Check,
  X,
  Send,
  MessageSquare,
  RefreshCw,
  Plus,
  UserCheck,
  UserX,
  AlertCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import { MessagingChannel, Bot } from "@/lib/types";

interface MessagingViewProps {
  channels: MessagingChannel[];
  onUpdateChannel: (channelId: string, updates: Partial<MessagingChannel>) => void;
  bots: Bot[];
  onSimulateInbound: (channelId: string, sender: string, message: string) => Promise<void>;
}

export function MessagingView({
  channels,
  onUpdateChannel,
  bots,
  onSimulateInbound,
}: MessagingViewProps) {
  const [selectedChannelId, setSelectedChannelId] = useState("msg-whatsapp");
  const [newAllowedSender, setNewAllowedSender] = useState("");
  const [simSender, setSimSender] = useState("+1 (555) 349-8821 (Self)");
  const [simMessage, setSimMessage] = useState("What are my top 3 priorities for today?");
  const [simStatus, setSimStatus] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const activeChannel = channels.find((c) => c.id === selectedChannelId) || channels[0];

  const handleSimulateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!simMessage.trim() || isSimulating) return;

    setIsSimulating(true);
    setSimStatus("Dispatching message through mobile gateway bridge...");

    try {
      await onSimulateInbound(activeChannel.id, simSender, simMessage.trim());
      setSimStatus("Message delivered! Bot responded via mobile channel.");
      setSimMessage("");
    } catch (err: any) {
      setSimStatus("Error dispatching simulated message.");
    } finally {
      setIsSimulating(false);
    }
  };

  const handleApprovePending = (sender: string) => {
    onUpdateChannel(activeChannel.id, {
      allowedSenders: [...activeChannel.allowedSenders, sender],
      pendingSenders: activeChannel.pendingSenders.filter((s) => s !== sender),
    });
  };

  const handleDenyPending = (sender: string) => {
    onUpdateChannel(activeChannel.id, {
      pendingSenders: activeChannel.pendingSenders.filter((s) => s !== sender),
    });
  };

  const handleAddSender = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAllowedSender.trim()) return;
    onUpdateChannel(activeChannel.id, {
      allowedSenders: [...activeChannel.allowedSenders, newAllowedSender.trim()],
    });
    setNewAllowedSender("");
  };

  const handleRemoveSender = (sender: string) => {
    onUpdateChannel(activeChannel.id, {
      allowedSenders: activeChannel.allowedSenders.filter((s) => s !== sender),
    });
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#090d16] p-4 md:p-6 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Smartphone className="w-6 h-6 text-emerald-400" />
            <span>Remote Messaging Channels</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Connect WhatsApp, Telegram, or Discord to talk with your bots anywhere, with strict sender allowlists and safety gates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Master Inbound:</span>
          <button
            onClick={() =>
              onUpdateChannel(activeChannel.id, {
                autoReplyEnabled: !activeChannel.autoReplyEnabled,
              })
            }
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition flex items-center gap-1.5 ${
              activeChannel.autoReplyEnabled
                ? "bg-emerald-950/60 border-emerald-700 text-emerald-300"
                : "bg-slate-900 border-slate-800 text-slate-400"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                activeChannel.autoReplyEnabled ? "bg-emerald-400" : "bg-slate-500"
              }`}
            />
            <span>{activeChannel.autoReplyEnabled ? "Auto-Reply ON" : "Paused"}</span>
          </button>
        </div>
      </div>

      {/* Channel Switcher Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {channels.map((chan) => {
          const isSelected = chan.id === selectedChannelId;
          const isConnected = chan.status === "connected";

          return (
            <button
              key={chan.id}
              onClick={() => setSelectedChannelId(chan.id)}
              className={`p-4 rounded-xl border text-left transition flex flex-col justify-between ${
                isSelected
                  ? "bg-[#0f172a] border-indigo-500 shadow-md shadow-indigo-500/10"
                  : "bg-[#0e1422] border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-white text-sm">{chan.name}</span>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase ${
                    isConnected
                      ? "bg-emerald-950 border border-emerald-800 text-emerald-400"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {chan.status}
                </span>
              </div>

              <div className="text-xs text-slate-400 font-mono truncate">
                {chan.accountIdentifier || "Not linked"}
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/60">
                <span>{chan.allowedSenders.length} allowed senders</span>
                {chan.autoReplyEnabled ? (
                  <span className="text-emerald-400">Replies active</span>
                ) : (
                  <span className="text-slate-500">Muted</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Channel Connection & QR Details */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-[#0e1422] border border-slate-800 space-y-4">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2">
              <QrCode className="w-4 h-4 text-indigo-400" />
              <span>Device Pairing: {activeChannel.name}</span>
            </h3>

            {activeChannel.type === "whatsapp" && (
              <div className="space-y-4">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col items-center justify-center text-center">
                  {/* Simulated QR Code Canvas */}
                  <div className="w-44 h-44 bg-white p-3 rounded-xl shadow-lg flex flex-col justify-between items-center relative group">
                    <div className="grid grid-cols-6 grid-rows-6 gap-1 w-full h-full">
                      {Array.from({ length: 36 }).map((_, i) => (
                        <div
                          key={i}
                          className={`rounded-sm ${
                            i % 2 === 0 || i % 7 === 0 ? "bg-slate-900" : "bg-transparent"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl opacity-0 group-hover:opacity-100 transition text-white text-xs font-semibold p-2">
                      Scan with WhatsApp: Settings &gt; Linked Devices
                    </span>
                  </div>

                  <div className="mt-3">
                    <span className="text-xs text-slate-400 block mb-1">
                      Or use 8-character pairing code:
                    </span>
                    <span className="text-sm font-mono font-bold tracking-widest text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-3 py-1 rounded">
                      {activeChannel.pairingCode || "7B4K-9Q2M"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-400">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-slate-200">1.</span>
                    <span>Open WhatsApp on your phone</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-slate-200">2.</span>
                    <span>Tap Menu / Settings &gt; <strong>Linked Devices</strong></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-slate-200">3.</span>
                    <span>Point your camera at this screen or enter the code above</span>
                  </div>
                </div>
              </div>
            )}

            {activeChannel.type === "telegram" && (
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Shared Bot Handle:</span>
                  <span className="font-mono font-bold text-indigo-400">@AbacusPersonal_bot</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Start a private conversation with @AbacusPersonal_bot on Telegram. The bot will authenticate your user ID against the allowlist below before answering.
                </p>
                <div className="p-2.5 rounded bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 font-mono text-[11px]">
                  Webhook status: Active · Latency: 48ms
                </div>
              </div>
            )}

            {activeChannel.type === "discord" && (
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
                <p className="text-slate-400">
                  Invite your Abacus Discord Bot into a private guild or DM lane.
                </p>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateChannel(activeChannel.id, {
                      status: activeChannel.status === "connected" ? "disconnected" : "connected",
                    })
                  }
                  className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium"
                >
                  {activeChannel.status === "connected" ? "Disconnect Guild" : "Link Discord Gateway"}
                </button>
              </div>
            )}

            {/* Safety & Tool Controls */}
            <div className="pt-3 border-t border-slate-800 space-y-3">
              <label className="flex items-center justify-between text-xs cursor-pointer">
                <span className="text-slate-300">Allow Unattended Tools for Remote Chats</span>
                <input
                  type="checkbox"
                  checked={activeChannel.allowUnattendedTools}
                  onChange={(e) =>
                    onUpdateChannel(activeChannel.id, {
                      allowUnattendedTools: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-0 bg-slate-900 border-slate-700"
                />
              </label>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                When enabled, incoming approved mobile messages can trigger tool executions (web searches, files, calendar) without needing desktop confirmation.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Senders Allowlist & Remote Simulator */}
        <div className="lg:col-span-7 space-y-6">
          {/* Sender Whitelist Manager */}
          <div className="p-5 rounded-2xl bg-[#0e1422] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Sender Access Control (Allowlist)</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {activeChannel.allowedSenders.length} permitted
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Only authorized contacts can trigger responses or tool calls. Unknown incoming numbers are held for approval.
            </p>

            {/* Pending Senders */}
            {activeChannel.pendingSenders && activeChannel.pendingSenders.length > 0 && (
              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/50 space-y-2">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Pending Inbound Requests</span>
                </span>
                {activeChannel.pendingSenders.map((sender) => (
                  <div
                    key={sender}
                    className="flex items-center justify-between text-xs py-1"
                  >
                    <span className="font-mono text-slate-200">{sender}</span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleApprovePending(sender)}
                        className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold flex items-center gap-1"
                      >
                        <UserCheck className="w-3 h-3" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleDenyPending(sender)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1"
                      >
                        <UserX className="w-3 h-3" />
                        <span>Deny</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Allowed Senders List */}
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
                Approved Senders
              </span>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {activeChannel.allowedSenders.map((sender) => (
                  <div
                    key={sender}
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs"
                  >
                    <span className="font-mono text-slate-200">{sender}</span>
                    <button
                      onClick={() => handleRemoveSender(sender)}
                      className="text-slate-500 hover:text-red-400 p-1"
                      title="Revoke access"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Sender Form */}
              <form onSubmit={handleAddSender} className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={newAllowedSender}
                  onChange={(e) => setNewAllowedSender(e.target.value)}
                  placeholder="e.g. +1 (555) 782-9900 or @telegram_handle"
                  className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </form>
            </div>
          </div>

          {/* Interactive Mobile Inbound Simulator */}
          <div className="p-5 rounded-2xl bg-[#0e1422] border border-slate-800 space-y-4">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              <span>Simulate Inbound Mobile Message</span>
            </h3>

            <p className="text-xs text-slate-400">
              Test how the bot processes messages received over WhatsApp or Telegram, invokes autonomous tools, and sends responses.
            </p>

            <form onSubmit={handleSimulateSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Sender Identity
                </label>
                <select
                  value={simSender}
                  onChange={(e) => setSimSender(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none"
                >
                  {activeChannel.allowedSenders.map((s) => (
                    <option key={s} value={s}>
                      {s} (Approved)
                    </option>
                  ))}
                  <option value="+1 (555) 000-9999 (Unauthorized Stranger)">
                    +1 (555) 000-9999 (Unauthorized Stranger)
                  </option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Message Content
                </label>
                <textarea
                  rows={2}
                  value={simMessage}
                  onChange={(e) => setSimMessage(e.target.value)}
                  placeholder="Type simulated message..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {simStatus && (
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-emerald-400 font-mono">
                  {simStatus}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSimulating || !simMessage.trim()}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white text-xs font-semibold transition shadow"
                >
                  {isSimulating ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>Dispatch Inbound Simulation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
