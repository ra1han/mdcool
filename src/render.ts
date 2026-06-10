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

  const rawHtml = md.render(mdText);
  const contentHtml = wrapSectionsCollapsible(rawHtml);
  const title = extractTitle(mdText);

  return { contentHtml, title };
}

function extractTitle(mdText: string): string {
  const match = mdText.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : "Untitled";
}

function wrapSectionsCollapsible(html: string): string {
  // Split HTML at h2 boundaries and wrap each section in <details>
  const h2Regex = /(<h2([^>]*)>)(.*?)(<\/h2>)/gi;
  const parts: string[] = [];

  const matches: { index: number; fullMatch: string; attrs: string; heading: string }[] = [];
  let match: RegExpExecArray | null;
  while ((match = h2Regex.exec(html)) !== null) {
    matches.push({
      index: match.index,
      fullMatch: match[0],
      attrs: match[2],
      heading: match[3],
    });
  }

  if (matches.length === 0) return html;

  // Content before the first h2 (e.g., h1 title, intro paragraphs)
  parts.push(html.slice(0, matches[0].index));

  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index;
    const end = i + 1 < matches.length ? matches[i + 1].index : html.length;
    const sectionContent = html.slice(start + matches[i].fullMatch.length, end);

    // Preserve id attribute from the heading on the details element
    const idMatch = matches[i].attrs.match(/id="([^"]+)"/);
    const idAttr = idMatch ? ` id="${idMatch[1]}"` : "";

    parts.push(
      `<details class="collapsible-section"${idAttr}>\n` +
      `<summary>${matches[i].heading}</summary>\n` +
      `${sectionContent}` +
      `</details>\n`
    );
  }

  return parts.join("");
}


function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
