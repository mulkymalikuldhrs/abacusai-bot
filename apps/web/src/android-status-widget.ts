/**
 * Android Device & Aster MCP UI Status Component
 * Displays live Android accessibility status, aster-mcp connection, and device automation controls.
 */

export interface AndroidDeviceStatus {
  connected: boolean;
  deviceName?: string;
  androidVersion?: string;
  accessibilityEnabled: boolean;
  asterMcpStatus: "active" | "inactive" | "connecting";
}

export function renderAndroidStatusWidget(status: AndroidDeviceStatus): string {
  const badgeColor = status.asterMcpStatus === "active" ? "#10B981" : "#F59E0B";
  return `
    <div class="android-status-card" style="padding: 16px; border-radius: 12px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1);">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="width: 10px; height: 10px; border-radius: 50%; background-color: ${badgeColor}; display: inline-block;"></span>
          <strong style="font-size: 14px;">Android Aster MCP</strong>
        </div>
        <span style="font-size: 12px; opacity: 0.8;">${status.deviceName ?? "Device Connected"}</span>
      </div>
      <div style="margin-top: 10px; font-size: 12px; opacity: 0.7; display: flex; gap: 12px;">
        <span>Accessibility: ${status.accessibilityEnabled ? "Enabled" : "Disabled"}</span>
        <span>Version: ${status.androidVersion ?? "Android 14+"}</span>
      </div>
    </div>
  `;
}
