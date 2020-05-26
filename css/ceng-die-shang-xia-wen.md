# index

大部分人在初步学完css后，对z-index的印象大概处于“`z-index`就是用来描述定义一个元素在屏幕`Z轴`上的堆叠顺序”。例如，如果A元素和B元素重叠了，这么说有点枯燥，换个说法，

1. 如果漂亮妹子A和文字B注释重叠了
2. 但是页面渲染的时候，文字处于图片之上，挡住你看妹子了
3. 这时候，你可能会
   * 设置妹子的z-index为999
   * 设置文字的z-index为-1

就是这么差别对待。既然拿上面那一段举栗子，那就代表这种理解有问题，至少是不严谨的。

1. `z-index`属性仅在**定位元素**（定义了[position](https://juejin.im/post/5ebd3001f265da7bcd5c62da)属性，且属性值为非`static`值的元素）上有效果。
2. 元素在`Z轴`上的堆叠顺序，由元素所属的**层叠上下文**、元素的**层叠水平**、以及元素在**文档中的顺序**等共同决定，元素的`z-index`值的只是决定元素的层叠水平的条件之一。

这两条一定要记牢，下面会用到。

## 什么是“层叠上下文”

层叠上下文\(stacking context\)，是HTML中一个三维的概念。它划分了某种领域或范围，在渲染规则层面，将内部与外部隔开，并赋予元素自身及内部区域某些特性。

在CSS2.1规范中，每个盒模型的位置是三维的，即元素除了在页面上沿`X轴Y轴`平铺，同时还拥有一个相对屏幕垂直的纵深，也就是表示层叠的`Z轴`。

对于元素所展现的内容，一般情况下，元素在文档中顺序排列，互相排斥，我们察觉不到它们在`Z轴`上的层叠关系。而一旦元素发生堆叠，就会发现某个元素覆盖了另一个元素或者被另一个元素覆盖。

对于元素的层级结构来说，父元素与其子元素大部分情况下都是重叠的，只是一般情况下，父元素没有设置边框和背景，或者因为子元素没有突破父元素的宽高，我们一般也不会意识到元素的堆叠情况。

元素由于特定的css设置，拥有了层叠上下文后，就会变成层叠上下文元素；

层叠上下文元素有如下特性：

1. 层叠上下文的层叠水平要比普通元素高；
2. 层叠上下文可以嵌套，内部层叠上下文及其所有子元素均受制于外部的层叠上下文。
3. 每个层叠上下文是自成体系的，当元素发生层叠的时候，整个元素被认为是在父层叠上下文的层叠顺序中。
4. 每个层叠上下文和兄弟元素独立，也就是当进行层叠变化或渲染的时候，只需要考虑后代元素。
5. 层叠上下文可以阻断元素的混合模式；

## 如何创建“层叠上下文”

层叠上下文大部分由一些特定的CSS属性创建。

1. `HTML`中的根元素`<html></html>`本身就具有层叠上下文，称为“根层叠上下文”。
2. 普通元素设置`position`属性为**非**`static`值并设置`z-index`属性为具体数值，产生层叠上下文。
3. css3补充了一些创建层叠上下文的条件，后面会列举。

## 层叠水平

层叠水平\(stacking level\)，决定了**同一个**层叠上下文中元素在z轴上的显示顺序。

所有的元素都有层叠水平，包括层叠上下文元素。每个层叠上下文和兄弟元素独立，因此层叠水平的比较只有在当前层叠上下文元素中才有意义。

> 归属于不同层叠上下文的元素，首先要追溯其祖先元素的层叠上下文，直到各自的祖先层叠上下文元素归属于同一个层叠上下文，然后判断这两个祖先元素的层叠水平。

## 层叠顺序

层叠顺序\(stacking order\)， 表示元素发生层叠时的特定的垂直显示顺序，是一种用于确定元素层叠水平的规则。

当元素重叠时，必须决定哪部分内容展示在屏幕上，因此，层叠顺序决定了一条优先级规则，也可以称为等级链规则。 以下排名分先后，自上而下优先级越来越低： 1. z-index &gt; 0 \(要求z-index属性生效\) 2. z-index: auto 或者 z-index: 0 \(z-index: auto 不会创建层叠上下文\) 3. inline、inline-block 行内盒子 4. float浮动盒子 5. block块级盒子，非 inline-block，无 position 定位（static除外）的子元素 6. z-index &lt; 0 7. 层叠上下文元素的 `background/border`

当元素发生层叠的时候，其覆盖关系通常遵循下面2个准则：

1. 在同一个层叠上下文领域，当具有明显的层叠水平标示的时候，如有效的 `z-index` 值，层叠水平值大的那一个覆盖小的那一个。
2. 当元素的层叠水平一致、层叠顺序相同的时候，在DOM流中处于后面的元素会覆盖前面的元素。

## 深入浅出

概念讲解完了，下面进入实战环节，来，看我手上，现在我们有两只猫：

 ![](https://user-gold-cdn.xitu.io/2020/5/25/172496fc29361e6d?w=232&h=153&f=png&s=22524) ![](https://user-gold-cdn.xitu.io/2020/5/25/17249714f08ee676?w=200&h=125&f=png&s=35940)

### 验证准则2，

> 当元素的层叠水平一致、层叠顺序相同的时候，在DOM流中处于后面的元素会覆盖前面的元素。

然后让它们重叠起来：

```markup
<div class="container">
  <div class="black">
    <img src="black.jpg"></img>  
  </div>
<div class="white">
    <img src="white.jpg"></img>  
  </div>
</div>
```

```css
.container{
  width: 300px;
  height: 200px;
  border: 1px solid grey;
}

.black{
  position: absolute;
}

.white{
  position: absolute;
  top: 50px;
  left: 50px;
}
```

 ![](https://user-gold-cdn.xitu.io/2020/5/25/172496fc29361e6d?w=232&h=153&f=png&s=22524) ![](https://user-gold-cdn.xitu.io/2020/5/25/17249714f08ee676?w=200&h=125&f=png&s=35940)

当前 `black.img` 和 `white.img` 都是普通元素， 其父元素也是普通元素，因此两者处于元素的“根层叠上下文”中。并且层叠水平一致，因此遵循后来居上原则，白猫覆盖黑猫。

### 验证准则1

> 在同一个层叠上下文领域，当具有明显的层叠水平标示的时候，如有效的 `z-index` 值，层叠水平值大的那一个覆盖小的那一个。

给黑猫`black.img`增加 `z-index` 属性并设置 `position` 使其生效

```css
.black img{
  position: relative;
  z-index: 1;
}
```

 ![](https://user-gold-cdn.xitu.io/2020/5/25/172496fc29361e6d?w=232&h=153&f=png&s=22524) ![](https://user-gold-cdn.xitu.io/2020/5/25/17249714f08ee676?w=200&h=125&f=png&s=35940)

当前 `black.img` 是层叠上下文元素\(不影响比较层叠水平\)， `white.img` 是普通元素， 其父元素都是普通元素，因此两者处于元素的“根层叠上下文”中。`black.img` 具有明显的层叠水平标示 `z-index: 1`。因此黑猫覆盖了白猫。

### 验证特性2、3

> 1. 层叠上下文可以嵌套，内部层叠上下文及其所有子元素均受制于外部的层叠上下文。
> 2. 每个层叠上下文是自成体系的，当元素发生层叠的时候，整个元素被认为是在父层叠上下文的层叠顺序中。

归属于不同层叠上下文的元素，首先要追溯其祖先层叠上下文元素，直到各自的祖先层叠上下文元素归属于同一个层叠上下文，然后判断这两个祖先元素的层叠水平。

接上面代码，首先给白猫`white.img`增加 `z-index` 属性并设置 `position` 使其生效，当前css代码如下：

```css
.container{
  width: 300px;
  height: 200px;
  border: 1px solid grey;
}

.black{
  position: absolute;
}
.black img{
  position: relative;
  z-index: 1;
}

.white{
  position: absolute;
  top: 50px;
  left: 50px;
}

.white img{
  position: relative;
   z-index: 2;
}
```

 ![](https://user-gold-cdn.xitu.io/2020/5/25/172496fc29361e6d?w=232&h=153&f=png&s=22524) ![](https://user-gold-cdn.xitu.io/2020/5/25/17249714f08ee676?w=200&h=125&f=png&s=35940) 此时，\`black.img\` 和 \`white.img\` 都是层叠上下文元素\(不影响层叠水平对比\)， 其父元素都是普通元素，两者处于元素的“根层叠上下文”中。\`black.img\` 和\`white.img\`都具有明显的层叠水平标示 \`z-index\`，白猫的 \`z-index\` 值大于黑猫，于是重新覆盖在黑猫上面。 给\`black\` 和 \`white\`补充\`z-index\` 属性，使\`black\` 和 \`white\`产生层叠上下文 \`\`\`css .black{ position: absolute; z-index: 2; } .white{ position: absolute; top: 50px; left: 50px; z-index: 1; } \`\`\` ![](https://user-gold-cdn.xitu.io/2020/5/25/172496fc29361e6d?w=232&h=153&f=png&s=22524) ![](https://user-gold-cdn.xitu.io/2020/5/25/17249714f08ee676?w=200&h=125&f=png&s=35940)

虽然白猫的 `z-index` 值大于黑猫，但由于各自的父元素均为层叠上下文元素，因此白猫和黑猫归属于不同的上下文元素，无法直接比较，需要追溯各自父元素。

`black` 和 `white`处于元素的“根层叠上下文”中，`black` 的`z-index` 大于 `white`，因此`black`的后代元素`black.img`覆盖在`white`的后代元素`white.img`上，即黑猫覆盖白猫。

### 验证特性1

> 1. 层叠上下文的层叠水平要比普通元素高；

为了使两张图片重叠，设置`black`的宽高为0。

> 如果继续使用`position: absolute`来使图片重叠，就没法验证本条，因为依据**层叠顺序**， `z-index: 0` 或 `z-index: auto` 本身就比`inline`或`block`优先级高，体现不出层叠上下文元素比普通元素层叠水平高

html代码不变，css如下

```css
.black{
  width :0;
  height :0;
}
// markdown 编辑器可能会补充一些属性，导致黑猫无法显示，因此我们补充下面属性
.black img{
  width: 232px;
  height: 153px;
  max-width: inherit; 
}
```

 ![](https://user-gold-cdn.xitu.io/2020/5/25/172496fc29361e6d?w=232&h=153&f=png&s=22524) ![](https://user-gold-cdn.xitu.io/2020/5/25/17249714f08ee676?w=200&h=125&f=png&s=35940)

上面的示例中，白猫和黑猫都是普通元素，处于元素的“根层叠上下文”中，其中白猫在DOM流中处于后面，因此白猫在黑猫的上面。

下面我们使用css3中补充的创建上下文的条件来使`black`元素产生层叠上下文。

> 元素的`opacity`属性值不是`1`；

```css
.black{
  width :0;
  height :0;
  opacity: 0.9;
}
```

 ![](https://user-gold-cdn.xitu.io/2020/5/25/172496fc29361e6d?w=232&h=153&f=png&s=22524) ![](https://user-gold-cdn.xitu.io/2020/5/25/17249714f08ee676?w=200&h=125&f=png&s=35940) 现在，\`black\`元素是层叠上下文元素，其后代\`black.img\`的层叠水平大于普通元素，所以黑猫覆盖了白猫。如果你仔细看，还是可以看到黑色背景后面的白猫的。 \#\#\# 验证层叠顺序：z-index: auto &gt; inline/inline-block 上个示例提到， \`z-index: 0\` 或 \`z-index: auto\` 本身就比\`inline\`或\`block\`优先级高，我们来验证一下。整体css属性如下。 \`\`\`css .black img{ position: absolute; } \`\`\` 仅设置\`black.img\`为\`position: absolute;\`。不显式设置 \`z-index\` 数值时，浏览器会默认\`z-index: auto\`。 ![](https://user-gold-cdn.xitu.io/2020/5/25/172496fc29361e6d?w=232&h=153&f=png&s=22524) ![](https://user-gold-cdn.xitu.io/2020/5/25/17249714f08ee676?w=200&h=125&f=png&s=35940) 当前 \`black.img\` 和 \`white.img\` 都是普通元素\(\`z-index: auto\` 不会创建层叠上下文\)， 其父元素也是普通元素，因此两者处于元素的“根层叠上下文”中。元素无明显的层叠水平标示 \`z-index\`，依据层叠顺序，\`z-index: auto &gt; inline/inline-block\`，黑猫在上面。 &gt; 如果对白猫 \`white.img\` 追加\`position: absolute;\` 属性，\`black.img\` 和 \`white.img\` 就处于同一层叠水平，依据后来居上原则，白猫在上面。选中本示例在控制台中调试一下吧 \#\#\# 验证层叠顺序：\`z-index 层叠上下文元素的 \`background/border\` 在此之前，我们先验证另一个规则：block块级盒子 &gt; \`z-index ![](https://github.com/suilang/fe-started-to-buried/tree/ed00eee1987bb79b27b8d3552475570c018ac3ac/css/black.jpg) \`\`\` 给\`black\`设置背景色橙色， \`black.img\` 设置\`z-index: -1\` \`\`\`css .black{ background: orange; } .black img{ position: relative; z-index: -1; } \`\`\` ![](https://user-gold-cdn.xitu.io/2020/5/25/172496fc29361e6d?w=232&h=153&f=png&s=22524) 整个\`black\`元素都显示橙色，证明了块级元素的层叠水平比\`z-index: -1\` 高。 然后给\`black\`元素追加\`opacity: 0.9\`，使\`black\`产生层叠上下文。 \`\`\`css .black{ background: orange; opacity: 0.9; } .black img{ position: relative; z-index: -1; } \`\`\` ![](https://user-gold-cdn.xitu.io/2020/5/25/172496fc29361e6d?w=232&h=153&f=png&s=22524)

此时，图片出现在橙色背景之上，验证了`z-index < 0` &gt; 层叠上下文元素的 `background/border`。

## css3产生层叠上下文的规则

在CSS3中，元素属性满足以下条件之一，也会产生层叠上下文。

1. 父元素的display属性值为`flex|inline-flex`，子元素`z-index`属性值不为`auto`的时候，子元素为层叠上下文元素\(此时`z-index`会生效，不需要设置`position`\)；
2. 元素的`opacity`属性值不是`1`；
3. 元素的`transform`属性值不是`none`；
4. 元素`mix-blend-mode属性值不是`normal`；`
5. `元素的`filter`属性值不是`none`；`
6. `元素的`isolation`属性值是`isolate`；`
7. will-change`指定的属性值为上面任意一个；`
8. `元素的`-webkit-overflow-scrolling`属性值设置为`touch\`。

### 验证css3规则1

> 父元素的display属性值为`flex|inline-flex`，子元素`z-index`属性值不为`auto`的时候，子元素为层叠上下文元素\(此时`z-index`会生效，不需要设置`position`\)；

```markup
<div class="container">
  <div class="black">
    <img src="black.jpg"></img>  
  </div>
</div>
```

给`black`设置背景色橙色， `black.img` 设置`z-index: -1` 。

```css
.black{
  background: orange;
}
.black img{
  position: relative;
  z-index: -1;
}
```

使用规则1，补充css属性如下：

```css
.container{
  width: 300px;
  height: 200px;
  border: 1px solid grey;
  display: flex;
}
.black{
  background: orange;
  z-index:2; 
}
```

![](https://user-gold-cdn.xitu.io/2020/5/25/172496fc29361e6d?w=232&h=153&f=png&s=22524)

此时，图片出现在橙色背景之上，依据层叠顺序`z-index < 0` &gt; 层叠上下文元素的 `background/border`，反向推出此时`black`为层叠上下文元素。

## 白猫还你

现在，把白猫还给你，使用下面的示例在控制台验证一下各项规则和你的想法吧

> 嗯。。。chrome --&gt; 鼠标移动到示例上 --&gt; 右击 --&gt; 检查
>
>  ![](https://user-gold-cdn.xitu.io/2020/5/25/172496fc29361e6d?w=232&h=153&f=png&s=22524) ![](https://user-gold-cdn.xitu.io/2020/5/25/17249714f08ee676?w=200&h=125&f=png&s=35940)

