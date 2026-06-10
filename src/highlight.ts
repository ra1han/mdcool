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
