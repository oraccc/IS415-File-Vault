var electron = require("electron");

var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var mainWindow = null;

app.on("ready", () => {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
        },
    });

    mainWindow.loadFile("index.html");

    mainWindow.on("close", () => {
        mainWindow = null;
    });
});