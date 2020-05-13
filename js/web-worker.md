# web worker

> Javascript是运行在单线程环境中，也就是说无法同时运行多个脚本。假设用户点击一个按钮，触发了一段用于计算的Javascript代码，那么在这段代码执行完毕之前，页面是无法响应用户操作的。

### 简介

Web Worker为Web内容在后台线程中运行脚本提供了一种简单的方法。线程可以执行任务而不干扰用户界面。

Web Worker \(工作线程\) 是 HTML5 中提出的概念，它让我们可以在页面运行的 JavaScript 主线程中加载运行另外单独的一个或者多个 JavaScript 线程；

Web Worker分为两种类型，专用线程（Dedicated Web Worker） 和共享线程（Shared Web Worker）。专用线程仅能被创建它的脚本所使用（一个专用线程对应一个主线程），而共享线程能够在不同的脚本中使用（一个共享线程对应多个主线程）。

> Web Worker 提供的多线程编程能力与们传统意义上的多线程编程\(Java、C++ 等\)不同，主程序线程和 Worker 线程之间，Worker 线程之间，不会共享任何作用域或资源，它们间唯一的通信方式就是一个基于事件监听机制的 message。

> JavaScript 语言本身仍是运行在单线程上的， Web Worker 只是浏览器（宿主环境）提供的一个能力／API。

### 应用场景

Web Worker 的实现为前端程序带来了后台计算的能力，我们可以将一些耗时的数据处理操作从主线程中剥离，从而极大减轻了因计算量大造成 UI 阻塞而出现的界面渲染卡、掉帧的情况，使主线程更加专注于页面渲染和交互，更大程度地利用了终端硬件的性能；

* 数学运算
* 大数据处理
* 懒加载
* 文本分析
* 流媒体数据处理
* canvas 图形绘制
* 图像处理
* ...

#### 注意

1. 在worker内，不能直接操作DOM节点，也不能使用`window`对象的默认方法和属性。但是可以使用WebSockets，IndexedDB以及FireFox OS专用的Data Store API等数据存储机制
2. workers和主线程间通过postMessage\(\)方法发送各自的消息，使用onmessage事件处理函数来响应消息（消息被包含在[`Message`](https://developer.mozilla.org/zh-CN/docs/Web/Reference/Events/Message)事件的data属性中）。这个过程中数据并不是被共享而是被**复制**。
3. Web Worker 的运行不会影响主线程，但与主线程交互时仍受到主线程单线程的瓶颈制约。换言之，如果 Worker 线程频繁与主线程进行交互，主线程由于需要处理交互，仍有可能使页面发生阻塞
4. 共享线程可以被多个浏览上下文（Browsing context）调用，但所有这些浏览上下文必须同源（相同的协议，主机和端口号）

> 只要运行在同源的父页面中，workers可以依次生成新的workers；

基本知识了解了，下面进行枯燥的使用讲解。

### 专用worker（Dedicated Web Worker）

#### 创建worker

创建一个新的worker很简单。调用`Worker()` 的构造器，指定一个脚本的URI来执行worker线程（main.js）：

```javascript
const myWorker = new Worker('worker.js');
```

#### worker检测

为了更好的错误处理控制以及向下兼容，将worker运行代码包裹在以下代码中是一个很好的想法\(main.js\)：

```javascript
if (window.Worker) {

  ...

}
```

#### 消息的接收和发送

Worker 线程和主线程都通过 `postMessage()` 方法发送消息，通过 `onmessage` 事件接收消息。

> 在主线程中使用时，`onmessage`和`postMessage()` 必须挂在worker对象上，而在worker中使用时不需要这样做。在worker内部，`self` 和 `this` 都代表子线程的全局对象。

对于监听 `message` 事件，以下四种写法是等同的。

```javascript
// 写法 1
self.addEventListener('message', function (e) {
    // ...
})

// 写法 2
this.addEventListener('message', function (e) {
    // ...
})

// 写法 3
addEventListener('message', function (e) {
    // ...
})

// 写法 4
onmessage = function (e) {
    // ...
}
```

在主页面与 worker 之间传递的数据是通过**拷贝**，而不是共享来完成的。

```javascript
// main.js
const myWorker = new Worker('worker.js')

myWorker.onmessage = function(e) {
    console.log(e.data) // 24
}

myWorker.postMessage([10, 24])


// Worker.js
onmessage = function (e) {
    const data = e.data
    postMessage(data[0] + data[1])
}
```

传递给 `worker` 的对象需要经过序列化，接下来在另一端还需要反序列化。页面与 `worker` **不会共享同一个实例，**最终的结果就是在每次通信结束时生成了数据的**一个副本。**大部分浏览器使用[结构化拷贝](https://developer.mozilla.org/en/DOM/The_structured_clone_algorithm)来实现该特性。

> worker线程修改data数据不影响主线程中原始对象

#### 通过转让所有权\(可转让对象\)来传递数据

另一种性能更高的方法是将特定类型的对象\([可转让对象](http://w3c.github.io/html/infrastructure.html#transferable-objects)\) 传递给一个 worker/从 worker 传回 。可转让对象从一个上下文转移到另一个上下文而不会经过任何拷贝操作。这意味着当传递大数据时会获得极大的性能提升。

与按照引用传递不同的是，一旦对象转让，那么它在原来上下文的那个版本将不复存在。该对象的所有权被转让到新的上下文内。例如，当你将一个 ArrayBuffer 对象从主应用转让到 Worker 中，原始的 `ArrayBuffer` 被清除并且无法使用。它包含的内容会\(完整无差的\)传递给 Worker 上下文。

```javascript
var uInt8Array = new Uint8Array(1024*1024*32); // 32MB
for (var i = 0; i < uInt8Array .length; ++i) {
  uInt8Array[i] = i;
}
const myWorker = new Worker('worker.js')

myWorker.postMessage(uInt8Array.buffer, [uInt8Array.buffer]);

console.log(uInt8Array.length); // 传递后长度:0
```

#### 关闭 Worker

可以调用worker的`terminate` 方法从主线程中立刻终止一个运行中的worker：

```javascript
myWorker.terminate();
```

> worker 线程会被立即杀死，不会有任何机会让它完成自己的操作或清理工作。

worker线程内也可以调用自己的 `close`  方法进行关闭：

```text
close();
```

#### 错误处理

可以通过在主线程或 Worker 线程中设置 `onerror` 和 `onmessageerror` 的回调函数对错误进行处理。

当 worker 出现运行中错误时，它的 `onerror` 事件处理函数会被调用。它会收到一个扩展了 `ErrorEvent` 接口的名为 `error`的事件。

该事件不会冒泡并且可以被取消；为了防止触发默认动作，worker 可以调用错误事件的 `preventDefault()`方法。

```javascript
// main.js
myWorker.onerror = function () {
    // ...
}
myWorker.onmessageerror = function () {
    // ...
}

// worker.js
onerror = function () {

}
```

错误事件有以下三个字段：

* `message`可读性良好的错误消息。
* `filename`发生错误的脚本文件名。
* `lineno`发生错误时所在脚本文件的行号。

#### 生成subworker <a id="&#x751F;&#x6210;subworker"></a>

如果需要的话 worker 能够生成更多的 worker。这就是所谓的subworker，它们必须托管在同源的父页面内。而且，subworker 解析 URI 时会相对于父 worker 的地址而不是自身页面的地址。这使得 worker 更容易记录它们之间的依赖关系。

#### 引入脚本与库 <a id="&#x5F15;&#x5165;&#x811A;&#x672C;&#x4E0E;&#x5E93;"></a>

Worker 线程能够访问一个全局函数`importScripts()`来引入脚本，该函数接受0个或者多个URI作为参数来引入资源；以下例子都是合法的：

```javascript
importScripts();                        /* 什么都不引入 */
importScripts('foo.js');                /* 只引入 "foo.js" */
importScripts('foo.js', 'bar.js');      /* 引入两个脚本 */
```

> 脚本的下载顺序不固定，但执行时会按照传入 `importScripts()` 中的文件名顺序进行。

#### 嵌入式 Worker

目前没有一类标签可以使 Worker 的代码像 `<script>` 元素一样嵌入网页中，但是如果一个 [`<script>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/script) 元素没有 `src 特性，并且它的` `type` 特性没有指定成一个可运行的 mime-type，那么它就会被认为是一个数据块元素，并且能够被 JavaScript 使用。我们可以通过 `Blob()` 将页面中的 Worker 代码进行解析。

```javascript
<script id="worker" type="javascript/worker">
// 这段代码不会被 JS 引擎直接解析，因为类型是 'javascript/worker'

// 在这里写 Worker 线程的逻辑
</script>
<script>
    var workerScript = document.querySelector('#worker').textContent
    var blob = new Blob(workerScript, {type: "text/javascript"})
    var worker = new Worker(window.URL.createObjectURL(blob))
</script>
```

当然，你也可以通过下面方式来使用：

```javascript
var myTask = `
    onmessage = function (e) {
        var data = e.data;
        console.log('worker:', data);
    };
`;

var blob = new Blob([myTask]);
var myWorker = new Worker(window.URL.createObjectURL(blob));
```

#### Worker上下文\(WorkerGlobalScope\) <a id="worker-"></a>

workers 运行在另一个全局上下文中,不同于当前的[`window`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window). 

* 获取window会报错
* 试图操纵dom会报错

在**专用workers**的情况下，

* `DedicatedWorkerGlobalScope` 对象代表了worker的上下文。
* 该 DedicatedWorkerGlobalScope 对象\(也就是 [`Worker`](https://developer.mozilla.org/zh-CN/docs/Web/API/Worker) 全局作用域\)可以通过 [`self`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/self)关键字来访问 。
* 每一个 `DedicatedWorkerGlobalScope` 对象都有不同的 `event loop`。这个 `event loop` 没有关联浏览器上下文（browsing context），它的任务队列也只有事件（events）、回调（callbacks）和联网的活动（networking activity）。

除了标准的 [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) 函数集 \(例如 [`String`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/String), [`Array`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Array), [`Object`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object), [`JSON`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON) 等\), DOM有多种功能可供 workers使用。[`DedicatedWorkerGlobalScope`](https://developer.mozilla.org/zh-CN/docs/Web/API/DedicatedWorkerGlobalScope)像Window，实现[`WindowTimers`](https://developer.mozilla.org/zh-CN/docs/Web/API/WindowTimers) 和 [`WindowBase64`](https://developer.mozilla.org/zh-CN/docs/Web/API/WindowBase64)。

**导航相关**

* `Navigator`
* `Location` 

**时间相关**

* clearInterval\(\)
* clearTimeout\(\)
* setInterval\(\)
* setTimeout

**存储相关**

* Cache
* IndexedDB

**网络相关**

* Fetch
* WebSocket
* XMLHttpRequest

**其他**

* console
* performance

### 共享worker\(Shared Web Worker\) <a id="&#x5171;&#x4EAB;worker"></a>

一个共享worker可以被多个脚本使用。

> 共享worker可以被多个浏览上下文调用，所有这些浏览上下文必须属于同源（相同的协议，主机和端口号）。在本地调试的时候也需要通过启动本地服务器的方式访问，使用 `file://` 协议直接打开的话将会抛出异常。

#### 创建worker

生成一个新的共享worker与生成一个专用worker非常相似，只是构造器的名字不同

```javascript
const myWorker = new SharedWorker('worker.js');
```

> 与一个共享worker通信必须通过端口对象——一个确切的打开的端口供脚本与worker通信

在传递消息之前，端口连接必须被显式的打开，打开方式是使用onmessage事件处理函数或者start\(\)方法。

> 即`start()` 方法是与 `addEventListener` 配套使用的。如果我们选择 `onmessage` 进行事件监听，那么将隐含调用 `start()` 方法。

#### 消息的接收和发送

`postMessage()` 方法必须被端口对象调用

```javascript
myWorker.port.postMessage([squareNumber.value,squareNumber.value]);
```

相比于专用Worker，多了个全局的 `connect()` 函数，在函数中需要去获取一个 post 对象来进行初始化操作；

```javascript
onconnect = function(e) {
  var port = e.ports[0];

  port.onmessage = function(e) {
    var workerResult = 'Result: ' + (e.data[0] * e.data[1]);
    port.postMessage(workerResult);
  }
}
```

1. 当一个端口连接被创建时（例如：在父级线程中，设置onmessage事件处理函数，或者显式调用start\(\)方法时），使用onconnect事件处理函数来执行代码。
2. 使用事件的ports属性来获取端口并存储在变量中。
3. 然后，为端口添加一个消息处理函数用来做运算并回传结果给主线程。

### 关于线程安全 <a id="&#x5173;&#x4E8E;&#x7EBF;&#x7A0B;&#x5B89;&#x5168;"></a>

`Worker`接口会生成真正的操作系统级别的线程，对于 web worker 来说，与其他线程的通信点会被很小心的控制，这意味着你很难引起并发问题。你没有办法去访问非线程安全的组件或者是 DOM，此外你还需要通过序列化对象来与线程交互特定的数据。所以你要是不费点劲儿，还真搞不出错误来。

### 其它类型的worker <a id="&#x5176;&#x5B83;&#x7C7B;&#x578B;&#x7684;worker"></a>

除了专用和共享的web worker，还有一些其它类型的worker：

* [ServiceWorkers](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorker_API) （服务worker）一般作为web应用程序、浏览器和网络（如果可用）之前的代理服务器。它们旨在（除开其他方面）创建有效的离线体验，拦截网络请求，以及根据网络是否可用采取合适的行动并更新驻留在服务器上的资源。他们还将允许访问推送通知和后台同步API。
* Chrome Workers 是一种仅适用于firefox的worker。如果您正在开发附加组件，希望在扩展程序中使用worker且有在你的worker中访问  [js-ctypes](https://developer.mozilla.org/en/js-ctypes) 的权限，你可以使用Chrome Workers。详情请参阅[`ChromeWorker`](https://developer.mozilla.org/zh-CN/docs/Web/API/ChromeWorker)。
* [Audio Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API#Audio_Workers) （音频worker）使得在web worker上下文中直接完成脚本化音频处理成为可能。





参考文章：

1. \*\*\*\*[**JavaScript 性能利器 —— Web Worker**](https://juejin.im/post/5c10e5a9f265da611c26d634)\*\*\*\*
2. \*\*\*\*[**浅谈HTML5 Web Worker**](https://juejin.im/post/59c1b3645188250ea1502e46)\*\*\*\*
3. \*\*\*\*[**使用 Web Workers**](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API/Using_web_workers)\*\*\*\*



