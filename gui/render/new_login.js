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
    console.log(sql);

    connection.query(sql, function (error, results, fields) {
        if (error) throw error;

        var path = "/vault/" + os.userInfo().username;

        fs.mkdir(path, { recursive: true }, (err) => {
            if (err) throw err;
          });

        window.location.href = "home.html";
    });
}