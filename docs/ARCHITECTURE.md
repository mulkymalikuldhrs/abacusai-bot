# Architecture & Dependency Graph

```
                   +-----------------------+
                   |    abacusai-bot       |
                   +-----------+-----------+
                               |
       +-----------------------+-----------------------+
       |                       |                       |
+------v-------+        +------v-------+        +------v-------+
|  apps/web    |        | apps/desktop |        | apps/android |  (New Android Target)
+------+-------+        +------+-------+        +------+-------+
       |                       |                       |
       +-----------------------+-----------------------+
                               |
                   +-----------v-----------+
                   |    @abacus-ai/host    |
                   +-----------+-----------+
                               |
                   +-----------v-----------+
                   |   @abacus-ai/agent    |
                   +-----------+-----------+
                               |
       +-----------------------+-----------------------+
       |                       |                       |
+------v-------+        +------v-------+        +------v-------+
| MCP Engine   |        | Built-in MCP |        | Extended AI  |
| (mcp/client) |        | (aster-mcp)  |        | Providers    |
+--------------+        +--------------+        +--------------+
                                                  (Custom Base URL,
                                                   Keys, Anthropic,
                                                   OpenAI, Ollama/.gguf)
```

## Component Overview
1. **`apps/android`**: Android application package (Capacitor / Android wrapper with full manifest system permissions for accessibility, storage, and network).
2. **`packages/agent/src/mcp/aster-mcp.ts`**: Built-in `aster-mcp` integration providing Android system automation tools, device controls, and accessibility capabilities directly to the agent.
3. **`packages/agent/src/providers.ts` & `model-catalog.ts`**: Enhanced AI model provider layer inspired by `brud`, supporting custom base URLs, custom API keys, OpenAI-compatible endpoints, Anthropic-compatible endpoints, Ollama, and local `.gguf` models.
