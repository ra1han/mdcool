import { describe, it, expect } from "vitest";
import { createHighlighter } from "../src/highlight.js";

describe("createHighlighter", () => {
  it("highlights JavaScript code with spans", async () => {
    const highlight = await createHighlighter("dark");
    const result = highlight("const x = 1;", "javascript");

    expect(result).toContain("<pre");
    expect(result).toContain("<span");
    expect(result).not.toContain("const x = 1;"); // should be tokenized
  });

  it("returns escaped HTML for unknown languages", async () => {
    const highlight = await createHighlighter("dark");
    const result = highlight("hello world", "unknownlang123");

    expect(result).toContain("<pre><code>");
    expect(result).toContain("hello world");
  });

  it("uses light theme when specified", async () => {
    const highlight = await createHighlighter("light");
    const result = highlight("const x = 1;", "javascript");

    expect(result).toContain("<pre");
    expect(result).toContain("<span");
  });
});
