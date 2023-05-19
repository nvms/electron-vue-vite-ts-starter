import { app, BrowserWindow, shell, ipcMain, Menu, MenuItem, screen } from "electron";
import { release } from "node:os";
import { join } from "node:path";
import { Config } from "../common";
import listen from "./ipc";


// Disable GPU Acceleration for Windows 7
if (release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

// Checks if the application instance is already running, and exits the current instance if it is.
if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

process.env.DIST_ELECTRON = join(__dirname, "..");
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist");
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, "../public")
  : process.env.DIST;

let win: BrowserWindow | null = null;
// Here, you can also use other preload
const preload = join(__dirname, "../preload/index.js");
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, "index.html");

async function createWindow() {
  win = new BrowserWindow({
    width: Config.get("windowBounds").width,
    height: Config.get("windowBounds").height,
    x: Config.get("position").x,
    y: Config.get("position").y,
    title: "Main window",
    icon: join(process.env.PUBLIC, "favicon.ico"),
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    // electron-vite-vue#298
    win.loadURL(url);
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml);
  }

  win.on("resized", () => {
    const { width, height } = win.getBounds();
    Config.set("windowBounds", { width, height });
  });

  win.on("moved", () => {
    const { x, y } = win.getBounds();
    Config.set("position", { x, y });
  });

  win.webContents.on("did-finish-load", () => {
    // app ready, do stuff!
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });

  listen(win);
}

app.whenReady().then(() => {
  // Sensible size and position defaults
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const defaults = {
    windowBounds: {
      width: Math.round(width * 0.5),
      height: Math.round(height * 0.5),
    },
    position: {
      x: Math.round(width * 0.25),
      y: Math.round(height * 0.25),
    },
  };

  Config.load({ configName: "user-preferences", defaults });

  createWindow();
});

app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") app.quit();
});