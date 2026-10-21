# Android, Built-in Aster MCP, and Custom LLM Features

## Overview
This repository includes native Android support (`apps/android`), built-in **Aster MCP** (`packages/agent/src/mcp/aster-mcp.ts`) for Android system and UI automation, and expanded **Custom LLM Provider capabilities** inspired by `brud` (`packages/agent/src/providers.ts`).

## Built-in Aster MCP Tools
The `aster-mcp` tools allow agents to interact with and automate Android devices natively:
- `aster_get_ui_tree`: Inspects the active accessibility node tree on the Android screen.
- `aster_tap`: Performs touch/tap actions at specific screen coordinates or UI element IDs.
- `aster_swipe`: Executes directional drag/swipe gestures across screen coordinates.
- `aster_input_text`: Enters string inputs into focused Android fields.
- `aster_launch_app`: Launches Android applications by package name.
- `aster_press_key`: Triggers system hardware keys (HOME, BACK, RECENTS, VOLUME, POWER).

## Custom LLM Provider Integration (brud pattern)
The agent provider engine supports arbitrary OpenAI-compatible and Anthropic-compatible endpoints, custom base URLs, custom API keys, Ollama, and local GGUF models:

### Custom Provider Configuration Example
```json
{
  "customProviders": [
    {
      "id": "custom-openai",
      "name": "Local LLM / vLLM Endpoint",
      "baseUrl": "http://localhost:8000/v1",
      "apiKey": "custom-key",
      "models": [{ "id": "llama-3-70b-instruct" }]
    },
    {
      "id": "custom-anthropic",
      "name": "Custom Anthropic Bridge",
      "baseUrl": "https://my-anthropic-proxy.com/v1",
      "apiKey": "sk-ant-custom",
      "api": "anthropic-messages",
      "models": [{ "id": "claude-3-5-sonnet" }]
    }
  ]
}
```

### Local Ollama / GGUF LLM Setup
Call `registerOllamaLocalProvider(registry, options)` to connect to local Ollama or GGUF endpoints (`http://127.0.0.1:11434/v1` by default).

## UI Widget & Accessibility Monitoring
The web frontend includes a status component (`apps/web/src/android-status-widget.ts`) for monitoring Android Accessibility Service state, Aster MCP connectivity, and device automation status in real time.

## Android Target Packaging (`apps/android`)
To build the Android application:
1. Ensure Capacitor CLI is installed: `pnpm --filter @abacus-ai/android build`
2. Sync capacitor assets to Android native wrapper: `pnpm --filter @abacus-ai/android cap:sync`
3. Open in Android Studio to build APK/AAB: `pnpm --filter @abacus-ai/android cap:open`
