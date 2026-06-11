<p align="center">
  <img src="img/logo.png" alt="mdcool" width="320">
</p>

[![Publish to npm](https://github.com/ra1han/mdcool/actions/workflows/publish.yml/badge.svg)](https://github.com/ra1han/mdcool/actions/workflows/publish.yml)
[![npm version](https://img.shields.io/npm/v/mdcool.svg)](https://www.npmjs.com/package/mdcool)
[![npm downloads](https://img.shields.io/npm/dm/mdcool.svg)](https://www.npmjs.com/package/mdcool)
[![Node.js](https://img.shields.io/node/v/mdcool.svg)](https://www.npmjs.com/package/mdcool)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Render Markdown files to polished, standalone HTML from the command line. Built for reading AI-agent-generated plans, research notes, specs, and technical documents without extra setup.

## Demo

![mdcool demo](img/mdcool.gif)

## Quick Start

```bash
npx mdcool README.md --open
```

`mdcool` writes an HTML file next to your Markdown input by default. Add `--serve` for live reload while editing, or `--stdout` when you want to pipe the rendered HTML elsewhere.

## Features

- GitHub-like document styling
- VS Code-grade syntax highlighting (Shiki)
- Mermaid diagram support
- Copy buttons on code blocks
- Live reload serve mode
- Zero-config usage: point it at a `.md` file and render

## Usage

```bash
# Generate HTML file
npx mdcool plan.md

# Open in browser immediately
npx mdcool plan.md --open

# Live reload while editing
npx mdcool plan.md --serve

# Live reload on a custom port
npx mdcool plan.md --serve --port 3000

# Custom output path
npx mdcool plan.md --out output/plan.html

# Pipe to stdout
npx mdcool plan.md --stdout
```

## CLI Options

| Flag | Description | Default |
|------|-------------|---------|
| `--open` | Open in default browser | off |
| `--serve` | Watch mode with live reload | off |
| `--out` | Custom output path | `<input>.html` |
| `--port` | Port for serve mode | `4567` |
| `--stdout` | Output to stdout | off |

Generated pages currently use the light theme.

## Requirements

- Node.js >= 18

## Development Commands

```bash
# Install dependencies
npm install

# Build the CLI
npm run build

# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Rebuild while editing
npm run dev
```

## Sample Document

The included sample Markdown document was taken from the [microsoft/hve-core](https://github.com/microsoft/hve-core) repository.

## License

MIT. See [LICENSE](LICENSE) for details.
