# Integrated Skills & Advanced Workflow Engine

## Overview
AbacusAI Bot incorporates integrated skills and agent capabilities inspired by:
- **`rea`** (Reverse engineering & binary/app analysis capabilities)
- **`anti-slop`** (Output quality filtering, non-verbose code cleanup, hype filtering)
- **`universal-modder`** (Modular code modding tasks and asset pipeline hooks)
- **`hermes agents` & `opencode`** (Multi-step agent workflow execution)

## Anti-Slop Quality Gate
Located in `packages/agent/src/integrated-skills.ts`, the anti-slop filter cleans AI output by:
1. Stripping redundant, trivial comments (`// Initialize ...`, `// Helper function`).
2. Cleaning hype copy or fake statistics.
3. Normalizing markdown hygiene and formatting.

Usage:
```typescript
import { applyAntiSlopFilter } from "./integrated-skills.js";

const cleanOutput = applyAntiSlopFilter(rawAgentOutput, {
  removeGenericComments: true,
  removeFakeStats: true,
  cleanMarkdown: true
});
```

## Universal Code Modder Utility
The code modder allows safe search-and-replace code transformations across files:
```typescript
import { applyUniversalCodeMod } from "./integrated-skills.js";

const updatedCode = applyUniversalCodeMod(sourceCode, [
  {
    targetFilePath: "src/app.ts",
    searchPattern: "old_setting",
    replacement: "new_setting"
  }
]);
```

## Multi-Step Workflow Engine
Located in `packages/agent/src/workflow-engine.ts`, the `AgentWorkflowRunner` handles complex agent routines:
- Step-by-step stateful execution loops
- Failure fallback branching
- Conditional step evaluation (`condition`, `llm_generate`, `mcp_tool`, `transform`)
