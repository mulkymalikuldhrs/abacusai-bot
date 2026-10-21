/**
 * Model & Skill Selection Filter UI Component
 * Provides anti-slop copy mode toggles and local model configuration presets.
 */

export interface ModelSkillUiConfig {
  antiSlopMode: "during" | "after" | "off";
  enableLocalGguf: boolean;
  asterMcpAutoConnect: boolean;
}

export function renderModelSkillSettings(config: ModelSkillUiConfig): string {
  return `
    <div class="skill-settings-panel" style="padding: 20px; border-radius: 12px; background: #18181b; color: #f4f4f5; font-family: sans-serif;">
      <h3 style="margin-top: 0; font-size: 16px; font-weight: 600;">Agent Capabilities & Quality Filters</h3>
      <div style="margin-bottom: 16px;">
        <label style="display: block; font-size: 13px; margin-bottom: 6px;">Anti-Slop Quality Gate</label>
        <select style="width: 100%; padding: 8px; border-radius: 6px; background: #27272a; color: #fff; border: 1px solid #3f3f46;">
          <option value="during" ${config.antiSlopMode === "during" ? "selected" : ""}>During (Real-time Filtering)</option>
          <option value="after" ${config.antiSlopMode === "after" ? "selected" : ""}>After (Audit Mode)</option>
          <option value="off" ${config.antiSlopMode === "off" ? "selected" : ""}>Off</option>
        </select>
      </div>
      <div style="display: flex; flex-direction: column; gap: 10px; font-size: 13px;">
        <label style="display: flex; align-items: center; gap: 8px;">
          <input type="checkbox" ${config.enableLocalGguf ? "checked" : ""} />
          Enable Local GGUF / Ollama Model Loader
        </label>
        <label style="display: flex; align-items: center; gap: 8px;">
          <input type="checkbox" ${config.asterMcpAutoConnect ? "checked" : ""} />
          Auto-connect Aster MCP Android Automation
        </label>
      </div>
    </div>
  `;
}
