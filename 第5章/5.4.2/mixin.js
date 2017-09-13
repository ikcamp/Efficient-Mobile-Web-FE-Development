// mixin方法，接收一个构造函数和一个原型对象
var mixin = function(obj, mixins) {
  var newObj = obj; // 保存构造函数等待扩展原型链
  newObj.prototype = Object.create(obj.prototype); // 原型对象实例赋给新的的函数的原型
  for (var key in mixins) {
    // 遍历原型对象上的属性
    if (mixins.hasOwnProperty(key)) {
      // 如果是对象是自身属性
      newObj.prototype[key] = mixins[key]; // 拷贝给新函数的原型
    }
  }
  return newObj; // 返回新的构造函数
};
var mixinObj = {
  // 要混入的原型对象
  foo: function() {
    // 一个属性为函数foo
    console.log('foo');
  }
};
var MyFunc = function() {
  // 构造函数
  console.log('bar');
};
var NewFunc = mixin(MyFunc, mixinObj); // mixin出一个新的构造函数
var newFunc = new NewFunc(); // 实例化
newFunc.foo(); // 输出了mixin上的foo
