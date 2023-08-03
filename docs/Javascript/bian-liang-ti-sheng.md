# 变量定义与变量提升

## 变量声明

JavaScript 是一种**弱类型**或者说**动态**语言。这意味着你不用提前声明变量的类型，在程序运行过程中，类型会被自动确定。这也意味着你可以使用同一个变量保存不同类型的数据。因此，对于js来说，只需要指定变量的作用域范围即可。

声明变量的方式有如下四种：

```js
// 1. 直接赋值
a = 1;

// 2. 使用修饰符
var a = 1;
let a = 1;
const a = 1
```

> 1. 目前一般不再使用直接赋值的方式来声明变量。
> 2. 目前一般不再使用`var`来声明变量

## 对象与函数的创建

### 创建对象

有两种简单方法可以创建一个空对象：
```js
var obj = new Object();
var obj = {};
```

这两种方法在语义上是相同的。第二种更方便的方法叫作“对象字面量（object literal）”法。

“对象字面量”也可以用来在对象实例中定义一个对象：

```javascript
var obj = {
    name: "Carrot",
    "for": "Max",//'for' 是保留字之一，使用'_for'代替
    details: {
        color: "orange",
        size: 12
    }
}
```

对象的属性可以通过链式（chain）表示方法进行访问：

```javascript
obj.details.color; // orange
obj["details"]["size"]; // 12
```

> 注意：若'名称'不包含中划线之类的字符，推荐使用第一种`object.key`来调用

### 创建函数

最简单的函数就像下面这个这么简单：

```javascript
function add(x, y) {
    var total = x + y;
    return total;
}
```

也可以是下面这种函数表达式
```js
const add = function (x, y) {
    var total = x + y;
    return total;
}
```


## 变量作用域

作用域有三种：全局作用域、函数作用域和块级作用域。

### 全局作用域

全局作用域贯穿整个 JavaScript 文档，除函数内声明和大括号内用 let、const 声明的所有变量，都在全局作用域里，因此也被称为全局变量。

### 函数作用域

当我们在函数中定义一个变量后，在函数中的任何地方都可以使用，这就是函数作用域。需要注意的是在函数之外就无法访问函数内定义的变量，因此函数内定义的变量也被称为局部变量。

### 块级作用域
ES6 之前只有全局作用域和函数作用域，没有块级作用域。块作用域用大括号{}包裹，if 语句和 for 语句里面的{}都属于块作用域，只在{}内有用。

```js
// 在循环中的变量泄露成为全局变量
for(var i = 0; i< 3;i++){
  // todo
}
console.log(i); // 可以打印出i


for(let i = 0; i< 3;i++){
  // todo
}
console.log(i); // 会报错，找不到i
```

**到现在，我们需要记住下面三个点：**

1. let/const 是块级作用域
2. let/const 不能重复定义（相同块级作用域）
3. const不能重复赋值

举例如下：

```js
let a = 1;
if(a === 1){
  let a = 2;
  let b = 2;
  console.log(a); // 2
}
console.log(a); // 1
console.log(b); // Uncaught ReferenceError: b is not defined
```

## 变量提升

在代码里，变量声明和赋值是一行代码，但是在上下文初始化的时候，变量的声明会被提升到最开始的位置，相当于变量已经占位，然后，当代码执行到对应赋值语句时，才会赋值。

`var / let / const` 都有变量提升，但是它们的表现不太一样。

### var

先来看个栗子：
```javascript
console.log(aVar); // undefined
var aVar = 1;
```
在程序执行最开始，由名称和对应值（undefined）组成一个变量对象的属性被创建。然后一直到运行到`var aVar = 1`这一行时，`aVar`才被赋值。这就是var的变量提升。

`var`声明的变量，可以在声明前被调用。

### let/const

```javascript
let x = 'global';

function func(){
  console.log(x);
}

func(); // global
```

func运行时，在函数内没有找到 x 的定义，沿着[函数作用域链](https://juejin.im/post/5eae96066fb9a043867d4dd0)寻到外层关于 x 的定义。

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

这个错误意味着在func内第一行程序已经知道在本函数内有一个变量叫x了，只不过没有初始化\(initialization\)而已。

由此可得出结论，**由于 `let x = ‘func’` 在函数作用域内存在变量提升**，阻断了函数作用域链的向上延伸。尽管 x 发生了变量提升，但是在初始化赋值前\(before initialization\)不允许读取。

这就引出了一个很重要的概念: **暂时性死区 \(TDZ\)**

### 暂时性死区\(**Temporal Dead Zone,** TDZ\) 

MDN 上关于暂时性死区的定义

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

由于[词法作用域](https://juejin.im/post/5eae96066fb9a043867d4dd0)，表达式`let foo = \(foo + 55\)`中的`foo`被认为是`if`块中声明的`foo`，而不是函数第一行声明的`var`变量。在同一行中，`if`块的`foo`已经在词法环境中创建，所以程序不会沿着作用域链向上层寻找`foo`，但由于变量还未初始化，处于暂时性死区中，访问会触发`ReferenceError`。

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

回到正题，重新看一下变量提升的逻辑。

### 全局作用域和函数作用域中的变量提升：

当进入执行上下文时，

1. 函数的所有形参 \(如果是函数上下文\)
   * 由名称和对应值组成的一个变量对象的属性被创建
   * 如果没有实参，属性值设为 undefined
2. 函数声明
   * 由名称和对应值（函数对象\(function-object\)）组成一个变量对象的属性被创建
   * 如果变量对象已经存在相同名称的属性，则**完全替换**这个属性
   * 函数提升只会提升函数声明，而不会提升**函数表达式**。
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

# 补充

补充下块级作用域知识点：

> * ES5 只有全局作用域和函数作用域，没有块级作用域。
> * ES6 引入了块级作用域，明确允许在块级作用域之中声明函数。ES6 规定，块级作用域之中，函数声明语句的行为类似于let，在块级作用域之外不可引用。
> * ES6 的块级作用域必须有大括号，如果没有大括号，JavaScript 引擎就认为不存在块级作用域。
> * 允许在块级作用域内声明函数。
> * 函数声明类似于var，即会提升到全局作用域或函数作用域的头部。
> * 同时，函数声明还会提升到所在的块级作用域的头部。


