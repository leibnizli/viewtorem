#!/usr/bin/env node

var fs = require("fs"),
    stat = fs.stat,
    util = require('util'),
    path = require('path'),
    buffer = require("buffer").Buffer,
    postcss = require('postcss'),
    viewtorem = require('./lib/viewtorem.js');

console.log("viewtorem is at :" + __dirname + "\r\njust rewrite it as you wish\r");

//获取到参数
var targetList = process.argv;
if (targetList[0] == "node") {
    targetList.shift();
}
targetList.shift();

if (targetList.length <= 0) {
    console.log("useage : viewtorem init or 'viewtorem build'");
    process.exit(0);
}

var sourceJson = path.join(__dirname,"viewtorem.json");
var targetJson = path.join(process.cwd(),"viewtorem.json");
//处理参数
for (var i = 0; i < targetList.length; i++) {
    var target = targetList[i];
    if (target == "init") {
        exists(sourceJson, targetJson, function(src, target) {
            //
        })
    } else if (target == "build") {
        exists(sourceJson, targetJson, function(src, target) {
            var options = require(target);
            var files = options.files;
            if (util.isArray(files)) {
                for (j = 0; j < files.length; j++) {
                    dealfile(files[j], options);
                }
            } else {
                var stat = fs.statSync(files);
                if (stat.isDirectory()){
                    var list = fs.readdirSync(files);
                    list.forEach(function(item) {
                        if (/\.css/.test(item)&&!/-rem\.css/.test(item)){
                            dealfile(path.join(files, item), options);
                        }
                    });
                }
            }
        })
    }
}


//检测文件是否存在
function exists(src, target, callback) {
    fs.exists(target, function(exists) {
        if (exists) {
            callback(src, target);
        } else {
            fs.readFile(src, function(err,data){
                if (err) throw err;
                fs.writeFileSync(target, data);
                callback(src, target);
            })
        }
    })
}

//处理文件
function dealfile(filename, options) {
    if (!fs.existsSync(filename)){
        console.log("css file does not exist");
        return
    }
    var css = fs.readFileSync(filename, {encoding:"utf8"});
    var processedCss = postcss(viewtorem(options)).process(css).css;
    process.stdout.write("--> " + filename + "...");
    fs.writeFileSync(path.normalize(filename).split(".")[0]+'-rem.css', processedCss);
    process.stdout.write("done\r\n");
}