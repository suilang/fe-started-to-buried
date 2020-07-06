
【🙄🙄🙄】傻傻分不清css长度的(百分比|负值)基准是谁
> 你们都不看的总集篇：  [从零开始的大前端筑基之旅(深入浅出，持续更新～)](https://juejin.im/post/5eb20ddcf265da7ba058226b)  
> 万字长目录，觉得不错就顺手点个赞吧~

**敲黑板：** 老规矩，本文所有示例均为手打html示例，可以直接选中示例在控制台调试，欢迎👏 并且建议验证各种想法。手敲不易，如果你觉得收获了新知识，那我在此求个赞～

> 另外，本次调整了左侧图片的距离及大小，`1366 * 768`分辨率下应该不会影响阅读了

## width height 百分比

当元素的height、width设置为百分比时，分别基于包含它的块级对象的高度、宽度。这个是常规百分比的含义。

```html
<div class="container">
  <div class="inner">注意这里</div>
  <div class="divider">我是分割线</div>
</div>
```
```css
.container{
  width: 500px;
  height: 300px;
  border: 1px solid grey;
}

.inner{
  background: lightblue;
  text-align: center;
  width: 50%;
  height: 50%;
}
.divider{
  border-top: 1px solid lightblue;
  text-align: center;
}
```
<div class="container" style=" width: 500px;
  height: 300px;
  border: 1px solid grey;">
  <div class="inner" style="  width: 50%;
  height: 50%;
  background: lightblue;
  text-align: center;">注意这里</div>
  <div class="divider" style=" border-top: 1px solid lightblue;
  text-align: center;">我是分割线</div>
</div>


## margin 百分比

假设一个块级容器，宽 500px，高 300px，块级子元素定义 `margin:10% 5%;`，你觉得 margin 的 top, right, bottom, left 计算值最终是多少？

我们来实际看一下
```html
<div class="container">
  <div class="inner">注意这里</div>
  <div class="divider">我是分割线</div>
</div>
```
```css
.container{
  width: 500px;
  height: 300px;
  border: 1px solid grey;
}

.inner{
  margin: 10% 10%;
  background: lightblue;
  text-align: center;
}
.divider{
  border-top: 1px solid lightblue;
  text-align: center;
}
```
<div class="container" style=" width: 500px;
  height: 300px;
  border: 1px solid grey;">
  <div class="inner" style=" margin: 10% 10%;
  background: lightblue;
  text-align: center;">注意这里</div>
  <div class="divider" style=" border-top: 1px solid lightblue;
  text-align: center;">我是分割线</div>
</div>


结果出来了，**50px 50px 50px 50px**，并不是`50px 30px 50px 30px`

**为什么**

> CSS权威指南中的解释：
>
> 我们认为，正常流中的大多数元素都会足够高以包含其后代元素（包括外边距），如果一个元素的上下外边距是父元素的height的百分数，就可能导致一个无限循环，父元素的height会增加，以适应后代元素上下外边距的增加，而相应的，上下外边距因为父元素height的增加也会增加。

 `margin` 的百分比值参照其包含块的宽度进行计算。

当书写模式变成纵向的时候，其参照将会变成包含块的高度。我们改变一下上面例子中的 CSS 书写模式：
```css
.container{
  width: 500px;
  height: 300px;
  border: 1px solid grey;
  writing-mode: vertical-lr;
}
```
<div class="container" style=" width: 500px;
  height: 300px;
  border: 1px solid grey; writing-mode: vertical-lr;
  ">
  <div class="inner" style=" margin: 10% 10%;
  background: lightblue;
  text-align: center;">注意这里</div>
  <div class="divider" style=" border-left: 1px solid lightblue;
  text-align: center;">我是分割线</div>
</div>


这时的结果为：**30px 30px 30px 30px**

也就是说**书写模式影响 margin 百分比的参照对象**。

## padding 百分比

同上 Î 

举个例子看看效果。注意，这是纵向排列的例子。

<div class="container" style=" width: 500px;
  height: 300px;
  border: 1px solid grey; writing-mode: vertical-lr;
  ">
  <div class="inner" style=" padding: 10% 10%;
  background: lightblue;
  text-align: center;">注意这里</div>
  <div class="divider" style=" border-left: 1px solid lightblue;
  text-align: center;">我是分割线</div>
</div>
同上一个例子相比， 左侧元素占位区域并没有扩大，仅仅是由于`margin` 改为`padding` 导致背景区域扩大而已。

因此，padding的百分比不是相对于自身，而是当书写模式为默认**横向排列**时，相对**最近父元素的宽度**，书写模式为`writing-mode: vertical-lr;` 纵向排列时，百分比相对于父元素高度

## width、padding 联合百分比

单用一个很简单，但如果联合，可能就会有问题了。这里我不禁要问一句：

> 兄弟，你听过盒模型么？

- W3C的标准盒模型
    `box-sizing: content-box`，默认属性
     设置的width或height是对 实际内容（content）的width或height进行设置，内容周围的border和padding另外设置

- 怪异盒模型
    `box-sizing: border-box`
    设置的width或height是对 实际内容（content）+内边距（padding）+边框（border）之和

现在，我们来看个栗子，其中内部元素`width`设为`100%`， `padding`设为`10%`

```html
<div class="container">
  <div class="inner"><div class="text">注意这里</div></div>
  <div class="divider">我是分割线</div>
</div>
```
```css
.container{
  width: 500px;
  height: 300px;
  border: 1px solid grey;
}
.inner{
  background: lightblue;
  text-align: center;
  width: 100%;
  padding: 10% 10%;
  box-sizing: content-box; // 补上这里是因为有些环境默认不是标准盒模型
}
.divider{
  border-top: 1px solid lightblue;
  text-align: center;
}
.text{
  background: yellow;
}
```
<div class="container" style=" width: 500px;
  height: 300px;
  border: 1px solid grey;">
  <div class="inner" style="  width: 100%;padding: 10% 10%;
  background: lightblue;box-sizing: content-box;
  text-align: center;"><div class="text" style="background: yellow;">注意这里</div></div>
  <div class="divider" style=" border-top: 1px solid lightblue;
  text-align: center;">我是分割线</div>
</div>



在标准盒模型下，` width: 100%; padding: 10% 10%;` 会导致内部元素溢出，如果遇到这种情况，一般都会使用怪异盒模型，即设置`box-sizing: border-box`，这时候`width`的值是会包含`padding`的距离的。你可以自己打开控制台试试，这里就不举例了。

## top、left、right、bottom 百分比

还是看图说话


```html
<div class="container">
  <div class="inner"></div>
</div>
```
```css
.container{
  width: 500px;
  height: 300px;
  border: 1px solid grey;
  position: relative;
}

.inner{
  width: 200px;
  height: 100px;
  background: lightblue;
  top:10%;
  left: 10%;
  position: absolute;
}
```
<div class="container" style=" width: 500px;
  height: 300px;
  border: 1px solid grey;
  position: relative;">
  <div class="inner" style="  width: 200px;
  height: 100px;
  background: lightblue;
  top:10%;
  left: 10%;
  position: absolute;"></div>
</div>


可以很明显的看出，left相对于父元素宽度，top相对于父元素高度。同理可推出right相对于父元素宽度，bottom相对于父元素高度。

## ## translate百分比

在translate 函数当中使用百分比是以该元素自身的宽高作为基准。

当子元素的width和height未知时，无法通过设置margin-left:-width/2和margin-top:-height/2来实现，这时候可以设置子元素的`transform: translate(-50%,-50%)`。
```html
<div class="container">
  <div class="inner"></div>
</div>
```
```css
.container{
  width: 500px;
  height: 300px;
  border: 1px solid grey;
  position: relative;
}

.inner{
  width: 50%;
  height: 50%;
  background: lightblue;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
}
```
<div class="container" style="  width: 500px;
  height: 300px;
  border: 1px solid grey;
  position: relative;">
  <div class="inner" style=" width: 50%;
  height: 50%;
  background: lightblue;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);"></div>
</div>

translate 属性和绝对定位、相对定位属性加上 top、left 数值都可以使元素产生位移，但存在细微差别，表现在offsetLeft 和 offsetTop 属性。

使用绝对定位、相对定位属性加上 top、left ，会影响offsetTop和 offsetLeft 的值；

> 使用 translate 的offsetTop和 offsetLeft 与没有产生位移的元素没有区别，即无论translate 的值为多少，offsetTop和 offsetLeft 的值都是固定不变的。

## margin为负值



1. margin-left,margin-right为负值
- 元素本身没有宽度，会增加元素宽度
```html
<div class="container">
  <div class="inner">里层的元素设置了margin-right:-100px</div>
</div>
```
```css
.container{
  width: 500px;
  height: 200px;
  border: 1px solid grey;
  margin-left: 100px;
}

.inner{
  height: 100px;
  background: lightblue;
  margin-left: -100px;
}
```
<div class="container" style=" width: 500px;margin-left: 100px;
  height: 200px;
  border: 1px solid grey;">
  <div class="inner" style="height: 100px;
  background: lightblue;
  margin-left: -100px;">里层的元素设置了margin-left:-100px</div>
</div>



- 元素本身有宽度，会产生位移
补充`inner`元素宽度属性
```css
.inner{
  height: 100px;
  background: lightblue;
  margin-left: -100px;
  width: 100%;
}
```
<div class="container" style=" width: 500px;margin-left: 100px;
  height: 200px;
  border: 1px solid grey;">
  <div class="inner" style="height: 100px;
  background: lightblue;width: 100%;
  margin-left: -100px;">里层的元素设置了margin-left:-100px</div>
</div>

2. margin-top为负值，不管是否设置高度，都不会增加高度，而是会产生向上的位移

```css
.inner{
  height: 100px;
  background: lightblue;
  margin-left: -100px;
  width: 100%;
}
```
<div class="container" style=" width: 500px;margin-top: 100px;
  height: 200px;
  border: 1px solid grey;">
  <div class="inner" style="height: 100px;
  background: lightblue;width: 100%;
  margin-top: -100px;">里层的元素设置了margin-top:-100px</div>
</div>

3. margin-bottom为负值的时候不会位移,而是会减少自身供css读取的高度.
```html
<div class="container">
  <div class="inner">里层的元素设置了margin-bottom:-100px</div>
  <div>这里是下一个元素</div>
</div>
```
```css
.inner{
  height: 150px; // 此处height变为150px
  background: lightblue;
  margin-bottom: -100px;
  width: 100%;
}
```
<div class="container" style=" width: 500px;
  height: 200px;
  border: 1px solid grey;">
  <div class="inner" style="height: 150px;
  background: lightblue;width: 100%;
  margin-bottom: -100px;">里层的元素设置了margin-bottom:-100px</div>
    <div>这里是下一个元素</div>
</div>



那么，你觉得负值改为负百分比又是什么情况呢？欢迎留言

## padding 为负值

很遗憾，padding不允许指定为负，指定了也无效～

<div style="height: 20px"></div>

**如果你收获了新知识，请点个赞告诉我～**

<div>
<img style="width: 250px;border-radius: 10px" src="https://user-gold-cdn.xitu.io/2020/6/25/172eb225ab0950ae?w=350&h=350&f=gif&s=61227"></img>
</div>

<div style="
    position: fixed;
    top: 180px;
    left: 90px;
    width: 8%;
    left: 6%;
    border-radius: 20px;
    overflow: hidden;
    "><img style="
    display: block;
    " class="lazyload inited loaded" data-src="https://user-gold-cdn.xitu.io/2020/5/18/17227bbcc1326227?imageView2/0/w/1280/h/960/format/webp/ignore-error/1" data-width="864" data-height="1280" src="https://user-gold-cdn.xitu.io/2020/5/18/17227bbcc1326227?imageView2/0/w/1280/h/960/format/webp/ignore-error/1">
    <div>
    </div></div>

> 本文收纳于：  [从零开始的大前端筑基之旅(深入浅出，持续更新～)](https://juejin.im/post/5eb20ddcf265da7ba058226b)   

 推荐阅读：  
 - [带你撸个属于自己的react项目|webpack+babel+typescript+eslint](https://juejin.im/post/5ee0e6e0e51d4510a178a3eb)  
    没搭过项目的新人一定不容错过，带你解锁快捷开发小技巧
- [三言两语带你理解「闭包」| 附使用场景](https://juejin.im/post/5eb2ad59e51d454def226a3f)  
    很简单就能解释清的东西为什么要多费口舌呢？

- [朝花夕拾，重新介绍继承与原型链](https://juejin.im/post/5eab794a6fb9a043620fed37)  
     有图有真相的讲解
- [回流(reflow)与重绘(repaint)，KFC与MC](https://juejin.im/post/5ec220bfe51d454de44339a6)   
   每次这两个都会被同时提及，关系就好像KFC边上一定会有MC一样亲密的让人摸不到头脑。

- [viewport和1px | 工具人: 这是1px，设计师： 不，这不是](https://juejin.im/post/5ec3c6de6fb9a048021457ea)  
设计我不行，但吵架我在行啊

- [可食用的「css布局干货」,纯Html示例，可调试 | 水平、垂直、多列](https://juejin.im/post/5ec53111f265da76e97d2c55)  
   可观看，可调试，可带走，仅此一家，别无分店

- [前端必须掌握的「CSS层叠上下文」讲解 | 纯手工示例，包教包会](https://juejin.im/post/5ecb1e77e51d457893029755)    
     妹子与猫，你要哪个？




参考文档：

1. [CSS margin 百分比](https://www.runoob.com/note/30218)
2. [margin为负值详解](https://blog.csdn.net/weixin_38912024/article/details/88837111)