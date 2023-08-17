# Sass vs Less 

> 我应该选择哪种CSS预处理器语言?


## 什么是CSS 预处理器？

CSS 预处理器定义了一种新的语言，其基本思想是，用一种专门的编程语言，为 CSS 增加了一些编程的特性，将 CSS 作为目标生成文件，然后开发者就只要使用这种语言进行CSS的编码工作。

## 为什么要使用CSS预处理器？

CSS仅仅是一个标记语言，不可以自定义变量，不可以引用。

**CSS有具体以下几个缺点：**

- 语法不够强大，比如无法嵌套书写，导致模块化开发中需要书写很多重复的选择器；
- 没有变量和合理的样式复用机制，使得逻辑上相关的属性值必须以字面量的形式重复输出，导致难以维护。

> 预编译很容易造成后代选择器的滥用

**使用预处理器的优点**

- 提供CSS层缺失的样式层复用机制
- 减少冗余代码
- 提高样式代码的可维护性

## Sass&Less

- Less （Leaner Style Sheets 的缩写） 是一门向后兼容的 CSS 扩展语言。因为 Less 和 CSS 非常像，Less 仅对 CSS 语言增加了少许方便的扩展，学习很容易。 

- sass，作为”世界上最成熟、最稳定、最强大的专业级CSS扩展语言”。兼容所有版本的css，且有无数框架使用sass构建，如Compass，Bourbon，和Susy。

> SASS版本3.0之前的后缀名为.sass，而版本3.0之后的后缀名.scss。

Sass 和 Less 这类语言，其实可以理解成 CSS 的超集，它们在CSS 原本的语法格式基础上，增加了编程语言的特性，如变量的使用、逻辑语句的支持、函数等。让 CSS 代码更容易维护和复用。

但浏览器最终肯定是只认识 CSS 文件的，它并无法处理 CSS 中的那些变量、逻辑语句，所以需要有一个编译的过程，将 Sass 或 Less 写的代码转换成标准的 CSS 代码，这个过程就称为 CSS 预处理。

## Less

> Less 是一门 CSS 预处理语言，它扩展了 CSS 语言，增加了变量、Mixin、函数等特性，使 CSS 更易维护和扩展。

Less 可以运行在 Node 或浏览器端。一个合法的CSS代码段本身也是一段合法的LESS代码段。

LESS 提供了变量、嵌套、混合、操作符、函数等一般编程所需的抽象机制。

### 变量

变量允许我们在一个地方定义一系列通用的值，然后在整个样式表中调用。

> 在做全局样式调整的时候，可能只需要修改几行代码就可以了。

```less
@width: 10px;
@height: @width + 10px;

#header {
  width: @width;
  height: @height;
}
```
编译为：
```css
#header {
  width: 10px;
  height: 20px;
}
```
### 混合（Mixins）
混合（Mixin）是一种将一组属性从一个规则集包含（或混入）到另一个规则集的方法。假设我们定义了一个类（class）如下：

```css
.bordered {
  border-top: dotted 1px black;
  border-bottom: solid 2px black;
}
```

如果希望在其它规则集中使用这些属性，只需像下面这样输入所需属性的类（class）名称即可
```less
#menu a {
  color: #111;
  .bordered();
}

.post a {
  color: red;
  .bordered();
}
```
### 嵌套（Nesting）
Less 提供了使用嵌套（nesting）代替层叠或与层叠结合使用的能力。假设我们有以下 CSS 代码：

```css
#header {
  color: black;
}
#header .navigation {
  font-size: 12px;
}
#header .logo {
  width: 300px;
}
```
用 Less 语言我们可以这样书写代码：
```less
#header {
  color: black;
  .navigation {
    font-size: 12px;
  }
  .logo {
    width: 300px;
  }
}
```
> 用 Less 书写的代码更加简洁，并且模仿了 HTML 的组织结构。

你还可以使用此方法将伪选择器（pseudo-selectors）与混合（mixins）一同使用。下面是一个经典的 clearfix 技巧，重写为一个混合（mixin） (& 表示当前选择器的父级）：

```less
.clearfix {
  display: block;
  zoom: 1;

  &:after {
    content: " ";
    display: block;
    font-size: 0;
    height: 0;
    clear: both;
    visibility: hidden;
  }
}
```

### 运算（Operations）

算术运算符 +、-、*、/ 可以对任何数字、颜色或变量进行运算  

注意，如果运算符两侧变量单位不同，在加、减或比较之前会进行单位换算。计算的结果以最左侧操作数的单位类型为准。如果单位换算无效或失去意义，则忽略单位。无效的单位换算例如：px 到 cm 或 rad 到 % 的转换。

> 没有单位则不做转换

```less
// 所有操作数被转换成相同的单位
@conversion-1: 5cm + 10mm; // 结果是 6cm
@conversion-2: 2 - 3cm - 5mm; // 结果是 -1.5cm

// conversion is impossible
@incompatible-units: 2 + 5px - 3cm; // 结果是 4px

// example with variables
@base: 5%;
@filler: @base * 2; // 结果是 10%
@other: @base + @filler; // 结果是 15%
```
乘法和除法不作转换。因为这两种运算在大多数情况下都没有意义，一个长度乘以一个长度就得到一个区域，而 CSS 是不支持指定区域的。Less 将按数字的原样进行操作，并将为计算结果指定明确的单位类型。
```less
@base: 2cm * 3mm; // 结果是 6cm
```
你还可以对颜色进行算术运算：

```less
@color: #224488 / 2; //结果是 #112244
background-color: #112244 + #111; // 结果是 #223355
```
### 函数（Functions）
Less 内置了多种函数用于转换颜色、处理字符串、算术运算等。这些函数在Less 函数手册中有详细介绍。

函数的用法非常简单。下面这个例子将介绍如何利用 percentage 函数将 0.5 转换为 50%，将颜色饱和度增加 5%，以及颜色亮度降低 25% 并且色相值增加 8 等用法：
```
@base: #f04615;
@width: 0.5;

.class {
  width: percentage(@width); // returns `50%`
  color: saturate(@base, 5%);
  background-color: spin(lighten(@base, 25%), 8);
}
```
### 导入（Importing）
你可以导入一个 .less 文件，此文件中的所有变量就可以全部使用了。如果导入的文件是 .less 扩展名，则可以将扩展名省略掉：

```less
@import "library"; // library.less
@import "typo.css";
```
> 本文仅列举less的几种特性的简单介绍。关于less更详细介绍参见文末参考文档2

## Sass

> Sass 是一款强化 CSS 的辅助工具，它在 CSS 语法的基础上增加了变量 (variables)、嵌套 (nested rules)、混合 (mixins)、导入 (inline imports) 等高级功能，这些拓展令 CSS 更加强大与优雅。

**特色功能 (Features)**  

- 完全兼容 CSS3
- 在 CSS 基础上增加变量、嵌套 (nesting)、混合 (mixins) 等功能
- 通过函数进行颜色值与属性值的运算
- 提供控制指令 (control directives)等高级功能
- 自定义输出格式

### 变量
sass使用$符号来标识变量(老版本的sass使用!来标识变量。
```sass
$highlight-color: #F90;
```
与CSS属性不同，变量可以在css规则块定义之外存在。当变量定义在css规则块内，那么该变量只能在此规则块内使用。
```sass
$nav-color: #F90;
nav {
  $width: 100px;
  width: $width;
  color: $nav-color;
}

//编译后

nav {
  width: 100px;
  color: #F90;
}
```

> 在声明变量时，变量值也可以引用其他变量。

### 嵌套（Nesting）
基本用法与less相同

#### 子组合选择器和同层组合选择器：>、+和~
这三个组合选择器必须和其他选择器配合使用，以指定浏览器仅选择某种特定上下文中的元素。

这些组合选择器可以毫不费力地应用到sass的规则嵌套中。可以把它们放在外层选择器后边，或里层选择器前边：
```sass
article {
  ~ article { border-top: 1px dashed #ccc }
  > section { background: #eee }
  dl > {
    dt { color: #333 }
    dd { color: #555 }
  }
  nav + & { margin-top: 0 }
}
```
sass会如你所愿地将这些嵌套规则一一解开组合在一起：
```sass
article ~ article { border-top: 1px dashed #ccc }
article > footer { background: #eee }
article dl > dt { color: #333 }
article dl > dd { color: #555 }
nav + article { margin-top: 0 }
```

#### 嵌套属性;
在sass中，除了CSS选择器，属性也可以进行嵌套。
```sass
nav {
  border: {
  style: solid;
  width: 1px;
  color: #ccc;
  }
}
```

嵌套属性的规则是这样的：把属性名从中划线-的地方断开，在根属性后边添加一个冒号:，紧跟一个{ }块，把子属性部分写在这个{ }块中。就像css选择器嵌套一样，sass会把你的子属性一一解开，把根属性和子属性部分通过中划线-连接起来，最后生成的效果与你手动一遍遍写的css样式一样：
```sass
nav {
  border-style: solid;
  border-width: 1px;
  border-color: #ccc;
}
```

对于属性的缩写形式，你甚至可以像下边这样来嵌套，指明例外规则：
```sass
nav {
  border: 1px solid #ccc {
  left: 0px;
  right: 0px;
  }
}
```
### 混合器;
混合器使用@mixin标识符定义，这个标识符给一大段样式赋予一个名字，可以轻易地通过引用这个名字重用这段样式。

下边的这段sass代码，定义了一个非常简单的混合器，目的是添加跨浏览器的圆角边框。
```sass
@mixin rounded-corners {
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px;
  border-radius: 5px;
}
```
然后就可以在样式表中通过@include来使用这个混合器。@include调用会把混合器中的所有样式提取出来放在@include被调用的地方。如果像下边这样写：
```
notice {
  background-color: green;
  border: 2px solid #00aa00;
  @include rounded-corners;
}

//sass最终生成：

.notice {
  background-color: green;
  border: 2px solid #00aa00;
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px;
  border-radius: 5px;
}
```
> less及sass都支持混合器传参，具体内容参见参考文档 2、3

### 导入SASS文件
css有一个特别不常用的特性，即@import规则，它允许在一个css文件中导入其他css文件。然而，后果是只有执行到@import时，浏览器才会去下载其他css文件，这导致页面加载起来特别慢。

sass也有一个@import规则，但不同的是，sass的@import规则在生成css文件时就把相关文件导入进来。这意味着所有相关的样式被归纳到了同一个css文件中，而无需发起额外的下载请求。

> 使用sass的@import规则并不需要指明被导入文件的全名。你可以省略.sass或.scss文件后缀

#### 使用SASS部分文件
当通过@import把sass样式分散到多个文件时，你通常只想生成少数几个css文件。那些专门为@import命令而编写的sass文件，并不需要生成对应的独立css文件，这样的sass文件称为局部文件。
sass局部文件的文件名以下划线开头。这样，sass就不会在编译时单独编译这个文件输出css

#### 默认变量值;
`!default`用于变量，含义是：如果这个变量被声明赋值了，那就用它声明的值，否则就用这个默认值。
```saaa
$fancybox-width: 400px !default;
.fancybox {
width: $fancybox-width;
}
```
在上例中，如果用户在导入你的sass局部文件之前声明了一个$fancybox-width变量，那么你的局部文件中对$fancybox-width赋值400px的操作就无效。如果用户没有做这样的声明，则$fancybox-width将默认为400px。


## 相同与差异

### 相同之处：

Less和Sass在语法上有些共性，比如下面这些：

1、混入(Mixins)——class中的class；

2、参数混入——可以传递参数的class，就像函数一样；

3、嵌套规则——Class中嵌套class，从而减少重复的代码；

4、运算——CSS中用上数学；

5、颜色功能——可以编辑颜色；

6、名字空间(namespace)——分组样式，从而可以被调用；

7、作用域——局部修改样式；

8、JavaScript 赋值——在CSS中使用JavaScript表达式赋值。

### 不同之处：

类别 | Sass | less
---|---|---
环境 | 需要ruby环境 | 基于javascript，可以运行在 Node 或浏览器端
使用 | 复杂 | 简单
功能 | 复杂 | 简单(相对而言)
处理机制 | 服务端处理 | 可以运行在 Node 或浏览器端
变量 | 以 $ 开头 | 以 @ 开头
文件后缀 | .sass 或. scss | .less

- 在Less中，仅允许循环数值。  
    在Sass中，我们可以遍历任何类型的数据。但在Less中，我们只能使用递归函数循环数值。

- 条件语句  
    Less 中并不支持条件语句，当然，可以通过内置函数 if 以及 and，or，not 这些来模拟条件语句。  
    在 Sass 中是支持条件语句的，但也不是像其他编程语言直接 if 这样通过保留字来编写，需要加个 @ 符合

- 框架-Compass 
    Sass 有一点比 Less 有优势的就是，目前有很多稳定且热门的基于 Sass 编写的框架库，比如：Compass、Bourbon 和 Susy 等。

## 用哪个？

不知道～

1. LESS环境较Sass简单
2. LESS使用较Sass简单，大概？
3. 相对而言，国内前端团队使用LESS的同学会略多于Sass
4. 从功能出发，Sass较LESS略强大一些
5. Sass在市面上有一些成熟的框架，比如说Compass，而且有很多框架也在使用Sass，比如说Foundation
6. 就国外讨论的热度来说，Sass绝对优于LESS
7. 就学习教程来说，Sass的教程要优于LESS。

> PS: 我们用的less，毕竟基本功能已经够用了，自然是简单些好。但是后代选择器的滥用是真的多


## 参考文档：
1. [Sass和less的区别是什么？用哪个好](https://www.cnblogs.com/tommymarc/p/11627576.html)
2. [less快速入门](https://less.bootcss.com/)
3. [Sass快速入门](https://www.sass.hk/guide/)
4. [SASS和LESS是什么？如何使用？](https://www.jianshu.com/p/568ab7eb1f47)