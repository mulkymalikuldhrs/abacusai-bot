import { describe, expect, it } from "vitest";
import { DynamicAgentNode, MixtureOfAgentsFusion, SubAgentRole } from "./hierarchical-agents.js";

describe("Hierarchical Dynamic Sub-Agents & MoA Fusion", () => {
  it("spawns recursive sub-agents and compiles reports up the hierarchy", async () => {
    const rootRole: SubAgentRole = {
      id: "orchestrator-root",
      name: "Engineering Lead",
      role: "orchestrator",
      capabilities: ["plan", "delegate"],
      systemPrompt: "Lead overall engineering task"
    };

    const rootNode = new DynamicAgentNode(rootRole);

    const devNode = rootNode.spawnChild({
      id: "dev-lead",
      name: "Development Lead",
      role: "developer_manager",
      capabilities: ["code", "manage"],
      systemPrompt: "Manage dev team"
    });

    devNode.spawnChild({
      id: "frontend-dev",
      name: "Frontend Developer",
      role: "frontend",
      capabilities: ["react", "ui"],
      systemPrompt: "Build UI"
    });

    devNode.spawnChild({
      id: "backend-dev",
      name: "Backend Developer",
      role: "backend",
      capabilities: ["node", "api"],
      systemPrompt: "Build APIs"
    });

    const report = await rootNode.executeTask("Implement user dashboard");

    expect(report.agentId).toBe("orchestrator-root");
    expect(report.status).toBe("completed");
    expect(report.childReports?.length).toBe(1);
    expect(report.childReports![0]!.childReports?.length).toBe(2);
  });

  it("fuses responses from multiple model outputs in Mixture-of-Agents engine", () => {
    const responses = [
      { modelId: "claude-sonnet-5", role: "architect", content: "Architecture proposal: Monorepo design." },
      { modelId: "gpt-5.6-terra", role: "developer", content: "Implementation proposal: TypeScript & Node." }
    ];

    const fusion = MixtureOfAgentsFusion.fuseResponses(responses);

    expect(fusion.consensusScore).toBeGreaterThan(0.9);
    expect(fusion.fusedOutput).toContain("Mixture-of-Agents Synthesized Consensus");
    expect(fusion.fusedOutput).toContain("Monorepo design");
  });
});
