## 为什么会有Promise

在认识`Promise`之前，有必要知道什么是 **回调地狱**（Callback Hell）。

**无阻塞高并发，是nodeJS的招牌，要达到无阻塞高并发，异步是其基本保障**。之前处理异步是通过纯粹的回调函数，例如，使用ajax发起异步请求，然后使用回调函数来处理返回结果。

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
         return loadImg('img2')   //这里返回一个Promise
     })                           // 直接就能用 then
     .then(str=>{
         console.log(str);
         f2();
         return loadImg('img3')		// 再返回一个Promise
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

回调作为宏任务执行，会被放到当前宏任务队尾。如果当前宏任务队列过长，每个宏任务里又创建了对应的微任务。当那么回调迟迟得不到执行，就会造成应用卡顿。

**作为微任务异步调用**

`resolve`或`reject` 方法会放在微任务队列的队尾，等本次宏任务执行完成，浏览器就会依次处理微任务直到清空微任务队列。这样，即不会影响延迟绑定，又不会由于等待时间太长造成应用卡顿。

## 手写Promise

不管怎么实现，只要遵循promise a+ 规范 ，那就是一个Promise类。

该实例完整代码移步[code](../code/MyPromise.js)

### promise规范

1. Promise是一个类, 类中需要传入一个executor执行器，默认会立即执行。
2. promise有内部会提供两个方法(非原型对象上)，这两个方法会传给executor执行器方法,可以更改promise的状态。
3. Promise有三个状态：pending, fulfilled 或 rejected，一个Promise必须处在其中之一的状态
4. Promise只会从等待变为成功或者从等待变为失败，且变化完成后，不允许再改变状态。
5. 每个promise实例上都要有一个then方法， 其接收两个可选参数，onFulfilled` 和 `onRejected，分别是成功和失败的回调

### 实现then和catch

1. 先写个最初版本，实现

- 回调函数延迟绑定
- 支持多次绑定回调函数

```
// 定义三种状态
const PENDING = "pending";
const RESOLVE = "resolve";
const REJECTED = "rejected";

class MyPromise {
  constructor(exector) {
    this.status = PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCbs = [];
    this.onRejectedCbs = [];

    const resolve = (value) => {
      if (this.status !== PENDING) { // 只允许状态由等待变为成功或失败，并且不允许多次调用
        return;
      }
      setTimeout(() => { // js代码本身无法设置微任务，这里使用宏任务来实现异步操作
        this.value = value; // 存储执行成功的结果
        this.status = RESOLVE; // 设置状态为成功
        this.onFulfilledCbs.forEach((cb) => { // 顺次执行当前存储的所有成功的回调函数
          cb(this.value);
        });
      });
    };

    const rejected = (reason) => {
      if (this.status !== PENDING) { // 只允许状态由等待变为成功或失败，并且不允许多次调用
        return;
      }
      setTimeout(() => {
        this.reason = reason;
        this.status = REJECTED;
        this.onRejectedCbs.forEach((cb) => {
          cb(reason);
        });
      });
    };
    exector(resolve, rejected);
  }

  then = (onFulfilled, onRejected) => {
    if (this.status === PENDING) { // 如果状态为等待，则存储成功及失败的回调
      this.onFulfilledCbs.push(onFulfilled);
      this.onRejectedCbs.push(onRejected);
    } else if (this.status === RESOLVE) { // 否则，直接执行对应回调
      onFulfilled(this.value);
    } else {
      onRejected(this.reason);
    }
    return this;
  };
}
```

执行一下试试

```
let readFilePromise = (filename) => {
  return new MyPromise((resolve, reject) => {
    setTimeout(() => {
      resolve(filename);
    }, 1000);
  });
};

const p1 = readFilePromise("./001.txt");

p1.then((data) => {
  console.log('第一次回调' + data.toString());
});

p1.then((data) => {
  console.log('第二次回调' + data.toString());
});

p1.then((data) => {
  console.log('第三次回调' + data.toString());
});

// 打印结果
第一次回调./001.txt
第二次回调./001.txt
第三次回调./001.txt

```

2. 第二步，增加链式调用功能。

在最初的例子中，每个loadImg函数在执行完后，都会返回一个Promise。
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

这样，在链式调用中，每一个then方法里的函数，都会在上一个then方法执行完成后执行。也就意味着，then方法在执行完成时，必须返回一个promise对象，保证下一个`.then`可以被正确执行。

而在我们实现的代码中，then方法返回了自己

```
 then = (onFulfilled, onRejected) => {
    // ...
    // ...
    return this;
  };
```

这么做保证了我们可以使用链式调用，但是这种链式调用本质上就是**多次绑定回调函数**。

```
const p1 = readFilePromise("./001.txt");

p1.then((data) => {
  console.log('第一次回调' + data.toString());
}).then((data) => {
  console.log('第二次回调' + data.toString());
}).then((data) => {
  console.log('第三次回调' + data.toString());
});

// 打印结果
第一次回调./001.txt
第二次回调./001.txt
第三次回调./001.txt
```

对测试代码做下变更，每个then函数在执行完成后，返回了下一次的要执行操作的Promise对象。结果如下所示，返回的Promise对象被抛弃了。

```
const p1 = readFilePromise("./001.txt");

p1.then((data) => {
  console.log("第一次回调" + data.toString());
  return readFilePromise("./002.txt");
})
  .then((data) => {
    console.log("第二次回调" + data.toString());
    return readFilePromise("./003.txt");
  })
  .then((data) => {
    console.log("第三次回调" + data.toString());
    console.log("读取003成功", data);
  });

// 打印结果
第一次回调./001.txt
第二次回调./001.txt
第三次回调./001.txt
```

关于Promsie难点就在于`then的返回值是Promise对象`的情况。

在then方法的内部本质上是返回了一个新的Promsie对象，我们将其称之为`thenPromsie`，之后需要通过调用这个thenPromsie的reslove方法，来触发执行`下一个then中的回调函数`。

如果then内部返回值是一个值的情况很好解决，直接调用thenPromsie的resolve方法便好，如果返回值是一个`Promsie对象，我们要根据这个Promise对象是否被`resolve`而决定thenPromsie是否被`resolve`，继而决定是否执行下一个then中的回调函数。

对then方法做下改动，以PENDING状态为例

```
 if (this.status === PENDING) {
    // 自行构造一个Promise，保证then的返回结果永远为一个Promise对象
      let promise2 = new MyPromise((resolve, rejected) => { 
        this.onFulfilledCbs.push((value) => {
          try {
            const x = onFulfilled(value); // 获得回调函数的返回值，并进一步处理
            // 如果回调函数返回的promise和then方法中构造的promise是同一个对象，抛异常，否则会陷入死循环
            if (x === promise2) { 
        				return reject(new TypeError('[TypeError: Chaining cycle detected for promise #<Promise>]'));
   					 }
            if (x instanceof MyPromise) { // 如果回调函数的结果是Promise，执行其then方法，并将resolve, rejected传入，
                x.then(resolve, rejected); 
            } else {
                resolve(x); // 返回值是一个值，直接resolve即可
            }
          } catch (error) {
            rejected(error);
          }
        });
        this.onRejectedCbs.push((reason) => {
          try {
            const x = onRejected(reason);
            // 如果回调函数返回的promise和then方法中构造的promise是同一个对象，抛异常，否则会陷入死循环
            if (x === promise2) { 
        				return reject(new TypeError('[TypeError: Chaining cycle detected for promise #<Promise>]'));
   					 }
            if (x instanceof MyPromise) { // 如果回调函数的结果是Promise，执行其then方法，并将resolve, rejected传入，
                x.then(resolve, rejected); 
            } else {
                resolve(x); // 返回值是一个值，直接resolve即可
            }
          } catch (error) {
            rejected(error);
          }
        });
      });
      return promise2;
```

提取处理`onFulfilled/onRejected`返回值的逻辑

```
 resolvePromise = (promise2, x, resolve, rejected) => {
    if (x === promise2) { // 如果回调函数返回的promise和then方法中构造的promise是同一个对象，抛异常，否则会陷入死循环
        return reject(new TypeError('[TypeError: Chaining cycle detected for promise #<Promise>]'));
    }
    if (x instanceof MyPromise) { // 如果回调函数的结果是Promise，执行其then方法，并将resolve, rejected传入，
        x.then(resolve, rejected); 
    } else {
        resolve(x);
    }
}
```

当前then函数代码如下

```
  then = (onFulfilled, onRejected) => {

    if (this.status === PENDING) {
    // 自行构造一个Promise，保证then的返回结果永远为一个Promise对象
      let promise2 = new MyPromise((resolve, rejected) => { 
        this.onFulfilledCbs.push((value) => {
          try {
            const x = onFulfilled(value); // 获得回调函数的返回值，并进一步处理
            this.resolvePromise(promise2, x, resolve, rejected);
          } catch (error) {
            rejected(error); // 有异常则rejected
          }
        });
        this.onRejectedCbs.push((reason) => {
          try {
            const x = onRejected(reason);
            this.resolvePromise(promise2, x, resolve, rejected);
          } catch (error) {
            rejected(error);
          }
        });
      });
      return promise2;
    } else if (this.status === RESOLVE) {
      let promise2 = new MyPromise((resolve, rejected) => {
        try {
          const x = onFulfilled(this.value);
          this.resolvePromise(promise2, x, resolve, rejected);
        } catch (error) {
          rejected(error);
        }
      });
      return promise2;
    } else {
      let promise2 = new MyPromise((resolve, rejected) => {
        try {
          const x = onRejected(this.reason);
          this.resolvePromise(promise2, x, resolve, rejected);
        } catch (error) {
          rejected(error);
        }
      });
      return promise2;
    }
  };
```

3. 修复下逻辑漏洞
- 处理then中两个参数为空的情况

对参数不传的情况做判断:
```
onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value; // 成功回调默认返回当前成功的结果
onRejected = typeof onRejected === 'function' ? onRejected : error => { throw error }; // 失败回调直接抛异常
```

4. 实现`catch`方法

catch方法其实就是没有成功回调的then方法。即
```
catch = (onRejected) => {
  return this.then(null, onRejected);
}
```
一旦其中有一个PENDING状态的 Promise 出现错误后状态必然会变为失败, 然后执行 onRejected函数，而在链式调用中，如果`then`方法没有传入失败回调，则会由默认的函数抛出异常，把新的 Promise 状态变为失败，新的 Promise 状态变为失败后又会执行onRejected......就这样一直抛下去，直到用catch 捕获到这个错误，才停止往下抛。
这就是 Promise 的错误冒泡机制。

### 实现Resolve

创建一个成功的promise

```
static resolve = (param) => {
      if(param instanceof MyPromise){
          return param;
      }
      return new MyPromise((resolve, reject) => {
				resolve(param);
			})
};
```

### 实现Reject

传入的参数会作为一个 reason 原封不动地往下传

```
  static reject = (reason) => {
    return new MyPromise((resolve, reject) => {
      reject(reason);
    });
  };
```

### 实现Finall

finally()方法用于指定不管 Promise 对象最后状态如何，都会执行的操作。该方法会将值原封不动的传递下去。

```
finally = (callback) => {
    return this.then(value => {
      return MyPromise.resolve(callback()).then(() => {
        return value;
      });
    }, error => {
      return MyPromise.resolve(callback()).then(() => {
        throw error;
      });
    });
  }
```

### 实现all

- 参数是一个数组，数组内是一个一个的promise，这些数组内的promise会并行执行。
- 最终返回一个新的promise
- 只要有一个promise状态变为`rejected`，那么最终返回的这个新的pomise的状态就是`rejected`。
- 当所有的promise都变为`fulfilled`，最终返回的这个新的promise的状态才会变为`fulfilled`, 并且返回的结果是一个数组。

```
  static all = (promises) => {
    return new MyPromise((resolve, reject) => {
      let result = [];
      let count = 0;
      let len = promises.length;
      if (len === 0) {
        resolve(result);
        return;
      }
      promises.forEach((promise, index) => {
        MyPromise.resolve(promise[index]) // promise[index]可能不是一个promise
          .then((data) => {
            result[index] = data;
            count++;
            if (count === len) {
              resolve(result);
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    });
  };
```

### 实现race

只要有一个 promise 执行完，直接 resolve 并停止执行。

```
  static race = (promises) => {
      return new MyPromise((resolve, reject) => {
        let len = promises.length;
        if (len === 0) {
          resolve(result);
          return;
        }
        promises.forEach((promise, index) => {
            MyPromise.resolve(promise[index]) // promise[index]可能不是一个promise
              .then((data) => {
                resolve(data);
                return;
              })
              .catch((err) => {
                reject(err);
              });
          });
      })
  }
}
```

##  补充知识

### Promise/A+ 规范

在上一节开始，为了规范代码的思路，简单介绍了Promise/A+ 规范主体结构，很多细节并没有展开，本文也不计划对规范进行详细介绍，这里附上

- 百度的一篇[Promise/A+ 规范](https://zhuanlan.zhihu.com/p/143204897)文章。
- 英文原文地址：[http://promisesaplus.com](http://promisesaplus.com/)
- 若要了解文中每一条规则，则参阅其测试仓库：https://github.com/promises-aplus/promises-tests/tree/master/lib/tests

**Promise解析过程**
这里额外说明一下，为了简化代码，我们假设代码执行环境只有我们的`MyPromise`，因此，在上述代码中，没有对符合`Promise`规范的其他实现做处理。若想实现，可移步参考文档3。

### 设计模式

Promise在一定程度上继承了观察者和发布-订阅设计模式的思想,这里直接推荐一篇博文[从设计模式角度分析Promise：手写Promise并不难](https://blog.csdn.net/daydream13580130043/article/details/89741767)

### Promise和async的差异点

> 该知识点出自参考文档2

**async**是**Generator**函数的语法糖，不同的是Generator函数是**手动调用**的，而async函数是await执行完之后才会自动执行下一个await前面的语句，无论await前面是异步方法还是同步方法。

await后面可以跟很多值，如基本数据类型、（字符，数值，布尔等会被自动转换为**立即resolved的Promsie对象**）Promise对象。

async内部是异步执行的，无论await后面跟的是同步任务还是异步任务，最终async函数会返回一个Promise对象，所以**async函数可以看成是多个异步操作包装成的Promise对象，\**async让Promsie的使用更顺滑。\****

如果我们要串行发送很多请求

**使用Promise**

```
function logInOrder(urls) {
  // 远程读取所有URL
  const textPromises = urls.map(url => {
    return fetch(url).then(response => response.text());
  });

  // 按次序输出
  textPromises.reduce((chain, textPromise) => {
    return chain.then(() => textPromise)
      .then(text => console.log(text));
  }, Promise.resolve());
}
```

**使用async**

```
async function logInOrder(urls) {
  for (const url of urls) {
    const response = await fetch(url);
    console.log(await response.text());
  }
}
```

如果要并行发送很多请求

```
async function logInOrder(urls) {
  // 并发读取远程URL
  const textPromises = urls.map(async url => {
    const response = await fetch(url);
    return response.text();
  });

  // 按次序输出
  for (const textPromise of textPromises) {
    console.log(await textPromise);
  }
}
```

上面代码中，虽然`map`方法的参数是`async`函数，但它是并发执行的，因为只有`async`函数内部是继发执行，外部不受影响。后面的`for..of`循环内部使用了`await`，因此实现了按顺序输出。


## 参考文档

1. [精读JS系列（9b） Promise — 回调地狱、Promise构造器](http://caibaojian.com/promise-a.html)
2. [Promise面试灵魂十二问](https://juejin.cn/post/6918719482575880200)
3. [Promise(1)-手写Promise](https://juejin.cn/post/6844904088963022856)

