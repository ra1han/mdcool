import { createHighlighter as shikiCreateHighlighter } from "shiki";
const cache = new Map();
export async function createHighlighter(theme) {
    const themeName = theme === "light" ? "github-light" : "github-dark";
    if (cache.has(themeName)) {
        return cache.get(themeName);
    }
    const promise = initHighlighter(themeName);
    cache.set(themeName, promise);
    return promise;
}
async function initHighlighter(themeName) {
    const highlighter = await shikiCreateHighlighter({
        themes: [themeName],
        langs: [
            "javascript", "typescript", "python", "go", "rust", "java",
            "json", "yaml", "toml", "html", "css", "bash", "shell",
            "sql", "markdown", "diff", "dockerfile", "graphql",
        ],
    });
    return (code, lang) => {
        try {
            return highlighter.codeToHtml(code, { lang, theme: themeName });
        }
        catch {
            const escaped = code
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");
            return `<pre><code>${escaped}</code></pre>`;
        }
    };
}
//# sourceMappingURL=highlight.js.map