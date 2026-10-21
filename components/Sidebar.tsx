"use client";

import React from "react";
import {
  Bot,
  MessageSquare,
  Smartphone,
  Layers,
  Clock,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export type NavTab =
  | "bots"
  | "chat"
  | "messaging"
  | "connectors"
  | "routines"
  | "deliverables"
  | "settings";

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  botsCount: number;
  activeRoutinesCount: number;
  unreadMessagesCount?: number;
}

export function Sidebar({
  activeTab,
  onTabChange,
  botsCount,
  activeRoutinesCount,
}: SidebarProps) {
  const navItems = [
    {
      id: "bots" as NavTab,
      label: "Bots",
      icon: Bot,
      badge: botsCount > 0 ? botsCount : undefined,
    },
    {
      id: "chat" as NavTab,
      label: "Agent Chat",
      icon: MessageSquare,
    },
    {
      id: "messaging" as NavTab,
      label: "Remote Messaging",
      icon: Smartphone,
      highlight: true,
    },
    {
      id: "connectors" as NavTab,
      label: "Connectors & MCP",
      icon: Layers,
    },
    {
      id: "routines" as NavTab,
      label: "Routines",
      icon: Clock,
      badge: activeRoutinesCount > 0 ? activeRoutinesCount : undefined,
    },
    {
      id: "deliverables" as NavTab,
      label: "Deliverables & Skills",
      icon: FileText,
    },
    {
      id: "settings" as NavTab,
      label: "Settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="w-16 md:w-56 border-r border-slate-800 bg-[#0c101a] flex flex-col justify-between shrink-0 select-none">
      <div className="py-3 px-2 flex flex-col gap-1">
        <div className="hidden md:block px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all relative ${
                isActive
                  ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
              title={item.label}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-indigo-500 rounded-r-md" />
              )}
              <Icon
                className={`w-5 h-5 shrink-0 ${
                  isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200"
                }`}
              />
              <span className="hidden md:inline truncate">{item.label}</span>

              {item.badge !== undefined && (
                <span
                  className={`hidden md:inline-flex ml-auto text-[11px] font-mono px-1.5 py-0.2 rounded-full ${
                    isActive
                      ? "bg-indigo-500/30 text-indigo-300"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {item.highlight && !item.badge && (
                <span className="hidden md:inline-flex ml-auto w-2 h-2 rounded-full bg-emerald-400"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info Box */}
      <div className="p-3 border-t border-slate-800/80 hidden md:block">
        <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 text-slate-300 font-medium mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Local & Sandboxed</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            All credentials, SQLite states & transcripts reside in your environment.
          </p>
        </div>
      </div>
    </aside>
  );
}
