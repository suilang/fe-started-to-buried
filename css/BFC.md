### 外边距重叠
外边距重叠就是 `margin-collapse`。相邻的两个盒子（可能是兄弟关系也可能是祖先关系）的外边距可以结合成一个单独的外边距。 这种合并外边距的方式被称为折叠，结合而成的外边距称为折叠外边距。

折叠结果遵循下列计算原则：

- 两个相邻的外面边距是正数时，折叠结果就是他们之中的较大值；
- 两个相邻的外边距都是负数时，折叠结果是两者绝对值的较大值；
- 两个外边距一正一负时，折叠结果是两者的相加的和；

有些人看到这里可能会想：啊，我做列表的时候遇到过这种情况，折腾了我半天呢。

另一些人可能会想：这是什么玩意，我怎么没遇到过？这难道不是css的bug么？

我们先来说说什么情况下不会产生外边距重叠

1. 水平边距永远不会重合。
2. 相邻的盒模型中，如果其中的一个是浮动的（float），垂直margin不会重叠，并且浮动的盒模型和它的子元素之间也是这样。
3. 设置了overflow属性的元素和它的子元素之间的margin不被重叠（overflow取值为visible除外）。
4. 设置了绝对定位（position:absolute）的盒模型，垂直margin不会被重叠，并且和他们的子元素之间也是一样。

等等，先不要列举了，这些条件怎么看着那么眼熟呢？嗯。。。这不就是生成BFC的条件么。。。。

### 什么是BFC？

BFC(Block formatting context)直译为"块级格式化上下文"。它是一个独立的渲染区域，只有Block-level box参与， 它规定了内部的Block-level Box如何布局，并且与这个区域外部毫不相干。

我们常说的文档流其实分为定位流、浮动流、普通流三种。而普通流其实就是指BFC中的FC。FC(Formatting Context)，直译过来是格式化上下文，它是页面中的一块渲染区域，有一套渲染规则，决定了其子元素如何布局，以及和其他元素之间的关系和作用。

先介绍下Box、Formatting Context的概念。

**Box：css布局的基本单位**

Box 是 CSS 布局的对象和基本单位， 直观点来说，就是一个页面是由很多个 Box 组成的。元素的类型和 display 属性，决定了这个 Box 的类型。 不同类型的 Box， 会参与不同的 Formatting Context（一个决定如何渲染文档的容器），因此Box内的元素会以不同的方式渲染。

- `block-level box:display` 属性为 block, list-item, table 的元素，会生成 block-level box。并且参与 block fomatting context；
- `inline-level box:display` 属性为 inline, inline-block, inline-table 的元素，会生成 inline-level box。并且参与 inline formatting context；
- `run-in box`: css3 中才有， 这儿先不讲了。

**Formatting Context**

`Formatting context` 是 W3C CSS2.1 规范中的一个概念。它是页面中的一块渲染区域，并且有一套渲染规则，它决定了其子元素将如何定位，以及和其他元素的关系和相互作用。最常见的 `Formatting context` 有 `Block fomatting context` (简称BFC)和 `Inline formatting context` (简称IFC)。

> 具有 BFC 特性的元素可以看作是隔离了的独立容器，容器里面的元素不会在布局上影响到外面的元素，并且 BFC 具有普通容器所没有的一些特性。

### BFC的布局约束规则

- 内部的Box会在垂直方向，一个接一个地放置。

- Box垂直方向的距离由margin决定。属于同一个BFC的两个相邻Box的margin会发生重叠。

- 每个盒子（块盒与行盒）的margin box的左边，与包含块border box的左边相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此。即BFC中子元素不会超出他的包含块。

- BFC的区域不会与float box重叠。

- BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此。

- 计算BFC的高度时，浮动元素也参与计算。

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

#### 1. 同一个 BFC 下外边距会发生折叠

```html
<div class="container">
  <div class="inner"></div>
  <div class="inner"></div>
</div>
```
```css
.container{
  display: inline-block;
  border: 1px solid grey;
}
.inner{
  width: 20px;
  height: 20px;
  margin: 20px;
  border: 1px solid grey;
  background: lightblue;
}
```
<div class="container" style=" display: inline-block;
  border: 1px solid grey;">
  <div class="inner" style=" width: 40px;
  height: 40px;
  margin: 20px;
  border: 1px solid grey;
  background: lightblue;"></div>
  <div class="inner" style=" width: 40px;
  height: 40px;
  margin: 20px;
  border: 1px solid grey;
  background: lightblue;"></div>
</div>


从效果上看，因为两个 div 元素都处于同一个 BFC 容器下 (这里通过设置`container`为 `display: inline-block` ) 所以第一个 div 的下边距和第二个 div 的上边距发生了重叠，所以两个盒子之间距离只有 20px，而不是 40px。

首先这不是 CSS 的 bug，我们可以理解为一种规范，**如果想要避免外边距的重叠，可以将其放在不同的 BFC 容器中。**

```html
<div class="container">
  <div class="inner"></div>
  <div class="container1">
     <div class="inner"></div>
  </div>
</div>
```
```css
.container{
  display: inline-block;
  border: 1px solid grey;
}
.container1{
  display: inline-block;
}
.inner{
  width: 20px;
  height: 40px;
  margin: 40px;
  border: 1px solid grey;
  background: orange;
  overflow: hidden;
}
```
这里，将第二个`div`放进`container1`中，通过设置`container`为 `display: inline-block`使其产生BFC，这样，两个`inner`就在不同的BFC下，边距就不会重叠。两个盒子之间距离是 40px。

<div class="container" style=" display: inline-block;
  border: 1px solid grey;">
  <div class="inner"  style=" width: 40px;
  height: 40px;
  margin: 20px;
  border: 1px solid grey;
  background: lightblue;"></div>
  <div class="container1"  style=" display: inline-block;">
     <div class="inner" style=" width: 40px;
  height: 40px;
  margin: 20px;
  border: 1px solid grey;
  background: lightblue;"></div>
  </div>
</div>

ps：此样例使用html编写，可直接点击示例在控制台调试，试试取消`container1`的style之后的效果吧

#### 2. BFC 可以包含浮动的元素（清除浮动）

浮动的元素会脱离普通文档流，来看下下面一个例子

```html
<div class="container">
    <div class="inner"></div>
</div>
```

```css
.container{
  border: 1px solid grey;
}

.inner{
  width: 20px;
  height: 20px;
  margin: 20px;
  background: orange;
  float: left;
}
```
栗子，包括下面的横线
<div class="container" style="border: 1px solid grey;">
    <div class="inner" style="  width: 40px;
  height: 40px;
  margin: 20px;
  background: orange;
  float: left;"></div>
</div>

由于容器内元素浮动，脱离了文档流，所以容器只剩下 2px 的边距高度。如果使触发容器的 BFC，那么容器将会包裹着浮动元素。

通过`overflow: hidden`使`container`生成BFC
```css
.container{
  border: 1px solid grey;
  overflow: hidden;
}
```

<div class="container" style="border: 1px solid grey; overflow: hidden;">
    <div class="inner" style="  width: 40px;
  height: 40px;
  margin: 20px;
  background: orange;
  float: left;"></div>
</div>
> 本例也可以直接点击调试哦～

#### 3. BFC 可以阻止元素被浮动元素覆盖

> 你真的清楚浮动效果么？告诉你个浮动的隐藏效果，作为交换，你给我点个赞，咋样

解释这个作用之前，我先来解释一下什么是浮动

**什么是浮动**

元素加了浮动后，会脱离文档流，提升了半层层级，向着指定方向移动，直到遇到父元素的边界或另一个浮动元素停止

**什么是层级**

如果将整个元素看做一层，则下半层是元素本身（背景样式等），上半层是元素中的内容

**举例**

```html
<div class="container">
  <div class="box1">box1</div>
   <div class="box2">box2</div>
   <div class="box3">box3</div>
</div>
```
```css
.container{
 width: 40px;
 border: 1px solid black;
}
.container div{
  width: 100%;
  height: 30px;
}
.box1 {
  background: yellow;
}
.box2 {
    background: orange; 
}
.box3 {
     background: pink; 
}
```
三个盒子都没有浮动时

<div class="container" style="width: 40px;border: 1px solid black;">
  <div class="box1" style=" width: 100%;
  height: 30px; background: yellow;">box1</div>
   <div class="box2" style=" width: 100%;
  height: 30px; background: orange;">box2</div>
   <div class="box3" style=" width: 100%;
  height: 30px; background: pink;">box3</div>
</div>

当给box2添加float:left时，三个盒子的排列变成
<div class="container" style="width: 40px;border: 1px solid black;">
  <div class="box1" style=" width: 100%;
  height: 30px; background: yellow;">box1</div>
   <div class="box2" style=" width: 100%;
  height: 30px; background: orange;float: left">box2</div>
   <div class="box3" style=" width: 100%;
  height: 30px; background: pink;">box3</div>
</div>


此时由于box2浮动脱离了文档流，box3上移，被box2遮挡了。但此时box3盒子里的文字box3并没有上移！！！

**小知识**
1. 浮动元素之间是漂浮着，并不会形成一个流。浮动元素总是要保证自己的顶部与上一个标准流中的元素（未浮动元素）的底部对齐。
2. position：absolute和float会隐式地改变display类型，除display:none外，只要设置了position：absolute或float，都会让元素以display:inline-block的方式显示，可以设置长宽

浮动效果讲完了，我们来看看元素被浮动元素覆盖的例子

```html
<div class="container">
  <div class="left">我是一个左浮动的元素</div>
  <div class="right">我是一个没有设置浮动, 
也没有触发 BFC 的元素， 我的一部分被覆盖了</div>
</div>
```
```css
.left{
  width: 100px;
  height: 50px;
  background: orange;
  float: left;
}
.right{
  width: 200px;
  height: 200px;
  background: lightblue;
}
```
<div class="container">
  <div class="left" style=" width: 100px;
  height: 50px;
  background: orange;
  float: left;">我是一个左浮动的元素</div>
  <div class="right" style=" width: 200px;
  height: 200px;
  background: lightblue;">我是一个没有设置浮动, 
也没有触发 BFC 的元素， 我的一部分被覆盖了</div>
</div>

第二个元素有部分被浮动元素所覆盖，(但是文本信息不会被浮动元素所覆盖，原因在上面浮动例子解释过) 如果想避免元素被覆盖，可触第二个元素的 BFC 特性，在第二个元素中加入 overflow: hidden，就会变成：
<div class="container">
  <div class="left" style=" width: 100px;
  height: 50px;
  background: orange;
  float: left;">我是一个左浮动的元素</div>
  <div class="right" style=" width: 200px;
  height: 200px;
  background: lightblue;overflow:hidden">我是一个没有设置浮动, 
但是触发 BFC 的元素， 我又完整了</div>
</div>



这个方法可以用来实现两列自适应布局，通过设置`container`的宽度，去掉`right`的宽度即可。这时候左边的宽度固定，右边的内容自适应宽度。

Ps: 建议在控制台调试一下本示例

ps：我一般使用`display: flwx`，然后左侧宽度固定，右侧设置`flex: 1`，这个方法垂直方向也可以使用，我常用来设置滚动列表的高度，这个方法也可以实现动态宽度的布局

例子如下：

```html
<div class="container">
  <div class="left">左侧元素，定宽</div>
  <div class="right">右侧元素，动态填充剩余空间</div>
</div>
```
```css
.container{
  width: 400px;
  display: flex;
  border: 1px solid grey;
}

.left{
  width: 100px;
  height: 50px;
  background: orange;
}
.right{
  height: 200px;
  flex: 1;
  background: lightblue;
}
```
<div class="container" style=" width: 400px;
  display: flex;
  border: 1px solid grey;">
  <div class="left" style=" width: 100px;
  height: 50px;
  background: orange;">左侧元素，定宽</div>
  <div class="right" style=" height: 200px;
  flex: 1;
  background: lightblue;">右侧元素，动态填充剩余空间</div>
</div>

你可以在控制台调整一下`container`的宽度，右侧元素会自动填充

### 外边距重叠示例

讲完了BFC及其作用，除了最直观的，同一个 BFC 下外边距会发生折叠，我们来看下其他边距重叠的示例

#### 1. 当一个元素包含在另一个元素之中时，子元素与父元素之间也会产生重叠现象，重叠后的外边距，等于其中最大者

栗子如下：

```html
<div class="container">
  <div class="title">
        此部分是能更容易看出让下面的块的margin-top。
  </div>
  <div class = "content">
    <div class="inner">
      子元素
      margin-top:20px;
    </div>
    <h2>父元素</h2>
    没有设置margin-top
  </div>
</div>
```
```css
.container{
  width: 400px;
  border: 1px solid grey;
}
.title{
  height:50px;
  background: #eee;
 }
.content{
  height:200px;
  background: #88f;
}
.inner{
  height:100px;
  margin-top:20px;
  background: #0ff;
  width:200px;
}
```
<div class="container" style="width: 400px;
  border: 1px solid grey;">
  <div class="title" style="height:50px;
  background: #eee;">
        此部分是能更容易看出让下面的块的margin-top。
  </div>
  <div class = "content" style="
  background: #88f;">
    <div class="inner" style="height:100px;
  margin-top:20px;
  background: #0ff;
  width:200px;">
      子元素
      margin-top:20px;
    </div>
    <h2>父元素</h2>
    没有设置margin-top
  </div>
</div>


父元素和子元素margin-top发生了重叠，最终结果相当于父元素设置了20px的margin-top。

可以设置 `overflow：hidden`来解决这个问题。你可以选中示例在控制台自己尝试一下其他解决方案。

#### 2. 如果一个无内容的空元素，其自身上下边距也会产生重叠。

```html
<div class="container">
  <div class="inner"></div>
</div>
```
```css
.container{
  width: 200px;
  border: 1px solid grey;
}
.inner{
  margin-top:20px;
  margin-bottom: 20px;
}
```

<div class="container" style="  width: 200px;
  border: 1px solid grey;">
  <div class="inner" style="  margin-top:20px;
  margin-bottom: 20px;"></div>
</div>


这个框的高度只有20px，稍微改动下inner元素，比如加个文字，或者加个边框，都会破坏这种现象，欢迎自己打开控制台尝试一下各种解决方案。

好了，外边距重叠、BFC、及浮动的讲解到此结束。有任何想法和意见欢迎在评论中指出。

### 参考文档：
1. [什么是BFC？看这一篇就够了](https://blog.csdn.net/sinat_36422236/article/details/88763187)
2. [10 分钟理解 BFC 原理](https://zhuanlan.zhihu.com/p/25321647)
3. [CSS中重要的BFC](https://segmentfault.com/a/1190000013023485)
4. [CSS 外边距(margin)重叠及防止方法边距重叠解决方案(BFC)](https://www.cnblogs.com/webdom/p/10643176.html)

