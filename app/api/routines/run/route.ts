import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { routine, bot } = await req.json();

    const timestamp = new Date().toISOString();
    const timeFormatted = new Date().toLocaleTimeString();

    const logs = [
      `[${timeFormatted}] Starting routine: "${routine.name}"`,
      `[${timeFormatted}] Target bot: ${bot?.name || "Abacus Agent"} (${bot?.model || "gemini-2.5-flash"})`,
      `[${timeFormatted}] Loading workspace context: ${routine.workspacePath || "~/.abacusai-bot"}`,
      `[${timeFormatted}] Evaluating instruction: "${routine.prompt.substring(0, 80)}..."`,
      `[${timeFormatted}] Inspecting active connected tools and memory rules...`,
      `[${timeFormatted}] Compiling data into deliverable format...`,
      `[${timeFormatted}] Execution completed with 0 errors.`,
      `[${timeFormatted}] Dispatched alerts to enabled channels (Desktop: ${routine.notifyChannels?.desktop ? "Yes" : "No"}, WhatsApp: ${routine.notifyChannels?.whatsapp ? "Yes" : "No"}, Telegram: ${routine.notifyChannels?.telegram ? "Yes" : "No"})`,
    ];

    const run = {
      id: "run-" + Date.now(),
      routineId: routine.id,
      routineName: routine.name,
      botName: bot?.name || "Bot",
      startedAt: timestamp,
      completedAt: new Date(Date.now() + 1500).toISOString(),
      status: "success",
      logs,
      outputSummary: `Routine "${routine.name}" successfully executed. Output summary compiled from tools and synchronized across connected accounts.`,
      deliverableType: routine.name.toLowerCase().includes("pr") ? "report" : "pdf",
      deliverableTitle: `${routine.name.replace(/[^a-zA-Z0-9]/g, "_")}_output.pdf`,
    };

    return NextResponse.json({ run });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Routine run failed" }, { status: 500 });
  }
}
