function ajax(url) {
    // 直接返回一个Promise对象。
    return new Promise(function (resolve, reject) {
        var xmlRequest = new XMLHttpRequest();
        xmlRequest.onreadystatechange = function () {
            if (xmlRequest.readyState === XMLHttpRequest.DONE) {
                if (xmlRequest.status === 200) {
                    // 成功时，结果采用resolve回调返回。
                    resolve(xmlRequest.responseText);
                } else {
                    // 失败时，将出错信息采用reject回调返回。
                    reject(new Error("The response fail with code " + xmlRequest.status));
                }
            }
        };
        xmlRequest.open("get", url);
        xmlRequest.send(null);
    });
}

ajax("http://huiang.com").then(function(data){
    // data中包含返回的内容。
}).catch(function(err){
    // err包含错误异步调用的错误信息
});

ajax("http://someapi").then(function(data){
    // 修改某些属性
    data.a = "some value";
    return data;
}).then(function(data){
    // 返回新的对象
    return {
        a: data.a,
        b: 'some value'
    };
}).then(function(data){
    // some codes
}).catch(function(err){
    // some codes
});



ajax("http://api1").then(function(data){
    return ajax("http://api2");
}).then(function(data){
    // data参数为api2返回的数据
})