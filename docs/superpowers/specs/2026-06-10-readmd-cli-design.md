# readmd — CLI Markdown Renderer Design Spec

**Date:** 2026-06-10
**Status:** Approved

## Overview

`readmd` is a Node.js CLI tool that renders Markdown files into beautiful, single-column HTML pages. It targets AI-agent-generated plans and research documents, providing a polished reading experience with GitHub-like styling, VS Code-grade syntax highlighting, and Mermaid diagram support.

## Goals

- Render any `.md` file to a self-contained HTML page from the command line
- Optimize for reading AI-generated plans/research during coding sessions
- Clean, distraction-free single-column layout
- Support both light and dark themes
- Distribute via `npx readmd` (zero-install)

## Non-Goals

- Full documentation site generation (use MkDocs/Docusaurus for that)
- In-terminal rendering (use Glow for that)
- Sidebar TOC or multi-page navigation
- Fully self-contained HTML (CDN links for Mermaid/CSS are acceptable)

## CLI Interface

**Package:** `readmd` (npm)
**Binary:** `readmd`

### Commands

```
readmd <file.md> [options]
```

### Flags

| Flag | Description | Default |
|------|-------------|---------|
| `--open` | Open in default browser after generating | off |
| `--serve` | Watch mode with live reload | off |
| `--theme <light\|dark>` | Color theme | `dark` |
| `--out <path>` | Custom output file path | `<input>.html` |
| `--port <number>` | Port for serve mode | `4567` |
| `--stdout` | Output HTML to stdout | off |

### Examples

```bash
npx readmd plan.md              # → plan.html
npx readmd plan.md --open       # → plan.html + opens browser
npx readmd plan.md --serve      # → localhost:4567 with live reload
npx readmd plan.md --theme light --out output/plan.html
```

## Architecture

### Rendering Pipeline

```
Input .md file
    │
    ▼
Read file from disk
    │
    ▼
Parse with markdown-it (CommonMark + GFM)
    │  ├── markdown-it-anchor (linkable headings)
    │  └── markdown-it-task-lists (GFM checkboxes)
    │
    ▼
Shiki highlights fenced code blocks (server-side)
    │  Theme: github-dark or github-light (based on --theme)
    │
    ▼
Inject into HTML template
    │  ├── GitHub Markdown CSS (CDN, light/dark variant)
    │  ├── Mermaid.js (CDN script)
    │  ├── Copy-button script (inline)
    │  └── Mermaid init script (inline)
    │
    ▼
Output .html file (or stdout, or serve)
```

### Serve Mode

When `--serve` is passed:
1. Start HTTP server on specified port
2. Watch the input `.md` file with `chokidar`
3. On change: re-render and notify browser via WebSocket
4. Browser auto-reloads content without full page refresh

## Tech Stack

| Component | Library | Purpose |
|-----------|---------|---------|
| CLI framework | `commander` | Argument parsing |
| Markdown parser | `markdown-it` | CommonMark + GFM parsing |
| Heading anchors | `markdown-it-anchor` | Linkable headings |
| Task lists | `markdown-it-task-lists` | GFM checkbox rendering |
| Syntax highlighting | `shiki` | VS Code-grade code highlighting |
| File watching | `chokidar` | File change detection for serve mode |
| HTTP server | Node `http` (built-in) | Serve mode |
| WebSocket | `ws` | Live reload notifications |
| Browser open | `open` | --open flag implementation |

### External (CDN, loaded in browser)

- `github-markdown-css` — GitHub typography styles
- `mermaid` — Diagram rendering

## HTML Output Design

### Layout

Single-column, centered (max-width 980px). No sidebar. Minimal chrome.

### Structure

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>{extracted from first # heading or filename}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="{github-markdown-css CDN, light or dark}">
  <style>/* minimal layout styles */</style>
</head>
<body>
  <article class="markdown-body">
    {rendered HTML content}
  </article>
  <script src="{mermaid CDN}"></script>
  <script>/* mermaid init + copy buttons */</script>
</body>
</html>
```

### Features

- **Typography:** GitHub Markdown CSS for headings, lists, tables, blockquotes, inline code
- **Code blocks:** Shiki-highlighted with copy button (top-right corner)
- **Mermaid diagrams:** Detected by `language-mermaid` class, rendered client-side
- **Theme:** Light or dark via `--theme` flag, selecting the appropriate CSS variant and Shiki theme
- **Responsive:** Content reflows cleanly on narrow viewports

## Project Structure

```
readmd/
├── package.json
├── tsconfig.json
├── src/
│   ├── cli.ts          # CLI entry point (commander setup)
│   ├── render.ts       # Markdown → HTML pipeline
│   ├── template.ts     # HTML template generation
│   ├── highlight.ts    # Shiki highlighter initialization
│   └── serve.ts        # Dev server with file watching & live reload
├── templates/
│   └── page.html       # HTML shell template
└── README.md
```

## Build & Distribution

- TypeScript compiled to ESM
- Published to npm as `readmd`
- `bin` field in `package.json` points to compiled CLI
- Works via `npx readmd` with no prior installation
- Node.js >= 18 required (for native fetch, structuredClone, etc.)

## Error Handling

- Missing file: clear error message with path
- Invalid Markdown: render as-is (markdown-it is forgiving)
- Shiki language not found: fall back to plain `<pre><code>` with escaping
- Port in use (serve mode): try next port, report to user
- File watch errors: log warning, continue serving last good render
