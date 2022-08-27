const {
    app,
    BrowserWindow,
    autoUpdater,
    dialog,
    globalShortcut,
  } = require('electron');
  const path = require('path');
  const fs = require('fs');
  const isDev = require("electron-is-dev")

  app.disableHardwareAcceleration();
  
  // Handle creating/removing shortcuts on Windows when installing/uninstalling.
  if (require('electron-squirrel-startup')) {
    // eslint-disable-line global-require
    app.quit();
  }
  
  require('update-electron-app')({
    repo: 'frederikheinrich/Interactive-Twitch-Chat',
    updateInterval: '5 minutes',
    logger: require('electron-log')
  })
  
  const server = 'https://update.electronjs.org'
  const feed = `${server}/frederikheinrich/Interactive-Twitch-Chat/${process.platform}-${process.arch}/${app.getVersion()}`
  
  autoUpdater.setFeedURL(feed)
  
  const createWindow = () => {
    const mainWindow = new BrowserWindow({
        fullscreen: true,
        autoHideMenuBar: true,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        vibrancy: 'ultra-dark',
        icon: path.join(__dirname, 'icon.ico')
    });

    mainWindow.setAlwaysOnTop(true, 'screen');
    mainWindow.loadURL("https://interactive-twitch-chat.frederikheinrich.de/");
    mainWindow.on("ready-to-show", () => {
      mainWindow.show();
    });
    if (!isDev)
      autoUpdater.checkForUpdates();
  
    // Open the DevTools.
    // mainWindow.webContents.openDevTools();
  };
  
  app.on('ready', createWindow);
  
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
  /*
  autoUpdater.on("update-available", (_event, releseNotes, releseName) => {
    const dialogOpts = {
      type: "info",
      buttons: ["Okay"],
      title: "Update!",
      message: process.platform == "win32" ? releseNotes : releseName,
      detail: "A new version is being downloades"
    }
    dialog.showMessageBox(dialogOpts, (response) = {
  
    })
  });
  
  autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    const dialogOpts = {
      type: 'info',
      buttons: ['Restart', 'Later'],
      title: 'Application Update',
      message: process.platform === 'win32' ? releaseNotes : releaseName,
      detail: 'A new version has been downloaded. Restart the application to apply the updates.'
    }
  
    dialog.showMessageBox(dialogOpts).then((returnValue) => {
      if (returnValue.response === 0) autoUpdater.quitAndInstall()
    })
  })*/