#!/usr/bin/env node

var config = require("./config.json"),
	fs = require("fs"),
	path = require("path"),
	buffer = require("buffer").Buffer;
var rootValue = 20;
var unitPrecision = 5;
//Buffer则node中储存二进制数据的中介者
console.log("viewtorem is at :" + __dirname + "\r\njust rewrite it as you wish\r\n");
//取到参数
var targetList = process.argv;
if (targetList[0] == "node") {
	targetList.shift();
}
targetList.shift();

if (targetList.length <= 0) {
	console.log("useage : viewtorem fileA [fileB [fileC]..]");
	console.log("useage : viewtorem dirName");
	process.exit(0);
}
//fs.statSync同步获取文件信息
for (var i = 0; i < targetList.length; i++) {
	var target = targetList[i],
		stat = fs.statSync(target);
	if (stat.isFile()) {
		mathcRuleForFile(target);
	}
	//fs.readdirSync读取目录的所有文件
	if (stat.isDirectory()) {
		var list = fs.readdirSync(target);
		list.forEach(function(item) {
			mathcRuleForFile(path.join(target, item));
		});
	}
}

function mathcRuleForFile(filePath) {

	//traverse rules
	for (var i = 0; i < config.length; i++) {
		var configItem = config[i];

		var reg = new RegExp(config[i].tail);
		if (reg.test(filePath)) {
			dealFile(filePath);
			break;
		}
	}

	function dealFile(filePath) {

		if (!fs.existsSync(filePath)) {
			console.log("file not exist :" + filePath);
		} else {
			fs.readFile(filePath, {encoding:"utf-8"}, function(err, data) {
				if (err) throw err;

				var pxRegexWidth = /width\s*:\s*(\d*\.?\d+)px/ig;
				var pxReplaceWidth = function (m, $1) {
				    return 'width:' + toFixed((parseFloat($1) / rootValue), unitPrecision) + 'rem';
				};
				var pxRegexHeight = /([^-]{1})height\s*:\s*(\d*\.?\d+)px/ig;
				var pxReplaceHeight = function (m, $1, $2) {
				    return $1 + 'height:' + toFixed((parseFloat($2) / rootValue), unitPrecision) + 'rem';
				};
				//var aa = fs.readFileSync(filePath, { encoding: "utf8" });
				var finalResult = data.replace(pxRegexWidth, pxReplaceWidth).replace(pxRegexHeight, pxReplaceHeight);

				process.stdout.write("--> " + filePath + "...");
				//var finalResult = buffer.concat([currentComment, data]);
				//fs.unlinkSync(filePath);
				fs.writeFileSync(filePath.split(".")[0]+'-rem.css', finalResult)
				process.stdout.write("done\r\n");
			});
		}
	}
}
function toFixed(number, precision) {
    var multiplier = Math.pow(10, precision + 1),
    wholeNumber = Math.floor(number * multiplier);
    return Math.round(wholeNumber / 10) * 10 / multiplier;
}