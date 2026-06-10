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
