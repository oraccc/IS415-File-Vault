var fs = require('fs');

var os = require('os');
var username = document.getElementById("name");
username.innerHTML = "Hello " + os.userInfo().username;

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
    var sql = "insert into user (name, password) values (\"" + os.userInfo().username + "\", \"" + pwd + "\");";
    console.log(sql);

    connection.query(sql, function (error, results, fields) {
        if (error) throw error;

        var pwd = "/home/" + os.userInfo().username + "/vault";

        fs.mkdir(pwd, { recursive: true }, (err) => {
            if (err) throw err;
          });

        window.location.href = "home.html";
    });
}