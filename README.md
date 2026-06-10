# readmd

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
npx readmd plan.md

# Open in browser immediately
npx readmd plan.md --open

# Live reload while editing
npx readmd plan.md --serve

# Light theme
npx readmd plan.md --theme light

# Custom output path
npx readmd plan.md --out output/plan.html

# Pipe to stdout
npx readmd plan.md --stdout
```

## Options

| Flag | Description | Default |
|------|-------------|---------|
| `--open` | Open in default browser | off |
| `--serve` | Watch mode with live reload | off |
| `--theme` | `light` or `dark` | `dark` |
| `--out` | Custom output path | `<input>.html` |
| `--port` | Port for serve mode | `4567` |
| `--stdout` | Output to stdout | off |

## Requirements

- Node.js >= 18