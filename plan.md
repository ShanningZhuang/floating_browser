 Floating Browser - Requirements & Specifications

 Goal

 Build a standalone Electron-based floating browser for macOS that can load any URL and stay on top of other windows.

 Problem Being Solved

 Need a way to keep web apps (like a Pomodoro timer) visible while working in other applications on macOS.

 ---
 Core Features

 1. Always-on-Top Window

 - Window should float above all other applications
 - Toggle on/off via UI button and keyboard shortcut
 - State persisted between app restarts

 2. URL Navigation

 - URL input field to load any website
 - Auto-prefix https:// if not provided
 - Remember last visited URL

 3. Browser Controls

 - Back button
 - Forward button
 - Reload button

 4. State Persistence

 - Save and restore:
   - Window position and size
   - Last URL visited
   - Always-on-top setting

 ---
 UI Requirements

 Window

 - macOS native title bar with traffic light buttons (close/minimize/maximize)
 - Default size: ~500x600px
 - Minimum size: 300x400px
 - Resizable

 Toolbar

 - Draggable area (to move window)
 - Navigation buttons: ← → ↻
 - URL input field
 - Pin/unpin button (📌)

 Content Area

 - Displays loaded web page
 - Full browser functionality (JavaScript, cookies, etc.)

 ---
 Keyboard Shortcuts

 - Cmd+Shift+T - Toggle always-on-top (global shortcut)

 ---
 Technical Stack

 - Electron - Cross-platform desktop app framework
 - TypeScript - Type-safe JavaScript
 - electron-store - Persist settings to disk
 - electron-builder - Package as macOS .app/.dmg

 ---
 Files to Create

 floating-browser/
 ├── src/
 │   ├── main.ts          # Electron main process
 │   ├── preload.ts       # IPC bridge (secure communication)
 │   └── index.html       # Toolbar UI
 ├── package.json
 ├── tsconfig.json
 └── .gitignore

 ---
 Implementation Steps

 1. Initialize new npm project
 2. Install dependencies: electron, electron-builder, electron-store, typescript
 3. Create main process with BrowserWindow configuration
 4. Create preload script for secure IPC
 5. Create HTML toolbar with URL bar and controls
 6. Implement URL loading and navigation
 7. Implement always-on-top toggle with persistence
 8. Add global keyboard shortcut
 9. Package as macOS application

 ---
 Usage Flow

 1. Launch app → shows toolbar with URL input
 2. Enter URL (e.g., localhost:3000 for Pomodoro timer)
 3. Press Enter or click "Go"
 4. Web page loads in the window
 5. Click 📌 to toggle always-on-top
 6. Window stays visible while using other apps

 ---
 Build Outputs

 - npm run dev - Run in development mode
 - npm run package:mac - Build macOS .dmg installer