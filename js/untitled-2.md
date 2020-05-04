# 你所不知道的变量提升

### 从一道面试题说起

**请说出 let，const，var 的区别**

大部分的回答是这样的，

1. let/const 是块级作用域
2. let 不能重复定义，const不能重复赋值
3. var 有变量提升

而实际上， `let / const` **也有变量提升** 。

先来看个栗子：

```javascript
console.log(aVar); // undefined
console.log(aLet); // causes ReferenceError: aLet is not defined
var aVar = 1;
let aLet = 2;
```

从结果上看，第二行没有找到aLet导致程序报错，表明let声明的变量并没有提升

不要紧，再看两个栗子\(请在浏览器环境运行，node环境结果不一样\)

```javascript
let x = 'global';

function func(){
  console.log(x);
}

func(); // global
```

> func运行时，在函数内没有找到 x 的定义，沿着[函数作用域链](https://juejin.im/post/5eae96066fb9a043867d4dd0)寻到外层关于 x 的定义。

```javascript
let x = 'global';

function func1(){
  console.log(x);
  let x = 'func';
}

func1();
// Uncaught ReferenceError: Cannot access 'x' before initialization
//    at func (<anonymous>:2:15)
//    at <anonymous>:4:3
```

咦，报错了？为什么func1没有访问到全局环境下的x呢？不要着急，仔细看下错误提示：_**无法在初始化之前访问x。**_

好好想想，这个错误意味着在func内第一行程序已经知道在本函数内有一个变量叫x了，只不过没有初始化\(initialization\)而已。

由此可得出结论**，**由于 _**`let x = ‘func’`**_ 在函数作用域内存在变量提升**，**阻断了函数作用域链的向上延伸。尽管 x 发生了变量提升，但是在初始化赋值前\(before initialization\)不允许读取。

这就引出了一个很重要的概念: **暂时性死区 \(TDZ\)**

### 暂时性死区\(**Temporal Dead Zone,** TDZ\) 

MDN 上关于暂时性死区的定义

> let bindings are created at the top of the \(block\) scope containing the declaration, commonly referred to as “hoisting”. Unlike variables declared with var, which will start with the value undefined, let variables are not initialized until their definition is evaluated. Accessing the variable before the initialization results in a ReferenceError. The variable is in a “temporal dead zone” from the start of the block until the initialization is processed.

> let绑定是在包含声明的\(块\)范围的顶部创建的，通常称为“提升”。不像用var声明的变量，let声明的变量不会被初始化\(initialized\)直到它们被定义位置的代码开始执行，在初始化之前访问变量会触发一个ReferenceError。从块的开始到变量初始化，变量都处于“暂时死区”。

简单来说，let 仅仅发生了提升而没有被赋初值，在显式赋值之前，任何对变量的读写都会触发ReferenceError 错误。**从代码块\(block\)起始到变量赋值以前的这块区域，称为该变量的暂时性死区**。

当程序控制流程运行到特定作用域\(scope ≈ Lexical Environment\) 时：即模块，函数，或块级作用域。在该作用域中代码真正执行之前，该作用域中定义的 let 和 const 变量会首先被创建出来，但因为在 let/const 变量被赋值\(LexicalBinding\)以前是不可以读写的，所以存在暂时性死区。

来看下下面代码验证下你的理解：

```javascript
function test(){
   var foo = 33;
   if(foo) {
      let foo = (foo + 55); // ReferenceError
   }
}
test();
```

> 由于[词法作用域](https://juejin.im/post/5eae96066fb9a043867d4dd0)，表达式let foo = \(foo + 55\);中的foo被认为是if块中声明的foo，而不是函数第一行声明的var变量。在同一行中，if块的foo已经在词法环境中创建，所以程序不会沿着作用域链向上层寻找foo，但由于变量还未初始化，处于暂时性死区中，访问会触发ReferenceError。

来做道题吧：

```javascript
function go(n) {
  // n here is defined!
  console.log(n); // Object {a: [1,2,3]}
  const a = n.a;
  for (let n of n.a) { // ReferenceError
    console.log(n);
  }
}

go({a: [1, 2, 3]});
```

> 答案已经给了，欢迎在评论区留下你的见解



回到正题，重新看一下变量提升的逻辑，这里先说一下全局作用域和函数作用域中的变量提升：

当进入执行上下文时，

1. 函数的所有形参 \(如果是函数上下文\)
   * 由名称和对应值组成的一个变量对象的属性被创建
   * 如果没有实参，属性值设为 undefined
2. 函数声明
   * 由名称和对应值（函数对象\(function-object\)）组成一个变量对象的属性被创建
   * 如果变量对象已经存在相同名称的属性，则**完全替换**这个属性
   * 函数提升只会提升函数声明，而不会提升函数表达式。
3. 变量声明
   * 由名称和对应值（undefined）组成一个变量对象的属性被创建；
   * 如果变量名称跟已经声明的形式参数或函数相同，则变量声明**不会干扰**已经存在的这类属性

依据上述规则的逻辑，分析下列代码：

代码一：

```javascript
var foo = function () {
    console.log('foo1');
}

foo();  // foo1

var foo = function () {
    console.log('foo2');
}

foo(); // foo2
// 依据规则二，函数表达式不会提升
// 依据规则三，相同变量名称不会干扰
```

来看这段代码：

```javascript
function foo() {
    console.log('foo1');
}

foo();  // foo2

function foo() {
    console.log('foo2');
}

foo(); // foo2
// 依据规则二，函数声明中若函数名相同，则后者完全覆盖前者
```

举一个小栗子巩固一下：

```javascript
var a = 1;

function foo() {
    a = 10;
    console.log(a);     
    function a() {};
}

foo(); // 10

console.log(a); // 1
```

在foo中，函数a存在变量提升，相当于

```javascript
var a = 1; // 定义一个全局变量 a
function foo() {
    // 提升函数声明function a () {}到函数作用域顶端， 函数a也是变量
    var a = function () {}; // 定义局部变量 a 并赋值。
    a = 10; // 修改局部变量 a 的值
    console.log(a); // 打印局部变量 a 的值：10
    return;
}
foo();
console.log(a); // 打印全局变量 a 的值：1
```

补充下块级作用域知识点：

> * ES5 只有全局作用域和函数作用域，没有块级作用域。
> * ES6 的块级作用域必须有大括号，如果没有大括号，JavaScript 引擎就认为不存在块级作用域。

> * ES6 引入了块级作用域，明确允许在块级作用域之中声明函数。ES6 规定，块级作用域之中，函数声明语句的行为类似于let，在块级作用域之外不可引用。
> * 允许在块级作用域内声明函数。
> * 函数声明类似于var，即会提升到全局作用域或函数作用域的头部。
> * 同时，函数声明还会提升到所在的块级作用域的头部。

> 友情提示，本篇文章建议与[让人恍然大悟的词法作用域及作用域链讲解](https://juejin.im/post/5eae96066fb9a043867d4dd0)和[简单介绍的执行上下文和执行栈](https://juejin.im/post/5eaf8ae05188256d9c259f17)一起食用

> ps: 我本来以为暂时性死区是由于创建执行上下文的方式导致的，结果搜资料的时候发现块级作用域没有单独的执行上下文，只有词法环境，若你知道块级作用域与词法环境的相关知识，欢迎在评论区留言，我会及时补充进来

> 如果你收获来新知识，请给作者点个赞吧～

