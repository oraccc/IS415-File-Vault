var os = require('os');
var my_crypto = require('crypto')

var ffi = require('ffi-napi');
var libm = ffi.Library('./netlink/libnetlink', {
    'send_msg': ['int', []]
});
var ret = libm.send_msg();
if (ret === -1) {
    console.log("netlink failed to send pid");
}

var username = document.getElementById("name");
username.value = os.userInfo().username;

function md5(string) {
    return my_crypto.createHash('md5').update(String(string)).digest('hex')
}

function login() {
    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'test'
    });

    connection.connect();

    var sql = "select * from user where name = \"" + os.userInfo().username + "\"";
    var pwd = document.getElementById('password').value;
    var hashed_pwd = md5(pwd);

    connection.query(sql, function (error, results, fields) {
        if (error) throw error;

        if (results[0]["password"] === hashed_pwd) {
            var fs = require('fs');
            fs.writeFileSync("/vault/" + os.userInfo().username + "/tmp.dat", pwd);
            window.location.href = "home.html";
        } else {
            alert("Wrong Password! \n Please Try Again.");
        }
    });
}
