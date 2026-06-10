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
  const { content, frontmatter } = stripFrontmatter(mdText);
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

  const rawHtml = md.render(content);
  const withAlerts = renderGitHubAlerts(rawHtml);
  const withTables = wrapTables(withAlerts);
  const contentHtml = wrapSectionsCollapsible(withTables);
  const title = frontmatter?.title || extractTitle(content);

  // Build the page preamble
  const parts: string[] = [];

  // Render frontmatter metadata as a info bar (don't inject title as h1)
  if (frontmatter && Object.keys(frontmatter).length > 0) {
    const meta = renderFrontmatterMeta(frontmatter);
    if (meta) parts.push(meta);
  }

  parts.push(contentHtml);
  return { contentHtml: parts.join("\n"), title };
}

function extractTitle(mdText: string): string {
  const match = mdText.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : "Untitled";
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const META_LABELS: Record<string, string> = {
  title: "📄 Title",
  author: "👤 Author",
  "ms.date": "📅 Date",
  date: "📅 Date",
  description: "📝 Description",
  "ms.topic": "📂 Topic",
  topic: "📂 Topic",
  keywords: "🏷️ Keywords",
  sidebar_position: "📌 Position",
};

function renderFrontmatterMeta(fm: Record<string, string>): string {
  const items: string[] = [];
  for (const [key, value] of Object.entries(fm)) {
    const label = META_LABELS[key] || key;
    items.push(`<span class="meta-item"><strong>${escapeHtml(label)}</strong> ${escapeHtml(value)}</span>`);
  }
  if (items.length === 0) return "";
  return `<div class="frontmatter-meta">${items.join("")}</div>`;
}

const ALERT_ICONS: Record<string, { icon: string; cssClass: string }> = {
  NOTE: { icon: "ℹ️", cssClass: "alert-note" },
  TIP: { icon: "💡", cssClass: "alert-tip" },
  IMPORTANT: { icon: "❗", cssClass: "alert-important" },
  WARNING: { icon: "⚠️", cssClass: "alert-warning" },
  CAUTION: { icon: "🔴", cssClass: "alert-caution" },
};

function renderGitHubAlerts(html: string): string {
  // Convert GitHub-style alerts: <blockquote><p>[!NOTE]\nContent</p></blockquote>
  return html.replace(
    /<blockquote>\s*<p>\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*\n?([\s\S]*?)<\/p>\s*<\/blockquote>/gi,
    (_match, type: string, content: string) => {
      const key = type.toUpperCase();
      const alert = ALERT_ICONS[key] || ALERT_ICONS.NOTE;
      return `<div class="github-alert ${alert.cssClass}">` +
        `<span class="github-alert-title">${alert.icon} ${key.charAt(0) + key.slice(1).toLowerCase()}</span>` +
        `<p>${content.trim()}</p></div>`;
    }
  );
}

function stripFrontmatter(mdText: string): { content: string; frontmatter: Record<string, string> | null } {
  const fmRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/;
  const match = mdText.match(fmRegex);
  if (!match) return { content: mdText, frontmatter: null };

  const content = mdText.slice(match[0].length);
  const frontmatter: Record<string, string> = {};

  // Parse YAML: handles scalars and simple lists
  const lines = match[1].split(/\r?\n/);
  let currentKey: string | null = null;
  let listItems: string[] = [];

  for (const line of lines) {
    const kv = line.match(/^(\w[\w.]*)\s*:\s*(.*)$/);
    if (kv) {
      // Flush previous list
      if (currentKey && listItems.length > 0) {
        frontmatter[currentKey] = listItems.join(", ");
        listItems = [];
      }
      currentKey = kv[1];
      const value = kv[2].trim();
      if (value) {
        frontmatter[currentKey] = value;
        currentKey = null;
      }
    } else {
      // List item under current key
      const listItem = line.match(/^\s+-\s+(.+)$/);
      if (listItem && currentKey) {
        listItems.push(listItem[1].trim());
      }
    }
  }
  // Flush final list
  if (currentKey && listItems.length > 0) {
    frontmatter[currentKey] = listItems.join(", ");
  }

  return { content, frontmatter };
}

function wrapTables(html: string): string {
  return html.replace(/<table>/g, '<div class="table-wrapper"><table>').replace(/<\/table>/g, '</table></div>');
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
