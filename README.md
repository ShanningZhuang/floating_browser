# Floating Browser

A minimal, always-on-top browser for macOS. Perfect for keeping reference content visible while working, such as documentation, timers, or video calls.

## Features

- **Always-on-top**: Window stays above other applications when pinned
- **Compact mode**: When pinned, the toolbar minimizes to just a small pin button
- **Frameless window**: Clean, minimal appearance without macOS title bar
- **Persistent state**: Remembers window position, size, last URL, and pin state
- **Global shortcut**: Toggle always-on-top with `Cmd+Shift+T`
- **Draggable**: Drag via toolbar (unpinned) or pin button area (pinned)

## Installation

### From DMG (Recommended)

1. Download the latest `.dmg` from releases
2. Open the DMG and drag the app to Applications
3. First launch: Right-click → Open (required for unsigned apps)

### From Source

```bash
# Clone the repository
git clone <repo-url>
cd floating_browser

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run package:mac
```

## Usage

| Action | How |
|--------|-----|
| Navigate | Enter URL in address bar, press Enter |
| Go back/forward | Use ← → buttons |
| Reload | Use ↻ button |
| Pin window | Click pin button or press `Cmd+Shift+T` |
| Drag (unpinned) | Drag the toolbar area |
| Drag (pinned) | Drag around the pin button |
| Quit | `Cmd+Q` or right-click dock icon → Quit |

## Development

```bash
# Run in development mode
npm run dev

# Build TypeScript only
npm run build

# Package for macOS
npm run package:mac
```

## Project Structure

```
floating_browser/
├── src/
│   ├── main.ts      # Electron main process
│   ├── preload.ts   # IPC bridge (renderer ↔ main)
│   └── index.html   # Toolbar UI
├── dist/            # Compiled JavaScript
├── package.json
└── tsconfig.json
```

## Tech Stack

- **Electron** - Cross-platform desktop app framework
- **TypeScript** - Type-safe JavaScript
- **electron-store** - Persistent storage for settings
- **electron-builder** - App packaging and distribution

## License

MIT
