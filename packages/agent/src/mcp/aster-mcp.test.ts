import { describe, expect, it } from "vitest";
import { getAsterBuiltinTools } from "./aster-mcp.js";

describe("aster-mcp built-in tools", () => {
  it("exports required Android accessibility and automation tools", () => {
    const tools = getAsterBuiltinTools();
    const names = tools.map((t) => t.name);

    expect(names).toContain("aster_get_ui_tree");
    expect(names).toContain("aster_tap");
    expect(names).toContain("aster_swipe");
    expect(names).toContain("aster_input_text");
    expect(names).toContain("aster_launch_app");
    expect(names).toContain("aster_press_key");
  });

  it("executes aster_tap tool handler correctly", async () => {
    const tools = getAsterBuiltinTools();
    const tapTool = tools.find((t) => t.name === "aster_tap");
    expect(tapTool).toBeDefined();

    const res = await tapTool!.handler({ x: 100, y: 200 });
    expect(res.text).toContain("100, 200");
  });
});
