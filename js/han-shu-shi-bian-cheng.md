# 函数式编程

## 什么是函数式编程

* 是一种编程范型，它将电脑运算视为数学上的函数计算，并且避免使用程序状态以及易变对象。
* 函数式编程更加强调程序执行的结果而非执行的过程，倡导利用若干简单的执行单元让计算结果不断渐进，逐层推导复杂的运算，而不是设计一个复杂的执行过程。
* 函数式编程的思维过程是完全不同的，它的着眼点是**函数**，而不是**过程**，它强调的是如何通过函数的组合变换去解决问题，而不是我通过写什么样的语句去解决问题

## 为什么叫函数式编程

根据学术上函数的定义，函数即是一种描述集合和集合之间的**转换关系**，输入通过函数都会返回**有且只有一个**输出值。**函数**实际上是一个**关系**，或者说是一种映射，而这种映射关系是可以组合的。

在我们的编程世界中，我们需要处理的其实也只有“数据”和“关系”，而关系就是函数。我们所谓的**编程工作**也不过就是在找一种**映射关系**，一旦关系找到了，问题就解决了，剩下的事情，就是让数据流过这种关系，然后转换成另一个数据。

## 函数式编程的特点

### **函数是一等公民**。

你可以像对待任何其他数据类型一样对待它们——把它们存在数组里，当作参数传递，赋值给变量...等等。使用总有返回值的表达式而不是语句

```javascript
// 函数式编程-函数作为返回参数
const add = (x) => {
  return plus = (y) => {
    return x + y;
  }
};
let plus1 = add(1);
let plus2 = add(2);

console.log(plus1(1)); // 2
console.log(plus2(1)); // 3
```

### 声明式编程 \(Declarative Programming\)

不再指示计算机如何工作，而是指出我们明确希望得到的结果。与命令式不同，声明式意味着我们要写表达式，而不是一步一步的指示。

以 SQL 为例，它就没有“先做这个，再做那个”的命令，有的只是一个指明我们想要从数据库取什么数据的表达式。至于如何取数据则是由它自己决定的。以后数据库升级也好，SQL 引擎优化也好，根本不需要更改查询语句。

### 无状态和数据不可变 \(Statelessness and Immutable data\)

这是函数式编程的核心概念：

* **数据不可变：** 它要求你所有的数据都是不可变的，这意味着如果你想修改一个对象，那你应该创建一个新的对象用来修改，而不是修改已有的对象。
* **无状态：** 主要是强调对于一个函数，不管你何时运行，它都应该像第一次运行一样，给定相同的输入，给出相同的输出，完全不依赖外部状态的变化。

```javascript
// 比较 Array 中的 slice 和 splice
let test = [1, 2, 3, 4, 5];

// slice 为纯函数，返回一个新的数组
console.log(test.slice(0, 3)); // [1, 2, 3]
console.log(test); // [1, 2, 3, 4, 5]

// splice则会修改参数数组
console.log(test.splice(0, 3)); // [1, 2, 3]
console.log(test); // [4, 5]
```

### 函数应该纯天然，无副作用

纯函数是这样一种函数，即相同的输入，永远会得到相同的输出，而且没有任何可观察的副作用。

副作用是指，函数内部与外部互动，产生运算以外的其他结果。 例如在函数调用的过程中，利用并修改到了外部的变量，那么就是一个有副作用的函数。

副作用可能包含，但不限于：

* 更改文件系统
* 往数据库插入记录
* 发送一个 http 请求
* 可变数据
* 打印/log
* 获取用户输入
* DOM 查询
* 访问系统状态

#### 纯函数的优点：

1. **可缓存性。**

   纯函数能够根据输入来做缓存。

2. **可移植性／自文档化。**

   * 可移植性可以意味着把函数序列化（serializing）并通过 socket 发送。也可以意味着代码能够在 web workers 中运行。
   * 纯函数是完全自给自足的，它需要的所有东西都能轻易获得。纯函数的依赖很明确，因此更易于观察和理解

   \*\*\*\*

3. **可测试性（Testable）**

   纯函数让测试更加容易。我们不需要伪造一个“真实的”支付网关，或者每一次测试之前都要配置、之后都要断言状态（assert the state）。只需简单地给函数一个输入，然后断言输出就好了。

4. **合理性（Reasonable）**

   很多人相信使用纯函数最大的好处是_引用透明性_（referential transparency）。如果一段代码可以替换成它执行所得的结果，而且是在不改变整个程序行为的前提下替换的，那么我们就说这段代码是引用透明的。

   由于纯函数总是能够根据相同的输入返回相同的输出，所以它们就能够保证总是返回同一个结果，这也就保证了引用透明性。

5. **并行代码**

   我们可以并行运行任意纯函数。因为纯函数根本不需要访问共享的内存，而且根据其定义，纯函数也不会因副作用而进入竞争态（race condition）。

> 面向对象语言的问题是，它们永远都要随身携带那些隐式的环境。你只需要一个香蕉，但却得到一个拿着香蕉的大猩猩...以及整个丛林

### 惰性执行（Lazy Evaluation）

函数只在需要的时候执行，不产生无意义的中间变量。从头到尾都在写函数，只有在最后的时候才通过调用 产生实际的结果。

函数式编程中有两种操作是必不可少的：**柯里化（Currying）**和**函数组合**（Compose）

## 柯里化

> 把接受多个参数的函数变换成接受一个单一参数\(最初函数的第一个参数\)的函数，只传递给函数一部分参数来调用它，让它返回一个函数去处理剩下的参数。

函数式编程 + 柯里化，将提取成柯里化的函数部分配置好之后，可作为参数传入，简化操作流程。

```javascript
// 给 list 中每个元素先加 1，再加 5，再减 1
let list = [1, 2, 3, 4, 5];

//正常做法
let list1 = list.map((value) => {
  return value + 1;
});
let list2 = list1.map((value) => {
  return value + 5;
});
let list3 = list2.map((value) => {
  return value - 1;
});
console.log(list3); // [6, 7, 8, 9, 10]

// 柯里化
const changeList = (num) => {
  return (data) => {
    return data + num
  }
};
let list1 = list.map(changeList(1)).map(changeList(5)).map(changeList(-1));
console.log(list1); // [6, 7, 8, 9, 10]
```

> 返回的函数就通过闭包的方式记住了传入的第一个参数

一次次地调用它实在是有点繁琐，我们可以使用一个特殊的 `curry` 帮助函数（helper function）使这类函数的定义和调用更加容易。

```javascript
var curry = require('lodash').curry;

var match = curry(function(what, str) {
  return str.match(what);
});

var replace = curry(function(what, replacement, str) {
  return str.replace(what, replacement);
});

var filter = curry(function(f, ary) {
  return ary.filter(f);
});

var map = curry(function(f, ary) {
  return ary.map(f);
});
```

上面的代码中遵循的是一种简单，同时也非常重要的模式。即策略性地把要操作的数据（String， Array）放到最后一个参数里。

> 你可以一次性地调用 curry 函数，也可以每次只传一个参数分多次调用。

```javascript
match(/\s+/g, "hello world");
// [ ' ' ]

match(/\s+/g)("hello world");
// [ ' ' ]

var hasSpaces = match(/\s+/g);
// function(x) { return x.match(/\s+/g) }

hasSpaces("hello world");
// [ ' ' ]

hasSpaces("spaceless");
// null
```

这里表明的是一种“预加载”函数的能力，通过传递一到两个参数调用函数，就能得到一个记住了这些参数的新函数。

curry 的用处非常广泛，就像在 `hasSpaces`、`findSpaces` 和 `censored` 看到的那样，只需传给函数一些参数，就能得到一个新函数。

用 `map` 简单地把参数是单个元素的函数包裹一下，就能把它转换成参数为数组的函数。

```javascript
var getChildren = function(x) {
  return x.childNodes;
};

var allTheChildren = map(getChildren);
```

> 只传给函数一部分参数通常也叫做_局部调用_（partial application），能够大量减少样板文件代码（boilerplate code）。

当我们谈论_纯函数_的时候，我们说它们接受一个输入返回一个输出。curry 函数所做的正是这样：每传递一个参数调用函数，就返回一个新函数处理剩余的参数。这就是一个输入对应一个输出啊。哪怕输出是另一个函数，它也是纯函数。

## 函数组合

函数组合的目的是将多个函数组合成一个函数。

```javascript
const compose = (f, g) => {
  return (x) => {
    return f(g(x));
  };
};
```

在 `compose` 的定义中，`g` 将先于 `f` 执行，因此就创建了一个从右到左的数据流。组合的概念直接来自于数学课本，从右向左执行更加能够反映数学上的含义。

所有的组合都有一个特性

```javascript
// 结合律（associativity）
var associative = compose(f, compose(g, h)) == compose(compose(f, g), h);
// true
```

所以，如果我们想把字符串变为大写\(假设`head`，`reverse`，`toUpperCase` 函数存在\)，可以这么写：

```javascript
compose(toUpperCase, compose(head, reverse));

// 或者
compose(compose(toUpperCase, head), reverse);
```

结合律的一大好处是任何一个函数分组都可以被拆开来，然后再以它们自己的组合方式打包在一起。关于如何组合，并没有标准的答案——我们只是以自己喜欢的方式搭乐高积木罢了。

### pointfree <a id="pointfree"></a>

pointfree 模式指的是，函数无须提及将要操作的数据是什么样的。一等公民的函数、柯里化（curry）以及组合协作起来非常有助于实现这种模式。

```javascript
// 非 pointfree，因为提到了数据：word
var snakeCase = function (word) {
  return word.toLowerCase().replace(/\s+/ig, '_');
};

// pointfree
var snakeCase = compose(replace(/\s+/ig, '_'), toLowerCase);
```

利用 curry，我们能够做到让每个函数都先接收数据，然后操作数据，最后再把数据传递到下一个函数那里去。另外注意在 pointfree 版本中，不需要 `word` 参数就能构造函数；而在非 pointfree 的版本中，必须要有 `word` 才能进行一切操作。pointfree 模式能够帮助我们减少不必要的命名，让代码保持简洁和通用。

### debug <a id="debug"></a>

如果在 debug 组合的时候遇到了困难，那么可以使用下面这个实用的，但是不纯的 `trace` 函数来追踪代码的执行情况。

```javascript
var trace = curry(function(tag, x){
  console.log(tag, x);
  return x;
});
```



## 优势

1. **更好的管理状态**。因为它的宗旨是无状态，或者说更少的状态。而平常DOM的开发中，因为DOM的视觉呈现依托于状态变化，所以不可避免的产生了非常多的状态，而且不同组件可能还相互依赖。以FP来编程，能最大化的减少这些未知、优化代码、减少出错情况。
2. **更简单的复用**。极端的FP代码应该是每一行代码都是一个函数，当然我们不需要这么极端。我们尽量的把过程逻辑以更纯的函数来实现，固定输入-&gt;固定输出，没有其他外部变量影响，并且无副作用。这样代码复用时，完全不需要考虑它的内部实现和外部影响。
3. **更优雅的组合**。往大的说，网页是由各个组件组成的。往小的说，一个函数也可能是由多个小函数组成的。参考上面第二点，更强的复用性，带来更强大的组合性。
4. 隐性好处。减少代码量，提高维护性。

## 缺点

1. **性能**：函数式编程相往往会对一个方法进行过度包装，从而产生上下文切换的性能开销。同时，在 JS 这种非函数式语言中，函数式的方式必然会比直接写语句指令慢（引擎会针对很多指令做特别优化）。
2.  **资源占用**：在 JS 中为了实现对象状态的不可变，往往会创建新的对象，因此，它对垃圾回收（Garbage Collection）所产生的压力远远超过其他编程方式。这在某些场合会产生十分严重的问题。
3. **递归陷阱**：在函数式编程中，为了实现迭代，通常会采用递归操作，为了减少递归的性能开销，我们往往会把递归写成尾递归形式，以便让解析器进行优化。但是众所周知，JS 是不支持尾递归优化的.
4. **代码不易读**。特别熟悉FP的人可能会觉得这段代码一目了然。而不熟悉的人，遇到写的晦涩的代码，看懂代码，得脑子里先演算半小时。

> 前端领域，我们能看到很多函数式编程的影子：ES6 中加入了箭头函数，Redux 引入 Elm 思路降低 Flux 的复杂性，React16.6 开始推出 React.memo\(\)，使得 pure functional components 成为可能，16.8 开始主推 Hook，建议使用 pure function 进行组件编写……













参考文档：

1. \*\*\*\*[**JavaScript函数式编程**](https://github.com/ecmadao/Coding-Guide/blob/master/Notes/JavaScript/JavaScript%E5%87%BD%E6%95%B0%E5%BC%8F%E7%BC%96%E7%A8%8B.md)\*\*\*\*
2. \*\*\*\*[**JavaScript 函数式编程到底是个啥**](https://segmentfault.com/a/1190000009864459)\*\*\*\*
3. \*\*\*\*[**函数式编程指北**](https://llh911001.gitbooks.io/mostly-adequate-guide-chinese/content/)\*\*\*\*



