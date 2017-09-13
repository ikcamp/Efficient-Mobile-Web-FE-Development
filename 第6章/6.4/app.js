var http = require("http");                       // 用于web服务器
var path = require('path');                       // 用于路径操作
var fs = require('fs');                           // 用于文件操作
var formidable = require("formidable");           // 用于解析HTTP协议里的Multipart格式，提取文件内容
var static = require('node-static');              // 用于提供静态资源

var staticServer = new static.Server('./public'); // 将public目录作为静态资源目录

function handleStaticRequest(req, res) {          // 处理静态资源请求
  req.addListener('end', function () {            // 监听HTTP请求结束事件
      staticServer.serve(req, res);               // 提供静态资源服务
  }).resume();
}

function handlefileUploadRequest(req, res) {      // 处理文件上传请求
  if (req.method === "POST") {                    // 文件上传请求必须是POST方法
    var form = new formidable.IncomingForm();     // 构建form实例
    form.on('error', function (error) {             // 监听form上传出错事件
      res.writeHead(500);                         // 设置响应头
      res.write('上传失败，' + error);              // 设置上传失败状态码和信息
      res.end();                                  // 结束响应
    }).parse(req, function(error, fields, files){ // 解析from上传数据
      for(var key in files) {                     // 遍历上传文件
        var file = files[key];                    // 上传文件
        var ws = fs.createWriteStream(path.resolve(__dirname, 'public/images', file.name)); // 构建写入流
        fs.createReadStream(file.path).pipe(ws);  // 写入上传文件至服务器文件夹
      }
      res.writeHead(200);                         // 设置响应头
      res.end();                                  // 结束响应
    });
  }
}

var app = http.createServer(function(req, res) {  // 创建WEB服务器
  handleStaticRequest(req, res);                  // 处理静态资源请求
  handlefileUploadRequest(req, res);              // 处理文件上传请求
});
app.listen(8080, function(){                      // 监听8080端口
	console.log("listen at port http://localhost:8080");
});