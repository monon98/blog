# 文章目录

- [文章目录](#文章目录)
  - [1. 说一下对原型和原型链的理解，原型和原型链在 JavaScript 中的作用和机制](#1-说一下对原型和原型链的理解原型和原型链在-javascript-中的作用和机制)
  - [2. react中的hook的什么？为什么引入hook？useCallback的作用是什么？](#2-react中的hook的什么为什么引入hookusecallback的作用是什么)
  - [3. route中的history和hash的区别是什么？各自的优点和缺点是什么？](#3-route中的history和hash的区别是什么各自的优点和缺点是什么)
  - [4. 前端的本地存储有哪些方式？](#4-前端的本地存储有哪些方式)
    - [IndexedDB 的基本概念和用法](#indexeddb-的基本概念和用法)
    - [Cache Storage的基本概念和用法](#cache-storage的基本概念和用法)
  - [5. 前端cookie是怎么发送的？跨域的情况下请求会携带cookie（fetch）吗？](#5-前端cookie是怎么发送的跨域的情况下请求会携带cookiefetch吗)
  - [6. 两个页签之间的通信方式](#6-两个页签之间的通信方式)
    - [共享工作者（Shared Worker）的应用和优势](#共享工作者shared-worker的应用和优势)
    - [广播频道 API（Broadcast Channel API）的基本用法和作用](#广播频道-apibroadcast-channel-api的基本用法和作用)
  - [7. loader 和 plugin 在 webpack 中的区别](#7-loader-和-plugin-在-webpack-中的区别)

## 1. 说一下对原型和原型链的理解，原型和原型链在 JavaScript 中的作用和机制

在 JavaScript 中，每个对象（除了基本数据类型）都有一个原型对象，可以理解为对象之间的关系。原型对象也是一个对象。当我们访问一个对象的属性或方法时，如果这个对象本身没有这个属性或方法，JavaScript 就会去它的原型对象上查找，直到找到为止。这种属性和方法的继承关系就是通过原型来实现的。

原型链（Prototype Chain）是一种对象之间通过原型对象连接起来的链式结构。每个对象都有一个原型，而原型对象本身也可以有自己的原型，形成一条链条。当我们访问一个对象的属性或方法时，JavaScript 会沿着原型链一直向上查找，直到找到对应的属性或方法为止。如果最终都没有找到，就会返回 undefined。

总的来说，原型和原型链是 JavaScript 中实现继承和属性查找的重要机制。通过原型链，我们可以实现对象之间的属性和方法的共享和继承，从而提高代码的复用性和可维护性。


## 2. react中的hook的什么？为什么引入hook？useCallback的作用是什么？

哦，React 中的 Hook 是一种函数，可以让你在函数组件中使用 React 特性。引入 Hook 的初衷是为了让函数组件具备类组件的功能，使得函数组件能够更方便地管理状态、生命周期等。使用 Hook 可以让代码更简洁、可读性更好。

`useCallback` 是 React 中的一个 Hook，它用于缓存一个回调函数，避免在每次组件渲染时都创建新的回调函数实例。这对于性能优化很有帮助，特别是在传递回调函数给子组件时，可以避免不必要的重新渲染。

举个例子，如果你有一个回调函数 `handleClick`，你可以使用 `useCallback` 来缓存这个函数：

```javascript
const handleClick = useCallback(() => {
  console.log('Button clicked');
}, []);
```

在这个例子中，`handleClick` 函数会在组件初始化时被创建，并且只有依赖项发生变化时才会重新创建。这样可以提高性能，避免不必要的函数重复创建。

总的来说，`useCallback` 的作用就是缓存回调函数，优化性能。如果你的组件有一些依赖于回调函数的逻辑，可以考虑使用 `useCallback` 来提高效率。

## 3. route中的history和hash的区别是什么？各自的优点和缺点是什么？

在 Vue.js 中，路由中的 `history` 模式和 `hash` 模式是两种常见的路由模式，它们有一些区别和各自的优缺点。

1. **区别**：
   - `hash` 模式：在 URL 中会出现 `#` 符号，路由信息会保存在 URL 的哈希部分，例如 `http://www.example.com/#/about`。
   - `history` 模式：利用 HTML5 的 History API，在 URL 中不会有 `#` 符号，路由信息会直接显示在路径中，例如 `http://www.example.com/about`。

2. **优点和缺点**：
   - `hash` 模式：
     - 优点：
       - 兼容性好，支持所有浏览器。
       - 部署简单，不需要服务器端额外配置。
     - 缺点：
       - URL 中会有 `#` 符号，影响美观性。
       - 不利于 SEO（搜索引擎优化），搜索引擎对于 `#` 后面的内容不会进行解析。
   - `history` 模式：
     - 优点：
       - URL 更美观，不会有 `#` 符号。
       - 更符合 RESTful 风格，路径更加直观。
     - 缺点：
       - 兼容性较差，需要服务器端的额外配置支持。
       - 刷新页面时会出现 404 错误，需要配置后端服务器以支持单页应用的路由。

综上所述，如果你的应用需要在老旧浏览器中运行或者不需要考虑 SEO 问题，可以选择 `hash` 模式；如果你追求更好的用户体验和更好的 URL 显示，可以选择 `history` 模式，但需要注意处理刷新页面时出现的问题。

## 4. 前端的本地存储有哪些方式？

前端的本地存储有一些方式，主要包括：

1. **Cookies（Cookie）**：是最古老也是最常见的一种本地存储方式。Cookies 是由服务器发送到浏览器并保存在本地的小段文本信息，可以通过 JavaScript 访问和操作。但是 Cookies 的容量有限，且在每次 HTTP 请求中都会被发送到服务器，可能会影响性能。

2. **Web Storage（Web存储）**：包括 `localStorage` 和 `sessionStorage`。它们都是浏览器提供的 API，用于在浏览器中保存键值对的数据。其中，`localStorage` 是永久保存在浏览器中的数据，`sessionStorage` 只在当前会话中有效，关闭标签页或浏览器后数据会被清除。

3. **IndexedDB**：是一种使用 JavaScript 操作的客户端数据库，用于存储大量结构化数据。IndexedDB 允许你在客户端存储和检索数据，可以存储复杂的数据类型，如对象、数组等。

4. **Cache Storage**：用于存储缓存的 API，通常用于存储离线应用程序的资源，如图片、CSS 文件等。Cache Storage 可以让你控制缓存的内容，适合用于提高应用程序的性能和离线访问体验。

这些本地存储方式各有优缺点，可以根据具体需求选择合适的方式来存储数据。如果只是简单的键值对存储，可以使用 `localStorage`；如果需要存储大量结构化数据，可以考虑使用 IndexedDB；如果需要缓存资源以提高性能，可以使用 Cache Storage。

### IndexedDB 的基本概念和用法

IndexedDB 是一个浏览器内置的客户端数据库，用于在浏览器中存储大量结构化数据。与传统的 Web 存储方式（如 Cookies 和 Web Storage）相比，IndexedDB 具有更强大的功能和更灵活的存储能力。

IndexedDB 具有以下特点和优势：

1. **适合存储大量数据**：IndexedDB 可以存储大量结构化数据，如对象、数组等，适合用于存储复杂的数据模型。
  
2. **支持事务**：IndexedDB 支持事务操作，可以确保数据的一致性和完整性，防止数据损坏或丢失。

3. **支持索引**：IndexedDB 允许为存储的对象设置索引，可以提高数据的检索效率，加快数据查询操作。

4. **异步操作**：IndexedDB 使用异步操作，不会阻塞主线程，可以提高页面的性能和响应速度。

使用 IndexedDB 可以在浏览器中创建数据库、存储数据、查询数据等操作，从而实现在客户端进行数据的持久化存储和管理。

下面是一个简单的示例，演示了如何使用 IndexedDB 存储和读取数据：

```javascript
// 打开数据库
let request = indexedDB.open('myDatabase', 1);

// 创建对象存储空间
request.onupgradeneeded = function(event) {
  let db = event.target.result;
  let objectStore = db.createObjectStore('customers', { keyPath: 'id' });
  objectStore.createIndex('name', 'name', { unique: false });
};

// 存储数据
request.onsuccess = function(event) {
  let db = event.target.result;
  let transaction = db.transaction(['customers'], 'readwrite');
  let objectStore = transaction.objectStore('customers');
  objectStore.add({ id: 1, name: 'Alice', email: 'alice@example.com' });
};

// 读取数据
request.onsuccess = function(event) {
  let db = event.target.result;
  let transaction = db.transaction(['customers'], 'readwrite');
  let objectStore = transaction.objectStore('customers');
  let getRequest = objectStore.get(1);
  getRequest.onsuccess = function() {
    console.log(getRequest.result);
  };
};
```

通过使用 IndexedDB，我们可以在浏览器中创建和管理客户端数据库，实现复杂的数据存储和查询操作。

### Cache Storage的基本概念和用法

Cache Storage是浏览器提供的一种用于缓存文件的API，它可以让开发者更好地控制网页的缓存策略，提高网页的性能和用户体验。

使用Cache Storage可以将网页所需的静态资源（如CSS、JavaScript、图片等）存储在浏览器的缓存中，以便在用户再次访问网站时能够更快地加载页面和资源。这有助于减少网络请求，节省带宽，并提高网页的加载速度。

下面是一个简单的示例，演示了如何使用Cache Storage缓存和读取静态资源：

```javascript
// 打开一个名为'assets-cache'的缓存
caches.open('assets-cache').then(cache => {
  // 将静态资源添加到缓存中
  cache.addAll([
    '/styles/style.css',
    '/scripts/script.js',
    '/images/image.jpg'
  ]);
});

// 从缓存中读取资源
caches.match('/styles/style.css').then(response => {
  if (response) {
    // 如果缓存中存在该资源，则使用缓存的资源
    return response;
  } else {
    // 如果缓存中不存在该资源，则从网络请求并存入缓存
    return fetch('/styles/style.css').then(networkResponse => {
      caches.open('assets-cache').then(cache => {
        cache.put('/styles/style.css', networkResponse);
      });
      return networkResponse.clone();
    });
  }
});
```

通过使用Cache Storage，我们可以实现对静态资源的缓存管理，提高网页的加载速度和性能。

## 5. 前端cookie是怎么发送的？跨域的情况下请求会携带cookie（fetch）吗？

在前端，Cookie 是通过 HTTP 请求头来发送的。当浏览器向服务器发送 HTTP 请求时，会将存储在浏览器中的 Cookie 信息包含在请求头中，以便服务器能够识别用户身份、保持会话状态等。

在跨域请求的情况下，浏览器默认情况下是不会携带 Cookie 的。这是因为浏览器的同源策略限制了跨域请求携带 Cookie，以保护用户的隐私和安全。但是，在一些情况下，我们可能需要在跨域请求中携带 Cookie，比如需要在跨域请求中保持会话状态。

对于跨域请求，如果我们使用 Fetch API 来发送请求，可以通过设置 `credentials` 选项为 `'include'` 来指示浏览器携带 Cookie。示例如下：

```javascript
fetch('http://www.example.com/api/data', {
  method: 'GET',
  credentials: 'include'
})
.then(response => {
  // 处理响应
})
.catch(error => {
  // 处理错误
});
```

通过设置 `credentials: 'include'`，浏览器会在跨域请求中携带 Cookie，以保持会话状态。需要注意的是，服务器端也需要配置允许跨域请求携带 Cookie，否则请求依然不会携带 Cookie。

## 6. 两个页签之间的通信方式

在前端中，我们可以使用一些方式来实现两个页签之间的通信：

1. **LocalStorage**：可以使用 `LocalStorage` 来在一个页签中存储数据，另一个页签再从 `LocalStorage` 中读取这些数据。通过监听 `LocalStorage` 的变化事件，可以实现页面之间的通信。

2. **Broadcast Channel API**：这是一个新的浏览器 API，可以创建一个广播通道，多个页面可以通过这个通道进行通信。一个页面发送消息，其他页面可以监听并接收这些消息。

3. **Shared Worker**：共享工作者是一个在多个页面间共享数据和通信的方式。多个页签可以和同一个共享工作者进行通信，从而实现跨页签的通信。

4. **PostMessage**：可以使用 `window.postMessage` 方法在不同页签之间发送消息。一个页面可以向另一个页面发送消息，并通过监听 `message` 事件来接收消息。

### 共享工作者（Shared Worker）的应用和优势

共享工作者（Shared Worker）是一个在多个浏览器页面之间共享的 JavaScript 线程。与普通的 Web Worker 不同，共享工作者可以被多个浏览器页面共享，使得这些页面可以共同利用一个后台线程来处理一些任务和通信。

共享工作者在多个页面之间共享数据和状态，可以实现页面之间的通信和协作。通过共享工作者，不同页面可以发送消息、接收消息，共享数据等，从而实现复杂的协作和通信需求。

共享工作者有以下特点和优势：

- 可以被多个页面共享，实现跨页面通信。
- 可以共享数据和状态，避免不同页面之间的数据冗余。
- 可以提高页面的性能，将一些计算密集型任务放在共享工作者中执行，不会阻塞主页面的渲染和交互。
需要注意的是，共享工作者只能通过消息传递进行通信，不能访问 DOM，也不能直接访问页面的 JavaScript 环境。因此，共享工作者适合用于处理一些与页面无关的后台任务和通信。

### 广播频道 API（Broadcast Channel API）的基本用法和作用

哦，广播频道 API（Broadcast Channel API）是一个新的浏览器 API，用于在不同的浏览器标签页之间进行通信。通过广播频道 API，我们可以创建一个广播通道，多个页面可以通过这个通道进行消息的广播和接收。

使用广播频道 API，可以实现跨标签页的通信，比如在一个页面发送消息，其他页面可以监听并接收这些消息。这在一些需要多个页面协同工作或进行实时通信的场景中非常有用。

下面是一个简单的示例，演示了如何使用广播频道 API：

```javascript
// 创建一个广播频道
const channel = new BroadcastChannel('myChannel');

// 发送消息
channel.postMessage('Hello from Page A!');

// 监听消息
channel.onmessage = event => {
  console.log('Message received in Page A:', event.data);
};

// 在另一个页面中监听并接收消息
const channel = new BroadcastChannel('myChannel');
channel.onmessage = event => {
  console.log('Message received in Page B:', event.data);
};
```

在这个示例中，我们创建了一个名为 `myChannel` 的广播频道，页面 A 发送了一条消息，并在页面 A 和页面 B 中分别监听并接收消息。

通过广播频道 API，不同标签页之间可以实现实时通信，方便实现一些跨页面协同的功能。希望这个简单介绍能帮助你理解广播频道 API 。

## 7. loader 和 plugin 在 webpack 中的区别

在 webpack 中，loader 用于处理各种类型的文件，比如 JavaScript、CSS、图片等。loader 可以将这些文件转换为模块，以便 webpack 可以正确地加载它们。loader 可以处理文件的转换、压缩、编译等任务，使得我们可以在项目中引入各种类型的文件，并且在构建过程中进行相应的处理。

在 webpack 中，plugin 用于执行更广泛的任务，比如打包优化、资源管理、环境变量注入等。plugin 可以监听 webpack 构建过程中的事件，并在适当的时机执行自定义的逻辑。通过使用 plugin，我们可以扩展 webpack 的功能，实现更多复杂的需求，比如代码分割、提取公共代码、压缩代码等。

总的来说，loader 主要用于处理文件的转换和加载，而 plugin 则用于执行更广泛的任务，对 webpack 的构建过程进行干预和定制化。在实际项目中，我们通常会同时使用 loader 和 plugin，来实现对项目资源的处理和优化。
