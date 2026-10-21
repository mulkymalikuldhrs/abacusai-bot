"use client";

import React, { useState } from "react";
import {
  Clock,
  Play,
  Plus,
  Trash2,
  CheckCircle2,
  RotateCw,
  Bell,
  Smartphone,
  Mail,
  Send,
  FileText,
  Calendar,
  AlertCircle,
  X,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { Routine, RoutineRun, Bot, ScheduleFrequency } from "@/lib/types";

interface RoutinesViewProps {
  routines: Routine[];
  routineRuns: RoutineRun[];
  bots: Bot[];
  onCreateRoutine: (routine: Routine) => void;
  onToggleRoutine: (routineId: string) => void;
  onDeleteRoutine: (routineId: string) => void;
  onRunNow: (routine: Routine) => Promise<void>;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
}

export function RoutinesView({
  routines,
  routineRuns,
  bots,
  onCreateRoutine,
  onToggleRoutine,
  onDeleteRoutine,
  onRunNow,
  isCreateModalOpen,
  setIsCreateModalOpen,
}: RoutinesViewProps) {
  const [runningRoutineId, setRunningRoutineId] = useState<string | null>(null);
  const [selectedRun, setSelectedRun] = useState<RoutineRun | null>(null);

  // New routine form state
  const [name, setName] = useState("");
  const [botId, setBotId] = useState(bots[0]?.id || "");
  const [scheduleType, setScheduleType] = useState<ScheduleFrequency>("daily");
  const [cronExpression, setCronExpression] = useState("0 8 * * *");
  const [prompt, setPrompt] = useState("");
  const [notifyDesktop, setNotifyDesktop] = useState(true);
  const [notifyWhatsApp, setNotifyWhatsApp] = useState(false);
  const [notifyTelegram, setNotifyTelegram] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState(false);

  const handleRunNowClick = async (routine: Routine) => {
    setRunningRoutineId(routine.id);
    try {
      await onRunNow(routine);
    } finally {
      setRunningRoutineId(null);
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !prompt.trim()) return;

    const newRoutine: Routine = {
      id: "routine-" + Date.now(),
      name: name.trim(),
      botId: botId || bots[0]?.id,
      scheduleType,
      cronExpression: scheduleType === "cron" ? cronExpression : undefined,
      prompt: prompt.trim(),
      workspacePath: `~/.abacusai-bot/routines/${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
      notifyChannels: {
        desktop: notifyDesktop,
        whatsapp: notifyWhatsApp,
        telegram: notifyTelegram,
        email: notifyEmail,
      },
      enabled: true,
      lastRunAt: undefined,
      nextRunAt: "Scheduled for next cycle",
      totalRuns: 0,
    };

    onCreateRoutine(newRoutine);
    setIsCreateModalOpen(false);
    setName("");
    setPrompt("");
  };

  const getBotName = (id: string) => {
    const found = bots.find((b) => b.id === id);
    return found ? found.name : "Assigned Bot";
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#090d16] p-4 md:p-6 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Clock className="w-6 h-6 text-amber-400" />
            <span>Scheduled Routines & Automations</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Configure hourly, daily, weekly, or webhook triggers that wake bots autonomously, execute tool pipelines, and notify your channels.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/20 transition self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Routine</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Active Routines List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
              Configured Routines ({routines.length})
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              {routines.filter((r) => r.enabled).length} active
            </span>
          </div>

          <div className="space-y-3">
            {routines.map((routine) => {
              const isRunning = runningRoutineId === routine.id;

              return (
                <div
                  key={routine.id}
                  className="p-5 rounded-2xl bg-[#0e1422] border border-slate-800/80 hover:border-slate-700 space-y-4 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="font-semibold text-white text-base">
                          {routine.name}
                        </h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-300 uppercase">
                          {routine.scheduleType}
                        </span>
                      </div>
                      <p className="text-xs text-indigo-400 font-medium mt-0.5">
                        Assigned Bot: {getBotName(routine.botId)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRunNowClick(routine)}
                        disabled={isRunning}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white text-xs font-semibold shadow-sm transition"
                        title="Execute routine right now"
                      >
                        {isRunning ? (
                          <RotateCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Play className="w-3.5 h-3.5 fill-current" />
                        )}
                        <span>{isRunning ? "Running..." : "Run Now"}</span>
                      </button>

                      <button
                        onClick={() => onToggleRoutine(routine.id)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition ${
                          routine.enabled
                            ? "bg-emerald-950/40 border-emerald-800 text-emerald-400"
                            : "bg-slate-900 border-slate-800 text-slate-400"
                        }`}
                      >
                        {routine.enabled ? "Active" : "Paused"}
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Delete routine "${routine.name}"?`)) {
                            onDeleteRoutine(routine.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-900 font-mono">
                    "{routine.prompt}"
                  </p>

                  {/* Metadata and Delivery channels */}
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 pt-2 border-t border-slate-800/60">
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-slate-500">Alerts:</span>
                      <div className="flex items-center gap-2">
                        {routine.notifyChannels.desktop && (
                          <span title="Desktop Notification" className="text-slate-300">
                            <Bell className="w-3.5 h-3.5" />
                          </span>
                        )}
                        {routine.notifyChannels.whatsapp && (
                          <span title="WhatsApp Dispatch" className="text-emerald-400">
                            <Smartphone className="w-3.5 h-3.5" />
                          </span>
                        )}
                        {routine.notifyChannels.telegram && (
                          <span title="Telegram Dispatch" className="text-blue-400">
                            <Send className="w-3.5 h-3.5" />
                          </span>
                        )}
                        {routine.notifyChannels.email && (
                          <span title="Email Briefing" className="text-purple-400">
                            <Mail className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span>Runs: {routine.totalRuns}</span>
                      {routine.lastRunAt && (
                        <span>
                          · Last: {new Date(routine.lastRunAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Routine Execution Logs & History */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
              Execution History & Outputs
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              {routineRuns.length} runs recorded
            </span>
          </div>

          <div className="space-y-3">
            {routineRuns.map((run) => (
              <div
                key={run.id}
                onClick={() => setSelectedRun(run)}
                className="p-4 rounded-xl bg-[#0e1422] border border-slate-800/80 hover:border-indigo-500/50 cursor-pointer transition space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-white text-xs">{run.routineName}</h4>
                    <span className="text-[11px] text-slate-400">Bot: {run.botName}</span>
                  </div>
                  <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{run.status}</span>
                  </span>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {run.outputSummary}
                </p>

                {run.deliverableTitle && (
                  <div className="flex items-center gap-1.5 text-[11px] text-indigo-400 font-mono bg-indigo-950/40 border border-indigo-900/40 px-2 py-1 rounded">
                    <FileText className="w-3 h-3" />
                    <span>{run.deliverableTitle}</span>
                  </div>
                )}

                <div className="text-[10px] text-slate-500 font-mono pt-1 flex items-center justify-between">
                  <span>{new Date(run.startedAt).toLocaleString()}</span>
                  <span>{run.logs.length} step logs</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CREATE ROUTINE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0e1422] border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-400" />
                <span>Configure Scheduled Routine</span>
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Routine Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Daily PR & Issue Sentinel"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Target Bot
                  </label>
                  <select
                    value={botId}
                    onChange={(e) => setBotId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                  >
                    {bots.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.model})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Frequency
                  </label>
                  <select
                    value={scheduleType}
                    onChange={(e: any) => setScheduleType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekdays">Weekdays</option>
                    <option value="weekly">Weekly</option>
                    <option value="cron">Custom Cron</option>
                    <option value="webhook">Webhook Trigger</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Autonomous Instructions / Goal *
                </label>
                <textarea
                  rows={3}
                  required
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the automated mission: e.g. Check all open PRs, analyze commits, and format report."
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white font-mono"
                />
              </div>

              {/* Notification Channels */}
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-2">
                  Delivery Channels
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 p-2 rounded bg-slate-900 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifyDesktop}
                      onChange={(e) => setNotifyDesktop(e.target.checked)}
                      className="rounded text-indigo-600 bg-slate-800"
                    />
                    <span>Desktop Alert</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded bg-slate-900 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifyWhatsApp}
                      onChange={(e) => setNotifyWhatsApp(e.target.checked)}
                      className="rounded text-indigo-600 bg-slate-800"
                    />
                    <span>WhatsApp</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded bg-slate-900 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifyTelegram}
                      onChange={(e) => setNotifyTelegram(e.target.checked)}
                      className="rounded text-indigo-600 bg-slate-800"
                    />
                    <span>Telegram</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded bg-slate-900 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifyEmail}
                      onChange={(e) => setNotifyEmail(e.target.checked)}
                      className="rounded text-indigo-600 bg-slate-800"
                    />
                    <span>Email Memo</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                >
                  Schedule Routine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL MODAL FOR EXECUTION RUN */}
      {selectedRun && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0e1422] border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">
                  {selectedRun.routineName}
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  Executed: {new Date(selectedRun.startedAt).toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => setSelectedRun(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  Output Deliverable Summary:
                </span>
                <p className="text-xs text-slate-200 bg-slate-900 p-3 rounded-lg border border-slate-800 leading-relaxed">
                  {selectedRun.outputSummary}
                </p>
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Execution Trace Logs:
                </span>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-900 font-mono text-[11px] text-slate-300 space-y-1 max-h-60 overflow-y-auto">
                  {selectedRun.logs.map((log, i) => (
                    <div key={i} className="leading-relaxed">
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedRun(null)}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
