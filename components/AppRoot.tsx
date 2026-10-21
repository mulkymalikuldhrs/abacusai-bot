"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useAppStore } from "@/lib/store";
import { Header } from "@/components/Header";
import { Sidebar, NavTab } from "@/components/Sidebar";
import { GraphifyView } from "@/components/graph/GraphifyView";
import { QuantHedgeFundView } from "@/components/quant/QuantHedgeFundView";
import { AsterMcpView } from "@/components/android/AsterMcpView";
import { BrudProvidersView } from "@/components/brud/BrudProvidersView";
import { SystemDocsView } from "@/components/docs/SystemDocsView";
import { BotsView } from "@/components/bots/BotsView";
import { ChatView } from "@/components/chat/ChatView";
import { MessagingView } from "@/components/messaging/MessagingView";
import { ConnectorsView } from "@/components/connectors/ConnectorsView";
import { RoutinesView } from "@/components/routines/RoutinesView";
import { DeliverablesView } from "@/components/deliverables/DeliverablesView";
import { SettingsView } from "@/components/settings/SettingsView";
import { ChatMessage } from "@/lib/types";

export default function AppRoot() {
  const [activeTab, setActiveTab] = useState<NavTab>("graph");
  const [isNewBotModalOpen, setIsNewBotModalOpen] = useState(false);
  const [isNewRoutineModalOpen, setIsNewRoutineModalOpen] = useState(false);
  const [isSendingChat, setIsSendingChat] = useState(false);

  const {
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
  } = useAppStore();

  const handleSelectBotForChat = (botId: string) => {
    setActiveBotId(botId);
    setActiveTab("chat");
  };

  const handleSendMessage = async (text: string) => {
    if (!activeBot) return;

    const userMessage: ChatMessage = {
      id: "msg-" + Date.now(),
      botId: activeBot.id,
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };

    addChatMessage(activeBot.id, userMessage);
    setIsSendingChat(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bot: activeBot,
          message: text,
          connectors,
          approvalMode: settings.approvalMode,
        }),
      });

      const data = await res.json();

      const assistantMessage: ChatMessage = {
        id: "msg-" + (Date.now() + 1),
        botId: activeBot.id,
        role: "assistant",
        content: data.reply || "Task processed.",
        timestamp: new Date().toISOString(),
        toolSteps: data.toolSteps || [],
        modelUsed: data.modelUsed || activeBot.model,
        needsApproval: data.isWaitingApproval,
      };

      addChatMessage(activeBot.id, assistantMessage);
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: "msg-err-" + Date.now(),
        botId: activeBot.id,
        role: "assistant",
        content: "Error communicating with agent backend. Please check network or try again.",
        timestamp: new Date().toISOString(),
      };
      addChatMessage(activeBot.id, errorMessage);
    } finally {
      setIsSendingChat(false);
    }
  };

  const handleApproveTool = (botId: string, messageId: string, toolStepId: string) => {
    const currentMessages = chats[botId] || [];
    const targetMsg = currentMessages.find((m) => m.id === messageId);
    if (!targetMsg) return;

    const updatedSteps = (targetMsg.toolSteps || []).map((step) =>
      step.id === toolStepId
        ? {
            ...step,
            status: "completed" as const,
            outputResult: "Action manually authorized by user. Command execution succeeded.",
            durationMs: 350,
          }
        : step
    );

    updateChatMessage(botId, messageId, {
      toolSteps: updatedSteps,
      needsApproval: false,
      content:
        targetMsg.content +
        "\n\n*Action authorized by supervisor. The privileged command has finished successfully.*",
    });
  };

  const handleRejectTool = (botId: string, messageId: string, toolStepId: string) => {
    const currentMessages = chats[botId] || [];
    const targetMsg = currentMessages.find((m) => m.id === messageId);
    if (!targetMsg) return;

    const updatedSteps = (targetMsg.toolSteps || []).map((step) =>
      step.id === toolStepId
        ? {
            ...step,
            status: "rejected" as const,
            outputResult: "Action was denied by user in supervised mode.",
          }
        : step
    );

    updateChatMessage(botId, messageId, {
      toolSteps: updatedSteps,
      needsApproval: false,
      content:
        targetMsg.content +
        "\n\n*Action was denied by supervisor. Halting privileged tool invocation.*",
    });
  };

  const handleSimulateInbound = async (
    channelId: string,
    sender: string,
    message: string
  ) => {
    const targetBot =
      bots.find((b) => b.id === "bot-whatsapp-agent") ||
      bots.find((b) => b.tools.messaging) ||
      bots[0];

    const channel = messagingChannels.find((c) => c.id === channelId);
    const channelType = channel?.type || "whatsapp";

    const inboundMsg: ChatMessage = {
      id: "msg-sim-" + Date.now(),
      botId: targetBot.id,
      role: "user",
      content: message,
      timestamp: new Date().toISOString(),
      channel: channelType,
      senderName: sender,
    };
    addChatMessage(targetBot.id, inboundMsg);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bot: targetBot,
          message,
          connectors,
          approvalMode: channel?.allowUnattendedTools ? "unattended" : "supervised",
        }),
      });

      const data = await res.json();

      const replyMsg: ChatMessage = {
        id: "msg-sim-reply-" + Date.now(),
        botId: targetBot.id,
        role: "assistant",
        content: data.reply || "Delivered via mobile gateway.",
        timestamp: new Date().toISOString(),
        toolSteps: data.toolSteps || [],
        modelUsed: data.modelUsed,
        channel: channelType,
      };

      addChatMessage(targetBot.id, replyMsg);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRunNow = async (routine: any) => {
    const targetBot = bots.find((b) => b.id === routine.botId) || bots[0];

    try {
      const res = await fetch("/api/routines/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ routine, bot: targetBot }),
      });

      const data = await res.json();
      if (data.run) {
        addRoutineRun(data.run);
      }
    } catch (e) {
      console.error("Run routine error:", e);
    }
  };

  const handleResetAllData = () => {
    if (typeof window !== "undefined") {
      localStorage.clear();
      window.location.reload();
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center text-slate-400 font-mono text-xs">
        Loading AbacusAI Bot ecosystem...
      </div>
    );
  }

  const activeRoutinesCount = routines.filter((r) => r.enabled).length;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#090d16]">
      {/* Top Header */}
      <Header
        settings={settings}
        onNewBotClick={() => setIsNewBotModalOpen(true)}
        onNewRoutineClick={() => setIsNewRoutineModalOpen(true)}
        activeTab={activeTab}
      />

      {/* Main Workspace: Left Sidebar Rail + Center Content View */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          botsCount={bots.length}
          activeRoutinesCount={activeRoutinesCount}
        />

        <main className="flex-1 flex flex-col overflow-hidden relative">
          <AnimatePresence mode="wait">
            {activeTab === "graph" && (
              <motion.div
                key="graph"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                className="flex-1 flex flex-col overflow-hidden"
              >
                <GraphifyView />
              </motion.div>
            )}

            {activeTab === "quant" && (
              <motion.div
                key="quant"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                className="flex-1 flex flex-col overflow-hidden"
              >
                <QuantHedgeFundView />
              </motion.div>
            )}

            {activeTab === "aster" && (
              <motion.div
                key="aster"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                className="flex-1 flex flex-col overflow-hidden"
              >
                <AsterMcpView />
              </motion.div>
            )}

            {activeTab === "brud" && (
              <motion.div
                key="brud"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                className="flex-1 flex flex-col overflow-hidden"
              >
                <BrudProvidersView />
              </motion.div>
            )}

            {activeTab === "docs" && (
              <motion.div
                key="docs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                className="flex-1 flex flex-col overflow-hidden"
              >
                <SystemDocsView />
              </motion.div>
            )}

            {activeTab === "bots" && (
              <motion.div
                key="bots"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                className="flex-1 flex flex-col overflow-hidden"
              >
                <BotsView
                  bots={bots}
                  onSelectBotForChat={handleSelectBotForChat}
                  onCreateBot={createBot}
                  onUpdateBot={updateBot}
                  onDeleteBot={deleteBot}
                  onAddMemory={addBotMemory}
                  onDeleteMemory={deleteBotMemory}
                  isCreateModalOpen={isNewBotModalOpen}
                  setIsCreateModalOpen={setIsNewBotModalOpen}
                />
              </motion.div>
            )}

            {activeTab === "chat" && (
              <motion.div
                key="chat"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                className="flex-1 flex flex-col overflow-hidden"
              >
                <ChatView
                  bots={bots}
                  activeBot={activeBot}
                  onSelectBot={setActiveBotId}
                  messages={activeChatMessages}
                  onSendMessage={handleSendMessage}
                  onClearChat={clearChat}
                  onApproveTool={handleApproveTool}
                  onRejectTool={handleRejectTool}
                  connectors={connectors}
                  settings={settings}
                  isSending={isSendingChat}
                />
              </motion.div>
            )}

            {activeTab === "messaging" && (
              <motion.div
                key="messaging"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                className="flex-1 flex flex-col overflow-hidden"
              >
                <MessagingView
                  channels={messagingChannels}
                  onUpdateChannel={updateMessagingChannel}
                  bots={bots}
                  onSimulateInbound={handleSimulateInbound}
                />
              </motion.div>
            )}

            {activeTab === "connectors" && (
              <motion.div
                key="connectors"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                className="flex-1 flex flex-col overflow-hidden"
              >
                <ConnectorsView
                  connectors={connectors}
                  onToggleConnector={toggleConnector}
                  mcpServers={mcpServers}
                  onAddMcpServer={addMcpServer}
                  onDeleteMcpServer={deleteMcpServer}
                />
              </motion.div>
            )}

            {activeTab === "routines" && (
              <motion.div
                key="routines"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                className="flex-1 flex flex-col overflow-hidden"
              >
                <RoutinesView
                  routines={routines}
                  routineRuns={routineRuns}
                  bots={bots}
                  onCreateRoutine={createRoutine}
                  onToggleRoutine={toggleRoutine}
                  onDeleteRoutine={deleteRoutine}
                  onRunNow={handleRunNow}
                  isCreateModalOpen={isNewRoutineModalOpen}
                  setIsCreateModalOpen={setIsNewRoutineModalOpen}
                />
              </motion.div>
            )}

            {activeTab === "deliverables" && (
              <motion.div
                key="deliverables"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                className="flex-1 flex flex-col overflow-hidden"
              >
                <DeliverablesView />
              </motion.div>
            )}

            {activeTab === "settings" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                className="flex-1 flex flex-col overflow-hidden"
              >
                <SettingsView
                  settings={settings}
                  onUpdateSettings={updateSettings}
                  onResetAllData={handleResetAllData}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
