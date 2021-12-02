var fs = require('fs');
var os = require('os');

var root_path = "/home/" + os.userInfo().username + "/vault";
var rel_path = "/";
var curren_path = rel_path;
var list = document.getElementById("list");

show_dir("/");

function show_dir(path) {
    let content = fs.readdirSync(root_path + path, { withFileTypes: true });

    curren_path = path;

    var html = "";

    if (path === rel_path && content.length === 0) {
        html = "<div>Your vault is empty!</div>";
        list.innerHTML = html;
        return;
    }

    var path_tmp = path;

    content.forEach((v, i) => {
        let arr = [];

        Reflect.ownKeys(v).forEach(function (name) {
            arr.push(v[name]);
        });

        if (arr[1] === 2) {
            path_tmp = path + arr[0] + "/";
            html = html + "<div class='rightclick'>dic: <a href=\"javascript:show_dir('" + path_tmp + "');\">" + arr[0] + "</a></div>";
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

const { remote } = require('electron');
const prompt = require('electron-prompt');

var rigthTemplate = [
    {
        label: 'create new directory',
        click: function () {
            prompt({
                title: 'Create New Directory',
                label: 'Directory name: ',
                type: 'input'
            }).then((r) => {
                if (r !== null) {
                    if (r.length === 0) {
                        alert('Please enter a directory name!');
                    } else {
                        fs.mkdir(root_path + curren_path + r, (error) => {
                            if (error) throw error;
                            show_dir(curren_path);
                        });
                    }
                }
            }).catch(console.error);
        }
    },
];

var m = remote.Menu.buildFromTemplate(rigthTemplate);

window.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    m.popup({ window: remote.getCurrentWindow() });
})

var rigthTemplate1 = [
    {
        label: 'test',
        click: function () {
            console.log("hihihihihihi");
        }
    },
];

var m1 = remote.Menu.buildFromTemplate(rigthTemplate1);

var test = document.getElementById("test");

test.addEventListener('contextmenu', event => {
    // event.preventDefault();
    event.stopPropagation();
    console.log("hello");
    m1.popup({ window: remote.getCurrentWindow() });
    // if(event.preventDefault){event.preventDefault(); } else {event.returnValue = false; }
});