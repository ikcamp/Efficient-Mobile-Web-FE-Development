var http = require("http");
var fs = require('fs');
var path = require('path');

var data = null;

// 创建一个http服务
http.createServer(function(req, res){
	var types = {
		".html": "text/html",
		".css": "text/css",
		".vtt": "text/vtt"
	};
	// 获取请求资源的扩展名
	var ext = path.extname(req.url);
	// 根据扩展名得到响应类型
	var type = types[ext] || "text/plain";
	// 读取文件内容
	fs.readFile(path.join(__dirname, req.url), "binary", function (err, file) {
		if(err) {
			console.log(err);
			res.writeHead(404);
		}else{
			res.writeHead(200, {
				'Content-Type': type
			});
			res.write(file, "binary");
		}
		res.end();
	
	});
}).listen(8000);