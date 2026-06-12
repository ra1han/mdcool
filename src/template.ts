export type TemplateOptions = {
  title: string;
  contentHtml: string;
  theme: "light" | "dark";
};

const MERMAID_CDN = "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js";

type ThemeColors = {
  bg: string;
  surface: string;
  surfaceHover: string;
  border: string;
  borderSubtle: string;
  text: string;
  textMuted: string;
  accent: string;
  accentSubtle: string;
  success: string;
  successSubtle: string;
  warning: string;
  warningSubtle: string;
  danger: string;
  dangerSubtle: string;
  purple: string;
  purpleSubtle: string;
  copyBtnBg: string;
  copyBtnBorder: string;
  copyBtnText: string;
  copyBtnHoverBg: string;
  shadow: string;
  codeLangBg: string;
  codeLangText: string;
  scrollThumb: string;
  scrollTrack: string;
  headerBg: string;
  tableHeadBg: string;
  tableHeaderBg: string;
  tableRowBorder: string;
  tableRowHover: string;
  inlineCodeBg: string;
  plainCodeText: string;
  plainCodeBg: string;
  lineNumberColor: string;
  treeIconColor: string;
};

const THEME_COLORS: Record<"light" | "dark", ThemeColors> = {
  light: {
    bg: "#f6f8fa",
    surface: "#ffffff",
    surfaceHover: "#f3f4f6",
    border: "#d1d9e0",
    borderSubtle: "#e5e7eb",
    text: "#1f2328",
    textMuted: "#656d76",
    accent: "#0969da",
    accentSubtle: "rgba(9,105,218,0.1)",
    success: "#1a7f37",
    successSubtle: "rgba(26,127,55,0.1)",
    warning: "#9a6700",
    warningSubtle: "rgba(154,103,0,0.1)",
    danger: "#d1242f",
    dangerSubtle: "rgba(209,36,47,0.1)",
    purple: "#8250df",
    purpleSubtle: "rgba(130,80,223,0.1)",
    copyBtnBg: "rgba(175,184,193,0.2)",
    copyBtnBorder: "rgba(31,35,40,0.15)",
    copyBtnText: "#1f2328",
    copyBtnHoverBg: "rgba(175,184,193,0.4)",
    shadow: "0 1px 3px rgba(31,35,40,0.12)",
    codeLangBg: "#eff2f5",
    codeLangText: "#656d76",
    scrollThumb: "#afb8c1",
    scrollTrack: "transparent",
    headerBg: "rgba(255,255,255,0.85)",
    tableHeadBg: "rgba(175,184,193,0.12)",
    tableHeaderBg: "#f6f8fa",
    tableRowBorder: "rgba(175,184,193,0.2)",
    tableRowHover: "rgba(175,184,193,0.08)",
    inlineCodeBg: "rgba(175,184,193,0.2)",
    plainCodeText: "#57606a",
    plainCodeBg: "#f6f8fa",
    lineNumberColor: "#afb8c1",
    treeIconColor: "#0969da",
  },
  dark: {
    bg: "#0d1117",
    surface: "#161b22",
    surfaceHover: "#1c2128",
    border: "#30363d",
    borderSubtle: "#21262d",
    text: "#e6edf3",
    textMuted: "#8b949e",
    accent: "#58a6ff",
    accentSubtle: "rgba(56,139,253,0.15)",
    success: "#3fb950",
    successSubtle: "rgba(46,160,67,0.15)",
    warning: "#d29922",
    warningSubtle: "rgba(187,128,9,0.15)",
    danger: "#f85149",
    dangerSubtle: "rgba(248,81,73,0.15)",
    purple: "#bc8cff",
    purpleSubtle: "rgba(163,113,247,0.15)",
    copyBtnBg: "rgba(110,118,129,0.4)",
    copyBtnBorder: "rgba(240,246,252,0.1)",
    copyBtnText: "#c9d1d9",
    copyBtnHoverBg: "rgba(110,118,129,0.6)",
    shadow: "0 1px 3px rgba(0,0,0,0.3)",
    codeLangBg: "#21262d",
    codeLangText: "#8b949e",
    scrollThumb: "#484f58",
    scrollTrack: "transparent",
    headerBg: "rgba(13,17,23,0.85)",
    tableHeadBg: "rgba(99,110,123,0.1)",
    tableHeaderBg: "#161b22",
    tableRowBorder: "rgba(99,110,123,0.2)",
    tableRowHover: "rgba(99,110,123,0.08)",
    inlineCodeBg: "rgba(110,118,129,0.25)",
    plainCodeText: "#8b949e",
    plainCodeBg: "#161b22",
    lineNumberColor: "#484f58",
    treeIconColor: "#58a6ff",
  },
};

function themeVariables(theme: "light" | "dark", colors: ThemeColors): string {
  return `[data-theme="${theme}"] {
      color-scheme: ${theme};
      --bg: ${colors.bg};
      --surface: ${colors.surface};
      --surface-hover: ${colors.surfaceHover};
      --border: ${colors.border};
      --border-subtle: ${colors.borderSubtle};
      --text: ${colors.text};
      --text-muted: ${colors.textMuted};
      --accent: ${colors.accent};
      --accent-subtle: ${colors.accentSubtle};
      --success: ${colors.success};
      --success-subtle: ${colors.successSubtle};
      --warning: ${colors.warning};
      --warning-subtle: ${colors.warningSubtle};
      --danger: ${colors.danger};
      --danger-subtle: ${colors.dangerSubtle};
      --purple: ${colors.purple};
      --purple-subtle: ${colors.purpleSubtle};
      --shadow: ${colors.shadow};
      --header-bg: ${colors.headerBg};
      --code-lang-bg: ${colors.codeLangBg};
      --code-lang-text: ${colors.codeLangText};
      --copy-btn-bg: ${colors.copyBtnBg};
      --copy-btn-border: ${colors.copyBtnBorder};
      --copy-btn-text: ${colors.copyBtnText};
      --copy-btn-hover-bg: ${colors.copyBtnHoverBg};
      --table-head-bg: ${colors.tableHeadBg};
      --table-header-bg: ${colors.tableHeaderBg};
      --table-row-border: ${colors.tableRowBorder};
      --table-row-hover: ${colors.tableRowHover};
      --inline-code-bg: ${colors.inlineCodeBg};
      --scroll-thumb: ${colors.scrollThumb};
      --scroll-track: ${colors.scrollTrack};
      --plain-code-text: ${colors.plainCodeText};
      --plain-code-bg: ${colors.plainCodeBg};
      --line-number-color: ${colors.lineNumberColor};
      --tree-icon-color: ${colors.treeIconColor};
    }`;
}

export function buildHtml(opts: TemplateOptions): string {
  const isDark = opts.theme === "dark";
  const colors = THEME_COLORS[opts.theme];

  return `<!doctype html>
<html lang="en" data-theme="${opts.theme}">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(opts.title)}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    *, *::before, *::after { box-sizing: border-box; }

    ${themeVariables("light", THEME_COLORS.light)}

    ${themeVariables("dark", THEME_COLORS.dark)}

    html {
      scroll-behavior: smooth;
    }

    body {
      margin: 0;
      padding: 0;
      background: var(--bg);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif;
      color: var(--text);
      line-height: 1.6;
    }

    /* Header */
    .page-header {
      position: sticky;
      top: 0;
      z-index: 100;
      background: var(--header-bg);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border);
      padding: 12px 24px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .page-header-icon {
      width: 28px;
      height: 28px;
      border-radius: 6px;
      background: var(--accent-subtle);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .page-header-icon svg {
      width: 16px;
      height: 16px;
      fill: var(--accent);
    }

    .page-header-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .page-header-meta {
      margin-left: auto;
      font-size: 12px;
      color: var(--text-muted);
      white-space: nowrap;
    }

    /* Main content area */
    .page-layout {
      display: grid;
      grid-template-columns: 260px 1fr;
      max-width: 1340px;
      margin: 0 auto;
      gap: 0;
      transition: grid-template-columns 0.2s;
    }

    .page-layout.toc-hidden {
      grid-template-columns: 0px 1fr;
    }

    /* TOC Sidebar */
    .toc-sidebar {
      position: sticky;
      top: 56px;
      height: calc(100vh - 56px);
      overflow-y: auto;
      padding: 24px 16px;
      border-right: 1px solid var(--border-subtle);
      transition: margin-left 0.2s, opacity 0.2s;
    }

    .toc-sidebar.collapsed {
      overflow: hidden;
      opacity: 0;
      pointer-events: none;
      padding: 0;
      border-right: none;
    }

    .toc-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }

    .toc-title {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--text-muted);
    }

    .toc-collapse-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--text-muted);
      padding: 4px;
      border-radius: 4px;
      display: flex;
      align-items: center;
    }

    .toc-collapse-btn:hover {
      color: var(--accent);
      background: var(--accent-subtle);
    }

    .toc-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .toc-list li {
      margin: 0;
    }

    .toc-list a {
      display: block;
      padding: 5px 10px;
      font-size: 13px;
      color: var(--text-muted);
      text-decoration: none;
      border-radius: 4px;
      border-left: 2px solid transparent;
      transition: color 0.1s, background 0.1s, border-color 0.1s;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .toc-list a:hover {
      color: var(--text);
      background: var(--surface-hover);
    }

    .toc-list a.active {
      color: var(--accent);
      border-left-color: var(--accent);
      background: var(--accent-subtle);
      font-weight: 500;
    }

    .toc-list .toc-h3 {
      padding-left: 22px;
      font-size: 12px;
    }

    /* Toggle button when sidebar hidden */
    .toc-show-btn {
      position: fixed;
      left: 12px;
      top: 68px;
      z-index: 90;
      background: var(--surface);
      border: 1px solid var(--border-subtle);
      border-radius: 6px;
      padding: 6px 8px;
      cursor: pointer;
      color: var(--text-muted);
      box-shadow: var(--shadow);
      display: none;
      align-items: center;
      transition: color 0.15s;
    }

    .toc-show-btn:hover {
      color: var(--accent);
    }

    .toc-show-btn.visible {
      display: flex;
    }

    .page-container {
      padding: 40px 32px 80px;
      min-width: 0;
    }

    @media (max-width: 900px) {
      .page-layout { grid-template-columns: 1fr; }
      .toc-sidebar { display: none; }
      .toc-show-btn { display: none !important; }
      .page-container { padding: 24px 16px 60px; }
      .page-header { padding: 10px 16px; }
    }

    /* Document title */
    .markdown-body h1:first-child {
      font-size: 2.2em;
      border-bottom: none;
      padding-bottom: 0;
      margin-bottom: 8px;
    }

    /* Frontmatter metadata bar */
    .frontmatter-meta {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 12px 16px;
      margin: 0 0 24px;
      background: var(--surface);
      border: 1px solid var(--border-subtle);
      border-radius: 8px;
      font-size: 0.85em;
      color: var(--text-muted);
    }

    .frontmatter-meta .meta-item strong {
      color: var(--text);
      font-weight: 500;
      margin-right: 4px;
    }

    .markdown-body {
      min-width: 200px;
      max-width: 100%;
      font-size: 16px;
    }

    /* Collapsible sections */
    .collapsible-section {
      border: 1px solid var(--border-subtle);
      border-radius: 8px;
      margin: 16px 0;
      background: var(--surface);
      box-shadow: var(--shadow);
      overflow: hidden;
      transition: border-color 0.15s;
    }

    .collapsible-section:hover {
      border-color: var(--border);
    }

    .collapsible-section summary {
      font-size: 1.25em;
      font-weight: 600;
      cursor: pointer;
      padding: 16px 20px;
      list-style: none;
      display: flex;
      align-items: center;
      gap: 12px;
      user-select: none;
      transition: background 0.1s;
    }

    .collapsible-section summary:hover {
      background: var(--surface-hover);
    }

    .collapsible-section summary::before {
      content: "";
      width: 20px;
      height: 20px;
      flex-shrink: 0;
      background: var(--accent-subtle);
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='${encodeURIComponent(colors.accent)}' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='9 18 15 12 9 6'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: center;
      transition: transform 0.2s ease, background-color 0.15s;
    }

    .collapsible-section[open] summary::before {
      transform: rotate(90deg);
      background-color: var(--accent-subtle);
    }

    .collapsible-section summary::-webkit-details-marker {
      display: none;
    }

    .collapsible-section > *:not(summary) {
      padding: 0 20px;
    }

    .collapsible-section[open] summary {
      border-bottom: 1px solid var(--border-subtle);
    }

    /* Code blocks */
    .code-block-wrapper {
      position: relative;
      margin: 16px 0;
    }

    .code-block-wrapper pre {
      border-radius: 8px !important;
      border: 1px solid var(--border-subtle) !important;
      padding: 16px !important;
      overflow-x: auto;
    }

    .code-lang-label {
      position: absolute;
      top: 0;
      right: 0;
      font-size: 11px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 3px 10px;
      background: var(--code-lang-bg);
      color: var(--code-lang-text);
      border-bottom-left-radius: 6px;
      border-top-right-radius: 7px;
    }

    .code-copy-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      font-size: 12px;
      font-weight: 500;
      padding: 4px 10px;
      border-radius: 6px;
      border: 1px solid var(--copy-btn-border);
      background: var(--copy-btn-bg);
      color: var(--copy-btn-text);
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.15s, background 0.1s;
      backdrop-filter: blur(4px);
    }

    .code-block-wrapper:hover .code-copy-btn {
      opacity: 1;
    }

    .code-copy-btn:hover {
      background: var(--copy-btn-hover-bg);
    }

    .code-copy-btn.copied {
      background: var(--success-subtle);
      color: var(--success);
      border-color: var(--success);
    }

    /* Line numbers */
    .code-block-wrapper pre code {
      counter-reset: line;
    }

    .code-block-wrapper pre code .line {
      counter-increment: line;
      display: inline-block;
      width: 100%;
    }

    .code-block-wrapper.has-line-numbers pre code .line::before {
      content: counter(line);
      display: inline-block;
      width: 2.5em;
      margin-right: 1em;
      padding-right: 0.5em;
      text-align: right;
      color: var(--line-number-color);
      border-right: 1px solid var(--border-subtle);
      user-select: none;
      -webkit-user-select: none;
    }

    .code-block-wrapper.has-line-numbers pre code .line:last-child:empty::before {
      display: none;
    }

    /* Plain text code blocks (no language detected) */
    .code-block-wrapper.plain-text pre {
      background: var(--plain-code-bg) !important;
      color: var(--plain-code-text) !important;
      font-style: italic;
    }

    .code-block-wrapper.plain-text pre code span {
      color: var(--plain-code-text) !important;
    }

    /* File tree blocks */
    .code-block-wrapper.file-tree pre {
      background: var(--surface) !important;
      color: var(--text) !important;
      font-style: normal;
      font-family: "JetBrains Mono", "Fira Code", "Cascadia Code", "SF Mono", Consolas, monospace;
      line-height: 1.8;
      letter-spacing: 0.02em;
    }

    .code-block-wrapper.file-tree pre code span {
      color: var(--text) !important;
    }

    .code-block-wrapper.file-tree .tree-icon {
      color: var(--tree-icon-color);
      margin-right: 4px;
      font-style: normal;
    }

    .code-block-wrapper.file-tree .tree-connector {
      color: var(--line-number-color);
      font-style: normal;
    }

    .code-block-wrapper.file-tree .tree-dir {
      font-weight: 600;
      font-style: normal;
    }

    .code-block-wrapper.file-tree .tree-file {
      font-style: normal;
    }

    /* Task lists */
    .markdown-body .task-list-item {
      list-style: none;
      position: relative;
    }

    .markdown-body .task-list-item input[type="checkbox"] {
      appearance: none;
      -webkit-appearance: none;
      width: 18px;
      height: 18px;
      border: 2px solid var(--border);
      border-radius: 4px;
      vertical-align: middle;
      margin-right: 8px;
      position: relative;
      top: -1px;
      cursor: default;
    }

    .markdown-body .task-list-item input[type="checkbox"]:checked {
      background: var(--success);
      border-color: var(--success);
    }

    .markdown-body .task-list-item input[type="checkbox"]:checked::after {
      content: "";
      position: absolute;
      left: 4px;
      top: 1px;
      width: 6px;
      height: 10px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }

    /* Blockquotes */
    .markdown-body blockquote {
      border-left: 4px solid var(--accent);
      background: var(--accent-subtle);
      padding: 12px 16px;
      border-radius: 0 8px 8px 0;
      margin: 16px 0;
    }

    /* GitHub-style alerts */
    .github-alert {
      border-radius: 8px;
      padding: 14px 16px;
      margin: 16px 0;
      border-left: 4px solid;
    }

    .github-alert-title {
      display: block;
      font-weight: 600;
      font-size: 0.9em;
      margin-bottom: 6px;
    }

    .github-alert p {
      margin: 0;
      font-size: 0.95em;
    }

    .alert-note {
      background: var(--accent-subtle);
      border-color: var(--accent);
    }
    .alert-note .github-alert-title { color: var(--accent); }

    .alert-tip {
      background: var(--success-subtle);
      border-color: var(--success);
    }
    .alert-tip .github-alert-title { color: var(--success); }

    .alert-important {
      background: var(--purple-subtle);
      border-color: var(--purple);
    }
    .alert-important .github-alert-title { color: var(--purple); }

    .alert-warning {
      background: var(--warning-subtle);
      border-color: var(--warning);
    }
    .alert-warning .github-alert-title { color: var(--warning); }

    .alert-caution {
      background: var(--danger-subtle);
      border-color: var(--danger);
    }
    .alert-caution .github-alert-title { color: var(--danger); }

    /* Unordered lists */
    .markdown-body ul:not(.contains-task-list) {
      list-style: none;
      padding-left: 1.5em;
    }

    .markdown-body ul:not(.contains-task-list) > li {
      position: relative;
      padding-left: 4px;
      margin-bottom: 6px;
    }

    .markdown-body ul:not(.contains-task-list) > li::before {
      content: "";
      position: absolute;
      left: -1.2em;
      top: 0.6em;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--accent);
      opacity: 0.8;
    }

    .markdown-body ul:not(.contains-task-list) > li > ul > li::before {
      background: var(--purple);
      width: 6px;
      height: 6px;
      border-radius: 2px;
      transform: rotate(45deg);
      opacity: 0.7;
    }

    .markdown-body ul:not(.contains-task-list) > li > ul > li > ul > li::before {
      background: var(--text-muted);
      width: 6px;
      height: 6px;
      border-radius: 50%;
      opacity: 0.5;
    }

    /* Ordered lists */
    .markdown-body ol {
      list-style: none;
      padding-left: 1.5em;
      counter-reset: list-counter;
    }

    .markdown-body ol > li {
      position: relative;
      padding-left: 4px;
      margin-bottom: 6px;
      counter-increment: list-counter;
    }

    .markdown-body ol > li::before {
      content: counter(list-counter);
      position: absolute;
      left: -1.6em;
      top: 0.15em;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: var(--accent-subtle);
      color: var(--accent);
      font-size: 0.75em;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
    }

    /* Tables */
    .markdown-body table {
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid var(--border);
      border-collapse: separate;
      border-spacing: 0;
      width: 100%;
      margin: 16px 0;
      font-size: 14px;
    }

    .markdown-body table thead {
      background: var(--table-head-bg);
    }

    .markdown-body table th {
      background: var(--table-header-bg);
      font-weight: 600;
      text-align: left;
      padding: 10px 14px;
      border-bottom: 2px solid var(--border);
      color: var(--text);
      white-space: nowrap;
    }

    .markdown-body table td {
      padding: 9px 14px;
      border-bottom: 1px solid var(--table-row-border);
      color: var(--text-secondary);
    }

    .markdown-body table tr:last-child td {
      border-bottom: none;
    }

    .markdown-body table tbody tr {
      transition: background 0.1s;
    }

    .markdown-body table tbody tr:hover {
      background: var(--table-row-hover);
    }

    .markdown-body table code {
      font-size: 12px;
      padding: 2px 6px;
      border-radius: 4px;
      background: var(--inline-code-bg);
    }

    /* Responsive table wrapper */
    .table-wrapper {
      overflow-x: auto;
      margin: 16px 0;
      border-radius: 8px;
    }

    /* Horizontal rule */
    .markdown-body hr {
      border: none;
      height: 2px;
      background: linear-gradient(to right, transparent, var(--border), transparent);
      margin: 32px 0;
    }

    /* Links */
    .markdown-body a {
      color: var(--accent);
      text-decoration: none;
      border-bottom: 1px solid transparent;
      transition: border-color 0.15s;
    }

    .markdown-body a:hover {
      border-bottom-color: var(--accent);
    }

    /* Inline code */
    .markdown-body code:not(pre code) {
      background: var(--inline-code-bg);
      border-radius: 4px;
      padding: 2px 6px;
      font-size: 0.9em;
    }

    /* Images */
    .markdown-body img {
      border-radius: 8px;
      border: 1px solid var(--border-subtle);
      max-width: 100%;
    }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-thumb { background: var(--scroll-thumb); border-radius: 4px; }
    ::-webkit-scrollbar-track { background: var(--scroll-track); }

    /* Expand all / collapse all button */
    .toggle-all-btn,
    .theme-toggle-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 500;
      color: var(--text-muted);
      background: transparent;
      border: 1px solid var(--border-subtle);
      border-radius: 6px;
      padding: 4px 10px;
      cursor: pointer;
      transition: color 0.15s, border-color 0.15s, background 0.15s;
    }

    .toggle-all-btn:hover,
    .theme-toggle-btn:hover {
      color: var(--accent);
      border-color: var(--accent);
      background: var(--accent-subtle);
    }

    /* Mermaid diagrams */
    .mermaid-container {
      position: relative;
      background: var(--surface);
      border: 1px solid var(--border-subtle);
      border-radius: 8px;
      margin: 16px 0;
      overflow: hidden;
      min-height: 80px;
    }

    .mermaid-container .mermaid {
      padding: 24px;
      text-align: center;
      overflow: auto;
      transition: transform 0.15s ease;
      transform-origin: top center;
    }

    .mermaid-zoom-controls {
      position: sticky;
      top: 8px;
      float: right;
      margin: 8px 8px 0 0;
      display: flex;
      gap: 4px;
      z-index: 5;
    }

    .mermaid-zoom-btn {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--surface);
      border: 1px solid var(--border-subtle);
      border-radius: 6px;
      cursor: pointer;
      color: var(--text-muted);
      font-size: 14px;
      font-weight: 600;
      transition: color 0.15s, border-color 0.15s;
    }

    .mermaid-zoom-btn:hover {
      color: var(--accent);
      border-color: var(--accent);
    }

    /* Print styles */
    @media print {
      .page-header { display: none; }
      .toc-sidebar { display: none; }
      .page-layout { grid-template-columns: 1fr; }
      .collapsible-section { border: none; box-shadow: none; }
      .collapsible-section[open] summary { border-bottom: 1px solid #ddd; }
      details { open: true; }
      .code-copy-btn { display: none; }
      .toggle-all-btn { display: none; }
      .theme-toggle-btn { display: none; }
      .toc-show-btn { display: none; }
    }
  </style>
</head>
<body>
  <header class="page-header">
    <div class="page-header-icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 1.75C2 .784 2.784 0 3.75 0h8.5C13.216 0 14 .784 14 1.75v12.5A1.75 1.75 0 0 1 12.25 16h-8.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25ZM4.5 3.25a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 0 1.5h-5.5a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h5.5a.75.75 0 0 0 0-1.5Zm0 3a.75.75 0 0 0 0 1.5h3.5a.75.75 0 0 0 0-1.5Z"/></svg>
    </div>
    <span class="page-header-title">${escapeHtml(opts.title)}</span>
    <span class="page-header-meta">
      <button class="theme-toggle-btn" onclick="toggleTheme()" id="themeToggleBtn" title="Toggle color theme">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
        <span>Dark mode</span>
      </button>
      <button class="toggle-all-btn" onclick="toggleAllSections()" id="toggleAllBtn">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        <span>Expand all</span>
      </button>
    </span>
  </header>

  <button class="toc-show-btn" id="tocShowBtn" onclick="toggleToc()" title="Show table of contents">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></svg>
  </button>

  <div class="page-layout">
    <nav class="toc-sidebar" id="tocSidebar">
      <div class="toc-header">
        <span class="toc-title">On this page</span>
        <button class="toc-collapse-btn" onclick="toggleToc()" title="Hide table of contents">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
      </div>
      <ul class="toc-list" id="tocList"></ul>
    </nav>

    <main class="page-container">
      <article class="markdown-body">
        ${opts.contentHtml}
      </article>
    </main>
  </div>

  <script src="${MERMAID_CDN}"></script>
  <script>
    mermaid.initialize({ startOnLoad: false, theme: "${isDark ? "dark" : "default"}" });

    function setTheme(theme) {
      document.documentElement.dataset.theme = theme;
      try { localStorage.setItem("mdcool-theme", theme); } catch {}
      const btn = document.getElementById("themeToggleBtn");
      if (btn) btn.querySelector("span").textContent = theme === "dark" ? "Light mode" : "Dark mode";
    }

    function toggleTheme() {
      setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
    }

    try {
      const savedTheme = localStorage.getItem("mdcool-theme");
      if (savedTheme === "light" || savedTheme === "dark") {
        document.documentElement.dataset.theme = savedTheme;
      }
    } catch {}

    document.addEventListener("DOMContentLoaded", async () => {
      setTheme(document.documentElement.dataset.theme || "${opts.theme}");

      // Mermaid diagrams — must expand sections first so diagrams have dimensions
      const mermaidBlocks = document.querySelectorAll("pre code.language-mermaid");
      if (mermaidBlocks.length > 0) {
        // Temporarily open all collapsed sections
        const closedSections = [...document.querySelectorAll(".collapsible-section:not([open])")];
        closedSections.forEach(s => s.open = true);

        mermaidBlocks.forEach((code) => {
          const pre = code.parentElement;
          const wrapper = document.createElement("div");
          wrapper.className = "mermaid-container";

          const controls = document.createElement("div");
          controls.className = "mermaid-zoom-controls";
          controls.innerHTML = '<button class="mermaid-zoom-btn" data-action="in" title="Zoom in">+</button>' +
            '<button class="mermaid-zoom-btn" data-action="out" title="Zoom out">\u2212</button>' +
            '<button class="mermaid-zoom-btn" data-action="reset" title="Reset zoom">⟳</button>';

          const diagram = document.createElement("div");
          diagram.className = "mermaid";
          diagram.textContent = code.textContent;

          wrapper.appendChild(controls);
          wrapper.appendChild(diagram);
          pre.replaceWith(wrapper);
        });

        await mermaid.run();

        // Re-collapse sections after render
        closedSections.forEach(s => s.open = false);
      }

      // Also re-render mermaid when a section is opened (handles edge cases)
      document.querySelectorAll(".collapsible-section").forEach(section => {
        section.addEventListener("toggle", () => {
          if (section.open) {
            const unrendered = section.querySelectorAll(".mermaid:not([data-processed])");
            if (unrendered.length) mermaid.run({ nodes: [...unrendered] });
          }
        });
      });

      // Mermaid zoom controls + drag-to-pan
      document.querySelectorAll(".mermaid-zoom-controls").forEach(controls => {
        const container = controls.parentElement;
        const diagram = container.querySelector(".mermaid");
        let scale = 1, panX = 0, panY = 0;
        let isDragging = false, startX = 0, startY = 0;

        function applyTransform() {
          diagram.style.transform = "scale(" + scale + ") translate(" + panX + "px, " + panY + "px)";
        }

        controls.addEventListener("click", (e) => {
          const btn = e.target.closest("[data-action]");
          if (!btn) return;
          const action = btn.dataset.action;
          if (action === "in") scale = Math.min(scale + 0.25, 3);
          else if (action === "out") scale = Math.max(scale - 0.25, 0.25);
          else { scale = 1; panX = 0; panY = 0; }
          applyTransform();
          diagram.style.cursor = scale > 1 ? "grab" : "default";
          if (scale <= 1) {
            const natural = diagram.scrollHeight;
            container.style.height = (natural * scale) + "px";
          } else {
            container.style.height = "auto";
          }
        });

        diagram.addEventListener("mousedown", (e) => {
          if (scale <= 1) return;
          isDragging = true;
          startX = e.clientX - panX;
          startY = e.clientY - panY;
          diagram.style.cursor = "grabbing";
          e.preventDefault();
        });

        document.addEventListener("mousemove", (e) => {
          if (!isDragging) return;
          panX = e.clientX - startX;
          panY = e.clientY - startY;
          applyTransform();
        });

        document.addEventListener("mouseup", () => {
          if (!isDragging) return;
          isDragging = false;
          diagram.style.cursor = "grab";
        });
      });

      // Code blocks: language label + copy button
      document.querySelectorAll("pre > code, pre code[class*='language-']").forEach((code) => {
        const pre = code.closest("pre");
        if (!pre || pre.closest(".mermaid")) return;
        if (pre.parentElement?.classList.contains("code-block-wrapper")) return;

        const wrapper = document.createElement("div");
        wrapper.className = "code-block-wrapper";
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);

        // Language label
        const langClass = code.className.match(/language-(\\w+)/);
        const lang = langClass && langClass[1] ? langClass[1] : "";

        if (lang) {
          const label = document.createElement("span");
          label.className = "code-lang-label";
          label.textContent = lang;
          wrapper.appendChild(label);
        }

        // Detect file tree content
        const text = code.textContent || "";
        const isFileTree = /[├└│┌┐┘┤┬┴┼─┃┣┗┏┓┛┠┰┸╋━]/.test(text) ||
          (/[\\\\/]/.test(text) && text.split("\\n").length > 2 && text.split("\\n").every(l => !l.includes("=") && !l.includes("(") && l.length < 80));

        if (isFileTree) {
          wrapper.classList.add("file-tree");
          // Enhance tree rendering with icons
          const lines = code.querySelectorAll(".line");
          if (lines.length > 0) {
            lines.forEach((line) => {
              const lineText = line.textContent || "";
              const span = line.querySelector("span") || line;
              const html = span.innerHTML;
              // Add icons: 📁 for dirs, 📄 for files
              const enhanced = html
                .replace(/([├└│┃┣┗─━]+\\s*)/g, '<span class="tree-connector">$1</span>')
                .replace(/([\\w.-]+\\/)/g, '<span class="tree-dir"><span class="tree-icon">📁</span>$1</span>')
                .replace(/([\\w.-]+\\.[a-z]{1,5})(?=[^/]|$)/gi, '<span class="tree-file"><span class="tree-icon">📄</span>$1</span>');
              span.innerHTML = enhanced;
            });
          }
          // Show "file tree" label
          if (!lang) {
            const label = document.createElement("span");
            label.className = "code-lang-label";
            label.textContent = "file tree";
            wrapper.appendChild(label);
          }
        } else if (!lang) {
          wrapper.classList.add("plain-text");
        }

        // Line numbers for blocks with 3+ lines
        const lineCount = code.querySelectorAll(".line").length || text.split("\\n").length;
        if (lineCount >= 3 && !isFileTree) {
          wrapper.classList.add("has-line-numbers");
        }

        // Copy button
        const btn = document.createElement("button");
        btn.className = "code-copy-btn";
        btn.textContent = "Copy";
        btn.addEventListener("click", async () => {
          try {
            await navigator.clipboard.writeText(code.textContent);
            btn.textContent = "✓ Copied";
            btn.classList.add("copied");
            setTimeout(() => { btn.textContent = "Copy"; btn.classList.remove("copied"); }, 1500);
          } catch {}
        });
        wrapper.appendChild(btn);
      });
    });

    // Toggle all sections
    function toggleAllSections() {
      const sections = document.querySelectorAll(".collapsible-section");
      const btn = document.getElementById("toggleAllBtn");
      const allOpen = [...sections].every(s => s.open);

      sections.forEach(s => s.open = !allOpen);
      btn.querySelector("span").textContent = allOpen ? "Expand all" : "Collapse all";
      btn.querySelector("svg").style.transform = allOpen ? "" : "rotate(180deg)";
    }

    // TOC
    function toggleToc() {
      const sidebar = document.getElementById("tocSidebar");
      const showBtn = document.getElementById("tocShowBtn");
      const layout = document.querySelector(".page-layout");
      sidebar.classList.toggle("collapsed");
      layout.classList.toggle("toc-hidden");
      showBtn.classList.toggle("visible", sidebar.classList.contains("collapsed"));
    }

    (function buildToc() {
      const tocList = document.getElementById("tocList");
      const sections = document.querySelectorAll(".collapsible-section[id]");
      const summaries = document.querySelectorAll(".collapsible-section summary");

      sections.forEach((section, i) => {
        const id = section.id;
        const text = summaries[i]?.textContent?.trim() || id;
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = "#" + id;
        a.textContent = text;
        a.dataset.id = id;
        a.addEventListener("click", (e) => {
          e.preventDefault();
          section.open = true;
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        });
        li.appendChild(a);
        tocList.appendChild(li);
      });

      // Active state tracking via IntersectionObserver
      const tocLinks = tocList.querySelectorAll("a");
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            tocLinks.forEach(l => l.classList.remove("active"));
            const link = tocList.querySelector('a[data-id="' + entry.target.id + '"]');
            if (link) link.classList.add("active");
          }
        });
      }, { rootMargin: "-60px 0px -80% 0px" });

      sections.forEach(s => observer.observe(s));
    })();
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
