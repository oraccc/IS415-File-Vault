var fs = require('fs');
var os = require('os');
var my_crypto = require('crypto')

var username = document.getElementById("name");
username.value = os.userInfo().username;

function md5(string) {
    return my_crypto.createHash('md5').update(String(string)).digest('hex')
}

function set_password() {
    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'test'
    });

    connection.connect();

    var pwd = document.getElementById('set_password').value;
    var hashed_pwd = md5(pwd);

    var sql = "insert into user (name, password) values (\"" + os.userInfo().username + "\", \"" + hashed_pwd + "\");";

    connection.query(sql, function (error, results, fields) {
        if (error) throw error;

        var ffi = require('ffi-napi');
        var libm = ffi.Library('./netlink/libnetlink', {
            'send_msg': ['int', []]
        });
        var ret = libm.send_msg();
        if (ret === -1) {
            console.log("netlink failed to send pid");
        }

        var path = "/vault/" + os.userInfo().username;

        fs.mkdirSync(path, { recursive: true });

        fs.writeFileSync("/vault/" + os.userInfo().username + "/tmp.dat", pwd);

        window.location.href = "home.html";
    });
}