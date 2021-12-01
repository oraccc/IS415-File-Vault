var fs = require('fs');
var os = require('os');

var root_path = "/home/" + os.userInfo().username + "/vault";
var rel_path = "/";
var list = document.getElementById("list");

show_dir("/");

function show_dir(path) {
    let content = fs.readdirSync(root_path + path, { withFileTypes: true });

    var html = "";

    var path_tmp = path;

    content.forEach((v, i) => {
        let arr = [];

        Reflect.ownKeys(v).forEach(function (name) {
            arr.push(v[name]);
        });

        if (arr[1] === 2) {
            path_tmp = path + arr[0] + "/";
            html = html + "<div>dic: <a href=\"javascript:show_dir('" + path_tmp + "');\">" + arr[0] + "</a></div>";
        } else {
            path_tmp = path + arr[0];
            html = html + "<div>file: <a href=\"javascript:show_content('" + path_tmp + "');\">" + arr[0] + "</a></div>";
        }

    });

    if (path !== rel_path) {
        path = path.slice(0, path.length - 1);
        path = path.slice(0, path.lastIndexOf("/") + 1);

        html = html + "<br><div><a href=\"javascript:show_dir('" + path + "');\">back</a></div>";
    }

    list.innerHTML = html;
}

function show_content(path) {
    const data = fs.readFileSync(root_path + path, 'utf8');

    var html = "<div style='white-space: pre-line;'>" + data + "</div>";

    list.innerHTML = html;

    if (path !== rel_path) {
        path = path.slice(0, path.lastIndexOf("/") + 1);

        html = html + "<br><div><a href=\"javascript:show_dir('" + path + "');\">back</a></div>";
    }

    list.innerHTML = html;
}