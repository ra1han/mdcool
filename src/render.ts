import MarkdownIt from "markdown-it";
import anchor from "markdown-it-anchor";
import taskLists from "markdown-it-task-lists";
import { createHighlighter } from "./highlight.js";

export type RenderOptions = {
  theme: "light" | "dark";
};

export type RenderResult = {
  contentHtml: string;
  title: string;
};

export async function renderMarkdown(
  mdText: string,
  opts: RenderOptions
): Promise<RenderResult> {
  const highlight = await createHighlighter(opts.theme);

  const md = new MarkdownIt({
    html: true,
    linkify: true,
    highlight(code: string, lang: string): string {
      // Preserve mermaid blocks for client-side rendering
      if (lang === "mermaid") {
        const escaped = code
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
        return `<pre><code class="language-mermaid">${escaped}</code></pre>`;
      }
      return highlight(code, lang);
    },
  });

  md.use(anchor, { permalink: false, slugify: slugify });
  md.use(taskLists, { enabled: true, label: true });

  const contentHtml = md.render(mdText);
  const title = extractTitle(mdText);

  return { contentHtml, title };
}

function extractTitle(mdText: string): string {
  const match = mdText.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : "Untitled";
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
