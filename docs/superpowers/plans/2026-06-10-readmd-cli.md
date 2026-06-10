# readmd CLI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a CLI tool that renders Markdown files into polished HTML pages with GitHub styling, Shiki syntax highlighting, and Mermaid diagram support.

**Architecture:** Single-pass pipeline: read `.md` → parse with markdown-it + plugins → highlight code with Shiki → inject into HTML template → write output. Serve mode adds chokidar file watching and WebSocket-based live reload.

**Tech Stack:** TypeScript (ESM), markdown-it, Shiki, commander, chokidar, ws

---

## File Structure

```
readmd/
├── package.json          # Package config, bin entry, scripts
├── tsconfig.json         # TypeScript config (ESM, Node18+)
├── src/
│   ├── cli.ts            # CLI entry point — parses args, dispatches to render or serve
│   ├── render.ts         # Core pipeline — markdown-it setup, Shiki integration, template injection
│   ├── template.ts       # HTML template string with placeholder substitution
│   ├── highlight.ts      # Shiki highlighter factory (lazy singleton)
│   └── serve.ts          # HTTP server + WebSocket + chokidar watcher
├── tests/
│   ├── render.test.ts    # Unit tests for the rendering pipeline
│   ├── template.test.ts  # Unit tests for template generation
│   ├── highlight.test.ts # Unit tests for highlighter
│   └── cli.test.ts       # Integration tests for CLI argument handling
└── README.md             # Usage docs
```

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `src/cli.ts` (placeholder)

- [ ] **Step 1: Initialize package.json**

```bash
cd c:\work\readmd
npm init -y
```

Then edit `package.json` to:

```json
{
  "name": "readmd",
  "version": "0.1.0",
  "description": "Render Markdown files to beautiful HTML from the CLI",
  "type": "module",
  "bin": {
    "readmd": "./dist/cli.js"
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "engines": {
    "node": ">=18"
  },
  "keywords": ["markdown", "html", "cli", "renderer"],
  "license": "MIT"
}
```

- [ ] **Step 2: Install dev dependencies**

```bash
npm install --save-dev typescript vitest @types/node
```

- [ ] **Step 3: Install runtime dependencies**

```bash
npm install markdown-it markdown-it-anchor markdown-it-task-lists shiki commander chokidar ws open
npm install --save-dev @types/markdown-it @types/ws
```

- [ ] **Step 4: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

- [ ] **Step 5: Create placeholder CLI entry**

Create `src/cli.ts`:

```typescript
#!/usr/bin/env node
console.log("readmd - coming soon");
```

- [ ] **Step 6: Verify build works**

```bash
npm run build
node dist/cli.js
```

Expected: prints "readmd - coming soon"

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json tsconfig.json src/cli.ts
git commit -m "feat: scaffold project with TypeScript, deps, and build"
```

---

### Task 2: HTML Template

**Files:**
- Create: `src/template.ts`
- Create: `tests/template.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/template.test.ts`:

```typescript
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
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/template.test.ts
```

Expected: FAIL — cannot find module `../src/template.js`

- [ ] **Step 3: Write the template module**

Create `src/template.ts`:

```typescript
export type TemplateOptions = {
  title: string;
  contentHtml: string;
  theme: "light" | "dark";
};

const GITHUB_CSS_CDN = "https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.6.1";
const MERMAID_CDN = "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js";

export function buildHtml(opts: TemplateOptions): string {
  const cssFile = opts.theme === "light" ? "github-markdown-light.css" : "github-markdown-dark.css";
  const bgColor = opts.theme === "light" ? "#ffffff" : "#0d1117";
  const cssHref = `${GITHUB_CSS_CDN}/${cssFile}`;

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(opts.title)}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="${cssHref}">
  <style>
    body {
      margin: 0;
      padding: 2rem 1rem;
      background: ${bgColor};
    }
    .markdown-body {
      box-sizing: border-box;
      min-width: 200px;
      max-width: 980px;
      margin: 0 auto;
    }
    .code-block-wrapper {
      position: relative;
    }
    .code-copy-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      font-size: 0.75rem;
      padding: 2px 8px;
      border-radius: 4px;
      border: 1px solid rgba(255,255,255,0.2);
      background: rgba(110,118,129,0.4);
      color: #c9d1d9;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.15s;
    }
    .code-block-wrapper:hover .code-copy-btn {
      opacity: 1;
    }
  </style>
</head>
<body>
  <article class="markdown-body">
    ${opts.contentHtml}
  </article>
  <script src="${MERMAID_CDN}"></script>
  <script>
    mermaid.initialize({ startOnLoad: false, theme: "${opts.theme === "light" ? "default" : "dark"}" });
    document.addEventListener("DOMContentLoaded", () => {
      document.querySelectorAll("pre code.language-mermaid").forEach((code) => {
        const pre = code.parentElement;
        const container = document.createElement("div");
        container.className = "mermaid";
        container.textContent = code.textContent;
        pre.replaceWith(container);
      });
      mermaid.run();

      document.querySelectorAll("pre > code").forEach((code) => {
        const pre = code.parentElement;
        const wrapper = document.createElement("div");
        wrapper.className = "code-block-wrapper";
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);
        const btn = document.createElement("button");
        btn.className = "code-copy-btn";
        btn.textContent = "Copy";
        btn.addEventListener("click", async () => {
          await navigator.clipboard.writeText(code.textContent);
          btn.textContent = "Copied!";
          setTimeout(() => btn.textContent = "Copy", 1500);
        });
        wrapper.appendChild(btn);
      });
    });
  </script>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run tests/template.test.ts
```

Expected: all 4 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/template.ts tests/template.test.ts
git commit -m "feat: add HTML template with theme support and mermaid/copy-button scripts"
```

---

### Task 3: Shiki Highlighter

**Files:**
- Create: `src/highlight.ts`
- Create: `tests/highlight.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/highlight.test.ts`:

```typescript
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
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/highlight.test.ts
```

Expected: FAIL — cannot find module `../src/highlight.js`

- [ ] **Step 3: Write the highlighter module**

Create `src/highlight.ts`:

```typescript
import { createHighlighter as shikiCreateHighlighter, type Highlighter } from "shiki";

type HighlightFn = (code: string, lang: string) => string;

export async function createHighlighter(theme: "light" | "dark"): Promise<HighlightFn> {
  const themeName = theme === "light" ? "github-light" : "github-dark";

  const highlighter: Highlighter = await shikiCreateHighlighter({
    themes: [themeName],
    langs: [
      "javascript", "typescript", "python", "go", "rust", "java",
      "json", "yaml", "toml", "html", "css", "bash", "shell",
      "sql", "markdown", "diff", "dockerfile", "graphql",
    ],
  });

  return (code: string, lang: string): string => {
    try {
      return highlighter.codeToHtml(code, { lang, theme: themeName });
    } catch {
      // Unknown language — fall back to plain escaped text
      const escaped = code
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      return `<pre><code>${escaped}</code></pre>`;
    }
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run tests/highlight.test.ts
```

Expected: all 3 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/highlight.ts tests/highlight.test.ts
git commit -m "feat: add Shiki-based code highlighter with light/dark theme support"
```

---

### Task 4: Markdown Rendering Pipeline

**Files:**
- Create: `src/render.ts`
- Create: `tests/render.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/render.test.ts`:

```typescript
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
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/render.test.ts
```

Expected: FAIL — cannot find module `../src/render.js`

- [ ] **Step 3: Write the render module**

Create `src/render.ts`:

```typescript
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
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run tests/render.test.ts
```

Expected: all 7 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/render.ts tests/render.test.ts
git commit -m "feat: add markdown rendering pipeline with highlighting and mermaid support"
```

---

### Task 5: CLI Entry Point

**Files:**
- Modify: `src/cli.ts`
- Create: `tests/cli.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/cli.test.ts`:

```typescript
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

describe("CLI", () => {
  let tmpDir: string;
  let mdFile: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "readmd-test-"));
    mdFile = path.join(tmpDir, "test.md");
    fs.writeFileSync(mdFile, "# Hello\n\nWorld\n\n```js\nconst x = 1;\n```\n");
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("generates HTML file from markdown", () => {
    execSync(`node dist/cli.js "${mdFile}"`, { encoding: "utf8" });

    const outFile = path.join(tmpDir, "test.html");
    expect(fs.existsSync(outFile)).toBe(true);

    const html = fs.readFileSync(outFile, "utf8");
    expect(html).toContain("<!doctype html>");
    expect(html).toContain("Hello");
    expect(html).toContain("World");
  });

  it("outputs to stdout with --stdout", () => {
    const output = execSync(`node dist/cli.js "${mdFile}" --stdout`, {
      encoding: "utf8",
    });

    expect(output).toContain("<!doctype html>");
    expect(output).toContain("Hello");
  });

  it("uses custom output path with --out", () => {
    const outFile = path.join(tmpDir, "custom.html");
    execSync(`node dist/cli.js "${mdFile}" --out "${outFile}"`, {
      encoding: "utf8",
    });

    expect(fs.existsSync(outFile)).toBe(true);
  });

  it("uses light theme with --theme light", () => {
    const output = execSync(`node dist/cli.js "${mdFile}" --stdout --theme light`, {
      encoding: "utf8",
    });

    expect(output).toContain("github-markdown-light");
  });

  it("exits with error for missing file", () => {
    expect(() => {
      execSync(`node dist/cli.js nonexistent.md`, {
        encoding: "utf8",
        stdio: "pipe",
      });
    }).toThrow();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run build && npx vitest run tests/cli.test.ts
```

Expected: FAIL — CLI only prints "coming soon", no file generated

- [ ] **Step 3: Implement the CLI**

Replace `src/cli.ts` with:

```typescript
#!/usr/bin/env node

import { program } from "commander";
import fs from "node:fs/promises";
import path from "node:path";
import { renderMarkdown } from "./render.js";
import { buildHtml } from "./template.js";

program
  .name("readmd")
  .description("Render Markdown files to beautiful HTML")
  .version("0.1.0")
  .argument("<file>", "Markdown file to render")
  .option("--open", "Open in default browser after generating")
  .option("--serve", "Watch mode with live reload")
  .option("--theme <theme>", "Color theme (light or dark)", "dark")
  .option("--out <path>", "Custom output file path")
  .option("--port <number>", "Port for serve mode", "4567")
  .option("--stdout", "Output HTML to stdout")
  .action(async (file: string, opts) => {
    const filePath = path.resolve(file);

    try {
      await fs.access(filePath);
    } catch {
      console.error(`Error: file not found: ${filePath}`);
      process.exit(1);
    }

    const mdText = await fs.readFile(filePath, "utf8");
    const theme = opts.theme === "light" ? "light" : "dark";

    if (opts.serve) {
      const { startServer } = await import("./serve.js");
      await startServer(filePath, { theme, port: parseInt(opts.port, 10) });
      return;
    }

    const { contentHtml, title } = await renderMarkdown(mdText, { theme });
    const html = buildHtml({ title, contentHtml, theme });

    if (opts.stdout) {
      process.stdout.write(html);
      return;
    }

    const outPath = opts.out
      ? path.resolve(opts.out)
      : filePath.replace(/\.md$/i, ".html");

    await fs.writeFile(outPath, html, "utf8");
    console.log(`Written: ${outPath}`);

    if (opts.open) {
      const { default: open } = await import("open");
      await open(outPath);
    }
  });

program.parse();
```

- [ ] **Step 4: Build and run tests**

```bash
npm run build && npx vitest run tests/cli.test.ts
```

Expected: all 5 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/cli.ts tests/cli.test.ts
git commit -m "feat: implement CLI with file output, stdout, theme, and open support"
```

---

### Task 6: Serve Mode with Live Reload

**Files:**
- Create: `src/serve.ts`

- [ ] **Step 1: Write the serve module**

Create `src/serve.ts`:

```typescript
import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { WebSocketServer, WebSocket } from "ws";
import { watch } from "chokidar";
import { renderMarkdown } from "./render.js";
import { buildHtml } from "./template.js";

export type ServeOptions = {
  theme: "light" | "dark";
  port: number;
};

export async function startServer(
  filePath: string,
  opts: ServeOptions
): Promise<void> {
  let currentHtml = await renderFile(filePath, opts.theme);

  const server = http.createServer((_req, res) => {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(injectLiveReload(currentHtml, opts.port));
  });

  const wss = new WebSocketServer({ server });
  const clients = new Set<WebSocket>();

  wss.on("connection", (ws) => {
    clients.add(ws);
    ws.on("close", () => clients.delete(ws));
  });

  const watcher = watch(filePath, { ignoreInitial: true });
  watcher.on("change", async () => {
    try {
      currentHtml = await renderFile(filePath, opts.theme);
      for (const client of clients) {
        if (client.readyState === WebSocket.OPEN) {
          client.send("reload");
        }
      }
      console.log(`[readmd] Reloaded: ${path.basename(filePath)}`);
    } catch (err) {
      console.error(`[readmd] Render error:`, err);
    }
  });

  server.listen(opts.port, () => {
    const url = `http://localhost:${opts.port}`;
    console.log(`[readmd] Serving: ${path.basename(filePath)}`);
    console.log(`[readmd] URL: ${url}`);
    console.log(`[readmd] Watching for changes... (Ctrl+C to stop)`);
  });

  // Keep process alive
  process.on("SIGINT", () => {
    watcher.close();
    wss.close();
    server.close();
    process.exit(0);
  });
}

async function renderFile(filePath: string, theme: "light" | "dark"): Promise<string> {
  const mdText = await fs.readFile(filePath, "utf8");
  const { contentHtml, title } = await renderMarkdown(mdText, { theme });
  return buildHtml({ title, contentHtml, theme });
}

function injectLiveReload(html: string, port: number): string {
  const script = `
<script>
  (function() {
    const ws = new WebSocket("ws://localhost:${port}");
    ws.onmessage = () => location.reload();
    ws.onclose = () => setTimeout(() => location.reload(), 1000);
  })();
</script>`;
  return html.replace("</body>", `${script}\n</body>`);
}
```

- [ ] **Step 2: Build and test manually**

```bash
npm run build
```

Then create a test file and run serve mode to verify:

```bash
echo "# Test\n\nHello world" > /tmp/test-serve.md
node dist/cli.js /tmp/test-serve.md --serve --port 4567
```

Expected: Server starts, prints URL, opening `http://localhost:4567` shows rendered page.

- [ ] **Step 3: Commit**

```bash
git add src/serve.ts
git commit -m "feat: add serve mode with file watching and WebSocket live reload"
```

---

### Task 7: Vitest Configuration & Full Test Run

**Files:**
- Create: `vitest.config.ts`

- [ ] **Step 1: Create vitest config**

Create `vitest.config.ts`:

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: false,
    testTimeout: 15000,
  },
});
```

- [ ] **Step 2: Run full test suite**

```bash
npm run build && npm test
```

Expected: All tests pass (template: 4, highlight: 3, render: 7, cli: 5 = 19 total)

- [ ] **Step 3: Commit**

```bash
git add vitest.config.ts
git commit -m "chore: add vitest config"
```

---

### Task 8: README & Final Polish

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Write README**

Replace `README.md` with:

```markdown
# readmd

Render Markdown files to beautiful HTML from the command line. Designed for reading AI-agent-generated plans and research documents.

## Features

- GitHub-like styling with light and dark themes
- VS Code-grade syntax highlighting (Shiki)
- Mermaid diagram support
- Copy buttons on code blocks
- Live reload serve mode
- Zero-config — just point at a `.md` file

## Usage

```bash
# Generate HTML file
npx readmd plan.md

# Open in browser immediately
npx readmd plan.md --open

# Live reload while editing
npx readmd plan.md --serve

# Light theme
npx readmd plan.md --theme light

# Custom output path
npx readmd plan.md --out output/plan.html

# Pipe to stdout
npx readmd plan.md --stdout
```

## Options

| Flag | Description | Default |
|------|-------------|---------|
| `--open` | Open in default browser | off |
| `--serve` | Watch mode with live reload | off |
| `--theme` | `light` or `dark` | `dark` |
| `--out` | Custom output path | `<input>.html` |
| `--port` | Port for serve mode | `4567` |
| `--stdout` | Output to stdout | off |

## Requirements

- Node.js >= 18
```

- [ ] **Step 2: Run full build and tests one final time**

```bash
npm run build && npm test
```

Expected: Build succeeds, all tests pass.

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: add README with usage instructions"
```

---

## Summary

| Task | Description | Tests |
|------|-------------|-------|
| 1 | Project scaffolding | — |
| 2 | HTML template | 4 |
| 3 | Shiki highlighter | 3 |
| 4 | Markdown rendering pipeline | 7 |
| 5 | CLI entry point | 5 |
| 6 | Serve mode | manual |
| 7 | Vitest config & full run | — |
| 8 | README & polish | — |

**Total: 8 tasks, ~19 automated tests**
