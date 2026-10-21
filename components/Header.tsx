"use client";

import React from "react";
import { Bot, Zap, Shield, Sparkles, Plus, ExternalLink } from "lucide-react";
import { AppSettings } from "@/lib/types";

interface HeaderProps {
  settings: AppSettings;
  onNewBotClick: () => void;
  onNewRoutineClick: () => void;
  activeTab: string;
}

export function Header({
  settings,
  onNewBotClick,
  onNewRoutineClick,
  activeTab,
}: HeaderProps) {
  return (
    <header className="h-14 border-b border-slate-800 bg-[#0d131f]/90 backdrop-blur px-4 flex items-center justify-between z-20 shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-md shadow-indigo-500/20">
          <Bot className="w-5 h-5" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-white tracking-tight text-base">
            AbacusAI Bot
          </span>
          <span className="text-[11px] font-mono text-indigo-400 bg-indigo-950/60 border border-indigo-800/60 px-1.5 py-0.5 rounded">
            v1.0.86
          </span>
        </div>

        {/* Status Indicator */}
        <div className="hidden md:flex items-center gap-1.5 ml-2 px-2.5 py-1 rounded-full bg-emerald-950/50 border border-emerald-800/40 text-[11px] text-emerald-400 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Connected</span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-400">RouteLLM Free</span>
        </div>
      </div>

      {/* Middle & Right Actions */}
      <div className="flex items-center gap-3">
        {/* Credits Balance */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-300 font-mono">
            {settings.freeCreditsRemaining.toLocaleString()} credits
          </span>
          <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider bg-emerald-950/80 px-1 rounded">
            Free
          </span>
        </div>

        {/* Approval Mode badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-800 text-xs text-slate-400">
          <Shield className="w-3.5 h-3.5 text-indigo-400" />
          <span>Mode:</span>
          <span className="text-slate-200 capitalize font-medium">
            {settings.approvalMode}
          </span>
        </div>

        {/* Quick Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onNewBotClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Bot</span>
          </button>
        </div>
      </div>
    </header>
  );
}
