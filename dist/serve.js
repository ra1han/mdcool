import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { WebSocketServer, WebSocket } from "ws";
import { watch } from "chokidar";
import { renderMarkdown } from "./render.js";
import { buildHtml } from "./template.js";
export async function startServer(filePath, opts) {
    let currentHtml = await renderFile(filePath, opts.theme);
    const server = http.createServer((_req, res) => {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(injectLiveReload(currentHtml, opts.port));
    });
    const wss = new WebSocketServer({ server });
    const clients = new Set();
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
            console.log(`[mdcool] Reloaded: ${path.basename(filePath)}`);
        }
        catch (err) {
            console.error(`[mdcool] Render error:`, err);
        }
    });
    server.listen(opts.port, () => {
        const url = `http://localhost:${opts.port}`;
        console.log(`[mdcool] Serving: ${path.basename(filePath)}`);
        console.log(`[mdcool] URL: ${url}`);
        console.log(`[mdcool] Watching for changes... (Ctrl+C to stop)`);
    });
    // Keep process alive
    process.on("SIGINT", () => {
        watcher.close();
        wss.close();
        server.close();
        process.exit(0);
    });
}
async function renderFile(filePath, theme) {
    const mdText = await fs.readFile(filePath, "utf8");
    const { contentHtml, title } = await renderMarkdown(mdText, { theme });
    return buildHtml({ title, contentHtml, theme });
}
function injectLiveReload(html, port) {
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
//# sourceMappingURL=serve.js.map