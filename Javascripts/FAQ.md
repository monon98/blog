# 1. Object.defineProperty

Object.defineProperty 是 JavaScript 中用来定义或修改对象属性的方法。通过这个方法，我们可以给对象添加新的属性，或者修改已有属性的特性（比如可写性、可枚举性、可配置性等）。这个方法接受三个参数：要定义属性的对象，要定义的属性名，以及一个描述这个属性特性的对象。举个例子，如果我们想要定义一个名为 age 的属性，可以这样使用：

```JavaScript
let person = {};
Object.defineProperty(person, 'age', {
  value: 30,
  writable: true,
  enumerable: true,
  configurable: true
});
```

在这个例子中，我们定义了一个 age 属性，它的值为 30，并且可以被修改、枚举和配置。

# 2. 