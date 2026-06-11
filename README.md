# mdcool

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

## Options

| Flag | Description | Default |
|------|-------------|---------|
| `--open` | Open in default browser | off |
| `--serve` | Watch mode with live reload | off |
| `--out` | Custom output path | `<input>.html` |
| `--port` | Port for serve mode | `4567` |
| `--stdout` | Output to stdout | off |

Generated pages currently use the light theme.

## Sample Document

The included sample Markdown document was taken from the [microsoft/hve-core](https://github.com/microsoft/hve-core) repository.

## Requirements

- Node.js >= 18
