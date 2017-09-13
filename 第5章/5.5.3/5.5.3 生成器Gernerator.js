function* gen() {
    yield 1;
    yield 2;
    return 3;
    yield 5;
}
var g = gen();
g.next();       // {value: 1, done: false}
g.next();       // {value: 2, done: false}
g.next();       // {value: 3, done: true}
g.next();       // {value: undefined, done: true}


function* demo() {
    var a = yield Promise.resolve(1);
    var b = yield Promise.resolve(a + 2);
    var c = yield Promise.resolve(3+b);
    return c;
};


function co(generator) {
    var gen = generator();
    function nextFunc(arg) {
        var next = gen.next(arg);
        // 首先执行以下next，取到第一个Promise
        if (!next.done) {
            // 如果生成器没有完成时，执行这个Promsie
            next.value.then(function (data) {
                console.log(data);
                // 当Promise执行成功后，执行下一个
                nextFunc(data);
            }).catch(function(err){
                console.log(err);
                nextFunc();
            });
        } else if(next.value) {
            // 当生成器执行完成后，得到返回的值。
            console.log(next.value);
        }
    }
    nextFunc();
}
co(demo);

async function es7(){
    var a = await Promise.resolve(1);
    var b = await Promise.resolve(a * 2);
    var c = await Promise.resolve(b+3);
    return c;
}

es7().then(function(data){
    console.log(data);
})