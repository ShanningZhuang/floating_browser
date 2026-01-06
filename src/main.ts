import {
  app,
  BrowserWindow,
  BrowserView,
  ipcMain,
  globalShortcut,
} from "electron";
import * as path from "path";
import Store from "electron-store";

interface StoreSchema {
  windowBounds: { x: number; y: number; width: number; height: number };
  lastUrl: string;
  alwaysOnTop: boolean;
}

const store = new Store<StoreSchema>({
  defaults: {
    windowBounds: { x: 100, y: 100, width: 500, height: 600 },
    lastUrl: "https://www.google.com",
    alwaysOnTop: true,
  },
});

let mainWindow: BrowserWindow | null = null;
let browserView: BrowserView | null = null;
let isPinned: boolean = true;

const TOOLBAR_HEIGHT_NORMAL = 50;
const TOOLBAR_HEIGHT_PINNED = 28;

function getToolbarHeight(): number {
  return isPinned ? TOOLBAR_HEIGHT_PINNED : TOOLBAR_HEIGHT_NORMAL;
}

function createWindow() {
  const bounds = store.get("windowBounds");
  const alwaysOnTop = store.get("alwaysOnTop");
  isPinned = alwaysOnTop;

  mainWindow = new BrowserWindow({
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
    minWidth: 300,
    minHeight: 400,
    frame: false,
    alwaysOnTop: alwaysOnTop,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Load toolbar UI
  mainWindow.loadFile(path.join(__dirname, "../src/index.html"));

  // Create BrowserView for web content
  browserView = new BrowserView({
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.setBrowserView(browserView);
  updateBrowserViewBounds();

  // Load last URL
  const lastUrl = store.get("lastUrl");
  browserView.webContents.loadURL(lastUrl);

  // Send initial state to renderer
  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow?.webContents.send("init-state", {
      url: lastUrl,
      alwaysOnTop: alwaysOnTop,
    });
  });

  // Update BrowserView bounds on resize
  mainWindow.on("resize", () => {
    updateBrowserViewBounds();
    saveWindowBounds();
  });

  mainWindow.on("move", () => {
    saveWindowBounds();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
    browserView = null;
  });

  // Track URL changes in BrowserView
  browserView.webContents.on("did-navigate", (_event, url) => {
    store.set("lastUrl", url);
    mainWindow?.webContents.send("url-changed", url);
  });

  browserView.webContents.on("did-navigate-in-page", (_event, url) => {
    store.set("lastUrl", url);
    mainWindow?.webContents.send("url-changed", url);
  });

  // Track navigation state
  browserView.webContents.on("did-navigate", () => {
    sendNavigationState();
  });

  browserView.webContents.on("did-navigate-in-page", () => {
    sendNavigationState();
  });
}

function updateBrowserViewBounds() {
  if (!mainWindow || !browserView) return;

  const toolbarHeight = getToolbarHeight();
  const [width, height] = mainWindow.getContentSize();
  browserView.setBounds({
    x: 0,
    y: toolbarHeight,
    width: width,
    height: height - toolbarHeight,
  });
}

function saveWindowBounds() {
  if (!mainWindow) return;
  const bounds = mainWindow.getBounds();
  store.set("windowBounds", bounds);
}

function sendNavigationState() {
  if (!mainWindow || !browserView) return;
  mainWindow.webContents.send("navigation-state", {
    canGoBack: browserView.webContents.canGoBack(),
    canGoForward: browserView.webContents.canGoForward(),
  });
}

// IPC Handlers
ipcMain.on("navigate", (_event, url: string) => {
  if (!browserView) return;

  let finalUrl = url.trim();
  if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
    finalUrl = "https://" + finalUrl;
  }

  browserView.webContents.loadURL(finalUrl);
  store.set("lastUrl", finalUrl);
});

ipcMain.on("go-back", () => {
  if (browserView?.webContents.canGoBack()) {
    browserView.webContents.goBack();
  }
});

ipcMain.on("go-forward", () => {
  if (browserView?.webContents.canGoForward()) {
    browserView.webContents.goForward();
  }
});

ipcMain.on("reload", () => {
  browserView?.webContents.reload();
});

ipcMain.on("toggle-always-on-top", () => {
  if (!mainWindow) return;
  const current = mainWindow.isAlwaysOnTop();
  const newValue = !current;
  isPinned = newValue;
  mainWindow.setAlwaysOnTop(newValue);
  store.set("alwaysOnTop", newValue);
  mainWindow.webContents.send("always-on-top-changed", newValue);
  updateBrowserViewBounds();
});

// App lifecycle
app.whenReady().then(() => {
  createWindow();

  // Register global shortcut
  globalShortcut.register("CommandOrControl+Shift+T", () => {
    if (!mainWindow) return;
    const current = mainWindow.isAlwaysOnTop();
    const newValue = !current;
    isPinned = newValue;
    mainWindow.setAlwaysOnTop(newValue);
    store.set("alwaysOnTop", newValue);
    mainWindow.webContents.send("always-on-top-changed", newValue);
    updateBrowserViewBounds();
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});
