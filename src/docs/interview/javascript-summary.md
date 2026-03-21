# JavaScript 面试题汇总

本文档汇总了 JavaScript 面试中常见的问题，按照主题进行分类，便于快速查阅和复习。

## 基础概念

### 1. 原型和原型链
- **核心概念**：每个对象都有原型对象，原型对象也可以有自己的原型，形成原型链
- **作用**：实现继承和属性查找机制
- **机制**：当访问对象属性时，会沿着原型链向上查找，直到找到或到达原型链末端

### 2. 作用域和作用域链
- **作用域**：变量、函数和对象的可访问范围
- **类型**：全局作用域、函数作用域、块级作用域
- **作用域链**：变量查找机制，从当前作用域开始，向上查找直到全局作用域

### 3. this 指向
- **全局上下文**：指向全局对象（window/global）
- **函数调用**：指向全局对象
- **方法调用**：指向调用该方法的对象
- **构造函数**：指向新创建的对象
- **箭头函数**：继承自外层作用域
- **call/apply/bind**：显式指定 this 指向

### 4. 闭包
- **定义**：函数能够访问其词法作用域之外的变量的能力
- **作用**：数据封装、保存状态
- **注意**：可能导致内存泄漏，需谨慎使用

### 5. 事件循环
- **核心概念**：JavaScript 处理异步操作的机制
- **组成**：调用栈、宏任务队列、微任务队列
- **执行顺序**：执行同步代码 → 执行所有微任务 → 执行一个宏任务 → 重复

## 异步编程

### 6. 异步编程模式
- **回调函数**：早期异步编程方式，容易导致回调地狱
- **Promise**：表示异步操作的最终完成或失败
- **async/await**：基于 Promise 的语法糖，使异步代码更像同步代码

### 7. Promise
- **状态**：pending（初始）、fulfilled（成功）、rejected（失败）
- **方法**：then()、catch()、finally()、all()、race()、allSettled()、any()
- **特点**：链式调用、错误捕获

### 8. async/await
- **async**：声明异步函数，返回 Promise
- **await**：等待 Promise 完成，只能在 async 函数中使用
- **错误处理**：使用 try-catch 捕获错误

## 数据类型和操作

### 9. 数据类型
- **基本类型**：string、number、boolean、null、undefined、symbol、bigint
- **引用类型**：object（包括数组、函数、日期等）

### 10. 类型转换
- **隐式转换**：JavaScript 自动进行的类型转换
- **显式转换**：使用 String()、Number()、Boolean() 等方法
- **类型检测**：typeof、instanceof、Object.prototype.toString.call()

### 11. 深浅拷贝
- **浅拷贝**：只复制对象的第一层属性，嵌套对象只复制引用
- **深拷贝**：复制对象的所有层级，创建完全独立的副本
- **实现方法**：JSON.parse(JSON.stringify())、递归拷贝

### 12. 正则表达式
- **创建方式**：字面量 /pattern/flags、RegExp 构造函数
- **标志**：g（全局）、i（忽略大小写）、m（多行）等
- **方法**：test()、exec()、match()、search()、replace()、split()

## DOM 操作

### 13. DOM 节点类型
- **Element**：元素节点
- **Text**：文本节点
- **Comment**：注释节点
- **Document**：文档节点
- **DocumentFragment**：文档片段节点

### 14. DOM 选择方法
- **getElementById()**：通过 ID 选择元素
- **querySelector()**：通过 CSS 选择器选择第一个匹配元素
- **getElementsByClassName()**：通过类名选择元素
- **getElementsByTagName()**：通过标签名选择元素
- **querySelectorAll()**：通过 CSS 选择器选择所有匹配元素

### 15. DOM 修改方法
- **innerHTML**：设置或获取元素的 HTML 内容
- **textContent**：设置或获取元素的文本内容
- **setAttribute()**：设置元素的属性
- **style**：修改元素的内联样式
- **classList**：操作元素的类名

### 16. DOM 事件处理
- **addEventListener()**：添加事件监听器
- **removeEventListener()**：移除事件监听器
- **事件委托**：利用事件冒泡，将子元素的事件处理委托给父元素

## 面向对象编程

### 17. 构造函数和原型继承
- **构造函数**：用于创建对象的函数
- **原型**：每个函数都有 prototype 属性，用于存储共享方法
- **继承**：通过原型链实现

### 18. ES6 Class
- **语法**：使用 class 关键字定义类
- **继承**：使用 extends 关键字实现
- **方法**：构造函数、实例方法、静态方法

### 19. 设计模式
- **单例模式**：确保一个类只有一个实例
- **工厂模式**：通过共同接口创建对象
- **观察者模式**：对象间的一对多依赖关系
- **装饰器模式**：动态为对象添加功能
- **模块模式**：使用闭包创建私有变量和方法

## 性能优化

### 20. 代码优化
- **减少 DOM 操作**：批量操作 DOM
- **使用事件委托**：减少事件监听器数量
- **避免使用 eval**：性能差且有安全风险
- **使用防抖和节流**：减少频繁触发的事件处理

### 21. 资源优化
- **压缩代码**：减少文件大小
- **减少 HTTP 请求**：合并文件
- **使用 CDN**：提高加载速度
- **延迟加载**：非关键代码延迟加载

### 22. 内存优化
- **及时释放内存**：将不再使用的变量设置为 null
- **避免内存泄漏**：避免全局变量、及时清除定时器、解除 DOM 引用

## 模块化开发

### 23. 模块化系统
- **CommonJS**：Node.js 使用的模块系统，使用 require 和 module.exports
- **ES Modules**：ECMAScript 标准，使用 import 和 export

### 24. 模块化工具
- **Webpack**：模块打包器
- **Rollup**：ES Modules 打包器
- **Parcel**：零配置打包器
- **Browserify**：将 CommonJS 模块打包为浏览器可用的代码

## 工具和调试

### 25. 测试
- **单元测试**：测试代码中最小的可测试单元
- **集成测试**：测试多个单元之间的交互
- **端到端测试**：模拟用户行为，测试整个应用
- **测试框架**：Jest、Mocha、Chai、Cypress

### 26. 性能分析和调试工具
- **浏览器开发工具**：Chrome DevTools、Firefox DevTools
- **命令行工具**：Node.js Inspector、clinic、0x
- **性能指标**：FCP、LCP、FID、CLS、TTI
- **调试技巧**：断点调试、日志调试、远程调试

### 27. 构建工具
- **打包工具**：Webpack、Rollup、Parcel
- **任务运行器**：Gulp、Grunt
- **代码质量工具**：ESLint、Prettier
- **包管理器**：npm、yarn、pnpm

## 其他重要概念

### 28. 函数式编程
- **纯函数**：相同输入总是产生相同输出，无副作用
- **不可变数据**：一旦创建就不能修改的数据
- **高阶函数**：接受函数作为参数或返回函数的函数
- **常用方法**：map、filter、reduce、compose、curry

### 29. 浏览器 API
- **DOM API**：操作网页结构、样式和内容
- **BOM API**：操作浏览器窗口和导航
- **Fetch API**：发送 HTTP 请求
- **Geolocation API**：获取用户地理位置
- **LocalStorage/SessionStorage**：在浏览器中存储数据
- **Canvas API**：绘制图形
- **WebSocket API**：建立双向通信
- **Service Worker API**：创建离线体验

### 30. 错误处理
- **错误类型**：SyntaxError、ReferenceError、TypeError、RangeError、URIError、EvalError
- **try-catch-finally**：捕获和处理错误
- **throw**：手动抛出错误
- **自定义错误**：继承 Error 类创建自定义错误

## 总结

JavaScript 是一门不断发展的语言，掌握核心概念和最佳实践对于面试和实际开发都非常重要。本文档汇总了常见的 JavaScript 面试问题，希望能帮助你更好地准备面试。

## 参考资料

- [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [JavaScript.info](https://javascript.info/)
- [You Don't Know JS](https://github.com/getify/You-Dont-Know-JS)
