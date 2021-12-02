var electron = require("electron");

var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var mainWindow = null;

var os = require('os');
var username = os.userInfo().username;

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'test'
});

connection.connect();

app.on("ready", () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
        },
    });

    mainWindow.webContents.openDevTools();

    var sql = "select * from user where name = \"" + username + "\"";

    connection.query(sql, function (error, results, fields) {
        if (error) throw error;

        if (results.length !== 0) {
            mainWindow.loadFile("login.html");
        } else {
            mainWindow.loadFile("new_login.html");
        }
    });

    mainWindow.on("close", () => {
        mainWindow = null;
    });
});