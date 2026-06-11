import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

describe("CLI", () => {
  let tmpDir: string;
  let mdFile: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "mdcool-test-"));
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

  it("defaults generated HTML to light theme", () => {
    const output = execSync(`node dist/cli.js "${mdFile}" --stdout`, {
      encoding: "utf8",
    });

    expect(output).toContain('data-theme="light"');
  });

  it("does not expose a CLI theme option", () => {
    const help = execSync("node dist/cli.js --help", { encoding: "utf8" });

    expect(help).not.toContain("--theme");
  });

  it("rejects the removed CLI theme option", () => {
    expect(() => {
      execSync(`node dist/cli.js "${mdFile}" --stdout --theme dark`, {
        encoding: "utf8",
        stdio: "pipe",
      });
    }).toThrow();
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
