var fs = require('fs');
var os = require('os');

var root_path = "/vault/" + os.userInfo().username;
var rel_path = "/";
var current_path = rel_path;

var list = document.getElementById("list");
var back_button = document.getElementById("back_button");
var file_path = document.getElementById("file_path");

show_dir("/");
update_dir_click();
update_file_click();

function show_dir(path) {
    let content = fs.readdirSync(root_path + path, { withFileTypes: true });

    current_path = path;
    var path_html = "";
    path_html = "<div style='margin-top:4px;margin-left:10px;'> \
                <i class='fa fa-folder-open' style='color:rgb(29, 161, 242)'></i>"
        + root_path + current_path +
        "</div>";
    file_path.innerHTML = path_html;

    var html = "";

    if (path === rel_path && content.length === 0) {
        html = "<div style='margin-top:20px; text-align: center; font-weight:bold;font-size:20px;color:dimgrey;'>\
                    <div>Your Vault is Empty!</div>\
                </div>"

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
            html = html +
                "<div class='folder' name = '" + path_tmp + "'style='text-align:center;'> \
                    <a  href=\"javascript:show_dir('" + path_tmp + "');\"> \
                        <img src='./static/img/logos/logo_folder.png' width='100%'/>\
                        <br>" + arr[0] +
                "</a>\
                </div>";

        }
        else {

            postfix = arr[0].split('.')[1];
            var logo_name = ""
            switch (postfix) {
                case "txt": case "docx": case "doc":
                    logo_name = "docx";
                    break;
                case "c": case "js": case "css": case "html":
                    logo_name = "code";
                    break;
                case "mp3":
                    logo_name = "mp3";
                    break;
                case "mp4":
                    logo_name = "mp4";
                    break;
                case "jpg": case "png": case "svg": case "gif":
                    logo_name = "png";
                    break;
                case "ppt": case "pptx":
                    logo_name = "pptx";
                    break;
                case "csv": case "xls":
                    logo_name = "xls";
                    break;
                case "pdf":
                    logo_name = "pdf";
                    break;
                case "zip": case "rar": case "tar": case "7z":
                    logo_name = "zip";
                    break;
                default:
                    logo_name = "code";
                    break;
            };
            path_tmp = path + arr[0];
            html = html +
                "<div class='file' name = '" + path_tmp + "'style='text-align:center;'> \
                    <a  href=\"javascript:show_content('" + path_tmp + "');\"> \
                        <img src='./static/img/logos/logo_" + logo_name + ".png' width='80%'/>\
                        <br>" + arr[0] +
                "</a>\
                </div>";
        }

    });

    var back_button_html = "";
    if (path !== rel_path) {
        path = path.slice(0, path.length - 1);
        path = path.slice(0, path.lastIndexOf("/") + 1);
        back_button_html = "<a style='font-size:20px;' href=\"javascript:show_dir('" + path + "');\">\
                                <i class='fa fa-arrow-circle-left' style='font-size:30px;margin-bottom:30px'></i>\
                                Back\
                            </a>";

    }

    back_button.innerHTML = back_button_html;
    list.innerHTML = html;
    update_dir_click();
    update_file_click();
}

function show_content(path) {
    // const data = fs.readFileSync(root_path + path, 'utf8');
    var postfix = path.split('.')[1];
    var data = "";

    switch (postfix) {
        case 'txt': case 'c':
            data = fs.readFileSync(root_path + path, 'utf8');
            break;
        // case 'png':case 'jpg':
        //     data = fs.readFileSyncz(root_path + path);
        //     break;
        default:
            data = fs.readFileSync(root_path + path, 'utf8');
            break;
    }
    var path_html = "";
    path_html = "<div style='margin-top:4px;margin-left:10px;'> \
                <i class='fa fa-folder-open' style='color:rgb(29, 161, 242)'></i>"
        + root_path + path +
        "</div>";
    file_path.innerHTML = path_html;


    var html = "<div style='text-align:center;margin-top:10px;color:dodgerblue;\
               font-weight:900;font-size:22px;'>FILE CONTENT</div><hr> \
               <div style='white-space:pre-line;color:rgb(54,54,54);text-align:left;margin:10px 30px 10px;font-weight:600;font-size:17px;'>" + data +
        "</div><hr>\
               <div class='gap-40'/>";

    list.innerHTML = html;

    if (path !== rel_path) {
        path = path.slice(0, path.lastIndexOf("/") + 1);

        var back_button_html = "<a style='font-size:20px' href=\"javascript:show_dir('" + path + "');\">\
                        <i class='fa fa-arrow-circle-left' style='font-size:30px;margin-bottom:30px;'></i>\
                        Back\
                      </a>";
    }
    back_button.innerHTML = back_button_html;

    list.innerHTML = html;

}

const remote = require("@electron/remote");
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
                        fs.mkdir(root_path + current_path + r, (error) => {
                            if (error) throw error;
                            show_dir(current_path);
                        });
                    }
                }
            }).catch(console.error);
        }
    },
    {
        label: 'move in file',
        click: function () {
            const { dialog } = require("@electron/remote");

            dialog.showOpenDialog({
                title: 'select a file',
                defaultPath: '/home/' + os.userInfo().username,
            }).then(result => {

                var sourceFile = result.filePaths[0];

                var filename = sourceFile.slice(sourceFile.lastIndexOf("/") + 1, sourceFile.length);
                var destFile = root_path + current_path + filename;

                // if (sourceFile.includes(root_path)) {
                //     var readStream = fs.createReadStream(sourceFile);
                //     var writeStream = fs.createWriteStream(destFile);
                //     readStream.pipe(writeStream);
                // } else {
                //     // todo: encrypt!
                //     var readStream = fs.createReadStream(sourceFile);
                //     var writeStream = fs.createWriteStream(destFile);
                //     readStream.pipe(writeStream);
                // }

                fs.copyFile(sourceFile, destFile, (error) => {
                    if (error) throw error;
                });

                fs.unlink(sourceFile, (err) => {
                    if (err) throw e;
                    show_dir(current_path);
                })
            }).catch(err => {
                console.log(err);
            })
        }
    },
];

var m = remote.Menu.buildFromTemplate(rigthTemplate);

window.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    m.popup({ window: remote.getCurrentWindow() });
})

function update_dir_click() {
    const remote = require("@electron/remote");
    var dir = document.getElementsByClassName("folder");

    for (let i = 0; i < dir.length; ++i) {
        dir[i].oncontextmenu = function (event) {
            event.stopPropagation();
            var path_tmp = dir[i].getAttribute("name");
            var rigthTemplate = [
                {
                    label: 'open',
                    click: function () {
                        show_dir(path_tmp);
                    }
                },
                {
                    label: 'delete',
                    click: function () {
                        fs.rmdir(root_path + path_tmp, { recursive: true }, function (error) {
                            if (error) throw error;
                            path_tmp = path_tmp.slice(0, path_tmp.length - 1);
                            path_tmp = path_tmp.slice(0, path_tmp.lastIndexOf("/") + 1);
                            show_dir(path_tmp);
                        })
                    }
                },
                {
                    label: 'rename',
                    click: function () {
                        prompt({
                            title: 'Rename Directory',
                            label: 'New name: ',
                            type: 'input'
                        }).then((r) => {
                            if (r !== null) {
                                if (r.length === 0) {
                                    alert('Please enter a new directory name!');
                                } else {
                                    var path_tmp1 = path_tmp;
                                    path_tmp = path_tmp.slice(0, path_tmp.length - 1);
                                    path_tmp = path_tmp.slice(0, path_tmp.lastIndexOf("/") + 1);
                                    fs.rename(root_path + path_tmp1, root_path + path_tmp + r, function (error) {
                                        if (error) throw error;
                                        show_dir(path_tmp);
                                    })
                                }
                            }
                        }).catch(console.error);
                    }
                },
            ];

            var m = remote.Menu.buildFromTemplate(rigthTemplate);
            m.popup({ window: remote.getCurrentWindow() });
        };
    }
}


function update_file_click() {
    const remote = require("@electron/remote");
    var file = document.getElementsByClassName("file");

    for (let i = 0; i < file.length; ++i) {
        file[i].oncontextmenu = function (event) {
            event.stopPropagation();
            var path_tmp = file[i].getAttribute("name");
            var rigthTemplate = [
                {
                    label: 'open',
                    click: function () {
                        show_content(path_tmp);
                    }
                },
                {
                    label: 'delete',
                    click: function () {
                        fs.rm(root_path + path_tmp, { recursive: true }, function (error) {
                            if (error) throw error;
                            path_tmp = path_tmp.slice(0, path_tmp.length - 1);
                            path_tmp = path_tmp.slice(0, path_tmp.lastIndexOf("/") + 1);
                            show_dir(path_tmp);
                        })
                    }
                },
                {
                    label: 'move out file',
                    click: function () {
                        const { dialog } = require("@electron/remote");

                        dialog.showSaveDialog({
                            title: 'move out file',
                            defaultPath: path_tmp,
                        }).then(result => {
                            var sourceFile = root_path + path_tmp;
                            var destFile = result.filePath;

                            // if (destFile.includes(root_path)) {
                            //     var readStream = fs.createReadStream(sourceFile);
                            //     var writeStream = fs.createWriteStream(destFile);
                            //     readStream.pipe(writeStream);
                            // } else {
                            //     // todo: decrypt!
                            //     var readStream = fs.createReadStream(sourceFile);
                            //     var writeStream = fs.createWriteStream(destFile);
                            //     readStream.pipe(writeStream);
                            // }

                            fs.copyFile(sourceFile, destFile, (error) => {
                                if (error) throw error;
                            });

                            fs.unlink(sourceFile, (err) => {
                                if (err) throw err;
                                show_dir(current_path);
                            })
                        }).catch(err => {
                            console.log(err);
                        })
                    }
                },
            ];

            var m = remote.Menu.buildFromTemplate(rigthTemplate);
            m.popup({ window: remote.getCurrentWindow() });
        };
    }
}
