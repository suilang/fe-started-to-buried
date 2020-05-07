# html 语义化

### 什么是语义元素？

语义元素可以清楚地向浏览器和开发者描述其意义。即元素本身传达了关于标签所包含内容类型的一些信息。例如，当浏览器解析到标签时，它将该标签解释为包含这一块内容的最重要的标题。

_非语义_元素：&lt;div&gt; 和 &lt;span&gt; - 无法提供关于其内容的信息。

_语义_元素：&lt;form&gt;、&lt;table&gt; 以及 &lt;img&gt; - 清晰地定义其内容。

### 为什么要语义化？

1. 页面结构: 使页面没有css的情况下，也能够呈现出很好的内容结构
2. 有利于SEO: 爬虫依赖标签来确定关键字的权重，因此可以帮助爬虫抓取更多的有效信息 
3. 提升用户体验： 例如title、alt可以用于解释名称或者解释图片信息，以及label标签的灵活运用。 
4. 便于团队开发和维护: 语义化使得代码更具有可读性，让其他开发人员更加理解你的html结构，减少差异化。 
5. 方便其他设备解析: 如屏幕阅读器、盲人阅读器、移动设备等，以有意义的方式来渲染网页。

大约有100多个[HTML语义元素](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element)可供选择。

常用的语义元素如下：

<table>
  <thead>
    <tr>
      <th style="text-align:left"><b>&#x7ED3;&#x6784;&#x4F53;</b>
      </th>
      <th style="text-align:left"><b>&#x6587;&#x672C;</b>
      </th>
      <th style="text-align:left"><b>&#x4E00;&#x81F4;</b>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="text-align:left">
        <p></p>
        <ul>
          <li>h1</li>
          <li>h2</li>
          <li>h3</li>
        </ul>
        <p></p>
      </td>
      <td style="text-align:left">
        <p></p>
        <ul>
          <li>p</li>
          <li>ul</li>
          <li>ol</li>
          <li>li</li>
          <li>blockquote</li>
        </ul>
      </td>
      <td style="text-align:left">
        <p></p>
        <ul>
          <li>a</li>
          <li>strong</li>
          <li>em</li>
          <li>q</li>
          <li>abbr</li>
          <li>small</li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>### HTML5 中新的语义元素

许多网站包含了指示导航、页眉以及页脚的 HTML 代码，例如这些：&lt;div id="nav"&gt; &lt;div class="header"&gt; &lt;div id="footer"&gt;。

如果使用 HTML4 的话，开发者会使用他们喜爱的属性名来设置页面元素的样式：

header, top, bottom, footer, menu, navigation, main, container, content, article, sidebar, topnav, ...

如此，浏览器便无法识别正确的网页内容。

HTML5 提供了定义页面不同部分的新语义元素：

| 标签 | 描述 |
| :--- | :--- |
| &lt;article&gt; | 定义文章。 |
| &lt;aside&gt; | 定义页面内容以外的内容。 |
| &lt;details&gt; | 定义用户能够查看或隐藏的额外细节。 |
| &lt;figcaption&gt; | 定义 &lt;figure&gt; 元素的标题。 |
| &lt;figure&gt; | 规定自包含内容，比如图示、图表、照片、代码清单等。 |
| &lt;footer&gt; | 定义文档或节的页脚。 |
| &lt;header&gt; | 规定文档或节的页眉。 |
| &lt;main&gt; | 规定文档的主内容。 |
| &lt;mark&gt; | 定义重要的或强调的文本。 |
| &lt;nav&gt; | 定义导航链接。 |
| &lt;section&gt; | 定义文档中的节。 |
| &lt;summary&gt; | 定义 &lt;details&gt; 元素的可见标题。 |
| &lt;time&gt; | 定义日期/时间。 |

![](../.gitbook/assets/image%20%284%29.png)

### &lt;article&gt; 元素

&lt;article&gt; 元素定义页面独立的内容，它可以有自己的header、footer、sections等，专注于单个主题的博客文章，报纸文章或网页文章。article可以嵌套article，只要里面的article与外面的是部分与整体的关系。

#### 实例

```text
<article>
   <h1>What Does WWF Do?</h1>
   <p>WWF's mission is to stop the degradation of our planet's natural environment,
  and build a future in which humans live in harmony with nature.</p>
</article> 
```

###  &lt;section&gt; 元素

&lt;section&gt; 元素定义文档中的节。

根据 W3C 的 HTML 文献：“节（section）是有主题的内容组，通常具有标题”。

可以将网站首页划分为简介、内容、联系信息等节。

#### 实例

```text
<section>
   <h1>WWF</h1>
   <p>The World Wide Fund for Nature (WWF) is....</p>
</section> 
```



### &lt;header&gt; 元素

&lt;header&gt; 元素为文档或节规定页眉。

&lt;header&gt; 元素应该被用作介绍性内容的容器。用于定义页面的介绍展示区域，通常包括网站logo、主导航、全站链接以及搜索框。也适合对页面内部一组介绍性或导航性内容进行标记。

一个文档中可以有多个 &lt;header&gt; 元素。

下例为一篇文章定义了页眉：

#### 实例

```text
<article>
   <header>
     <h1>What Does WWF Do?</h1>
     <p>WWF's mission:</p>
   </header>
   <p>WWF's mission is to stop the degradation of our planet's natural environment,
  and build a future in which humans live in harmony with nature.</p>
</article> 
```



### &lt;footer&gt; 元素

&lt;footer&gt; 元素为文档或节规定页脚。

&lt;footer&gt; 元素应该提供有关其包含元素的信息。

页脚通常包含文档的作者、版权信息、使用条款链接、联系信息等等。

您可以在一个文档中使用多个 &lt;footer&gt; 元素。

#### 实例

```text
<footer>
   <p>Posted by: Hege Refsnes</p>
   <p>Contact information: <a href="mailto:someone@example.com">
  someone@example.com</a>.</p>
</footer> 
```



###  &lt;nav&gt; 元素

&lt;nav&gt; 元素定义导航链接集合。

&lt;nav&gt; 元素旨在定义大型的导航链接块。不过，并非文档中所有链接都应该位于 &lt;nav&gt; 元素中！

#### 实例

```text
<nav>
<a href="/html/">HTML</a> |
<a href="/css/">CSS</a> |
<a href="/js/">JavaScript</a> |
<a href="/jquery/">jQuery</a>
</nav> 
```

### &lt;aside&gt; 元素

&lt;aside&gt; 元素页面主内容之外的某些内容（比如侧栏）。

aside 内容应该与周围内容相关。

#### 实例

```text
<p>My family and I visited The Epcot center this summer.</p>

<aside>
   <h4>Epcot Center</h4>
   <p>The Epcot Center is a theme park in Disney World, Florida.</p>
</aside> 
```

###  &lt;figure&gt; 和 &lt;figcaption&gt; 元素

在书籍和报纸中，与图片搭配的标题很常见。

标题（caption）的作用是为图片添加可见的解释。

通过 HTML5，图片和标题能够被组合在 _&lt;figure&gt;_ 元素中：

#### 实例

```text
<figure>
   <img src="pic_mountain.jpg" alt="The Pulpit Rock" width="304" height="228">
   <figcaption>Fig1. - The Pulpit Pock, Norway.</figcaption>
</figure> 
```



其他语义化元素：

###  **&lt;blockquote&gt;**元素

定义块引用，浏览器会在 blockquote 元素前后添加换行，并增加外边距。cite属性可用来规定引用的来源

```text
<blockquote cite="https://en.wikiquote.org/wiki/Marie_Curie">
    Here is a long quotation here is a long quotation here is a long quotation
    here is a long quotation here is a long quotation here is a long quotation
    here is a long quotation here is a long quotation here is a long quotation.
</blockquote>
```

###  **&lt;abbr&gt;元素**

解释缩写词。使用title属性可提供全称，只在第一次出现时使用即可。

```text
The <abbr title="People's Republic of China">PRC</abbr> was founded in 1949.
```







参考文档：

> html语义元素：[https://www.w3school.com.cn/html/html5\_semantic\_elements.asp](https://www.w3school.com.cn/html/html5_semantic_elements.asp)
>
> html语义化标签： [https://blog.csdn.net/qq\_38128179/java/article/details/80811339](https://blog.csdn.net/qq_38128179/java/article/details/80811339)

