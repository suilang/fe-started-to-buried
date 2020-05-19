---
description: 'css: 这是1px，设计师： 不，这不是'
---

# 移动端1px方案

目前多端运行的项目越来越多，设计师对于UI的要求也越来越高。

> 设计师：你这字体大小不太对
>
> 工具人：你看代码，就是16px
>
> 设计师：确实跟设计稿不一致\(拿出iphone 11 max\)
>
> 工具人：我一般称这种情况为 有钱人的烦恼\(拿出5寸安卓\)
>
> 设计师：好吧

请原谅工具人吧。

在`高清屏`下，很多设计稿上的参数就不能像web一样直接拿来用了，不管是H5页面还是RN应用，都需要进行下适配。例如，同样是1px，移动端的1px 就会显得很粗。

起因

那么为什么会产生这个问题呢？主要是跟一个东西有关，DPR\(devicePixelRatio\) 设备像素比，它是默认缩放为100%的情况下，设备像素和CSS像素的比值。简单地说，这告诉浏览器应该使用多少个屏幕的实际像素来绘制单个 CSS 像素。

```text
value = window.devicePixelRatio;
```

> 在早先的移动设备中，屏幕像素密度都比较低，如iphone3，它的分辨率为320x480，在iphone3上，一个css像素确实是等于一个屏幕物理像素的。后来随着技术的发展，移动设备的屏幕像素密度越来越高，从iphone4开始，苹果公司便推出了所谓的Retina屏，分辨率提高了一倍，变成640x960，但屏幕尺寸却没变化，这就意味着同样大小的屏幕上，像素却多了一倍，这时，一个css像素是等于两个物理像素的。



解决方案：

用 0.5px 解决

> 既然1px代表2像素，那用0.5px 不就完美了么

在 WWDC大会上，给出了1px方案，当写 0.5px的时候，就会显示一个物理像素宽度的 border。

![](../.gitbook/assets/image%20%2813%29.png)

> retina 屏的浏览器可能不认识0.5px的边框，将会把它解释成0px，没有边框。包括 iOS 7 和 之前版本，OS X Mavericks 及以前版本，还有 Android 设备。

通过 JavaScript 检测浏览器能否处理0.5px的边框，如果可以，给`<html>`元素添加个`class`。

```javascript
if (window.devicePixelRatio && devicePixelRatio >= 2) {
  var testElem = document.createElement('div');
  testElem.style.border = '.5px solid transparent';
  document.body.appendChild(testElem);
  if (testElem.offsetHeight == 1)
  {
    document.querySelector('html').classList.add('hairlines');
  }
  document.body.removeChild(testElem);
}
```

然后，极细的边框样式就容易了：

```javascript
div {
  border: 1px solid #bbb;
}
 
.hairlines div {
  border-width: 0.5px;
}
```

> 顺便踩了一脚其他的解决方案。原文：
>
> unlike previous solutions involving SVG or GIF or transforms or linear-gradient1, you can have retina hairlines on elements with rounded corners \(border-radius\).
>
> 对于不支持的设备：
>
> This is supported by most desktop browsers, and now by Safari 8 on both iOS and OS X. Chrome on Android is a notable absent, but no doubt it will eventually follow suit. When a browser doesn’t support it, it just displays a regular border. No big deal.

下面介绍下被diss的三种方法

使用图片实现

6x6 的 一张图片

[![](https://jinlong.github.io/image/css-retina-1px/border.png)](https://jinlong.github.io/image/css-retina-1px/border.png)

可以用 gif，png，或 base64 图片

```javascript
.border{
    border-width: 1px;
    border-image: url(border.gif) 2 repeat;
}
```

缺点是改边框颜色时要改图片，不是很方便。

用多背景渐变实现的

设置1px的渐变背景，50%有颜色，50%透明，但是无法实现圆角

```javascript
.border {
    background:
    linear-gradient(180deg, black, black 50%, transparent 50%) top    left  / 100% 1px no-repeat,
    linear-gradient(90deg,  black, black 50%, transparent 50%) top    right / 1px 100% no-repeat,
    linear-gradient(0,      black, black 50%, transparent 50%) bottom right / 100% 1px no-repeat,
    linear-gradient(-90deg, black, black 50%, transparent 50%) bottom left  / 1px 100% no-repeat;
}
```

伪类 + transform

结合 JS 代码，判断是否 Retina 屏

```css
if(window.devicePixelRatio && devicePixelRatio >= 2){
    document.querySelector('ul').className = 'hairlines';
}
```

把原先元素的 border 去掉，然后利用 `:before` 或者 `:after` 重做 border ，并 transform 的 scale 缩小一半。原先的元素相对定位，新做的 border 绝对定位

> 如果是上下边框，scaleY 设置为0.5，左右边框 scaleX 设置为0.5

```css
.hairlines li{
    position: relative;
    border:none;
}
.hairlines li:after{
    content: '';
    position: absolute;
    left: 0;
    background: #000;
    width: 100%;
    height: 1px;
    -webkit-transform: scaleY(0.5);
            transform: scaleY(0.5);
    -webkit-transform-origin: 0 0;
            transform-origin: 0 0;
}
```

可以支持圆角，但是 `<td>` 用不了。

通过 viewport + rem 实现

```javascript
var viewport = document.querySelector("meta[name=viewport]");

//下面是根据设备像素设置viewport
if (window.devicePixelRatio == 1) {
  viewport.setAttribute('content', 'width=device-width,initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no');
}
if (window.devicePixelRatio == 2) {
  viewport.setAttribute('content', 'width=device-width,initial-scale=0.5, maximum-scale=0.5, minimum-scale=0.5, user-scalable=no');
}
if (window.devicePixelRatio == 3) {
  viewport.setAttribute('content', 'width=device-width,initial-scale=0.3333333333333333, maximum-scale=0.3333333333333333, minimum-scale=0.3333333333333333, user-scalable=no');
}

var docEl = document.documentElement;
var fontsize = 32* (docEl.clientWidth / 750) + 'px';
docEl.style.fontSize = fontsize;
```







参考文档：

1. [移动端1px解决方案](https://juejin.im/post/5d19b729f265da1bb2774865)
2. [CSS retina hairline, the easy way.](http://dieulot.net/css-retina-hairline)
3. [Retina屏的移动设备如何实现真正1px的线？](https://jinlong.github.io/2015/05/24/css-retina-hairlines/)
4. 
