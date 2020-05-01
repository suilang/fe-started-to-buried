# this及箭头函数

> 本文章预计耗时15 - 20分钟，包含执行代码验证的时间。非常建议仔细阅读并手动执行代码，以验证不同操作的结果，如果你读完后对this指向还有疑问，欢迎在底部留言～

与其他语言相比，**函数的 `this` 关键字**在 JavaScript 中的表现略有不同，此外，在[严格模式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Strict_mode)和非严格模式之间也会有一些差别。

* 函数的调用方式决定了`this`的值。
* `this`不能在执行期间被赋值，并且在每次函数被调用时`this`的值也可能会不同。
* ES5引入了[bind](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)方法来设置函数的`this`值，而不用考虑函数如何被调用的，
* ES2015 引入了支持`this`词法解析的箭头函数（它在闭合的执行环境内设置`this`的值）。

> this指当前执行代码的环境对象，在非严格模式下，总是指向一个对象，在严格模式下可以是任意值

## 全局环境

无论是否在严格模式下，在全局执行环境中（在任何函数体外部）`this` 都指向全局对象。

```javascript
// 在浏览器中, window 对象同时也是全局对象：
console.log(this === window); // true

a = 37;
console.log(window.a); // 37

this.b = "MDN";
console.log(window.b)  // "MDN"
console.log(b)         // "MDN"
```

> 可以直接使用`globalThis` 来获取不同环境下的全局 `this`  对象（也就是全局对象自身）

## 函数环境

在函数内部，`this`的值取决于函数被调用的方式。

### 简单调用

在非严格模式下，直接在全局作用域下调用函数， `this` 的值不是由该调用设置的，所以 `this` 的值默认指向全局对象。

```javascript
function f1(){
  return this;
}
//在浏览器中：
f1() === window;   //在浏览器中，全局对象是window

//在Node中：
f1() === global;   
```

在严格模式下，`this`将保持他进入执行环境时的值，所以下面的`this`将会默认为`undefined`。

```javascript
function f2(){
  "use strict"; // 这里是严格模式
  return this;
}

f2() === undefined; // true
```

> **严格模式**下，如果 `this` 没有被执行环境（execution context）定义，那它将保持为 `undefined`。

#### 使用 [`call`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call) 或者[`apply`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply) 方法可以将其主体中使用的 `this` 绑定到某个对象。

```javascript
// 将一个对象作为call和apply的第一个参数，this会被绑定到这个对象。
var obj = {a: 'Custom'};

// 这个属性是在global对象定义的。
var a = 'Global';

function whatsThis(arg) {
  return this.a;  // this的值取决于函数的调用方式
}

whatsThis();          // 'Global'
whatsThis.call(obj);  // 'Custom'
whatsThis.apply(obj); // 'Custom'
```

> 如果传递给 `this` 的值不是一个对象，JavaScript 会尝试使用内部 `ToObject` 操作将其转换为对象。因此，如果传递的值是一个原始值比如 `7` 或 `'foo'`，那么就会使用相关构造函数将它转换为对象，所以原始值 `7` 会被转换为对象，像 `new Number(7)` 这样，而字符串 `'foo'` 转化成 `new String('foo')`

### `bind`方法

ECMAScript 5 引入了 [`Function.prototype.bind()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)。调用`f.bind(someObject)`会创建一个与`f`具有相同函数体和作用域的函数，但是在这个新函数中，`this`将永久地被绑定到了`bind`的第一个参数，无论这个函数是如何被调用的。

```javascript
function f(){
  return this.a;
}

var g = f.bind({a:"azerty"});
console.log(g()); // azerty

var h = g.bind({a:'yoo'}); // bind只生效一次！
console.log(h()); // azerty

var o = {a:37, f:f, g:g, h:h};
console.log(o.a, o.f(), o.g(), o.h()); // 37, 37, azerty, azerty
```

### 作为对象的方法

当普通函数作为对象里的方法被调用时，它们的 `this` 是调用该函数的对象。

下面的例子中，当 `o.f()`被调用时，函数内的`this`将绑定到`o`对象。

```javascript
var o = {
  prop: 37,
  f: function() {
    return this.prop;
  }
};

console.log(o.f()); // 37
```

请注意，函数内部的this指向**调用函数的对象**，跟函数所在**位置**无关。如下面例子：

```javascript
// 接上面代码, 建议在浏览器控制台运行下面代码，node环境下你只会一脸懵逼，比如我

var prop = 10; 
const func = o.f;

// 在全局环境下直接调用函数
console.log(func()); // 10 

// 定义新的对象
const o1 = {
  prop: 15
}

// 将o1中的func指向o中的函数f
o1.func = o.f;

// 通过o1调用, 函数内this指向o1
console.log(o1.func())； // 15
```

### **原型链中的 this**

对于在对象原型链上某处定义的方法，同样的概念也适用。如果该方法存在于一个对象的原型链上，那么`this`指向的是调用这个方法的对象，就像该方法在对象上一样。

#### 作为构造函数 <a id="&#x4F5C;&#x4E3A;&#x6784;&#x9020;&#x51FD;&#x6570;"></a>

当一个函数用作构造函数时（使用[new](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new)关键字），它的`this`被绑定到正在构造的新对象。

```javascript
function C(){
  this.a = 37;
}

var o = new C();
console.log(o.a); // logs 37
```

### 作为一个DOM事件处理函数

当函数被用作事件处理函数时，它的`this`指向触发事件的元素（一些浏览器在使用非`addEventListener`的函数动态添加监听函数时不遵守这个约定）。

```javascript
// 被调用时，将关联的元素变成蓝色
function bluify(e){
  console.log(this === e.currentTarget); // 总是 true

  // 当 currentTarget 和 target 是同一个对象时为 true
  console.log(this === e.target);        
  this.style.backgroundColor = '#A5D9F3';
}

// 获取文档中的所有元素的列表
var elements = document.getElementsByTagName('*');

// 将bluify作为元素的点击监听函数，当元素被点击时，就会变成蓝色
for(var i=0 ; i<elements.length ; i++){
  elements[i].addEventListener('click', bluify, false);
}
```

## 箭头函数

在[箭头函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Arrow_functions)中，`this`与封闭词法环境的`this`保持一致。

### 全局环境中

在全局代码中，它将被设置为全局对象：

```javascript
var globalObject = this;
var foo = () => this;

// 全局代码中调用
console.log(foo() === globalObject); // true

// 作为对象的一个方法调用
var obj = {foo: foo};
console.log(obj.foo() === globalObject); // true

// 使用call来设定this, 操作无效
console.log(foo.call(obj) === globalObject); // true

// 使用bind来设定this，操作无效
foo = foo.bind(obj);
console.log(foo() === globalObject); // true
```

> 注意：将`this`传递给`call`、`bind`、或者`apply`来调用箭头函数操作是无效的。

箭头函数不会创建自己的`this,`它只会从自己的作用域链的上一层继承this。

> 下面代码请在控制台中执行

### 箭头函数作为对象方法

```javascript
// 还是这个对象
var o = {
  prop: 37,
  f: function() {
    return this.prop;
  },
  g: () => {
    return this.prop;
  }
};

// 分别调用
console.log(o.f()); // 37，this指向对象 o
console.log(o.g()); // undefined，this指向全局

// 在全局中声明 prop
var prop = 10;

// 分别调用
console.log(o.f()); // 37
console.log(o.g()); // 10
```

你可以参考一下[`Object.defineProperty()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)的示例，大概就可以理解为什么对象方法里的箭头函数内部this指向全局了：

```javascript
'use strict';
var obj = {
  a: 10
};

Object.defineProperty(obj, "b", {
  get: () => {
    console.log(this.a, typeof this.a, this);
    return this.a+10; 
   // 代表全局对象 'Window', 因此 'this.a' 返回 'undefined'
  }
});
```

### 函数内部执行箭头函数

在下面的代码中，传递给`setInterval`的函数内的`this`与封闭函数中的`this`值相同：

```javascript
function Person(){
  this.age = 0;

  setTimeout(() => {
    this.age++; // |this| 正确地指向 p 实例
  }, 1000);
}

var p = new Person();
p.age; // 1
```

换一种方式调用：

```javascript
// 声明全局变量
var prop = 10;

// 声明一个对象
const o1 = {
  prop: 15
}


function func1() {
  const prop = 11;
  const te = () => {
    return this.prop;
  }
  return te();
}

console.log(func1()) // 10
console.log(func1.call(o1)) // 15
```

从上面的代码可以看出，在函数内部定义的箭头函数，其内部使用的this继承自外部函数，此时，箭头函数的this就不是固定的了，而是会在外部函数func1执行时确定。

再换一种方式调用：

```javascript
// 声明全局变量
var prop = 10;

// 声明一个对象
const o1 = {
  prop: 15
}

function func1() {
  const prop = 11;
  const te = () => {
    return this.prop;
  }
  return te;
}

// func1在全局环境下调用
o1.func = func1();
console.log(o1.func()) // 10，箭头函数的this指向全局对象

// func1在o1方法下调用
o1.func1 = func1;
console.log(o1.func1()()) // 15, 箭头函数的this指向o1
```

结论：函数内部的箭头函数的this继承外部函数的this，因此不是固定的，而是会在外部函数func1执行时确定。

请注意，当使用`this.te = () => { return this.prop }`，te作为对象的属性而不是函数的局部变量，因此内部this不再继承自函数，而是指向全局，具体参考上面**箭头函数作为对象方法**一节。

最后，来说明一下怎么使对象内部的箭头函数方法的this不再固定，没错，就是在函数内部定义对象，对象内部声明方法。

```javascript
// 声明全局变量
var prop = 10;

// 声明一个对象
const o1 = {
  prop: 15
}

function test(){
  const prop = 20;
  const o2 = {
    prop: 30,
    f: () => {
      return this.prop;
    }
  }
  return o2.f();
}

// 在全局环境下调用
console.log(test()) // 10

// 使用o1调用
console.log(test.call(o1)) // 15
```

现在你明白this会指向哪里了么？

> 如果你收获了新知识，请给作者点个赞吧～

