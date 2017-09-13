var http = require("http");                       // 用于web服务器
var static = require('node-static');              // 用于提供静态资源
var WebSocketServer = require('ws').Server;       // 用于Websocket服务器

var staticServer = new static.Server('./public'); // 将public目录作为静态资源目录

function handleStaticRequest(req, res) {          // 处理静态资源请求
  req.addListener('end', function () {            // 监听HTTP请求结束事件
      staticServer.serve(req, res);               // 提供静态资源服务
  }).resume();
}

var uid = 1;                                      // 当前可分配的用户id
var wss = new WebSocketServer({port: 3000});      // 监听3000端口
wss.on('connection', function(ws) {               // 客户端发起连接
  ws.on('message', function(data) {               // 客户端发送消息
    var data = JSON.parse(data);
    wss.broadcast({
      uid: data.uid,
      message: data.message,
      type: "message"
    });
  });
  ws.uid = uid;
  ws.on('close', function() {                     // 客户端关闭连接
    wss.broadcast({
      uid: ws.uid,
      type: "leave"
    });
  });
  ws.send(JSON.stringify({
      uid: uid,
      type: "assign"
  }));
  //将新加入用户的信息告诉所有房间内的所有用户
  wss.broadcast({
    uid: uid,
    type: "welcome"
  });

  uid++;
});

wss.broadcast = function(data) {
  wss.clients.forEach(function each(client) {
    client.send(JSON.stringify(data));
  });
}

var app = http.createServer(function(req, res) {  // 创建WEB服务器
  handleStaticRequest(req, res);                  // 处理静态资源请求
});
app.listen(8080, function(){                      // 监听8080端口
	console.log("listen at port http://localhost:8080");
});