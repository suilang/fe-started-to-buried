# 重新介绍javascript--类型

> 任何编程语言都不可缺少的组成部分——“类型”

JavaScript 中的类型包括：

* [`Number`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number)（数字）
* [`String`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/String)（字符串）
* [`Boolean`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Boolean)（布尔）
* [`Function`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Function)（函数）
* [`Object`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object)（对象）
* [`Symbol`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol)（ES2015 新增）

你可能还经常见到并使用 [`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined)（未定义）类型和 [`null`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/null)（空）类型。此外还有[`Array`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Array)（数组）类型，以及分别用于表示日期和正则表达式的 [`Date`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Date)（日期）和 [`RegExp`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/RegExp)（正则表达式），这三种类型都是特殊的对象。严格意义上说，Function（函数）也是一种特殊的对象。所以准确来说，JavaScript 中的类型应该包括这些：

* [`Number`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number)（数字）
* [`String`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/String)（字符串）
* [`Boolean`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Boolean)（布尔）
* [`Symbol`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol)（符号）（ES2015 新增）
* [`Object`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object)（对象）
  * [`Function`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Function)（函数）
  * [`Array`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Array)（数组）
  * [`Date`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Date)（日期）
  * [`RegExp`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/RegExp)（正则表达式）
* [`null`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/null)（空）
* [`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined)（未定义）

### 数字 <a id="&#x6570;&#x5B57;"></a>

JavaScript 采用“遵循 IEEE 754 标准的双精度 64 位格式”表示数字。和其他编程语言（如 C 和 Java）不同，JavaScript 不区分整数值和浮点数值，所有数字在 JavaScript 中均用浮点数值表示，所以在进行数字运算的时候要特别注意。看看下面的例子：

```text
0.1 + 0.2 = 0.30000000000000004
```

> 注意，除了上述例子之外，还有 `0.1+0.7 = 0.7999999999999999`
>
> 而除此之外，0.1 加上其他 0.3， 0.4， ...， 0.9都是正常的

在具体实现时，整数值通常被视为32位整型变量，在个别实现（如某些浏览器）中也以32位整型变量的形式进行存储，直到它被用于执行某些32位整型不支持的操作，这是为了便于进行位操作。

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

**备注：** [`parseInt()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/parseInt) 和 [`parseFloat()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/parseFloat) 函数会尝试逐个解析字符串中的字符，直到遇上一个无法被解析成数字的字符，然后返回该字符前所有数字字符组成的数字。然而如果使用运算符 "+"， 只要字符串中含有无法被解析成数字的字符，该字符串都将被转换成 `NaN`。可分别使用这两种方法解析“10.2abc”这一字符串，并比较得到的结果，来理解这两种方法的区别。

```javascript
parseInt('10.2abc'); // 10
parseFloat('10.2abc'); // 10.2
+ "10.2abc"; // NaN


```









> 参考文档：
>
> 重新介绍javascript：[https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/A\_re-introduction\_to\_JavaScript](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/A_re-introduction_to_JavaScript)

