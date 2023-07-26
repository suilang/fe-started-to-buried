# 重新介绍javascript--类型

> 任何编程语言都不可缺少的组成部分——“类型”

### 动态类型 <a id="&#x52A8;&#x6001;&#x7C7B;&#x578B;"></a>

JavaScript 是一种**弱类型**或者说**动态**语言。这意味着你不用提前声明变量的类型，在程序运行过程中，类型会被自动确定。这也意味着你可以使用同一个变量保存不同类型的数据：

```javascript
var foo = 42;    // foo is a Number now
foo = "bar"; // foo is a String now
foo = true;  // foo is a Boolean now
```

JavaScript 中的类型包括：

* [`Number`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number)（数字）
* [`String`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/String)（字符串）
* [`Boolean`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Boolean)（布尔）
* [`Function`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Function)（函数）
* [`Object`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object)（对象）
* [`Symbol`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol)（ES2015 新增）

你可能还经常见到并使用 [`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined)（未定义）类型和 [`null`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/null)（空）类型。此外还有[`Array`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Array)（数组）类型，以及分别用于表示日期和正则表达式的 [`Date`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Date)（日期）和 [`RegExp`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/RegExp)（正则表达式），这三种类型都是特殊的对象。严格意义上说，Function（函数）也是一种特殊的对象。所以准确来说，JavaScript 中的类型应该包括这些：

7 种[原始类型](https://developer.mozilla.org/zh-CN/docs/Glossary/Primitive):

* [Boolean](https://developer.mozilla.org/zh-CN/docs/Glossary/Boolean)  （布尔）
* [Null](https://developer.mozilla.org/zh-CN/docs/Glossary/Null)   （空）
* [Undefined](https://developer.mozilla.org/zh-CN/docs/Glossary/undefined)  （未定义）
* [Number](https://developer.mozilla.org/zh-CN/docs/Glossary/Number)  （数字）
* [BigInt](https://developer.mozilla.org/zh-CN/docs/Glossary/BigInt)  （大数）
* [String](https://developer.mozilla.org/zh-CN/docs/Glossary/%E5%AD%97%E7%AC%A6%E4%B8%B2)  （字符串）
* [Symbol](https://developer.mozilla.org/zh-CN/docs/Glossary/Symbol)   （符号）

和[`Object`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object)（对象）

* [`Function`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Function)（函数）
* [`Array`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Array)（数组）
* [`Date`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Date)（日期）
* [`RegExp`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/RegExp)（正则表达式）

> **原始值\( primitive values \)**
>
> 除 Object 以外的所有类型都是不可变的（值本身无法被改变），因此称这些类型的值为“原始值”。

### 数字 <a id="&#x6570;&#x5B57;"></a>

JavaScript 采用“遵循 IEEE 754 标准的双精度 64 位格式”表示数字（-\(2^53 -1\) 到 2^53 -1\)。和其他编程语言（如 C 和 Java）不同，JavaScript 不区分整数值和浮点数值，所有数字在 JavaScript 中均用浮点数值表示，所以在进行数字运算的时候要特别注意。看看下面的例子：

```text
0.1 + 0.2 = 0.30000000000000004
```

> 注意，除了上述例子之外，还有 `0.1+0.7 = 0.7999999999999999`
>
> 而除此之外，0.1 加上其他 0.3， 0.4， ...， 0.9都是正常的

在具体实现时，整数值通常被视为32位整型变量，在个别实现（如某些浏览器）中也以32位整型变量的形式进行存储，直到它被用于执行某些32位整型不支持的操作，这是为了便于进行位操作。

数字类型中只有一个整数有两种表示方法： 0 可表示为 -0 和 +0（"0" 是 +0 的简写）。 在实践中，这也几乎没有影响。 例如 `+0 === -0` 为真。 但是，你可能要注意除以0的时候：

```text
42 / +0; // Infinity
42 / -0; // -Infinity
```

JavaScript 支持标准的[算术运算符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Arithmetic_Operators)，包括加法、减法、取模（或取余）等等。还有一个内置对象 [`Math`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math)（数学对象），用以处理更多的高级数学函数和常数：

```text
Math.sin(3.5);
var circumference = 2 * Math.PI * r;
```

你可以使用内置函数 [`parseInt()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/parseInt) 将字符串转换为整型。该函数的第二个可选参数表示字符串所表示数字的基（进制）：

```text
parseInt("123", 10); // 123
parseInt("010", 10); // 10
```

这是因为字符串以数字 0 开头，[`parseInt()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/parseInt)函数会把这样的字符串视作八进制数字；同理，0x开头的字符串则视为十六进制数字。

如果想把一个二进制数字字符串转换成整数值，只要把第二个参数设置为 2 就可以了：

```text
parseInt("11", 2); // 3
```

JavaScript 还有一个类似的内置函数 [`parseFloat()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/parseFloat)，用以解析浮点数字符串，与[`parseInt()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/parseInt)不同的地方是，`parseFloat()` 只应用于解析十进制数字。

单元运算符 + 也可以把数字字符串转换成数值：

```text
+ "42";   // 42
+ "010";  // 10
+ "0x10"; // 16
```

如果给定的字符串不存在数值形式，函数会返回一个特殊的值 [`NaN`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/NaN)（Not a Number 的缩写）：

```text
parseInt("hello", 10); // NaN
```

要小心NaN：如果把 `NaN` 作为参数进行任何数学运算，结果也会是 `NaN`：

```text
NaN + 5; //NaN
```

可以使用内置函数 [`isNaN()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/isNaN) 来判断一个变量是否为 `NaN`：

```text
isNaN(NaN); // true
```

**注意：** [`parseInt()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/parseInt) 和 [`parseFloat()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/parseFloat) 函数会尝试逐个解析字符串中的字符，直到遇上一个无法被解析成数字的字符，然后返回该字符前所有数字字符组成的数字。然而如果使用运算符 "+"， 只要字符串中含有无法被解析成数字的字符，该字符串都将被转换成 `NaN`。可分别使用这两种方法解析“10.2abc”这一字符串，并比较得到的结果，来理解这两种方法的区别。

```javascript
parseInt('10.2abc'); // 10
parseFloat('10.2abc'); // 10.2
+ "10.2abc"; // NaN
```



JavaScript 还有两个特殊值：[`Infinity`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Infinity)（正无穷）和 `-Infinity`（负无穷）：

```text
1 / 0; //  Infinity
-1 / 0; // -Infinity
```

可以使用内置函数 [`isFinite()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/isFinite) 来判断一个变量是否是一个有穷数， 如果类型为`Infinity`, `-Infinity` 或 `NaN则返回false`：

```javascript
isFinite(1/0); // false
isFinite(Infinity); // false
isFinite(-Infinity); // false
isFinite(NaN); // false

isFinite(0); // true
isFinite(2e64); // true

isFinite("0"); // true
// 如果是纯数值类型的检测，则返回 false：
Number.isFinite("0"); // false
```

要检查值是否大于或小于 `+/-Infinity`，你可以使用常量 [`Number.MAX_VALUE`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_VALUE) 和 [`Number.MIN_VALUE`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/MIN_VALUE)。

另外在 ECMAScript 6 中，你也可以通过 [`Number.isSafeInteger()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger) 方法还有 [`Number.MAX_SAFE_INTEGER`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER) 和 [`Number.MIN_SAFE_INTEGER`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/MIN_SAFE_INTEGER) 来检查值是否在双精度浮点数的取值范围内。 超出这个范围，JavaScript 中的数字不再安全了，也就是只有 second mathematical interger 可以在 JavaScript 数字类型中正确表现。

### BigInt 类型

[`BigInt`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/BigInt)类型是 JavaScript 中的一个基础的数值类型，可以用任意精度表示整数。使用 BigInt，可以安全地存储和操作大整数，甚至可以超过数字的安全整数限制。BigInt是通过在整数末尾附加 `n` 或调用构造函数来创建的。

```javascript
> const x = 2n ** 53n;
9007199254740992n
> const y = x + 1n; 
9007199254740993n
```

可以对`BigInt`使用运算符`+、*、-、**`和`%`，就像对数字一样。BigInt 严格来说并不等于一个数字，但它是松散的。

在将`BigInt`转换为`Boolean`时，它的行为类似于一个数字：`if、||、&&、Boolean 和!。`

> `警告：BigInt`不能与数字互换操作。否则，将抛出[`TypeError`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError)。

### 字符串 <a id="&#x5B57;&#x7B26;&#x4E32;"></a>

JavaScript 中的字符串是一串[Unicode 字符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Values,_variables,_and_literals#Unicode.E7.BC.96.E7.A0.81)序列，是一组16位的无符号整数值的“元素”。更准确地说，它们是一串UTF-16编码单元的序列，每一个编码单元由一个 16 位二进制数表示。每一个Unicode字符由一个或两个编码单元来表示。

字符串中的每个元素占据了字符串的位置。第一个元素的索引为0，下一个是索引1，依此类推。字符串的长度是它的元素的数量。如果想表示一个单独的字符，只需使用长度为 1 的字符串。

通过访问字符串的 [`length`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/length)（编码单元的个数）属性，可以得到它的长度。

```javascript
"hello".length; // 5
```

String其实是 JavaScript 对象。你可以像  [object](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object)  一样使用字符串，字符串也有 [methods](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/String#Methods)（方法）能让你操作字符串和获取字符串的信息。

```javascript
"hello".charAt(0); // "h"
"hello, world".replace("world", "mars"); // "hello, mars"
"hello".toUpperCase(); // "HELLO"
```

> 注意：JavaScript 字符串是不可更改的。这意味着字符串一旦被创建，就不能被修改。但是，可以基于对原始字符串的操作来创建新的字符串。即JavaScript 中对字符串的操作一定返回了一个新字符串，原始字符串并没有被改变

。例如：

* 获取一个字符串的子串可通过选择个别字母或者使用 [`String.substr()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/substr).
* 两个字符串的连接使用连接操作符 \(`+`\) 或者 [`String.concat()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/concat).

### 布尔类型

布尔表示一个逻辑实体，可以有两个值：`true` 和 `false`。

根据具体需要，JavaScript 按照如下规则将变量转换成布尔类型：

1. `false`、`0`、空字符串（`""`）、`NaN`、`null` 和 `undefined` 被转换为 `false`
2. 所有其他值被转换为 `true`

> 小提示：在做双等==逻辑时，2==true 是会返回false的，因为boolean类型被转换为数字1，然后再做比较

### Undefined 类型

一个没有被赋值的变量会有个默认值 `undefined。`undefined是一个不能被配置（non-configurable），不能被重写（non-writable）的属性。

* 一个没有被赋值的变量的类型是undefined。
* 一个函数如果没有使用return语句指定[`返回`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/return)值，就会返回一个undefined值。

使用undefined和严格相等或不相等操作符来决定一个变量是否拥有值。但是如果你不知道这个值是否声明过，例如试图使用全局变量中的属性，建议使用[`typeof`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/typeof)`,`它不会在一个变量没有被声明的时候抛出一个错误。

```javascript
// 这里没有声明y
if(typeof y === 'undefined') {       // 没有错误，执行结果为true
   console.log("y is " + typeof y )  // y is undefined
}

if(y === undefined) {                // ReferenceError: y is not defined

}
```

### Null 类型

Null 类型只有一个值： `null。`它是 JavaScript [基本类型](https://developer.mozilla.org/zh-CN/docs/Glossary/Primitive) 之一

值 `null` 是一个字面量，特指对象的值未设置。把 `null` 作为尚未创建的对象，也许更好理解。

> 注意：`typeof null == "object"`

`null` 常在返回类型应是一个对象但没有关联的值的地方使用。

```javascript
// foo 不存在，它从来没有被定义过或者是初始化过：
foo;
"ReferenceError: foo is not defined"

// foo 现在已经是知存在的，但是它没有类型或者是值：
var foo = null; 
foo;
null
```

#### `null` 与 `undefined` 的不同点：

当检测 `null` 或 `undefined` 时，注意[相等（==）与全等（===）两个操作符的区别](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comparison_Operators) ，前者会执行类型转换：

```javascript
typeof null        // "object" (因为一些以前的原因而不是'null')
typeof undefined   // "undefined"
null === undefined // false
null  == undefined // true
null === null // true
null == null // true
!null //true
isNaN(1 + null) // false
isNaN(1 + undefined) // true
```

### 符号类型

符号\(Symbols\)是ECMAScript 第6版新定义的。符号类型是唯一的并且是不可修改的。

`Symbol()`函数会返回**symbol**类型的值，该类型具有静态属性和静态方法。每个从`Symbol()`返回的symbol值都是唯一的。一个symbol值能作为对象属性的标识符；这是该数据类型仅有的**目的**。

> 不支持 `var sym = new Symbol(); // TypeError`

```javascript
const symbol1 = Symbol();
const symbol2 = Symbol(42);
const symbol3 = Symbol('foo');

console.log(typeof symbol1);
// expected output: "symbol"

console.log(symbol3.toString());
// expected output: "Symbol(foo)"

console.log(Symbol('foo') === Symbol('foo'));
// expected output: false
```

> `Symbol`函数的参数是可选的，字符串类型。是对symbol的描述，可用于调试但不是访问symbol本身。

再次强调，Symbol类型唯一合理的用法是用变量存储 symbol的值，然后使用存储的值创建对象属性。

```javascript
var  myPrivateMethod  = Symbol();
this[myPrivateMethod] = function() {...};
```

当一个 symbol 类型的值在属性赋值语句中被用作标识符，

* 该属性是匿名的；并且是不可枚举的。因为这个属性是不可枚举的，
* 它不会在循环结构 “`for( ... in ...)`” 中作为成员出现，也因为这个属性是匿名的，它同样不会出现在 “`Object.getOwnPropertyNames()`” 的返回数组里。
* 这个属性可以通过创建时的原始 symbol 值访问到，或者通过遍历 “`Object.getOwnPropertySymbols()`” 返回的数组。
* 通过保存在变量 `myPrivateMethod`的值可以访问到对象属性。
* 当使用 JSON.stringify\(\) 时，以 symbol 值作为键的属性会被完全忽略：

 [`typeof`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/typeof)运算符能帮助你识别 symbol 类型

```javascript
typeof Symbol() === 'symbol'
typeof Symbol('foo') === 'symbol'
```

#### **方法：`Symbol.for(key)`** 

会根据给定的键 `key`，来从运行时的 symbol 注册表中找到对应的 symbol，如果找到了，则返回它，否则，新建一个与该键关联的 symbol，并放入全局 symbol 注册表中。

### 对象 <a id="&#x5BF9;&#x8C61;"></a>

JavaScript 中的对象，Object，可以简单理解成“名称-值”对（而不是键值对，ES 2015 的映射表（Map），比对象更接近键值对））

“名称”部分是一个 **JavaScript 字符串**，“值”部分可以是任何 JavaScript 的数据类型——包括对象。

有两种简单方法可以创建一个空对象：

```javascript
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
>
> 若key未知或需要通过参数传递进来，则使用第二种`object[key]`来调用，下面会说明原因

下面的例子创建了一个对象原型，**`Person`**，和这个原型的实例，**`You`**。

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
}

// 定义一个对象
var You = new Person("You", 24); 
// 我们创建了一个新的 Person，名称是 "You" 
// ("You" 是第一个参数, 24 是第二个参数..)
```

完成创建后，对象属性可以通过如下两种方式进行赋值和访问：

```javascript
obj.name = "Simon"
var name = obj.name;
```

和：

```javascript
// bracket notation
obj['name'] = 'Simon';
var name = obj['name'];
// can use a variable to define a key
var user = prompt('what is your key?')
obj[user] = prompt('what is its value?')
```

这两种方法在语义上也是相同的。第二种方法的优点在于属性的名称被看作一个字符串，这就意味着它可以在运行时被计算，缺点在于这样的代码有可能无法在后期被解释器优化。它也可以被用来访问某些以[预留关键字](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#Keywords)作为名称的属性的值：

```javascript
obj.for = "Simon"; // 语法错误，因为 for 是一个预留关键字
obj["for"] = "Simon"; // 工作正常
```

### 数组 <a id="&#x6570;&#x7EC4;"></a>

JavaScript 中的数组是一种特殊的对象。它的工作原理与普通对象类似（以数字为属性名，但只能通过`[]` 来访问），但数组还有一个特殊的属性——`length`（长度）属性。这个属性的值通常比数组**最大索引**大 1。

注意，`Array.length` 并不总是等于数组中元素的个数，如下所示：

```javascript
var a = ["dog", "cat", "hen"];
a[100] = "fox";
a.length; // 101
```

如果试图访问一个不存在的数组索引，会得到 `undefined`：

```javascript
typeof(a[90]); // undefined
```

ES2015 引入了更加简洁的 [`for`...`of`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of) 循环，可以用它来遍历可迭代对象，例如数组：

```javascript
for (const currentValue of a) {
  // Do something with currentValue
}
```

> 不推荐使用 [`for...in`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...in) 循环，该方法遍历数组的索引。如果哪个家伙直接向 `Array.prototype` 添加了新的属性，使用这样的循环这些属性也同样会被遍历

ECMAScript 5 增加了另一个遍历数组的方法，[`forEach()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)：

```javascript
["dog", "cat", "hen"].forEach(function(currentValue, index, array) {
  // Do something with currentValue or array[index]
});
```

> 若部分遍历，还可以考虑`some(), every()`等方法，建议查看 [Array 方法的完整文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array)。

### 函数 <a id="&#x51FD;&#x6570;"></a>

最简单的函数就像下面这个这么简单：

```javascript
function add(x, y) {
    var total = x + y;
    return total;
}
```

* 一个 JavaScript 函数可以包含 0 个或多个已命名的变量。
* 函数体中的表达式数量也没有限制。你可以声明函数自己的局部变量。
* `return` 语句在返回一个值并结束函数。如果没有使用 `return` 语句，或者一个没有值的 `return` 语句，JavaScript 会返回 `undefined`。

你可以传入多于函数本身需要参数个数的参数，只是多余的参数会被忽略。

函数实际上是访问了函数体中一个名为 [`arguments`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions_and_function_scope/arguments) 的内部对象，这个对象就如同一个**类似于数组**的对象一样，包括了所有被传入的参数。

```javascript
function add() {
    var sum = 0;
    for (var i = 0, j = arguments.length; i < j; i++) {
        sum += arguments[i];
    }
    return sum;
}

add(2, 3, 4, 5); // 14
```

为了使代码变短一些，我们可以使用[剩余参数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Rest_parameters)来替换arguments的使用。

```javascript
function avg(...args) {
  var sum = 0;
  for (let value of args) {
    sum += value;
  }
  return sum / args.length;
}

avg(2, 3, 4, 5); // 3.5
```

> 无论“剩余参数操作符”被放置到函数声明的哪里，它都会把除了自己之前的所有参数存储起来。
>
> 通常不建议使用该特性，会导致传参意义不明确



JavaScript 允许以递归方式调用函数。递归在处理树形结构（比如浏览器 [DOM](https://developer.mozilla.org/zh-CN/docs/Web/API/Document_Object_Model)）时非常有用。

```javascript
function countChars(elm) {
    if (elm.nodeType == 3) { // TEXT_NODE 文本节点
        return elm.nodeValue.length;
    }
    var count = 0;
    for (var i = 0, child; child = elm.childNodes[i]; i++) {
        count += countChars(child);
    }
    return count;
}
```

你可以命名立即调用的函数表达式（IIFE——Immediately Invoked Function Expression），如下所示：

```javascript
var charsInBody = (function counter(elm) {
    if (elm.nodeType == 3) { // 文本节点
        return elm.nodeValue.length;
    }
    var count = 0;
    for (var i = 0, child; child = elm.childNodes[i]; i++) {
        count += counter(child);
    }
    return count;
})(document.body);
```

如上所提供的函数表达式的名称的作用域仅仅是该函数自身。这允许引擎去做更多的优化，并且这种实现更可读、友好。

### 自定义对象 <a id="&#x81EA;&#x5B9A;&#x4E49;&#x5BF9;&#x8C61;"></a>

让我们来定义一个人名对象，这个对象包括人的姓和名两个域（field）。名字的表示有两种方法：“名 姓（First Last）”或“姓, 名（Last, First）”。

```javascript
function makePerson(first, last) {
    return {
        first: first,
        last: last
    }
}
function personFullName(person) {
    return person.first + ' ' + person.last;
}
function personFullNameReversed(person) {
    return person.last + ', ' + person.first
}
s = makePerson("Simon", "Willison");
personFullName(s); // Simon Willison
personFullNameReversed(s); // Willison, Simon
```

上面的写法虽然可以满足要求，但是看起来很麻烦，因为需要在全局命名空间中写很多函数。既然函数本身就是对象，如果需要使一个函数隶属于一个对象，那么不难得到：

```javascript
function makePerson(first, last) {
    return {
        first: first,
        last: last,
        fullName: function() {
            return this.first + ' ' + this.last;
        },
        fullNameReversed: function() {
            return this.last + ', ' + this.first;
        }
    }
}
s = makePerson("Simon", "Willison");
s.fullName(); // Simon Willison
s.fullNameReversed(); // Willison, Simon
```

当使用函数时，函数内`this` 指代当前的对象，也就是调用了函数的对象。如果在一个对象上使用[点或者方括号](https://developer.mozilla.org/en/JavaScript/Reference/Operators/Member_Operators)来访问属性或方法，这个对象就成了 `this`。如果并没有使用“点”运算符调用某个对象，那么 `this` 将指向全局对象（global object）。这是一个经常出错的地方。例如：

```javascript
s = makePerson("Simon", "Willison");
var fullName = s.fullName;
fullName(); // undefined undefined
```

下面使用关键字 `this` 改进已有的 `makePerson`函数：

```javascript
function Person(first, last) {
    this.first = first;
    this.last = last;
    this.fullName = function() {
        return this.first + ' ' + this.last;
    }
    this.fullNameReversed = function() {
        return this.last + ', ' + this.first;
    }
}
var s = new Person("Simon", "Willison");
```

`new` 关键字将生成的 `this` 对象返回给调用方，而被 `new` 调用的函数称为构造函数。习惯的做法是将这些函数的首字母大写，这样用 `new` 调用他们的时候就容易识别了。

下面是一个 `new` 方法的简单实现：

```javascript
function trivialNew(constructor, ...args) {
    var o = {}; // 创建一个对象
    constructor.apply(o, args);
    return o;
}
```

> 这并不是 `new` 的完整实现，因为它没有创建原型（prototype）链。

每次我们创建一个 Person 对象的时候，我们都在其中创建了两个新的函数对象，下面使用原型链进行优化。

`Person.prototype` 是一个可以被`Person`的所有实例共享的对象。它是一个名叫原型链（prototype chain）的查询链的一部分：当你试图访问一个 `Person` 没有定义的属性时，解释器会首先检查这个 `Person.prototype` 来判断是否存在这样一个属性。所以，任何分配给 `Person.prototype` 的东西对通过 `this` 对象构造的实例都是可用的。

```javascript
function Person(first, last) {
    this.first = first;
    this.last = last;
}
Person.prototype.fullName = function() {
    return this.first + ' ' + this.last;
}
Person.prototype.fullNameReversed = function() {
    return this.last + ', ' + this.first;
}
```

> JavaScript 允许你在程序中的任何时候修改原型（prototype）中的一些东西，也就是说你可以在运行时\(runtime\)给已存在的对象添加额外的方法
>
> 关于原型链更多内容，可参见[继承与原型链](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)

\*\*\*\*

**最后附上对象及其衍生类型的一些判断方式**

判断数组

* `Array.isArray()`
* `[] instanceof Array`判断是否在Array的原型链上
* `[].constructor === Array`通过其构造函数判断
* `Object.prototype.toString.call([])`判断值是否为'\[object Array\]'

```javascript
const arr = [1, 2, 3];

Array.isArray(arr); // true
arr instanceof Array; // true
arr.constructor === Array; // true
Object.prototype.toString.call(arr); // "[object Array]"
```

判断对象

* `{} instanceof Object`判断是否在Object的原型链上
* `{}.constructor === Object`通过其构造函数判断
* `Object.prototype.toString.call({})， 值为`'\[object Object\]'

```javascript
const obj = {};

obj instanceof Object; // true
obj.constructor === Object; // true
Object.prototype.toString.call(obj); // "[object Object]"
```

判断函数

* `func typeof function`
* `func instanceof Function`判断是否在`Function`的原型链上
* `func.constructor === Function`通过构造函数判断
* `Object.prototype.toString.call(func)`值为 "\[object Function\]"

```javascript
function func() {}

typeof(func); // function
func instanceof Function; // true
func.constructor === Function; // true
Object.prototype.toString.call(func); // "[object Function]"
```

### 参考文档：

1. 重新介绍javascript：[https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/A\_re-introduction\_to\_JavaScript](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/A_re-introduction_to_JavaScript)

2. JavaScript 数据类型和数据结构: [https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data\_structures](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures)



