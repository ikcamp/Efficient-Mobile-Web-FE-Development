function ajax(url, callback) {
    // 新建一个XMLHttpRequest对象
    var xmlRequest = new XMLHttpRequest();
    // 检测readystatechange事件
    xmlRequest.onreadystatechange = function () {
        // 当请求已经完成时触发
        if (xmlRequest.readyState === XMLHttpRequest.DONE) {
            // 如果服务器端的响应没有错误（HTTP status的值为200）
            if (xmlRequest.status === 200) {
                callback(null, xmlRequest.responseText);
            } else {
                callback(xmlRequest.status);
            }
        }
    };
    // 建立一个链接
    xmlRequest.open("get", url);
    // 发送body为空的数据
    xmlRequest.send(null);
}

// do something

ajax("http://www.hujiang.com", function (err, data) {
    if (err) {
        console.log(err);
    } else {
        console.log('the response body is ' + data);
    }
})
// do something


function asyncMethod(callback){
    setTimeout(function() {
       // 需要执行很久的代码
       callback(result); 
    }, 0);
}

ajax("http://apiA", function (dataA) {
    ajax("http://apiB", function (dataB) {
        ajax("http://apiC", function(dataC){

        });
    });
});