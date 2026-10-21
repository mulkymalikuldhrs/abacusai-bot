"use client";

import React, { useState } from "react";
import {
  Layers,
  CheckCircle2,
  Plus,
  Terminal,
  ExternalLink,
  Shield,
  Trash2,
  RefreshCw,
  Search,
  Server,
  Zap,
  Check,
  X,
} from "lucide-react";
import { Connector, McpServer } from "@/lib/types";

interface ConnectorsViewProps {
  connectors: Connector[];
  onToggleConnector: (connectorId: string) => void;
  mcpServers: McpServer[];
  onAddMcpServer: (server: McpServer) => void;
  onDeleteMcpServer: (serverId: string) => void;
}

export function ConnectorsView({
  connectors,
  onToggleConnector,
  mcpServers,
  onAddMcpServer,
  onDeleteMcpServer,
}: ConnectorsViewProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeSection, setActiveSection] = useState<"connectors" | "mcp">("connectors");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddMcpOpen, setIsAddMcpOpen] = useState(false);

  // New MCP form state
  const [mcpName, setMcpName] = useState("");
  const [mcpCommand, setMcpCommand] = useState("npx");
  const [mcpArgs, setMcpArgs] = useState("-y @modelcontextprotocol/server-postgres");

  const categories = [
    { id: "all", label: "All Connectors" },
    { id: "google", label: "Google Workspace" },
    { id: "communication", label: "Communication" },
    { id: "development", label: "Developer Tools" },
    { id: "productivity", label: "Productivity" },
    { id: "storage", label: "Storage & Files" },
  ];

  const filteredConnectors = connectors.filter((c) => {
    const matchesCat = activeCategory === "all" || c.category === activeCategory;
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleAddMcpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mcpName.trim()) return;

    const newServer: McpServer = {
      id: "mcp-" + Date.now(),
      name: mcpName.trim(),
      transport: "stdio",
      command: mcpCommand.trim(),
      args: mcpArgs.split(" ").filter(Boolean),
      status: "connected",
      toolsList: ["custom_query", "fetch_records", "execute_operation"],
    };

    onAddMcpServer(newServer);
    setIsAddMcpOpen(false);
    setMcpName("");
    setMcpArgs("");
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#090d16] p-4 md:p-6 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-indigo-400" />
            <span>Connectors & MCP Protocol</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Authorize services (Gmail, Calendar, Slack, GitHub) and attach Model Context Protocol servers to give bots real-world execution powers.
          </p>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl self-start md:self-auto">
          <button
            onClick={() => setActiveSection("connectors")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSection === "connectors"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Built-in Connectors ({connectors.filter((c) => c.isConnected).length}/{connectors.length})
          </button>
          <button
            onClick={() => setActiveSection("mcp")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSection === "mcp"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            MCP Servers ({mcpServers.length})
          </button>
        </div>
      </div>

      {activeSection === "connectors" && (
        <div className="space-y-5">
          {/* Category Pills & Search */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                    activeCategory === cat.id
                      ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                      : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search connectors or tools..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Connectors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredConnectors.map((conn) => (
              <div
                key={conn.id}
                className="p-5 rounded-2xl bg-[#0e1422] border border-slate-800/80 hover:border-slate-700 flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-semibold text-white text-base flex items-center gap-2">
                        <span>{conn.name}</span>
                        {conn.isConnected && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        )}
                      </h3>
                      <span className="text-[10px] font-mono uppercase text-slate-500">
                        {conn.category}
                      </span>
                    </div>

                    <button
                      onClick={() => onToggleConnector(conn.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold border transition ${
                        conn.isConnected
                          ? "bg-emerald-950/60 border-emerald-800 text-emerald-400 hover:bg-red-950/40 hover:border-red-800 hover:text-red-400"
                          : "bg-indigo-600 hover:bg-indigo-500 text-white border-transparent shadow-sm"
                      }`}
                    >
                      {conn.isConnected ? "Connected" : "Connect"}
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed mb-3">
                    {conn.description}
                  </p>

                  {conn.connectedAccount && (
                    <div className="text-[11px] font-mono text-slate-300 bg-slate-900 px-2 py-1 rounded border border-slate-800 truncate mb-3">
                      Account: {conn.connectedAccount}
                    </div>
                  )}

                  {/* Tools Provided */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
                      Tools Armed ({conn.toolsProvided.length}):
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {conn.toolsProvided.map((tool) => (
                        <span
                          key={tool}
                          className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-indigo-300"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Scopes: {conn.scopes.join(", ")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === "mcp" && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              The <strong>Model Context Protocol (MCP)</strong> connects local and remote tools, filesystems, and databases directly to bots via JSON-RPC.
            </p>

            <button
              onClick={() => setIsAddMcpOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add MCP Server</span>
            </button>
          </div>

          <div className="space-y-3">
            {mcpServers.map((server) => (
              <div
                key={server.id}
                className="p-4 rounded-xl bg-[#0e1422] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <Server className="w-4 h-4 text-indigo-400" />
                    <h3 className="font-semibold text-white text-sm">{server.name}</h3>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase ${
                        server.status === "connected"
                          ? "bg-emerald-950 border border-emerald-800 text-emerald-400"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {server.status}
                    </span>
                  </div>

                  <div className="font-mono text-xs text-slate-400 flex items-center gap-2">
                    <span className="text-slate-500">$</span>
                    <span>
                      {server.command} {server.args.join(" ")}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {server.toolsList.map((tool) => (
                      <span
                        key={tool}
                        className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-300"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto">
                  <button
                    onClick={() => onDeleteMcpServer(server.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition"
                    title="Remove MCP server"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ADD MCP SERVER MODAL */}
          {isAddMcpOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
              <div className="bg-[#0e1422] border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Server className="w-4 h-4 text-indigo-400" />
                    <span>Register MCP Server</span>
                  </h3>
                  <button
                    onClick={() => setIsAddMcpOpen(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleAddMcpSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Server Label
                    </label>
                    <input
                      type="text"
                      required
                      value={mcpName}
                      onChange={(e) => setMcpName(e.target.value)}
                      placeholder="e.g. SQLite DB Server"
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Command Executable
                    </label>
                    <input
                      type="text"
                      required
                      value={mcpCommand}
                      onChange={(e) => setMcpCommand(e.target.value)}
                      placeholder="e.g. npx or python3"
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Arguments
                    </label>
                    <input
                      type="text"
                      value={mcpArgs}
                      onChange={(e) => setMcpArgs(e.target.value)}
                      placeholder="e.g. -y @modelcontextprotocol/server-sqlite --db path.db"
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white font-mono"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddMcpOpen(false)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                    >
                      Connect Server
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
