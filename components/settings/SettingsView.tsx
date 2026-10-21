"use client";

import React from "react";
import {
  Settings,
  Shield,
  Zap,
  Cpu,
  RotateCcw,
  Bell,
  Lock,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { AppSettings } from "@/lib/types";

interface SettingsViewProps {
  settings: AppSettings;
  onUpdateSettings: (updates: Partial<AppSettings>) => void;
  onResetAllData: () => void;
}

export function SettingsView({
  settings,
  onUpdateSettings,
  onResetAllData,
}: SettingsViewProps) {
  const models = [
    {
      id: "gemini-2.5-flash",
      name: "Google Gemini 2.5 Flash",
      provider: "Google AI",
      badge: "Fast & Grounded",
      desc: "Sub-second multimodal latency, large 1M context, state-of-the-art tool calling.",
    },
    {
      id: "gemini-2.5-pro",
      name: "Google Gemini 2.5 Pro",
      provider: "Google AI",
      badge: "Deep Reasoning",
      desc: "Exceptional code synthesis, mathematical proofs, and complex multi-turn workflows.",
    },
    {
      id: "routellm-open",
      name: "RouteLLM - Open (Free pool)",
      provider: "Abacus.AI",
      badge: "Free Forever",
      desc: "Intelligently routes across available free models; auto-heals if a provider is rate limited.",
    },
    {
      id: "claude-3-5-sonnet",
      name: "Claude 3.5 Sonnet",
      provider: "Anthropic",
      badge: "Top Coder",
      desc: "Industry standard for nuance, writing quality, and autonomous computer use.",
    },
    {
      id: "gpt-4o",
      name: "GPT-4o",
      provider: "OpenAI",
      badge: "Versatile",
      desc: "Omni-modal text and vision processing with low latency.",
    },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#090d16] p-4 md:p-6 space-y-6">
      {/* Header Banner */}
      <div className="pb-6 border-b border-slate-800">
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-slate-400" />
          <span>Models, Safety & Preferences</span>
        </h1>
        <p className="text-xs md:text-sm text-slate-400 mt-1">
          Configure model routing, credit balances, tool approval modes, and local workspace persistence.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Models & Routing */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-5 rounded-2xl bg-[#0e1422] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-400" />
                <span>Default AI Model</span>
              </h2>
              <span className="text-xs text-indigo-400 font-mono font-semibold">
                Active: {settings.defaultModel}
              </span>
            </div>

            <div className="space-y-2.5">
              {models.map((model) => {
                const isSelected = settings.defaultModel === model.id;

                return (
                  <div
                    key={model.id}
                    onClick={() => onUpdateSettings({ defaultModel: model.id })}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition flex items-start justify-between ${
                      isSelected
                        ? "bg-[#0f172a] border-indigo-500 shadow-sm"
                        : "bg-slate-900/60 border-slate-800/80 hover:border-slate-700"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-xs">
                          {model.name}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                          {model.provider}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/50">
                          {model.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {model.desc}
                      </p>
                    </div>

                    <div className="shrink-0 ml-3 mt-1">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition ${
                          isSelected ? "border-indigo-500 bg-indigo-600" : "border-slate-700"
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Credit Quotas & Plan */}
          <div className="p-5 rounded-2xl bg-[#0e1422] border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Credit Pool & Free Tier</span>
            </h2>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Monthly Free Credits:</span>
                <span className="font-mono font-bold text-white">
                  {settings.freeCreditsRemaining} / {settings.freeCreditsTotal}
                </span>
              </div>

              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-2 rounded-full"
                  style={{
                    width: `${(settings.freeCreditsRemaining / settings.freeCreditsTotal) * 100}%`,
                  }}
                />
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                Free tier accounts include 2,000 monthly credits. When routing through <strong>RouteLLM - Open</strong>, requests draw exclusively from eligible free model endpoints with zero charges.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Security & State */}
        <div className="lg:col-span-5 space-y-6">
          {/* Security & Tool Policies */}
          <div className="p-5 rounded-2xl bg-[#0e1422] border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Execution Safety & Approval Mode</span>
            </h2>

            <div className="space-y-3">
              <div
                onClick={() => onUpdateSettings({ approvalMode: "supervised" })}
                className={`p-3 rounded-xl border cursor-pointer transition ${
                  settings.approvalMode === "supervised"
                    ? "bg-indigo-950/40 border-indigo-500"
                    : "bg-slate-900/60 border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">
                    Supervised Mode (Recommended)
                  </span>
                  {settings.approvalMode === "supervised" && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Requires explicit user confirmation before executing terminal commands, file mutations, or external messaging.
                </p>
              </div>

              <div
                onClick={() => onUpdateSettings({ approvalMode: "unattended" })}
                className={`p-3 rounded-xl border cursor-pointer transition ${
                  settings.approvalMode === "unattended"
                    ? "bg-amber-950/40 border-amber-500"
                    : "bg-slate-900/60 border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">
                    Unattended Autonomous Mode
                  </span>
                  {settings.approvalMode === "unattended" && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Grants full tool authorization without prompts. Designed for headless background cron routines and remote chat responders.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <label className="flex items-center justify-between text-xs cursor-pointer">
                <span className="text-slate-300">Desktop Push Notifications</span>
                <input
                  type="checkbox"
                  checked={settings.notifyDesktop}
                  onChange={(e) => onUpdateSettings({ notifyDesktop: e.target.checked })}
                  className="rounded text-indigo-600 bg-slate-900 border-slate-700"
                />
              </label>
            </div>
          </div>

          {/* Reset / Data Management */}
          <div className="p-5 rounded-2xl bg-[#0e1422] border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-red-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Data & Workspace Reset</span>
            </h2>

            <p className="text-xs text-slate-400 leading-relaxed">
              Reset all bot transcripts, custom personas, and routine histories back to default repository seeds.
            </p>

            <button
              onClick={() => {
                if (confirm("Reset all local AbacusAI Bot data back to defaults?")) {
                  onResetAllData();
                }
              }}
              className="w-full py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-800/60 text-red-300 text-xs font-semibold transition flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Application State</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
