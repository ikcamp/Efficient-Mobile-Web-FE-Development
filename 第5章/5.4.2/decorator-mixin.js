function handleClass() {
  // 处理类
  for (let i = 0, l = mixins.length; i < l; i++) {
    // 遍历混入的对象
    const descs = getOwnPropertyDescriptors(mixins[i]); // 获取mixins的属性
    for (const key in descs) {
      // 遍历原型对象上的属性
      if (!(key in target.prototype)) {
        // 如果类上没有这个属性
        defineProperty(target.prototype, key, descs[key]); // 定义一个属性
      }
    }
  }
}
export default function mixin(...mixins) {
  // 输出这个方法
  return target => {
    // 返回一个对类包装的函数
    return handleClass(target, mixins);
  };
}
