var echarts = require('echarts');
var chartDom = document.getElementById('pie-chart');
var myChart = echarts.init(chartDom);

var option;

var fs = require('fs');
var os = require('os');
var path = require('path');

var root_path = "/vault/" + os.userInfo().username + "/";
var file = [];

fileDisplay(root_path);

function fileDisplay(filePath) {
    let files = fs.readdirSync(filePath);
    for (let i = 0; i < files.length; i++) {
        var filename = files[i];
        var filedir = path.join(filePath, filename);
        var stats = fs.statSync(filedir);
        var isFile = stats.isFile();
        var isDir = stats.isDirectory();
        if (isFile) {
            file.push(filedir);
        }
        if (isDir) {
            fileDisplay(filedir);
        }
    }
}
var dic = { "text": 0, "music": 0, "video": 0, "image": 0, "others": 0 };;
file.forEach((name) => {
    name = name.slice(name.lastIndexOf(".") + 1, name.length);
    switch (name) {
        case "txt": case "docx": case "doc":
            dic["text"] += 1;
            break;
        case "mp3":
            dic["music"] += 1;
            break;
        case "mp4":
            dic["video"] += 1;
            break;
        case "jpg": case "png": case "svg": case "gif":
            dic["image"] += 1;
            break;
        default:
            dic["others"] += 1;
            break;
    };
});

option = {
    title: {
        text: 'Current Vault Usage',
        left: 'center',
        top: 20,
        textStyle: {
            color: '#363636',
            fontWeight: 'bolder',
            fontSize: 20,
        }

    },
    tooltip: {
        trigger: 'item',
        formatter: function (params) {
            console.log(params);
            return "Vault Usage: <br>" + "Category: " + params.name +
                "<br> Size: " + params.value + " MB <br>" +
                "Percent: " + params.percent + " %";
        }
    },
    legend: {
        orient: 'horizontal',
        x: 'center',
        y: '330px',
        textStyle: {
            fontSize: 14,
            fontWeight: 'bolder'
        }
    },
    series: [
        {
            name: 'Vault Usage',
            type: 'pie',
            radius: '62%',
            center: ['50%', '45%'],
            startAngle: '90',
            color: ['#10344A', '#709198', '#83CFCF', '#44A9B1', '#B5B5B5'],
            data: [
                {
                    value: dic["text"], name: 'Text',
                    itemStyle: { shadowBlur: '10', shadowColor: 'rgba(0,0,0,0.8)', shadowOffsetY: '5' },
                },
                {
                    value: dic["music"], name: 'Music',
                    itemStyle: { shadowBlur: '10', shadowColor: 'rgba(0,0,0,0.8)', shadowOffsetY: '5' },
                },
                {
                    value: dic["video"], name: 'Video',
                    itemStyle: { shadowBlur: '10', shadowColor: 'rgba(0,0,0,0.8)', shadowOffsetY: '5' },
                },
                {
                    value: dic["image"], name: 'Image',
                    itemStyle: { shadowBlur: '10', shadowColor: 'rgba(0,0,0,0.8)', shadowOffsetY: '5' },
                },
                {
                    value: dic["others"], name: 'Others',
                    itemStyle: { shadowBlur: '10', shadowColor: 'rgba(0,0,0,0.8)', shadowOffsetY: '5' },
                },
            ],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },
            label: {
                textStyle: {
                    fontSize: 14,
                    fontWeight: 'bolder',
                }
            },
            animationDuration: 2500,
            animationEasing: "cubicInOut",
        }
    ]
};

option && myChart.setOption(option);

var echarts = require('echarts');
var chartDom = document.getElementById('pop-chart');
var myChart = echarts.init(chartDom);
var option;
const data_Docs = [
    [1, 156, 'file1.docx'],
    [3, 178, 'file2.docx'],
    [4, 106, 'file3.docx'],
    [6, 87, 'file4.docx'],
    [7, 75, 'file5.docx'],
];
const data_Archives = [
    [1, 303, 'dataset1.zip'],
    [2, 185, 'dataset2.zip'],
    [4, 321, 'dataset3.zip'],
    [5, 241, 'dataset4.zip'],
    [7, 164, 'dataset5.zip'],
];
const data_Videos = [
    [1, 125, 'movie1.mp4'],
    [2, 265, 'movie2.mp4'],
    [3, 183, 'movie3.mp4'],
    [4, 409, 'movie4.mp4'],
    [7, 102, 'movie5.mp4'],
];

const data_Others = [
    [2, 209, 'else.pptx'],
    [3, 165, 'else.xls'],
    [4, 83, 'else.md'],
    [5, 165, 'else.png'],
    [6, 107, 'else.pdf'],
];

const itemStyle = {
    opacity: 0.8,
    shadowBlur: 10,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowColor: 'rgba(0,0,0,0.3)'
};

option = {
    title: {
        text: 'Vault Upload Record',
        left: 'center',
        top: 20,
        textStyle: {
            color: '#363636',
            fontWeight: 'bolder',
            fontSize: 20,
        }

    },

    color: ['#10344A', '#709198', '#83CFCF', '#44A9B1'],

    legend: {
        bottom: 15,
        data: ['Docs', 'Archives', 'Videos', 'Others'],
        textStyle: {
            fontSize: 15,
            fontWeight: 'bolder',
        }
    },

    grid: {
        left: '10%',
        right: '10%',
        top: '18%',
        bottom: '18%'
    },

    tooltip: {
        backgroundColor: 'rgba(255,255,255,0.7)',
        formatter: function (param) {
            var value = param.value;

            return '<div style="font-size: 16px; font-weight:900; padding-bottom: 7px;margin-bottom: 2px; color:dimgray">'
                + 'Day' + value[0] + ': <br>'
                + 'File Name: ' + value[2] + '<br>'
                + 'Category: ' + param.seriesName + '<br>'
                + 'File Size: ' + value[1] + ' MB'
            '</div>'
        }
    },
    xAxis: {
        type: 'value',
        nameGap: 16,
        nameTextStyle: {
            fontSize: 16
        },
        max: 7,
        splitLine: {
            show: false
        }
    },
    yAxis: {
        type: 'value',
        min: 0,
        max: 512,
        name: 'Size / MB',
        nameLocation: 'end',
        nameGap: 10,
        nameTextStyle: {
            fontSize: 14,
            fontWeight: 'bolder',
        },
        splitLine: {
            show: false
        }
    },
    visualMap: [
        {
            show: false,
            dimension: 1,
            min: 0,
            max: 512,
            itemWidth: 30,
            itemHeight: 120,
            calculable: true,
            precision: 0.1,
            textGap: 30,
            inRange: {
                symbolSize: [10, 60]
            },
            outOfRange: {
                symbolSize: [10, 60],
                color: ['rgba(255,255,255,0.4)']
            },
            controller: {
                inRange: {
                    color: ['#c23531']
                },
                outOfRange: {
                    color: ['#999']
                }
            }
        },
    ],
    series: [
        {
            name: 'Docs',
            type: 'scatter',
            itemStyle: itemStyle,
            data: data_Docs
        },
        {
            name: 'Archives',
            type: 'scatter',
            itemStyle: itemStyle,
            data: data_Archives
        },
        {
            name: 'Videos',
            type: 'scatter',
            itemStyle: itemStyle,
            data: data_Videos
        },
        {
            name: 'Others',
            type: 'scatter',
            itemStyle: itemStyle,
            data: data_Others
        },
    ],
    animationDuration: 2000,
    animationEasing: "cubicInOut",
};

option && myChart.setOption(option);