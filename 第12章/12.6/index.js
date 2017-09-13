// 引用benchmark组件
var Benchmark = require('benchmark');
// 声明一个测试实例
var suite = new Benchmark.Suite;

// 添加正则的测试用例
suite.add('RegExp#test', function() {
  /o/.test('Hello World!');
});
// 添加indexOf的测试用例
suite.add('String#indexOf', function() {
  'Hello World!'.indexOf('o') > -1;
});
// add listeners
suite.on('cycle', function(event) {
  console.log(String(event.target));
});
// 添加一个事件监听：在测试完成后输出最快的用例名称
suite.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
});
// 运行测试
suite.run();

/*
RegExp#test x 7,221,820 ops/sec ±1.47% (79 runs sampled)
String#indexOf x 13,487,003 ops/sec ±1.25% (76 runs sampled)
Fastest is String#indexOf

 */
var suite = new Benchmark.Suite('foo', {
  'onStart': onStart,
  'onCycle': onCycle,
  'onAbort': onAbort,
  'onError': onError,
  'onReset': onReset,
  'onComplete': onComplete
});