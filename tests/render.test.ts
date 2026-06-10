import { describe, it, expect } from "vitest";
import { renderMarkdown } from "../src/render.js";

describe("renderMarkdown", () => {
  it("renders basic markdown to HTML", async () => {
    const result = await renderMarkdown("# Hello\n\nWorld", { theme: "dark" });

    expect(result.contentHtml).toContain("<h1");
    expect(result.contentHtml).toContain("Hello");
    expect(result.contentHtml).toContain("<p>World</p>");
    expect(result.title).toBe("Hello");
  });

  it("renders GFM task lists", async () => {
    const md = "- [x] Done\n- [ ] Todo";
    const result = await renderMarkdown(md, { theme: "dark" });

    expect(result.contentHtml).toContain('type="checkbox"');
    expect(result.contentHtml).toContain("checked");
  });

  it("highlights fenced code blocks", async () => {
    const md = "```javascript\nconst x = 1;\n```";
    const result = await renderMarkdown(md, { theme: "dark" });

    expect(result.contentHtml).toContain("<span");
  });

  it("preserves mermaid blocks as language-mermaid", async () => {
    const md = "```mermaid\ngraph TD;\nA-->B;\n```";
    const result = await renderMarkdown(md, { theme: "dark" });

    expect(result.contentHtml).toContain("language-mermaid");
    expect(result.contentHtml).toContain("graph TD;");
  });

  it("extracts title from first h1 heading", async () => {
    const md = "# My Plan\n\nContent here";
    const result = await renderMarkdown(md, { theme: "dark" });

    expect(result.title).toBe("My Plan");
  });

  it("uses fallback title when no h1 present", async () => {
    const md = "No heading here\n\nJust paragraphs";
    const result = await renderMarkdown(md, { theme: "dark" });

    expect(result.title).toBe("Untitled");
  });

  it("adds anchor links to headings", async () => {
    const md = "## Section One\n\nContent";
    const result = await renderMarkdown(md, { theme: "dark" });

    expect(result.contentHtml).toContain('id="section-one"');
    expect(result.contentHtml).toContain("<details");
    expect(result.contentHtml).toContain("<summary>Section One</summary>");
  });
});
