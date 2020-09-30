> 最近突然有些不安，很多东西看过是看过，但是终归不属于自己，过一阵子也就忘了。整理的结果是很欣慰的，发现了很多觉得自己知道但其实真的不知道的知识点。



 > 希望每个来看文档的人都能收获知识，然后留下了赞～
 >  告诉我你曾来过、看过，并在这里不虚此行吧！！


前端路漫漫，与诸君共勉！

*目录\(就是目录\)：*

> 以 标题+摘要 的方式罗列，详细讲解点击标题查看

# 代码规范

## [论如何优雅的写出不会挨揍的代码](https://juejin.im/post/5e9f948b6fb9a03c2e5435e8)

 写代码，一定要有良好的编程习惯。如果实在写不好怎么办呢

 1. **No Code**

>    No code is the best way to write secure and reliable applications. Write nothing; deploy nowhere.  

 2. 谢同事不杀之恩，平时多投喂些零食。


# html

## [谈谈html 语义化](https://juejin.im/post/5ea53554f265da47b72601eb)

 语义元素可以清楚地向浏览器和开发者描述其意义。即元素本身传达了关于标签所包含内容类型的一些信息。

 为什么要语义化？

 1. 页面结构: 使页面没有css的情况下，也能够呈现出很好的内容结构
 2. 有利于SEO: 爬虫依赖标签来确定关键字的权重，因此可以帮助爬虫抓取更多的有效信息
 3. 提升用户体验： 例如title、alt可以用于解释名称或者解释图片信息，以及label标签的灵活运用。
 4. 便于团队开发和维护: 语义化使得代码更具有可读性，让其他开发人员更加理解你的html结构，减少差异化。
 5. 方便其他设备解析: 如屏幕阅读器、盲人阅读器、移动设备等，以有意义的方式来渲染网页。

# js基础

盗图镇个楼～手把手带你走进js深入之路
![](https://user-gold-cdn.xitu.io/2020/5/15/17215ef36c396fab?w=663&h=894&f=png&s=209830)

## 一、[朝花夕拾，重新介绍javascript类型](https://juejin.im/post/5ea787da6fb9a043410a0027)

 任何编程语言都不可缺少的组成部分——“类型”。javaScript 是一种**弱类型**或者说**动态**语言。这意味着你不用提前声明变量的类型，在程序运行过程中，类型会被自动确定。

 **提问**：0.1 + 0.2 === 0.3的结果是什么？那0.1 + 0.3 === 0.4的结果呢？

## 二、[初学者不容错过的双等\(==\)小知识](https://juejin.im/post/5ea829a4e51d454dcf455cc0)

== 代表相同， ===代表严格相同,

- 进一步解释： 当进行双等号比较时候： 先检查两个操作数数据类型，如果相同， 则进行===比较， 如果不同， 则进行一次类型转换， 转换成相同类型后再进行比较， 而===比较时， 如果类型不同，直接返回false.

- 根据具体需要，JavaScript 按照如下规则将变量转换成布尔类型：

    false、0、空字符串（""）、NaN、null 和 undefined 被转换为 false
所有其他值被转换为 true

上述两段话大家应该都知道，被问到也都能答上来。但是，

> **提问**： 1 === true的结果是什么？ 那么 2 === true 的结果呢？

## 三、[Clone：你真的知道深浅么？](https://juejin.im/post/5ea9555c5188256d997cbb5c)
> 如何解决循环引用问题？

 数据分为基本数据类型\(String, Number, Boolean, Null, Undefined，Symbol\)和对象数据类型。

 1、基本数据类型的特点：直接存储在栈\(stack\)中的数据

2、引用数据类型的特点：**存储的是该对象在栈中引用，真实的数据存放在堆内存里**  
> en。。。上面这两句严格来说，是错的  

这种描述并不严谨，所以补充如下描述：  
1. 基本数据类型：变量对应的是一个值  
2. 引用数据类型：变量对应的是一个地址，地址指向堆内存中的某个对象，

> 请注意，基本数据类型不是全存在栈中，只有直接声明的变量才会在栈中。
> 基本类型如果是全局的，也放在堆上。位于引用类型内的基本类型，也是放在堆上。



## 四、[朝花夕拾，重新介绍继承与原型链](https://juejin.im/post/5eab794a6fb9a043620fed37)

> 只有对象类型才有继承与原型概念，不断向上追溯的原型共同组成了原型链

## 五、[看完就能搞懂的this指向及箭头函数的讲解～](https://juejin.im/post/5eac13735188256d51476f59)

> 与其他语言相比，**函数的 `this` 关键字**在 JavaScript 中的表现略有不同。this指当前执行代码的环境对象，函数的调用方式决定了`this`的值。

## 六、[apply、call、bind的区别与精简实现](https://juejin.im/post/5ead209ce51d454dc55c92bc)

> * **`apply()`** 方法接收一个指定的`this`值和一个**包含多个参数的数组**来调用一个函数。
> * **`call()`** 方法接收一个指定的 `this` 值和一个**参数列表**来调用一个函数。
> * **`bind()`** 方法创建一个新的函数，在 `bind()` 被调用时，这个新函数的 `this` 被指定为 `bind()` 的第一个参数，而其余参数将作为新函数的参数，供调用时使用
>
> 使用 `call` 和 `apply` 函数的时候要注意，如果传递给 `this` 的值不是一个对象...

## 七、[让人恍然大悟的词法作用域及作用域链讲解](https://juejin.im/post/5eae96066fb9a043867d4dd0)

> 作用域是指程序源代码中定义变量的区域。作用域规定了如何查找变量，也就是确定当前执行代码对变量的访问权限。
>
> JavaScript 采用词法作用域\(lexical scoping\)，也就是静态作用域。代码一旦写好，不用执行， 作用范围就已经确定好了，这个就是所谓的词法作用域。

## 八、[简单介绍的执行上下文和执行栈](https://juejin.im/post/5eaf8ae05188256d9c259f17)

> 执行上下文是评估和执行 JavaScript 代码的环境的抽象概念。Javascript 代码都是在执行上下文中运行。
>
> 执行栈，是一种拥有 LIFO（后进先出）数据结构的栈，被用来存储代码运行时创建的所有执行上下文。
>
> JavaScript 的可执行代码\(executable code\)的类型只有三种，全局代码、函数代码、eval代码。对应着，JavaScript 中有三种执行上下文类型。

## 九、[你可能不知道的变量提升](https://juejin.im/post/5eafd3e06fb9a043661f7cce)

> 实际上， `let / const` **也存在变量提升** 。  

## 十、[三言两语带你理解「闭包」|附使用场景](https://juejin.im/post/5eb2ad59e51d454def226a3f)

> * 闭包就是内部函数，我们可以通过在一个函数内部或者 `{}` 块里面定义一个函数来创建闭包。闭包可以访问外部作用域，即使这个外部作用域已经执行结束。
> * 闭包在没有被外部使用的情况下，随执行结束销毁
> * 闭包的外部作用域是在其定义的时候已决定，而不是执行的时候。

## 十一、[简单明了的「 事件循环/event loop」 详解](https://juejin.im/post/5eb4bcd76fb9a0436f14be3d)
> javascript是一门单线程语言，在最新的HTML5中提出了Web-Worker，但javascript是单线程这一核心仍未改变，不管谁写的代码，都得一句一句的来执行。
> 事件循环，可以理解为实现异步的一种方式，用来协调用户交互，脚本，渲染，网络这些不同的任务。

## 十二、[懒人整理的js函数式编程讲解](https://juejin.im/post/5eb94dcaf265da7bca4ffeaa)
> - 函数式编程是一种编程范型，它将电脑运算视为数学上的函数计算，并且避免使用程序状态以及易变对象。
> - 函数式编程更加强调程序执行的结果而非执行的过程，倡导利用若干简单的执行单元让计算结果不断渐进，逐层推导复杂的运算，而不是设计一个复杂的执行过程。
> - 函数式编程的思维过程是完全不同的，它的着眼点是函数，而不是过程，它强调的是如何通过函数的组合变换去解决问题，而不是我通过写什么样的语句去解决问题  

> 前端领域，我们能看到很多函数式编程的影子：ES6 中加入了箭头函数，Redux 引入 Elm 思路降低 Flux 的复杂性，React16.6 开始推出 React.memo()，使得 pure functional components 成为可能，16.8 开始主推 Hook，建议使用 pure function 进行组件编写……

## 十三、[可以不会用但你必须要了解的Web Worker详解](https://juejin.im/post/5ebbdb5e5188256d67328180)
> Web Worker (工作线程) 是 HTML5 中提出的概念，它让我们可以在页面运行的 JavaScript 主线程中加载运行另外单独的一个或者多个 JavaScript 线程；  

> Web Worker 提供的多线程编程能力与们传统意义上的多线程编程(Java、C++ 等)不同，主程序线程和 Worker 线程之间，Worker 线程之间，不会共享任何作用域或资源，它们间唯一的通信方式就是一个基于事件监听机制的 message。

> 还差server worker 和promise，有精力了再整理

## 十四、[遇见Blob🙈🙈🙈](https://juejin.im/post/6850037282691678221)

**Blob 是什么**

Blob（Binary Large Object）表示二进制类型的大对象。在数据库管理系统中，将二进制数据存储为一个单一个体的集合。

Blob 对象表示一个不可变、原始数据的类文件对象。Blob 表示的不一定是JavaScript原生格式的数据。File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。

**生成Blob**

要从其他非blob对象和数据构造一个 Blob，需要使用 Blob() 构造函数。

Blob() 构造函数返回一个新的 Blob 对象。 blob的内容由参数数组中给出的值的串联组成。
### 语法：
```
var aBlob = new Blob( array, options );
```

**Blob 使用场景**

1. 分片上传

File 对象是特殊类型的 Blob，可以用在任意的 Blob 类型的上下文中。  

针对大文件传输的场景，我们可以使用 slice 方法对大文件进行切割，然后分片进行上传。

2. 存储下载数据

从互联网上下载的数据可以存储到 Blob 对象中。  
例如，在一些需要鉴权的图片接口中，我们可以使用fetch的方式，将鉴权信息附在请求里，下载得到blob对象，然后使用下面的方法，将blob作为url使用。或者在前端直接通过构建Blob对象进行前端文件下载。

3. Blob 用作 URL

Blob 可以很容易的作为 <a>、<img> 或其他标签的 URL。Blob URL/Object URL 是一种伪协议，允许 Blob 和 File 对象用作图像，下载二进制数据链接等的 URL 源。

在浏览器中，我们使用 URL.createObjectURL 方法来创建 Blob URL，该方法接收一个 Blob 对象，并为其创建一个唯一的 URL。这个 URL 的生命周期和创建它的窗口中的 document 绑定。这个新的URL 对象表示指定的 File 对象或 Blob 对象。相当于这个方法创建了一个传入对象的内存引用地址

**Blob 与 ArrayBuffer**

- Blob和ArrayBuffer都能存储二进制数据。Blob相对而言储存的二进制数据大（如File文件对象）。
- ArrayBuffer对象表示原始的二进制数据缓冲区，即在内存中分配指定大小的二进制缓冲区（容器），用于存储各种类型化数组的数据，是最基础的原始数据容器，无法直接读取或写入， 需要通过具体视图来读取或写入，即TypedArray对象或DataView对象对内存大小进行读取或写入；Blob对象表示一个不可变、原始数据的类文件对象。
- ArrayBuffer 是存在内存中的，可以直接操作。而 Blob 可以位于磁盘、高速缓存内存和其他不可用的位置。


# css

## 一、[聊聊css position属性及其sticky属性值的特性(吸顶特效)](https://juejin.im/post/5ebd3001f265da7bcd5c62da)
> CSS position属性用于指定一个元素在文档中的定位方式。top，right，bottom 和 left 属性则决定了该元素的最终位置。
> 总共有6个取值，分别为 static、relative、fixed、absolute、sticky及inherit。
>
> sticky粘性定位可以被认为是相对定位和固定定位的混合。当元素在屏幕或滚动元素显示区域时，表现为relative，就要滚出显示器屏幕的时候，表现为fixed。

## 二、[回流(reflow)与重绘(repaint)，KFC与MC](https://juejin.im/post/5ec220bfe51d454de44339a6)
> 回流与重绘，会影响页面性能，每次这两个都会被同时提及，关系就好像KFC边上一定会有MC一样亲密的让人摸不到头脑。
>
> - 当Render Tree中部分或全部元素的尺寸、结构、或某些属性发生改变时，浏览器将重新渲染部分或全部文档，这时发生的就是回流。  
>
> - 当页面中元素样式的改变并不影响它在文档流中的位置时（例如：color、background-color、visibility等），浏览器会将新样式赋予给元素并重新绘制它，这个过程称为重绘。


## 三、[viewport和1px | 工具人: 这是1px，设计师： 不，这不是](https://juejin.im/post/5ec3c6de6fb9a048021457ea)
> 设计师：你这字体大小不太对  
> 工具人：你看代码，就是16px  
> 设计师：确实跟设计稿不一致(拿出iphone 11 max)  
> 工具人：我一般称这种情况为 有钱人的烦恼(拿出5寸安卓)  
> 设计师：好吧  
>
> DPR(devicePixelRatio) 设备像素比，它是默认缩放为100%的情况下，设备像素和CSS像素的比值。简单地说，这告诉浏览器应该使用多少个屏幕的实际像素来绘制单个 CSS 像素。

## 四、[可食用的「css布局干货」,纯Html示例，可调试 | 水平、垂直、多列](https://juejin.im/post/5ec53111f265da76e97d2c55)
> 本文仅整理常用的水平居中、垂直居中及多列等布局，不求全部涉及，只考虑**常用**并且可以**顺手拿来**使用。若有其他精妙的方案，欢迎在评论中指出，我会及时补充至文档内。  
>
> 本文中所有示例均为 html 渲染构成，所以可以直接选中示例在控制台调试，推荐自己动手试试文章中列举的小提示，有助于加深理解 。

## 五、[前端必须掌握的「CSS层叠上下文」讲解 | 手敲示例，包教包会](https://juejin.im/post/5ecb1e77e51d457893029755)
> 大部分人在初步学完css后，对z-index的印象大概处于“`z-index`就是用来描述定义一个元素在屏幕`Z轴`上的堆叠顺序”。但是`z-index`属性仅在**定位元素**（定义了[position](https://juejin.im/post/5ebd3001f265da7bcd5c62da)属性，且属性值为非`static`值的元素）上有效果。
>
> 层叠上下文(stacking context)，是HTML中一个三维的概念。它划分了某种领域或范围，在渲染规则层面，将内部与外部隔开，并赋予元素自身及内部区域某些特性。
>
> 元素由于特定的css设置，拥有了层叠上下文后，就会变成层叠上下文元素；
>
> 层叠上下文元素有如下特性：
>
> 1. 层叠上下文的层叠水平要比普通元素高；
> 2. 层叠上下文可以嵌套，内部层叠上下文及其所有子元素均受制于外部的层叠上下文。
> 3. 每个层叠上下文是自成体系的，当元素发生层叠的时候，整个元素被认为是在父层叠上下文的层叠顺序中。
> 4. 每个层叠上下文和兄弟元素独立，也就是当进行层叠变化或渲染的时候，只需要考虑后代元素。
> 5. 层叠上下文可以阻断元素的混合模式；


## 六、[Sass.vs.Less | 简介与比较](https://juejin.im/post/5eccf4ed51882543152cf0fc)
> “我应该选择哪种CSS预处理器语言?”  
 - Less （Leaner Style Sheets 的缩写） 是一门向后兼容的 CSS 扩展语言。因为 Less 和 CSS 非常像，Less 仅对 CSS 语言增加了少许方便的扩展，学习很容易。
 - sass，作为”世界上最成熟、最稳定、最强大的专业级CSS扩展语言”。兼容所有版本的css，且有无数框架使用sass构建。

## 七、[拒绝水货 | 除了解决边距重叠，BFC还可以这么用](https://juejin.im/post/5ef834a2e51d4534791d3ade)

### 外边距重叠

外边距重叠就是 `margin-collapse`。相邻的两个盒子（可能是兄弟关系也可能是祖先关系）的外边距可以结合成一个单独的外边距。 这种合并外边距的方式被称为折叠，结合而成的外边距称为折叠外边距。

折叠结果遵循下列计算原则：

- 两个相邻的外面边距是正数时，折叠结果就是他们之中的较大值；
- 两个相邻的外边距都是负数时，折叠结果是两者绝对值的较大值；
- 两个外边距一正一负时，折叠结果是两者的相加的和；

### 什么是BFC？

BFC(Block formatting context)直译为"块级格式化上下文"。它是一个独立的渲染区域，只有Block-level box参与， 它规定了内部的Block-level Box如何布局，并且与这个区域外部毫不相干。

我们常说的文档流其实分为定位流、浮动流、普通流三种。而普通流其实就是指BFC中的FC。FC(Formatting Context)，直译过来是格式化上下文，它是页面中的一块渲染区域，有一套渲染规则，决定了其子元素如何布局，以及和其他元素之间的关系和作用。

### BFC触发方式

1. 根元素，即HTML标签
2. 浮动元素：float值为left、right
3. overflow值不为 visible，为 auto、scroll、hidden
4. display值为 inline-block、table-cell、table-caption、table、inline-table、flex、inline-flex、grid、inline-grid
5. 定位元素：position值为 absolute、fixed
   **注意：**
   `display: table`也可以生成BFC的原因在于Table会默认生成一个匿名的table-cell，是这个匿名的table-cell生成了BFC。

### BFC作用

BFC是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面元素，反之亦然。我们可以利用BFC的这个特性来做很多事。

1. 同一个 BFC 下外边距会发生折叠
2. BFC 可以包含浮动的元素（清除浮动）
3. BFC 可以阻止元素被浮动元素覆盖



## 八 [傻傻分不清css长度的(百分比|负值)基准是谁](https://juejin.im/post/5f031222e51d4534b130564b)

1. width height 百分比

当元素的height、width设置为百分比时，分别基于包含它的块级对象的高度、宽度。这个是常规百分比的含义。

2. margin 百分比
     `margin` 的百分比值参照其包含块的宽度进行计算。当书写模式变成纵向的时候，其参照将会变成包含块的高度。
**为什么**

> CSS权威指南中的解释：
>
> 我们认为，正常流中的大多数元素都会足够高以包含其后代元素（包括外边距），如果一个元素的上下外边距是父元素的height的百分数，就可能导致一个无限循环，父元素的height会增加，以适应后代元素上下外边距的增加，而相应的，上下外边距因为父元素height的增加也会增加。

3. padding 百分比
    同上
4. width、padding 联合百分比
    在标准盒模型下，` width: 100%; padding: 10% 10%;` 会导致内部元素溢出，如果遇到这种情况，一般都会使用怪异盒模型，即设置`box-sizing: border-box`，这时候`width`的值是会包含`padding`的距离的。
5. translate百分比
    在translate 函数当中使用百分比是以该元素自身的宽高作为基准。

6. margin为负值
    1. margin-left,margin-right为负值
        - 元素本身没有宽度，会增加元素宽度
        - 元素本身有宽度，会产生位移
    2. margin-top为负值，不管是否设置高度，都不会增加高度，而是会产生向上的位移
    3. margin-bottom为负值的时候不会位移,而是会减少自身供css读取的高度.
7.  padding 为负值
    很遗憾，padding不允许指定为负，指定了也无效～
> 具体讲解及手工示例请移步[傻傻分不清css长度的(百分比|负值)基准是谁](https://juejin.im/post/5f031222e51d4534b130564b)

## 九、[精心整理33个css知识干货](https://juejin.im/post/6854573221291753480)

值得扩展的我都在问题后面附上文章链接，里面会有详细的讲解和案例分析，面试突击的话只看本文就好了，想跟面试官聊聊技术的可以深入的看一下。

- 标准的CSS盒子模型及其和低版本的IE盒子模型的区别？
- CSS优先级算法如何计算？
- 如何居中div？
- display有哪些值？他们的作用是什么？
- position不同的值的定位原点及其特性？
- 如何用纯CSS创建一个三角形
- 浮动原理及什么时候需要清除浮动？清除浮动的方式？
- CSS预处理器/后处理器是什么？为什么要使用它们？
- ::before 和 :after中双冒号和单冒号有什么区别？
- 伪元素和伪类的区别
-  css 属性 content 有什么作用？
- px、em、rem有什么区别？
- 一个高度自适应的div，里面有两个div，一个高度100px，希望另一个填满剩下的高度问题怎么解决？
- transition、transform和animation的区别
- 对 line-height 的理解？
- CSS 外边距(margin)重叠及防止方法
- 什么是BFC？怎么触发BFC？有什么用？
- display: none; 与 visibility: hidden; 有什么区别？
- 隐藏元素的方法有哪几种？
- li与li之间有看不见的空白间隔是什么原因引起的？有什么解决办法？
- JS如何获取盒模型的位置及宽高
- 浏览器如何判断元素是否匹配某个CSS选择器
- 移动端如何实现1px
- CSS有哪些属性是可以继承的？
- React Native中的css样式？
- style标签写在body后与body前有什么区别
- position:fixed;在手机端下无效怎么处理？
- 什么是回流（重排）和重绘以及其区别
- 行内元素和块级元素的具体区别是什么？行内元素的 padding 和 margin 可设置吗？
- img 图片自带边距的问题是什么原因引起的？如何解决？
- 说说css层叠上下文
- css百分比单位相对基准









# 工程化
## 一、[带你撸个属于自己的react项目|webpack+babel+typescript+eslint]()
写前端一年多了，用的都是大佬建好的架子，还没自己从头建个项目，现在开始踩坑。

项目大体包括以下几部分

- 目录规范
- react
- webpack
- less
- typescript
- eslint

手把手教学，看完你可以
- 入门`webpack`，了解`babel`
- 学会配置`typescript + eslint`
- 拥有一个自己亲手搭建的React项目


# 网络

## 一、JSON Web Token(JWT)简单介绍
JSON Web Token（缩写 JWT）是目前最流行的跨域认证解决方案，

该token被设计为紧凑且安全的，特别适用于分布式站点的单点登录（SSO）场景。JWT的声明一般被用来在身份提供者和服务提供者间传递被认证的用户身份信息，以便于从资源服务器获取资源，也可以增加一些额外的其它业务逻辑所必须的声明信息，该token也可直接被用于认证，也可被加密。

### 传统的session认证
http协议本身是一种无状态的协议，而这就意味着如果用户向我们的应用提供了用户名和密码来进行用户认证，那么下一次请求时，用户还要再一次进行用户认证才行。

一般请求流程是下面这样。

1. 用户向服务器发送用户名和密码。
2. 服务器验证通过后，在当前对话（session）里面保存相关数据，比如用户角色、登录时间等等。
3. 服务器向用户返回一个 session_id，写入用户的 Cookie。
4. 用户随后的每一次请求，都会通过 Cookie，将 session_id 传回服务器。
5. 服务器收到 session_id，找到前期保存的数据，由此得知用户的身份。

#### session认证所显露的问题

- **服务端开销**：每个用户经过应用认证之后，应用都要在服务端做一次记录，以方便用户下次请求的鉴别。通常session都是保存在内存中，而随着认证用户的增多，服务端的开销会明显增大。
- **扩展性**:  如果认证的记录被保存在内存中的话，这意味着用户下次请求还必须要请求在这台服务器上,这样才能拿到授权的资源，这样在分布式的应用上，相应的限制了负载均衡器的能力。这也意味着限制了应用的扩展能力。
- 另一种方案是 session 数据持久化，写入数据库或别的持久层。各种服务收到请求后，都向持久层请求数据。这种方案的优点是架构清晰，缺点是工程量比较大。另外，持久层万一挂了，就会单点失败。
- **CSRF**: 因为是基于cookie来进行用户识别的, cookie如果被截获，用户就会很容易受到跨站请求伪造的攻击。

### 基于token的鉴权机制

基于token的鉴权机制类似于http协议也是无状态的，但它不需要在服务端去保留用户的认证信息或者会话信息。

流程上是这样的：

1. 用户使用用户名密码来请求服务器
2. 服务器验证用户的信息
3. 服务器通过验证，给用户返回一个token
4， 客户端存储token，并在每次请求时附送上这个token值
5. 服务端验证token值，并返回数据

服务端要支持CORS(跨来源资源共享)策略，一般在服务端设置`Access-Control-Allow-Origin: *`就可以了。

### JWT 的几个特点

1. JWT 默认是不加密。生成原始 Token 以后，可以用密钥再加密一次。

2. JWT 不加密的情况下，不能将秘密数据写入 JWT。

3. JWT 不仅可以用于认证，也可以用于交换信息。有效使用 JWT，可以降低服务器查询数据库的次数。

4. 由于服务器不保存 session 状态，因此无法在使用过程中废止某个 token，或者更改 token 的权限。也就是说，一旦 JWT 签发了，在到期之前就会始终有效，除非服务器部署额外的逻辑。

5. JWT 本身包含了认证信息，一旦泄露，任何人都可以获得该令牌的所有权限。为了减少盗用，JWT 的有效期应该设置得比较短。对于一些比较重要的权限，使用时应该再次对用户进行认证。

6. 为了减少盗用，JWT 不应该使用 HTTP 协议明码传输，要使用 HTTPS 协议传输。

## 遇见跨域🙈🙈🙈
不管你有没有遇到过，但我相信你肯定听说过**跨域**。实际项目中，涉及到跨域的问题非常多。  
下面分**文档间跨域通信**和**前后台跨域通信**分别讲解一下几种常用方法。

**什么是跨域**

简单来讲，当一个域下的文档或执行脚本，想要获取另一个域下的资源或者与另一个域进行通信，就会发生跨域。例如<link>、<img>、<frame>中链接加载其他域下的资源文件或页面，js发起的通往后台域名的ajax请求，或者父级页面与不同域下子级iframe的通信等。

要了解跨域，首先要了解什么是域。

**什么是域**

与域名不同，跨域的域是由浏览器同源策略限定的一种概念。

同源策略/SOP（Same origin policy）是一种约定，由 `Netscape` 公司1995年引入浏览器，它是浏览器最核心也最基本的安全功能，如果缺少了同源策略，浏览器很容易受到 [XSS、CSFR](https://developer.mozilla.org/en-US/docs/Web/Security/Types_of_attacks#Cross-site_request_forgery_CSRF) 等攻击。

同源指的是资源或目标地址的 `协议、域名、端口` 三者相同，即便是不同的域名指向同一个ip地址，也不同源。

当一个请求url的协议、域名、端口三者之间任意一个与当前页面url不同即为跨域

**非同源限制**
1. 无法读取非同源网页的 Cookie、LocalStorage 和 IndexedDB
2. 无法接触非同源网页的 DOM
3. 无法向非同源地址发送 AJAX 请求

**如何解决跨域问题**
```!
对于文档之间的通信
```

1. 设置document.domain解决无法读取非同源网页的 Cookie问题

因为浏览器是通过document.domain属性来检查两个页面是否同源，因此只要通过设置相同的document.domain，两个页面就可以共享Cookie（此方案仅限主域相同，子域不同的跨域应用场景。）
```
// 两个页面都设置
document.domain = 'test.com';
```

> ps: 种cookie的时候，基本都是种在主域名下，保证同域名的页面可以共享token等信息，同时，打开新的同域页面会自动附带当前域名下cookie

2. 跨文档通信 API：window.postMessage()

该方法可以安全地实现跨源通信，只要正确的使用，这种方法就很安全。

它可用于解决以下方面的问题：

- 页面和其打开的新窗口的数据传递
- 多窗口之间消息传递
- 页面与嵌套的iframe消息传递
- 上面三个场景的跨域数据传递

一个窗口可以获得对另一个窗口的引用（比如 targetWindow = window.opener），然后在窗口上调用 targetWindow.postMessage() 方法分发一个  MessageEvent 消息。接收消息的窗口可以根据需要自由处理此事件。
**语法**
```
otherWindow.postMessage(message, targetOrigin, [transfer]);
```
3. JSONP跨域

`<script>` 标签的 src 属性并不被同源策略所约束，所以可以获取任何服务器上脚本并执行它。  
JSONP的核心思想就是通过添加一个`<script>`元素，向服务器请求 `JSON` 数据，服务器收到请求后，将数据放在一个指定名字的回调函数的参数位置传回来。

```
<script src="http://test.com/data.php?callback=dosomething"></script>
// 向服务器test.com发出请求，该请求的查询字符串有一个callback参数，用来指定回调函数的名字
 
// 处理服务器返回回调函数的数据
<script type="text/javascript">
    function dosomething(res){
        // 处理获得的数据
        console.log(res.data)
    }
</script>
```
4. CORS跨域

CORS 是跨域资源分享（Cross-Origin Resource Sharing）的缩写。它是 W3C 标准，属于跨源 AJAX 请求的根本解决方法。它允许浏览器向跨源服务器，发出 XMLHttpRequest 请求，从而克服了 AJAX 只能同源使用的限制。

整个CORS通信过程，都是浏览器自动完成，不需要用户参与。浏览器一旦发现AJAX请求跨源，就会自动添加一些附加的头信息，有时还会多出一次附加的请求，但用户不会有感知。

    1. 普通跨域请求：只需服务器端设置Access-Control-Allow-Origin
    2. 带cookie跨域请求：前后端都需要进行设置

浏览器会将 CORS 请求分成两类，简单请求（simple request）和非简单请求（not-so-simple request），浏览器对这两种请求的处理，是不一样的。

5. WebSocket协议跨域
WebSocket protocol是HTML5一种新的协议。它实现了浏览器与服务器全双工通信，同时允许跨域通讯，是server push技术的一种很好的实现。

原生WebSocket API使用起来不太方便，推荐使用Socket.io，它很好地封装了webSocket接口，提供了更简单、灵活的接口，也对不支持webSocket的浏览器提供了向下兼容。

6. nginx代理跨域

同源策略是浏览器的安全策略，不是HTTP协议的一部分。服务器端调用HTTP接口只是使用HTTP协议，不会执行JS脚本，不需要同源策略，也就不存在跨越问题。

通过nginx配置一个代理服务器（域名与网站域名相同，端口不同）做跳板机，反向代理访问后台接口，并且可以顺便修改cookie中domain信息，方便当前域cookie写入，实现跨域登录。

7. node代理跨域
​
本质上是通过启一个代理服务器，实现数据的转发，也可以通过设置cookieDomainRewrite参数修改响应头中cookie中域名，实现当前域的cookie写入，方便接口登录认证。
这里使用 express + http-proxy-middleware 来搭建一个代理服务器， webpack-dev-server 里就是使用的它。



# react

## 一、[react hook防抖及节流 ](https://juejin.im/post/6854573217349107725)

防抖（debounce）和节流（throttle）是前端经常用到的工具函数。
**函数防抖**

当持续触发事件时，一定时间段内没有再触发事件，事件处理函数才会执行一次，如果设定的时间到来之前，又一次触发了事件，就重新开始延时。
```
function debounce(fn, ms) {
  let timer;
  return function(...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn(...args)
      timer = null;
    }, ms);
  }
}
```
请务必记得，防抖函数应该在只执行一次的位置被调用。

**函数节流**

当持续触发事件时，保证一定时间段内只调用一次事件处理函数。

```
function throttle(fn, ms) {            
    let timer;        
    return function(...args) {                
        if (timer) return;
        canRun = false;
        timer = setTimeout(() => { 
            fn(...args);
            timer = null;
        }, ms);          
    }        
}        
```
请务必记得，防抖函数应该在只执行一次的位置被调用。

**hook 防抖**
```
function useDebounce(fn, delay, dep = []) {
  const { current } = useRef({ fn, timer: null });
  useEffect(function () {
    current.fn = fn;
  }, [fn]);

  return useCallback(function f(...args) {
    if (current.timer) {
      clearTimeout(current.timer);
    }
    current.timer = setTimeout(() => {
      current.fn.call(this, ...args);
    }, delay);
  }, dep)
}
```
**Hook节流**

```
function useThrottle(fn, delay, dep = []) {
  const { current } = useRef({ fn, timer: null });
  useEffect(function () {
    current.fn = fn;
  }, [fn]);

  return useCallback(function f(...args) {
    if (!current.timer) {
      current.timer = setTimeout(() => {
        delete current.timer;
      }, delay);
      current.fn.call(this, ...args);
    }
  }, dep);
}
```
具体原理及hook中使用防抖及节流的分析请点击标题

> 未完待续




<div style="height:20px"></div>


> 求**收藏关注**，顺便在左侧边栏第一个按钮**用力点一下**就更好了。这是对我的最大认可。  

能力有限，如果你有好的知识点或者不同的意见，欢迎在下方评论，我会及时跟进。

<div align="center"><img style="width: 200px" src="https://user-gold-cdn.xitu.io/2020/5/6/171e7892077ea95f?w=640&h=640&f=jpeg&s=25537"></img</div>