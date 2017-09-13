function debounce(idle, func) {
  // 接受两个参数，间隔时间和实际调用函数
  var last; // 保存异步调用实际函数，通过闭包赋值不被销毁
  return function() {
    var ctx = this, args = arguments; // 存放函数的this和变量给下面的函数调用
    clearTimeout(last); // 如果该函数被调用，则清除上一个异步调用实际函数
    last = setTimeout(function() {
      // 重设异步调用实际函数
      func.apply(ctx, args); // 让实际函数在间隔设置的时间后调用
    }, idle);
  };
}
