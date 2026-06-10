import { describe, it, expect } from "vitest";
import { buildHtml } from "../src/template.js";

describe("buildHtml", () => {
  it("produces valid HTML with content and title", () => {
    const html = buildHtml({
      title: "My Plan",
      contentHtml: "<h1>Hello</h1>",
      theme: "dark",
    });

    expect(html).toContain("<!doctype html>");
    expect(html).toContain("<title>My Plan</title>");
    expect(html).toContain('<article class="markdown-body">');
    expect(html).toContain("<h1>Hello</h1>");
  });

  it("uses dark github-markdown CSS for dark theme", () => {
    const html = buildHtml({
      title: "Test",
      contentHtml: "<p>hi</p>",
      theme: "dark",
    });

    expect(html).toContain("github-markdown-dark");
  });

  it("uses light github-markdown CSS for light theme", () => {
    const html = buildHtml({
      title: "Test",
      contentHtml: "<p>hi</p>",
      theme: "light",
    });

    expect(html).toContain("github-markdown-light");
  });

  it("includes mermaid script", () => {
    const html = buildHtml({
      title: "Test",
      contentHtml: "<p>hi</p>",
      theme: "dark",
    });

    expect(html).toContain("mermaid");
  });
});
