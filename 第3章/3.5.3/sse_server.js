// 引入http模块，创建Web服务器
var http = require("http");
// 引入fs模块，操作文件
var fs = require("fs");

http.createServer(function (req, res) {
  // 默认页面
  var index = "./sse.html";
  // 文件名
  var fileName;
  // 定时器
  var interval;
  // 判断url是什么
  if (req.url === "/")
    fileName = index;
  else
    fileName = "." + req.url;
  // 如果是Server Sent Event建立连接，则设置相应头信息
  if (fileName === "./stream") {
    res.writeHead(200, {"Content-Type":"text/event-stream", "Cache-Control":"no-cache", "Connection":"keep-alive"});
    // 过10000秒重试
    res.write("retry: 10000\n");
    // 首先发送一次时间信息
    res.write("data: " + (new Date()) + "\n\n");
    // 每隔1秒发送一次时间信息
    interval = setInterval(function() {
      res.write("data: " + (new Date()) + "\n\n");
    }, 1000);
    // 监听close事件，用于停止定时器
    req.connection.addListener("close", function () {
      clearInterval(interval);
    }, false);
  } else if (fileName === index) {
    // 判断是否为页面请求，并找到相应文件返回页面
    fs.exists(fileName, function(exists) {
      if (exists) {
        fs.readFile(fileName, function(error, content) {
          if (error) {
            // 文件查找失败返回500
            res.writeHead(500);
            res.end();
          } else {
            // 文件查找成功返回页面
            res.writeHead(200, {"Content-Type":"text/html"});
            res.end(content, "utf-8");
          }
        });
      } else {
        // 文件不存在返回404
        res.writeHead(404);
        res.end();
      }
    });
  } else {
    // 路径不存在返回404
    res.writeHead(404);
    res.end();
  }

}).listen(8080, "127.0.0.1");
console.log("Server running at http://127.0.0.1:8080/");