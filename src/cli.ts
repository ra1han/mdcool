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
      : /\.md$/i.test(filePath)
        ? filePath.replace(/\.md$/i, ".html")
        : filePath + ".html";

    await fs.writeFile(outPath, html, "utf8");
    console.log(`Written: ${outPath}`);

    if (opts.open) {
      const { exec } = await import("node:child_process");
      const cmd = process.platform === "win32" ? `start "" "${outPath}"`
        : process.platform === "darwin" ? `open "${outPath}"`
        : `xdg-open "${outPath}"`;
      exec(cmd);
    }
  });

program.parse();
