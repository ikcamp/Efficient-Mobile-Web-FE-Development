var ws = new WebSocket("ws://localhost:3000");
var uid;
var $nickname = $(".name");
var $chat = $(".chat");
var typedMessage = $('.typed-message');
ws.onmessage = function(event) {
    var message = JSON.parse(event.data);
    if(message.type === "assign") {
        uid =  message.uid;
        $nickname.text("游客 " + uid);
    } else if(message.type === "welcome") {
      $chat.append(
        '<span class="user">系统消息：</span><div class="message">欢迎游客 ' 
        + message.uid + '.</div>'
      );
    } else if(message.type === "leave") {
      $chat.append(
        '<span class="user">系统消息：</span><div class="message">游客 ' 
        + message.uid + ' 退出聊天室.</div>'
      );
    } else if(message.type === "message") {
      $chat.append(
        '<span class="user">游客 ' + message.uid + ' 说：</span><div class="message">' 
        + message.message + '</div>'
      );
    }
}

$('.send-message').click(function(){
  var message = typedMessage.val();
  if(message === ""){
    return ;
  }
  ws.send(JSON.stringify({
    uid: uid,
    message: message
  }));
  typedMessage.val('');
});