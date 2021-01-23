// background.js
'use strict'

import {
  app,
  protocol,
  // Menu,
  // BrowserWindow,
  // remote,
  ipcMain,
  globalShortcut,
} from 'electron'
// import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
// import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import windowControl from './mixin/windowControl';
import fs from 'fs'

const isDevelopment = process.env.NODE_ENV !== 'production'
const log = require('electron-log')
const { autoUpdater } = require('electron-updater')
const path = require('path')
// var sqlite3 = require("sqlite3").verbose();

//-------------------------------------------------------------------
// Logging
// +++ 此处为新增
// THIS SECTION IS NOT REQUIRED
//
// This logging setup is not required for auto-updates to work,
// but it sure makes debugging easier :)
//-------------------------------------------------------------------
autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'
log.info('App starting...')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
// +++ 此处为新增webcontent
let win, webContents

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
  {
    scheme: 'file',
    privileges: { secure: true, standard: true, bypassCSP: true },
  },
])
app.whenReady().then(() => {
  protocol.registerFileProtocol('file', (request, callback) => {
    const pathname = decodeURI(request.url.replace('file:///', ''))
    callback(pathname)
  })
})
app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors')
function createWindow() {
  // Create the browser window.
  // win = new BrowserWindow({
  //   width: 1280,
  //   height: 800,
  //   resizable: true, //可否改变窗口大小
  //   frame: false,
  //   autoHideMenuBar: true, //是否隐藏菜单
  //   webPreferences: {
  //     // Use pluginOptions.nodeIntegration, leave this alone
  //     // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
  //     nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
  //     // +++ 此处为新增 增加预加载脚本
  //     preload: path.join(__dirname, 'preload.js'),
  //     webSecurity: false,
  //     nodeIntegration: true,
  //   },
  //   // icon: `${__static}/icon.png`,
  // })
  // win.setFullScreen(true)
  // if (process.env.WEBPACK_DEV_SERVER_URL) {
  //   // Load the url of the dev server if in development mode
  //   win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
  //   if (!process.env.IS_TEST) win.webContents.openDevTools()
  // } else {
  //   createProtocol('app')
  //   // Load the index.html when not in development
  //   win.loadURL('app://./index.html')
  // }
  win = windowControl.create({
    url: '/',
    data: '',
    title: 'okayDisk-欢迎',
    onclose: () => {
      win = null;
    },
    callback: () => {
      // win.webContents.openDevTools();
    }
  });
  // +++ 此处为新增
  webContents = win.webContents

  // win.on('closed', () => {
  //   win = null
  // })
  //按esc退出全屏模式
  globalShortcut.register('ESC', () => {
    win.setFullScreen(false)
  })
}
let appendage;
function createAppendage(arg) {
  if(appendage) {
    return windowControl.active(appendage, arg);
  }
  appendage = windowControl.create({
    parent: win,
    url: '/appendage',
    data: arg.data || '',
    title: '附属物列表',
    frame: false,
    onclose: () => {
      appendage = null;
    },
    callback: () => {
      // appendage.webContents.openDevTools();
    }
  });
  webContents = appendage.webContents;
  //按esc退出全屏模式
  globalShortcut.register('ESC', () => {
    console.log('dddddd')
    appendage.setFullScreen(false)
  })
}
// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  console.log('activate', win)
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    // try {
    //   await installExtension(VUEJS_DEVTOOLS);
    // } catch (e) {
    //   console.error("Vue Devtools failed to install:", e.toString());
    // }
  }
  console.log('ready')
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

// +++ 以下皆为新增内容
// 主进程监听渲染进程传来的信息
ipcMain.on('update', (e, arg) => {
  console.log(arg)
  checkForUpdates()
})
ipcMain.on('route', (e, arg) => {
  console.log(arg)
  switch (arg.name) {
    case 'appendage':
      createAppendage(arg)
      break;
    default:
      break;
  }
  checkForUpdates()
})

ipcMain.on('close-app', (e, arg) => {
  // 通知关闭
  const remote = require('electron').remote;
  console.log('remote', remote)
  // const wins = remote.getCurrentWindow();
  // console.log('wins', wins)
  //   wins.close();
  switch (arg) {
    case 'appendage':
      console.log('close-app')
      // appendage.closed()
      appendage.close()
      // appendage = null;
      break;
  
    default:
      break;
  }
  // win.close()
})
ipcMain.on('uploadFiles', UploadFiles)

let checkForUpdates = () => {
  // 配置安装包远端服务器
  // autoUpdater.setFeedURL(feedUrl);

  // 下面是自动更新的整个生命周期所发生的事件
  autoUpdater.on('error', function(message) {
    sendUpdateMessage('error', message)
  })
  autoUpdater.on('checking-for-update', function(message) {
    sendUpdateMessage('checking-for-update', message)
  })
  autoUpdater.on('update-available', function(message) {
    sendUpdateMessage('update-available', message)
  })
  autoUpdater.on('update-not-available', function(message) {
    sendUpdateMessage('update-not-available', message)
  })

  // 更新下载进度事件
  autoUpdater.on('download-progress', function(progressObj) {
    sendUpdateMessage('downloadProgress', progressObj)
  })
  // 更新下载完成事件
  autoUpdater.on('update-downloaded', function(
    event,
    releaseNotes,
    releaseName,
    releaseDate,
    updateUrl,
    quitAndUpdate
  ) {
    sendUpdateMessage('isUpdateNow')
    ipcMain.on('updateNow', (e, arg) => {
      autoUpdater.quitAndInstall()
    })
  })

  //执行自动更新检查
  autoUpdater.checkForUpdates()
}

// 主进程主动发送消息给渲染进程函数
function sendUpdateMessage(message, data) {
  webContents.send('message', { message, data })
}
async function UploadFiles(e, data) {
  console.log("data", data)
  for (let index = 0; index < data.upload_data.length; index++) {
    const obj = data.upload_data[index]

    let arg = {
      imgurl: obj.imgurl,
      result: obj.name + obj.id + '.png',
      parentID: data.parentID,
      projectID: data.projectID,
      token: data.token,
      id: obj.id,
      index: index,
      indexLength: data.upload_data.length,
    }
    console.log('arg', arg)
    if(obj.imgurl) {
      await runUploadFiles(arg)
    }
    
    webContents.send('uploadMessage', {
      index: index,
      id: obj.id,
      indexLength: data.upload_data.length,
      
      source: true
    })
  }
  
}
async function runUploadFiles(data) {
  let imgli = data.imgurl.split(',')
  for (let index = 0; index < imgli.length; index++) {
    
    const element = imgli[index]
    
    if(!element) {continue}
    let fd = {
      datasetPath: fs.createReadStream(element),
      filePath: Number(Math.random().toString().substr(3, 8) + Date.now()).toString(36) + "_" + data.result,
      parentID: data.parentID,
      projectID: data.projectID,
    }
    let _options = {
      method: 'POST',
      headers: {
        token: data.token,
      },
      url: `http://172.16.20.148:3000/clouddisk/project/ProjectMinioPathUpload`,
      port: 7451,
      formData: fd,
    }
    webContents.send('uploadMessage', {
      // index: data.index,
      id: data.id,
      indexLength: data.indexLength,
      uploadImg: true,
      imageUrl: element,
      filePath: data.result,
    })
    await SyncuploadFiles(_options).then(res => {
      console.log("1111", res);
      
    }).catch(err => {
      webContents.send('uploadMessage', {
        // index: data.index,
        id: data.id,
        indexLength: data.indexLength,
        err: err.msg || err.Error || err,
        imageUrl: element
      })
    })
  }
  
  
}
var request = require('request');
async function SyncuploadFiles(options) {
	return new Promise((resolve, reject) => {
		request(options, (error, response, body) => {
			if (error) {
				reject('error');
				console.log('error ', error);
			} else {
				resolve(JSON.parse(body));
				// console.log('body: ', JSON.parse(body).msg); // Print the HTML for the Google homepage.
			}
		});
	});
}