## 为什么会有Promise

在认识`Promise`之前，有必要知道什么是 **回调地狱**（Callback Hell）。

**无阻塞高并发，是nodeJS的招牌，要达到无阻塞高并发，异步是其基本保障**。之前处理异步是通过纯粹的回调函数，例如，使用ajax发起异步请求时，然后使用回调函数来处理返回结果。

如果只有一次回调，也没什么问题。但是，如果我们要用第一次异步返回的结果来决定第二次异步请求，用第二次异步请求的结果来决定第三次异步请求，层层嵌套下去，就形成了所谓的**回调地狱**。

举个例子

```
function loadImg(src,cb){
      const img = new Img();
      img.src = src 
      img.onload=()=>{cb()}
      img.onerror=()=>{cb(new Error('failed to load '+src ))  }
  }
loadImg('img1', err=>{
  if(err===undefined) {
      f1(); 
  } else {
      console.log(err.message);
  }
})
```

单一的处理逻辑，非常好处理，但如果再补上两层逻辑

```
 loadImg('img1', err=>{
     if(err===undefined) {
         f1();
         loadImg('img2', err=>{
             if(err===undefined) {
                 f2();
                 loadImg('img3', err=>{
                     if(err===undefined) {
                         f3();
                     } else {
                         console.log(err.message);
                     }
                 })
             } else {
                 console.log(err.message);
             }
         })
     } else {
         console.log(err.message);
     }
 })
```

每多一层回调，就会补两层判断，最终，问题可以解决，但是难以读懂，并且不好维护。

为了解决这个问题，`Promise`便应运而生——主要是将**深层回调**变成了**链式调用**，这样能更符合人类逻辑。

```
 function loadImg(src){
     const img = new Img();
      img.src = src 
      return new Promise((resolve, reject)=>{
          img.onload=()=>{resolve('success '+ src)}
          img.onerror=()=>{reject(new Error('failed to load '+src ))  }
      })
  }
```

将嵌套回调改为链式调用

```
loadImg('img1')
     .then(str=>{
         console.log(str);
         f1();
         return load('img2')   //这里返回一个Promise
     })                           // 直接就能用 then
     .then(str=>{
         console.log(str);
         f2();
         return load('img3')		// 再返回一个Promise
     })
     .then(str=>{           
         console.log(str);
         f3();
     })
     .catch(er=>{
         console.log(er.message);
     })
```
整个逻辑就很明晰和清爽了。

## 认识Promise

MDN 上对Promise概念的描述为：

> Promise 对象是一个代理对象（代理一个值），被代理的值在Promise对象创建时可能是未知的。它允许你为异步操作的成功和失败分别绑定相应的处理方法。 这让异步方法可以像同步方法那样返回值，但并不是立即返回最终执行结果，而是一个能代表未来出现的结果的promise对象

Promise的核心是**异步链式调用**。它利用了三大技术手段来解决回调地狱:

- 回调函数延迟绑定。
- 返回值穿透。
- 错误冒泡。

还是上面的例子，回调函数不是直接声明的，而是在通过后面的 then 方法传入的，即延迟传入。这就是**回调函数延迟绑定**。

根据 then 中回调函数的传入值创建不同类型的Promise, 然后把返回的 Promise 穿透到外层, 以供后续的调用。这便是**返回值穿透**。同回调函数延迟绑定一起，形成了链式调用的效果。

在整个链式调用流程中，某个流程一旦报错，产生的错误会一直向后传递，被最后的catch 接收到。这就是**错误冒泡**。

### 为什么要引入微任务

Promise 中的执行函数是同步进行的，但是里面存在着异步操作，在异步操作结束后会调用 resolve 方法，或者中途遇到错误调用 reject 方法，这两者都是作为微任务进入到 EventLoop 中。

**采用同步调用？**
同步调用会让整个脚本阻塞住，当前任务等待，后面的任务都无法得到执行，并且无法实现延迟绑定的效果。

**作为宏任务异步调用？**

在浏览器中，宏任务与微任务是交替执行的，简单来说，执行完一个宏任务，就会接着执行整个微任务列表中的 任务，然后再执行一个宏任务。

回调作为宏任务执行，会被放到当前宏任务队尾。当前宏任务队列过长，每个宏任务里又创建了对应的微任务。当那么回调迟迟得不到执行，就会造成应用卡顿。

**作为微任务异步调用**

`resolve`或`reject` 方法会放在微任务队列的队尾，等本次宏任务执行完成，浏览器就会依次处理微任务直到清空微任务队列。这样，即不会影响延迟绑定，又不会由于等待时间太长造成应用卡顿。

## 手写Promise

不管怎么实现，只要遵循promise a+ 规范 ，那就是一个Promise类

### promise规范

1. Promise是一个类, 类中需要传入一个executor执行器



## 参考文档

1. [精读JS系列（9b） Promise — 回调地狱、Promise构造器](http://caibaojian.com/promise-a.html)
2. [Promise面试灵魂十二问](https://juejin.cn/post/6918719482575880200)
3. [Promise(1)-手写Promise](https://juejin.cn/post/6844904088963022856)

