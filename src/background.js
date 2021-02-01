// background.js
"use strict";

import {
  app,
  protocol,
  Menu,
  BrowserWindow,
  ipcMain,
  globalShortcut,
} from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
// import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
// import axios from "axios";
// import fs from "fs";

const isDevelopment = process.env.NODE_ENV !== "production";
const log = require("electron-log");
const { autoUpdater } = require("electron-updater");
const path = require("path");
// var sqlite3 = require("sqlite3").verbose();
// import models from "./db/models";
// const { Op } = require("sequelize");
//-------------------------------------------------------------------
// Logging
// +++ 此处为新增
// THIS SECTION IS NOT REQUIRED
//
// This logging setup is not required for auto-updates to work,
// but it sure makes debugging easier :)
//-------------------------------------------------------------------
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";
log.info("App starting...");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
// +++ 此处为新增webcontent
let win, webContents;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  {
    scheme: "app",
    privileges: { secure: true, standard: true, bypassCSP: true },
  },
  {
    scheme: "file",
    privileges: { secure: true, standard: true, bypassCSP: true },
  },
]);
app.whenReady().then(() => {
  protocol.registerFileProtocol("file", (request, callback) => {
    const pathname = decodeURI(request.url.replace("file:///", ""));
    callback(pathname);
  });
});
app.commandLine.appendSwitch("disable-features", "OutOfBlinkCors");
function createWindow(option) {
  // Create the browser
  let defaultOptions = {
    width: 1280,
    height: 800,
    resizable: true, //可否改变窗口大小
    frame: false,
    autoHideMenuBar: true, //是否隐藏菜单
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      // nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      // +++ 此处为新增 增加预加载脚本
      preload: path.join(__dirname, "preload.js"),
      webSecurity: false,
      nodeIntegration: true,
    },
    icon: `${__static}/icon.png`,
  };
  let options = Object.assign(defaultOptions, option);
  let win = new BrowserWindow(options);
  Menu.setApplicationMenu(null)
  // console.log("WEBPACK_DEV_SERVER_URL", process.env.WEBPACK_DEV_SERVER_URL);
  win.setFullScreen(true);
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL + "#" + option.url);
    // if (!process.env.IS_TEST) win.webContents.openDevTools()
    win.webContents.openDevTools();
  } else {
    
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html#/" + option.url);
  }
  // +++ 此处为新增
  // webContents = win.webContents

  win.on("closed", () => {
    win = null;
  });
  //按esc退出全屏模式
  globalShortcut.register("ESC", () => {
    win.setFullScreen(false);
  });
  return win;
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    win = createWindow({ url: "" });
    webContents = win.webContents;
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    // try {
    //   await installExtension(VUEJS_DEVTOOLS);
    // } catch (e) {
    //   console.error("Vue Devtools failed to install:", e.toString());
    // }
  }
  win = createWindow({ url: "" });
  webContents = win.webContents;
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}

// +++ 以下皆为新增内容
// 主进程监听渲染进程传来的信息
ipcMain.on("update", (e, arg) => {
  console.log(arg);
  checkForUpdates();
});

ipcMain.on("close-app", (e, arg) => {
  // 通知关闭
  console.log("arg", arg);
  switch (arg) {
    case "photoSphere":
      console.log("photoSphere");
      photoSphere.close();
      webContents = win.webContents;
      break;
    case "win":
      win.close();
      break;

    default:
      break;
  }
  // win.close()
});

// ipcMain.on("getDB", getDB);
let photoSphere;
ipcMain.on("route", (e, arg) => {
  console.log(arg);
  switch (arg) {
    case "photoSphere":
      photoSphere = createWindow({ url: arg });
      photoSphere.show();
      photoSphere.focus();
      webContents = photoSphere.webContents;
      break;

    default:
      break;
  }
});
ipcMain.on("routeData", (e, arg) => {

  switch (arg.name) {
    case "home":
      win.show();
      win.focus();
      webContents = win.webContents;
      webContents.send("routeData", arg);

      break;

    default:
      break;
  }
});

let checkForUpdates = () => {
  // 配置安装包远端服务器
  // autoUpdater.setFeedURL(feedUrl);

  // 下面是自动更新的整个生命周期所发生的事件
  autoUpdater.on("error", function(message) {
    sendUpdateMessage("error", message);
  });
  autoUpdater.on("checking-for-update", function(message) {
    sendUpdateMessage("checking-for-update", message);
  });
  autoUpdater.on("update-available", function(message) {
    sendUpdateMessage("update-available", message);
  });
  autoUpdater.on("update-not-available", function(message) {
    sendUpdateMessage("update-not-available", message);
  });

  // 更新下载进度事件
  autoUpdater.on("download-progress", function(progressObj) {
    sendUpdateMessage("downloadProgress", progressObj);
  });
  // 更新下载完成事件
  autoUpdater.on("update-downloaded", function() {
    sendUpdateMessage("isUpdateNow");
    ipcMain.on("updateNow", (e, arg) => {
      autoUpdater.quitAndInstall();
    });
  });

  //执行自动更新检查
  autoUpdater.checkForUpdates();
};

// 主进程主动发送消息给渲染进程函数
function sendUpdateMessage(message, data) {
  webContents.send("message", { message, data });
}

