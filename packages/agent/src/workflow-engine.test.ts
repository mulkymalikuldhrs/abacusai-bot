import { describe, expect, it } from "vitest";
import { AgentWorkflow, AgentWorkflowRunner } from "./workflow-engine.js";

describe("AgentWorkflowRunner", () => {
  it("executes multi-step workflow sequentially", async () => {
    const workflow: AgentWorkflow = {
      id: "test-workflow",
      name: "Test Agent Workflow",
      description: "Simple multi-step execution",
      steps: [
        {
          id: "step-1",
          name: "Initialize",
          action: "transform",
          onSuccessNext: "step-2"
        },
        {
          id: "step-2",
          name: "Process",
          action: "llm_generate"
        }
      ]
    };

    const runner = new AgentWorkflowRunner(workflow);
    const finalContext = await runner.run({ input: "start" });

    expect(finalContext.lastExecutedStep).toBe("step-2");
    expect(finalContext.input).toBe("start");
  });
});
