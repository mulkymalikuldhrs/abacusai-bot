/**
 * Advanced Workflow & Modular Agent Extensions Engine
 * Inspired by Hermes Agents, OpenCode, DeerFlow, and OpenMausBot workflows.
 * Provides multi-step agent flow orchestration, fallback strategies, and stateful memory loops.
 */

export interface AgentWorkflowStep {
  id: string;
  name: string;
  action: "llm_generate" | "mcp_tool" | "condition" | "transform";
  params?: Record<string, unknown>;
  onSuccessNext?: string;
  onFailureNext?: string;
}

export interface AgentWorkflow {
  id: string;
  name: string;
  description: string;
  steps: AgentWorkflowStep[];
}

export class AgentWorkflowRunner {
  private workflow: AgentWorkflow;

  constructor(workflow: AgentWorkflow) {
    this.workflow = workflow;
  }

  async executeStep(
    stepId: string,
    context: Record<string, unknown>
  ): Promise<{ status: "success" | "failed"; context: Record<string, unknown> }> {
    const step = this.workflow.steps.find((s) => s.id === stepId);
    if (!step) {
      return { status: "failed", context: { ...context, error: `Step ${stepId} not found` } };
    }

    const updatedContext: Record<string, unknown> = {
      ...context,
      lastExecutedStep: step.id,
      stepHistory: [...((context.stepHistory as string[]) || []), step.id]
    };

    switch (step.action) {
      case "transform": {
        if (step.params?.transformFn && typeof step.params.transformFn === "function") {
          const res = (step.params.transformFn as (ctx: Record<string, unknown>) => Record<string, unknown>)(updatedContext);
          Object.assign(updatedContext, res);
        } else if (step.params?.key && step.params?.value) {
          updatedContext[String(step.params.key)] = step.params.value;
        }
        return { status: "success", context: updatedContext };
      }
      case "condition": {
        const conditionMet = Boolean(updatedContext[String(step.params?.field ?? "condition")]);
        return {
          status: conditionMet ? "success" : "failed",
          context: { ...updatedContext, conditionResult: conditionMet }
        };
      }
      case "llm_generate": {
        const prompt = String(step.params?.prompt ?? updatedContext.prompt ?? "Generate response");
        updatedContext.llmOutput = `[Workflow LLM Response for: ${prompt}]`;
        return { status: "success", context: updatedContext };
      }
      case "mcp_tool": {
        const toolName = String(step.params?.toolName ?? "aster_get_ui_tree");
        updatedContext.mcpToolResult = { tool: toolName, status: "executed" };
        return { status: "success", context: updatedContext };
      }
      default:
        return { status: "success", context: updatedContext };
    }
  }

  async run(initialContext: Record<string, unknown> = {}): Promise<Record<string, unknown>> {
    let currentStepId: string | undefined = this.workflow.steps[0]?.id;
    let context = { ...initialContext };

    while (currentStepId) {
      const result = await this.executeStep(currentStepId, context);
      context = result.context;

      const currentStep = this.workflow.steps.find((s) => s.id === currentStepId);
      if (result.status === "success") {
        currentStepId = currentStep?.onSuccessNext;
      } else {
        currentStepId = currentStep?.onFailureNext;
      }
    }

    return context;
  }
}
