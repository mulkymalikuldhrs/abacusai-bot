"use client";

import React, { useState } from "react";
import {
  FileText,
  Presentation,
  Sparkles,
  Download,
  Eye,
  Check,
  Layers,
  Palette,
  Compass,
  Code,
  Tag,
  ExternalLink,
} from "lucide-react";
import { DELIVERABLE_TEMPLATES } from "@/lib/initial-data";
import { DeliverableTemplate } from "@/lib/types";

export function DeliverablesView() {
  const [activeFilter, setActiveFilter] = useState<"all" | "deck" | "pdf" | "skill">("all");
  const [selectedTemplate, setSelectedTemplate] = useState<DeliverableTemplate | null>(null);

  const filtered = DELIVERABLE_TEMPLATES.filter(
    (t) => activeFilter === "all" || t.type === activeFilter
  );

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#090d16] p-4 md:p-6 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-indigo-400" />
            <span>Deliverables, Decks & Skills</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Standard templates and skills that your personal bots use to produce slide decks, publication-grade PDFs, and structured code reviews.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl self-start md:self-auto">
          {(
            [
              { id: "all", label: "All Items" },
              { id: "deck", label: "Deck Templates" },
              { id: "pdf", label: "PDF Themes" },
              { id: "skill", label: "Agent Skills" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeFilter === tab.id
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Templates & Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div
            key={item.slug}
            className="p-5 rounded-2xl bg-[#0e1422] border border-slate-800/80 hover:border-slate-700 flex flex-col justify-between transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="font-semibold text-white text-base">{item.name}</h3>
                <span
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold ${
                    item.type === "deck"
                      ? "bg-amber-950/60 text-amber-400 border border-amber-800/60"
                      : item.type === "pdf"
                      ? "bg-blue-950/60 text-blue-400 border border-blue-800/60"
                      : "bg-purple-950/60 text-purple-400 border border-purple-800/60"
                  }`}
                >
                  {item.type}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                {item.tagline}
              </p>

              {item.bestFor && (
                <div className="mb-3 text-[11px] text-slate-400">
                  <span className="text-slate-500 font-semibold block">Best for:</span>
                  <span>{item.bestFor}</span>
                </div>
              )}

              {item.tags && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">
                {item.slideCount ? `${item.slideCount} slide archetype` : `Ready in agents`}
              </span>

              <button
                onClick={() => setSelectedTemplate(item)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PREVIEW MODAL */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0e1422] border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <h3 className="text-base font-bold text-white">
                  {selectedTemplate.name} ({selectedTemplate.type.toUpperCase()})
                </h3>
                <span className="text-xs text-slate-400">{selectedTemplate.tagline}</span>
              </div>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 py-2">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
                <div className="text-indigo-400 font-bold border-b border-slate-800 pb-2">
                  Sample Layout Output Preview:
                </div>
                {selectedTemplate.type === "pdf" && (
                  <div className="text-slate-300 space-y-2">
                    <p className="font-serif text-sm font-bold text-white">
                      1.0 EXECUTIVE ARCHITECTURE SPECIFICATION
                    </p>
                    <p className="text-slate-400">
                      Prepared by AbacusAI Bot · Model: gemini-2.5-flash · Format: {selectedTemplate.name}
                    </p>
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-[11px]">
                      | Component | Latency | Status | Redundancy |<br />
                      | Desktop Agent | 42ms | Active | Triple Multi-Zone |<br />
                      | WhatsApp Bridge | 120ms | Paired | Auto-healing |
                    </div>
                  </div>
                )}

                {selectedTemplate.type === "deck" && (
                  <div className="text-slate-300 space-y-2">
                    <div className="h-28 rounded-lg bg-gradient-to-r from-indigo-900 to-purple-950 border border-indigo-700/50 p-4 flex flex-col justify-between">
                      <span className="text-[10px] uppercase font-bold text-indigo-300">
                        Slide 1: Vision
                      </span>
                      <h4 className="text-sm font-bold text-white">
                        Autonomous Personal Workspaces
                      </h4>
                      <span className="text-[10px] text-slate-400">
                        {selectedTemplate.mood}
                      </span>
                    </div>
                  </div>
                )}

                {selectedTemplate.type === "skill" && (
                  <div className="text-slate-300 space-y-2">
                    <p className="text-emerald-400 font-bold">
                      Skill Activation: {selectedTemplate.slug}
                    </p>
                    <p className="text-slate-400">
                      Injected prompt rules enforce zero-regression checks, AST validation, and clean formatting.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedTemplate(null)}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
