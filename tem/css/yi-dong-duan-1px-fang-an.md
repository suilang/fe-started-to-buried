---
description: 'css: 这是1px，设计师： 不，这不是'
---

# 移动端1px方案与viewport的使用

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

## 起因

那么为什么会产生这个问题呢？主要是跟一个东西有关，DPR\(devicePixelRatio\) 设备像素比，它是默认缩放为100%的情况下，设备像素和CSS像素的比值。简单地说，这告诉浏览器应该使用多少个屏幕的实际像素来绘制单个 CSS 像素。

> 还有一个因素也会引起css中px的变化，那就是用户缩放。例如，当用户把页面放大一倍，那么css中1px所代表的物理像素也会增加一倍；反之把页面缩小一倍，css中1px所代表的物理像素也会减少一倍。

```javascript
value = window.devicePixelRatio;
```

> 在早先的移动设备中，屏幕像素密度都比较低，如iphone3，它的分辨率为320x480，在iphone3上，一个css像素确实是等于一个屏幕物理像素的。后来随着技术的发展，移动设备的屏幕像素密度越来越高，从iphone4开始，苹果公司便推出了所谓的Retina屏，分辨率提高了一倍，变成640x960，但屏幕尺寸却没变化，这就意味着同样大小的屏幕上，像素却多了一倍，这时，一个css像素是等于两个物理像素的。

## 解决方案：

### 用 0.5px 解决

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

### 下面介绍下被diss的三种方法

#### 使用图片实现

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

#### 用多背景渐变实现的

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

#### 伪类 + transform

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

上面三种方法与最开始的类似，既然1个css像素代表两个物理像素，设备又不认`0.5px`的写法，那就画1px，然后再想尽各种办法将线宽减少一半。

### 通过 viewport + rem 实现

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

// 设置对应viewport的rem基准值
var docEl = document.documentElement;
var fontsize = 16* (docEl.clientWidth / 375) + 'px';
docEl.style.fontSize = fontsize;
```

说到viewport，就不得不详细聊聊它了。

> 下面内容来自参考文档4

#### 三类viewport

移动设备上的viewport就是设备的屏幕上用来显示我们的网页的那一块区域，但viewport又不局限于浏览器**可视区域**的大小。ppk把移动设备上的viewport分为layout viewport 、 visual viewport 和 ideal viewport 三类，

为了能在移动设备上正常显示那些传统的为桌面浏览器设计的网站，移动设备上的浏览器都会把自己默认的viewport设为980px或1024px。但带来的后果就是浏览器会出现横向滚动条。我们把这个浏览器默认的viewport叫做 **layout viewport**，通过 `document.documentElement.clientWidth` 来获取

桌面浏览器中css的1个像素往往都是对应着电脑屏幕的1个物理像素，但css中的像素只是一个抽象的单位，在不同的设备或不同的环境中，css中的1px所代表的设备物理像素是不同的。

> 现在有很多手机分辨率都非常大，比如768x1024，或者1080x1920这样。但css中的1px并不是代表屏幕上的1px，你分辨率越大，css中1px代表的物理像素就会越多，devicePixelRatio的值也越大。因为你分辨率增大了，但屏幕尺寸并没有变大多少，必须让css中的1px代表更多的物理像素，才能让1px的东西在屏幕上的大小与那些低分辨率的设备差不多，不然就会因为太小而看不清。

把代表浏览器可视区域的大小viewport叫做 **visual viewport**。visual viewport的宽度可以通过`window.innerWidth` 来获取。

最后有一个能完美适配移动设备的viewport。所谓的完美适配指的是，

* 不需要用户缩放和横向滚动条就能正常的查看网站的所有内容；
* 显示的文字的大小是合适，比如一段14px大小的文字，不会因为在一个高密度像素的屏幕里显示得太小而无法看清，理想的情况是这段14px的文字无论是在何种密度屏幕，何种分辨率下，显示出来的大小都是差不多的。

这个viewport叫做 **ideal viewport**，也就是第三个viewport——移动设备的理想viewport。

#### meta标签

移动设备默认的viewport是layout viewport，我们需要的是ideal viewport。这时候轮到meta标签出场了。

```javascript
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
```

该meta标签的作用是让当前viewport的宽度等于设备的宽度，同时不允许用户手动缩放。

meta viewport 有6个属性：

![](../.gitbook/assets/image%20%2814%29.png)

要得到ideal viewport就必须把默认的layout viewport的宽度设为移动设备的屏幕宽度。因为meta viewport中的width能控制layout viewport的宽度，所以我们只需要把width设为width-device这个特殊的值就行了。

```javascript
<meta name="viewport" content="width=device-width">
```

> 在iphone和ipad上，仅设置`content="width=device-width"`，无论是竖屏还是横屏，宽度都是竖屏时ideal viewport的宽度。

```javascript
<meta name="viewport" content="initial-scale=1">
```

这句代码也能达到和前一句代码一样的效果，也可以把当前的的viewport变为 ideal viewport。

> 缩放是相对于 ideal viewport来进行缩放的，当对ideal viewport进行100%的缩放，也就是缩放值为1的时候，就得到了 ideal viewport。因此，默认的 initial-scale 不是1

> 仅设置`content="`initial-scale=1`"`，phone、ipad以及IE 会横竖屏不分，通通以竖屏的ideal viewport宽度为准。推荐两者都写

缩放是相对于ideal viewport来缩放的，缩放值越大，当前viewport的宽度就会越小，反之亦然。例如在iphone中，ideal viewport的宽度是320px，如果我们设置 initial-scale=2 ，此时viewport的宽度会变为只有160px了。

> 缩放2倍是在实际宽度不变的情况下，1px变得跟原来的2px的长度一样了.所以放大2倍后原来需要320px才能填满的宽度现在只需要160px就做到了

```javascript
visual viewport宽度 = ideal viewport宽度  / 当前缩放值
```

好了，现在回到1px问题上。

每个移动设备浏览器中都有一个理想的宽度，这个理想的宽度是指css中的宽度，跟设备的物理宽度没有关系，在css中，这个宽度就相当于100%的所代表的那个宽度。我们可以用meta标签把viewport的宽度设为那个理想的宽度，如果不知道这个设备的理想宽度是多少，那么用device-width这个特殊值就行了

> 如一个分辨率为320x480的手机理想viewport的宽度是320px，而另一个屏幕尺寸相同但分辨率为640x960的手机的理想viewport宽度也是为320px。但是对于后者，1个css像素会用2个物理像素来显示

因此，对于`window.devicePixelRatio = 2` 的屏幕，通过设置 

```javascript
viewport.setAttribute('content', 'width=device-width,initial-scale=0.5, maximum-scale=0.5, minimum-scale=0.5, user-scalable=no');
```

将1px变得跟原来0.5px一样，就实现来css中1px 对应屏幕1px 了。

> 相对的，假如原本320px可以填满屏幕的话，现在需要640px才能填满屏幕了，因此改变viewport时会同步使用rem作为像素单位。因为rem是相对大小，只与根元素`font-size`的值有关



参考文档：

1. [移动端1px解决方案](https://juejin.im/post/5d19b729f265da1bb2774865)
2. [CSS retina hairline, the easy way.](http://dieulot.net/css-retina-hairline)
3. [Retina屏的移动设备如何实现真正1px的线？](https://jinlong.github.io/2015/05/24/css-retina-hairlines/)
4. [移动前端开发之viewport,devicePixelRatio的深入理解](https://www.jianshu.com/p/413a25b2c503)

