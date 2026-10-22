import { describe, expect, it } from "vitest";
import { createModelRuntime, registerCustomProviders, registerOllamaLocalProvider } from "./providers.js";

describe("Custom & Ollama/Local LLM Providers (brud pattern)", () => {
  it("registers custom OpenAI and Anthropic compatible providers with custom base URLs and keys", async () => {
    const runtime = await createModelRuntime("/tmp/test-agent-dir");

    registerCustomProviders(runtime as any, {
      customProviders: [
        {
          id: "custom-openai",
          name: "My OpenAI Compatible Server",
          baseUrl: "https://my-custom-llm.example.com/v1",
          apiKey: "sk-custom-key-123",
          models: [{ id: "model-v1", name: "Custom Model V1" }]
        },
        {
          id: "custom-anthropic",
          name: "My Anthropic Compatible Server",
          baseUrl: "https://my-anthropic.example.com/v1",
          apiKey: "sk-ant-key-456",
          api: "anthropic-messages",
          models: [{ id: "claude-custom-1", name: "Custom Claude 1" }]
        }
      ]
    });

    const registered1 = (runtime as any).getProvider("custom-openai");
    expect(registered1).toBeDefined();
    expect(registered1.name).toBe("My OpenAI Compatible Server");

    const registered2 = (runtime as any).getProvider("custom-anthropic");
    expect(registered2).toBeDefined();
    expect(registered2.name).toBe("My Anthropic Compatible Server");
  });

  it("registers Ollama / Local .gguf provider", async () => {
    const runtime = await createModelRuntime("/tmp/test-agent-dir");

    registerOllamaLocalProvider(runtime as any, {
      baseUrl: "http://localhost:11434/v1",
      apiKey: "ollama-local",
      models: [{ id: "qwen-coder.gguf", name: "Qwen Coder GGUF" }]
    });

    const registered = (runtime as any).getProvider("ollama-local");
    expect(registered).toBeDefined();
    expect(registered.name).toBe("Ollama / Local GGUF LLM");
  });
});
