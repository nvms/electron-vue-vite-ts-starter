import { app, BrowserWindow, shell, ipcMain, Menu, MenuItem, screen } from "electron";

import * as fs from 'fs';
import * as path from 'path';

export default function listen(win: BrowserWindow) {
  ipcMain.on("show-context-menu", (event, params: { x: number, y: number }) => {
    const template = [
      {
        label: 'Inspect element',
        click: () => {
          win?.webContents.inspectElement(params.x, params.y);
        }
      },
      { type: 'separator' },
      { 
        label: 'Clear userData',
        click: () => {
          const userDataPath = app.getPath('userData');
          fs.readdir(userDataPath, (err, files) => {
            for (const file of files) {
              fs.unlink(path.join(userDataPath, file), err => { });
            }
          });
        } 
      }
    ]
    const menu = Menu.buildFromTemplate(template as any)
    menu.popup(BrowserWindow.fromWebContents(event.sender) as any)
  });
};
