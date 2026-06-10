# CLI Markdown → HTML Renderer Design

You can build this as a Node/TypeScript CLI that takes a `.md` file and emits a single self‑contained HTML file (or runs a tiny server) using `markdown-it` + plugins, Shiki for code highlighting, Mermaid.js for diagrams, and `github-markdown-css` for a GitHub‑like look. This gives you a very polished reading experience while staying simple and hackable.

Below is an architecture and concrete stack you can implement quickly.

---

## Overall approach

Goal: “Render AI‑agent generated Markdown plans/research into beautiful, readable HTML from the CLI.”

High‑level design:

- CLI command (e.g. `md-view plan.md`) that:
  - Reads the Markdown file.
  - Converts it to HTML with `markdown-it` (GFM, task lists, tables, footnotes, etc.).
  - Applies Shiki server‑side syntax highlighting for fenced code blocks so the HTML is fully static.
  - Wraps the output in a template using `github-markdown-css` to mimic GitHub’s excellent typography and layout.
  - Adds `<script>` for Mermaid.js and auto‑initializes ` ```mermaid ` blocks into diagrams in the browser.
  - Optionally starts a dev server (`--serve`) with auto‑reload while the MD file changes.

This is more focused than generic tools like Pandoc or MkDocs, but you can borrow their ideas and aesthetics.

---

## Core tech stack

### Markdown parsing

- **markdown-it** as the parser/renderer:
  - Fast JS Markdown parser with CommonMark and GFM tables, strikethrough, etc.
  - Plugin ecosystem: anchors, TOC, task lists, containers for callouts, etc.
- Add plugins:
  - `markdown-it-anchor` for linkable headings (for deep-linking in plans).
  - `markdown-it-toc-done-right` for a generated table of contents.
  - `markdown-it-task-lists` for `- [ ]` / `- [x]` GFM task lists.

These give you GitHub‑like semantics that match typical AI‑generated research docs.

### Styling / layout

- **github-markdown-css**:
  - Minimal CSS to replicate GitHub’s Markdown style.
  - Usage pattern: wrap your HTML content in `<article class="markdown-body">` and include the stylesheet.
  - CDN / npm delivery, including separate light/dark variants like `github-markdown-light.css` and `github-markdown-dark.css`.

You can layer your own layout shell around it: sidebar TOC, top toolbar, etc., while leaving typography to this CSS.

### Code highlighting

- **Shiki**:
  - VS Code–grade syntax highlighter (TextMate grammars + VS Code themes).
  - Generates HTML with inline `<span>` tags and classes or styles, no JS required at runtime.
  - Supports nearly all languages and lets you pick a VS Code theme (e.g. `github-dark`, `vscode-dark-plus`).

This will make code snippets look like your editor, and you can match your existing theme for familiarity.

### Mermaid diagrams

- **Mermaid.js in the browser**:
  - Mermaid is a JS diagramming library that turns ` ```mermaid ` text blocks into diagrams client‑side.
  - GitHub’s own approach: detect `mermaid` language blocks and let Mermaid.js render them in the browser.

In your HTML template, you:

- Include Mermaid CDN script.
- On DOMContentLoaded, find all `<pre><code class="language-mermaid">` blocks, extract text, replace with `<div class="mermaid">` and call `mermaid.init()`.

---

## CLI behavior and UX

### Basic commands

Design something like:

- `md-view plan.md`
  - Outputs `plan.html` next to the file (or to `stdout` with `--stdout`).
- `md-view plan.md --open`
  - Writes HTML and opens it in the default browser.
- `md-view plan.md --serve`
  - Starts a tiny static server (e.g. `http://localhost:4173`) and watches the `.md` file; re-renders on change.

This mirrors tools like `gh markdown-preview` (GitHub CLI extension that starts a local web server and serves rendered Markdown) and other Markdown‑preview CLIs, but under your control.

### Options

Add flags that map cleanly to your workflow:

- `--root` or `--repo-root` to resolve relative links (`./src/foo.ts`) correctly.
- `--theme` (e.g. `github-light`, `github-dark`, `system`) mapping to which CSS you include.
- `--title` override if docs lack a `# Heading` at the top.
- `--inline-css` to embed CSS into the HTML file vs linking external files for fully self‑contained artifacts.

---

## HTML template design

A good base template:

```html
<!doctype html>
<html lang="en" data-theme="system">
  <head>
    <meta charset="utf-8" />
    <title>{{title}}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <!-- GitHub markdown styles -->
    <link rel="stylesheet" href="{{githubMarkdownCssHref}}" />

    <!-- Your layout/TOC/theme styles -->
    <style>
      body {
        margin: 0;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }

      .layout {
        display: grid;
        grid-template-columns: minmax(0, 260px) minmax(0, 1fr);
        min-height: 100vh;
      }

      .sidebar {
        border-right: 1px solid #e5e7eb;
        padding: 1.5rem;
        overflow-y: auto;
      }

      .content-wrapper {
        padding: 2rem;
        overflow-x: hidden;
      }

      .markdown-body {
        box-sizing: border-box;
        min-width: 0;
        max-width: 980px;
        margin: 0 auto;
      }

      @media (max-width: 960px) {
        .layout {
          grid-template-columns: 1fr;
        }
        .sidebar {
          display: none;
        }
      }

      .code-block {
        position: relative;
      }

      .code-copy-btn {
        position: absolute;
        top: 8px;
        right: 8px;
        font-size: 0.75rem;
        padding: 0.15rem 0.4rem;
        border-radius: 4px;
        border: 1px solid #e5e7eb;
        background: rgba(249, 250, 251, 0.9);
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <div class="layout">
      <aside class="sidebar">
        {{tocHtml}}
      </aside>

      <main class="content-wrapper">
        <article class="markdown-body">
          {{contentHtml}}
        </article>
      </main>
    </div>

    <!-- Mermaid -->
    <script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>
    <script>
      mermaid.initialize({ startOnLoad: false, theme: "default" });

      document.addEventListener("DOMContentLoaded", () => {
        // Convert ```mermaid blocks
        document.querySelectorAll("pre code.language-mermaid").forEach((code) => {
          const pre = code.parentElement;
          const container = document.createElement("div");
          container.className = "mermaid";
          container.textContent = code.textContent;
          pre.replaceWith(container);
        });
        mermaid.run();

        // Add copy buttons
        document.querySelectorAll("pre > code").forEach((code) => {
          const pre = code.parentElement;
          pre.classList.add("code-block");
          const button = document.createElement("button");
          button.className = "code-copy-btn";
          button.textContent = "Copy";
          button.addEventListener("click", async () => {
            try {
              await navigator.clipboard.writeText(code.textContent);
              button.textContent = "Copied!";
              setTimeout(() => (button.textContent = "Copy"), 1500);
            } catch {}
          });
          pre.appendChild(button);
        });
      });
    </script>
  </body>
</html>
```

This uses `github-markdown-css`’s `.markdown-body` styles for the content area and a simple CSS grid for sidebar + main.

---

## Markdown → HTML pipeline (Node/TS)

You can glue this together roughly like:

```ts
import fs from "node:fs/promises";
import path from "node:path";
import MarkdownIt from "markdown-it";
import anchor from "markdown-it-anchor";
import toc from "markdown-it-toc-done-right";
import taskLists from "markdown-it-task-lists";
import shiki from "shiki";

type RenderOptions = {
  filePath: string;
  title?: string;
};

export async function renderMarkdownFileToHtml(opts: RenderOptions): Promise<string> {
  const mdText = await fs.readFile(opts.filePath, "utf8");

  const highlighter = await shiki.getHighlighter({
    theme: "github-dark-default", // or match your editor
  });

  const md = new MarkdownIt({
    html: true,
    linkify: true,
    highlight(code, lang) {
      try {
        if (lang && highlighter.getLoadedLanguages().includes(lang as any)) {
          return highlighter.codeToHtml(code, { lang });
        }
      } catch {
        // fallback
      }
      // default <pre><code> escape
      return `<pre><code>${md.utils.escapeHtml(code)}</code></pre>`;
    },
  })
    .use(anchor, { permalink: anchor.permalink.headerLink() })
    .use(taskLists, { enabled: true, label: true })
    .use(toc, { includeLevel: [2, 3, 4] });

  // Generate TOC by injecting placeholder in a temp render
  const tocPlaceholder = "__TOC_PLACEHOLDER__";
  const contentWithToc = `${tocPlaceholder}\n\n${mdText}`;
  const rendered = md.render(contentWithToc);

  const [tocHtml, contentHtml] = rendered.split(tocPlaceholder);

  const title =
    opts.title ||
    (mdText.match(/^#\s+(.+)$/m)?.[1] ??
      path.basename(opts.filePath, path.extname(opts.filePath)));

  return applyTemplate({
    title,
    tocHtml,
    contentHtml,
  });
}
```

- `markdown-it` handles Markdown; GFM tables and strikethrough are built-in.
- Shiki’s `codeToHtml` gives you fully highlighted code; you just drop the generated HTML directly into your page.
- Plugins give you anchors, TOC, and task lists.

`applyTemplate` just interpolates into the HTML template shown earlier.

---

## Handling AI‑agent–specific content

Your plans/research files will often have certain patterns that are worth special‑casing:

### Code blocks

- Shiki ensures multi‑language syntax highlighting with your preferred VS Code theme.
- Add:
  - Copy buttons (shown above).
  - Optional line numbers (Shiki’s HTML can be post‑processed to add them).
  - “Language pill” label in the top-right of the block.

### File links and repo navigation

- AI agents often output links like `./src/agents/planner.ts` or `docs/AGENTS.md`.
- For static HTML:
  - Use `--root` to know the repo root.
  - When rendering links, detect local relative paths and:
    - Keep them as-is so clicking opens them in your editor if you’re using a browser extension.
    - Or convert to `vscode://file/...` style URIs if you want 1‑click “open in VS Code” when run locally.
- For `--serve` mode:
  - Serve the whole repo directory; links to other `.md` files can be automatically routed through your renderer (turn `foo.md` → `foo.html` on the fly).

### Mermaid blocks

- AI agents already use ` ```mermaid ` in many ecosystems because that’s how GitHub, JetBrains, VS Code previews, etc. work.
- Your client‑side script auto‑converts these blocks, so nothing special is required in the Markdown.

---

## Beautification strategies

To “maximize the beautification” without over‑engineering:

- **Adopt GitHub’s Markdown style** for the core content:
  - Consistent heading hierarchy, spacing, and typography via `github-markdown-css`.
- **Add structure around it**:
  - Sticky sidebar TOC with active section highlighting (using `IntersectionObserver`).
  - A top breadcrumb or file path display (`/repo/docs/plan-2026-06-10.md`).
- **Dark/light mode**:
  - Use `prefers-color-scheme` plus `github-markdown-light.css` vs `github-markdown-dark.css`.
- **Callouts for important sections**:
  - Use `markdown-it-container` plugin for syntax like:
    - `::: info`, `::: warning`, `::: success`
  - Render custom boxes with icons/colors similar to Material for MkDocs’ admonitions that many people like.
- **Keyboard navigation**:
  - Add simple shortcuts: `[`/`]` to move between heading sections, `t` to focus search (if you later add a client‑side search box), inspired by doc frameworks like MkDocs Material.

This gives you a doc experience on par with light static site generators (MkDocs Material, Docsify) but with near‑zero setup for individual AI‑generated `.md` files.

---

## Reuse vs build: why this design

Existing tools like:

- `gh markdown-preview` (GitHub CLI extension) which calls GitHub’s Markdown API and uses GitHub CSS.
- `Glow` / `glowm` for rich terminal Markdown (including Mermaid).
- Pandoc and MkDocs for markdown→HTML and full doc sites.

are great, but they either:

- Focus on in‑terminal rendering, or
- Expect a full project with config and nav, or
- Don’t integrate Mermaid + Shiki + GitHub CSS + AI‑agent conventions out of the box.

Your custom CLI sits in the sweet spot: single‑file input, rich HTML output, tightly tailored to AI coding assistant output, built on well‑maintained open‑source components (`markdown-it`, Shiki, Mermaid, `github-markdown-css`).
