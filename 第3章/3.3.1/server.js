var http = require("http");
var fs = require('fs');
var path = require('path');

var data = null;

// 创建一个http服务
http.createServer(function(req, res){
	// 如果请求地址是保存数据
	if(req.url=='/savedata'){
		var post = '';
		// 监听data事件，接收post数据
		req.on('data', function(chunk){
			post += chunk;
		});
		// 监听end事件，在post结束后响应客户端
		req.on('end', function(){
			// 获取post来的数据，存入data对象
			data = post.substr('data='.length);
			// 响应客户端
			res.writeHead(200);
			res.write('saved');
			res.end();
		});
	}else{
		var types = {
			".html": "text/html",
			".css": "text/css",
			".js": "text/javascript"
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
	}
}).listen(8000);