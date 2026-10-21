import { describe, expect, it } from "vitest";
import { applyAntiSlopFilter, applyUniversalCodeMod } from "./integrated-skills.js";

describe("Integrated Agent Skills (anti-slop & universal-modder)", () => {
  it("filters generic comments and hype copy using anti-slop rules", () => {
    const rawInput = `// Initialize variables\nconst x = 10;\n// Setup config\nconst latency = "0.0001ms latency";`;
    const filtered = applyAntiSlopFilter(rawInput);

    expect(filtered).not.toContain("// Initialize");
    expect(filtered).not.toContain("// Setup");
    expect(filtered).toContain("Reliable Performance");
  });

  it("modifies source code safely using universal code modder tasks", () => {
    const code = `function hello() { return "old_value"; }`;
    const modified = applyUniversalCodeMod(code, [
      {
        targetFilePath: "test.ts",
        searchPattern: "old_value",
        replacement: "new_value"
      }
    ]);

    expect(modified).toContain("new_value");
    expect(modified).not.toContain("old_value");
  });
});
