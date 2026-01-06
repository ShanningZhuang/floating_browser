import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  // Navigation
  navigate: (url: string) => ipcRenderer.send("navigate", url),
  goBack: () => ipcRenderer.send("go-back"),
  goForward: () => ipcRenderer.send("go-forward"),
  reload: () => ipcRenderer.send("reload"),

  // Always on top
  toggleAlwaysOnTop: () => ipcRenderer.send("toggle-always-on-top"),

  // Event listeners
  onInitState: (callback: (state: { url: string; alwaysOnTop: boolean }) => void) => {
    ipcRenderer.on("init-state", (_event, state) => callback(state));
  },
  onUrlChanged: (callback: (url: string) => void) => {
    ipcRenderer.on("url-changed", (_event, url) => callback(url));
  },
  onAlwaysOnTopChanged: (callback: (value: boolean) => void) => {
    ipcRenderer.on("always-on-top-changed", (_event, value) => callback(value));
  },
  onNavigationState: (callback: (state: { canGoBack: boolean; canGoForward: boolean }) => void) => {
    ipcRenderer.on("navigation-state", (_event, state) => callback(state));
  },
});
