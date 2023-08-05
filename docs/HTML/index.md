# 简介
一个简单的页面如下

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>菜鸟教程(runoob.com)</title>
    </head>
    <body>
        <h1>我的第一个标题</h1>
        <p>我的第一个段落。</p>
    </body>
</html>
```

- `<!DOCTYPE html>` 声明为 HTML5 文档
- `<html>` 元素是 HTML 页面的根元素
- `<head>` 元素包含了文档的元（meta）数据，如 `<meta charset="utf-8">` 定义网页编码格式为 utf-8。
- `<title>`元素描述了文档的标题
- `<body>` 元素包含了可见的页面内容
- `<h1>` 元素定义一个大标题
- `<p>` 元素定义一个段落

## HTML 标签
HTML 标记标签通常被称为 HTML 标签 (HTML tag)。

HTML 标签是由尖括号包围的关键词，比如 `<html>`
HTML 标签通常是成对出现的，比如 `<b>` 和 `</b>`
标签对中的第一个标签是开始标签，第二个标签是结束标签
开始和结束标签也被称为开放标签和闭合标签
```html
<标签>内容</标签>
```


## HTML 元素语法
1. HTML 元素以开始标签起始, 以结束标签终止
2. 元素的内容是开始标签与结束标签之间的内容
3. 某些 HTML 元素具有空内容（empty content）
4. 空元素在开始标签中进行关闭（以开始标签的结束而结束）
5. 大多数 HTML 元素可拥有属性

### 嵌套的 HTML 元素
大多数 HTML 元素可以嵌套（HTML 元素可以包含其他 HTML 元素）。

HTML 文档由相互嵌套的 HTML 元素构成。

### HTML 空元素

没有内容的 HTML 元素被称为空元素。空元素是在开始标签中关闭的。

`<br>` 就是没有关闭标签的空元素（`<br>` 标签定义换行）。

在 XHTML、XML 以及未来版本的 HTML 中，所有元素都必须被关闭。

在开始标签中添加斜杠，比如 `<br />`，是关闭空元素的正确方法，HTML、XHTML 和 XML 都接受这种方式。

### 使用小写标签
HTML 标签对大小写不敏感：`<P>` 等同于 `<p>`。万维网联盟（W3C）在 HTML 4 中推荐使用小写

## HTML 属性
HTML 元素可以设置属性
属性可以在元素中添加附加信息
属性一般描述于开始标签
属性总是以名称/值对的形式出现，比如：name="value"。

```html
<a href="http://www.runoob.com">这是一个链接</a>
```

### 使用小写属性
属性和属性值对大小写不敏感。不过，万维网联盟在其 HTML 4 推荐标准中推荐小写的属性/属性值。

[HTML 全局属性](https://www.runoob.com/tags/ref-standardattributes.html)
|属性|描述|
|---|---|
| class |	为html元素定义一个或多个类名（classname）(类名从样式文件引入) |
| id	| 定义元素的唯一id |
| style |	规定元素的行内样式（inline style）|
| title |	描述了元素的额外信息 (作为工具条使用) |

## URL

URL 是一个网页地址。

URL可以由字母组成，如"runoob.com"，或互联网协议（IP）地址： 192.68.20.50。大多数人进入网站使用网站域名来访问，因为 名字比数字更容易记住。

`scheme://host.domain:port/path/filename`


- scheme - 定义因特网服务的类型。最常见的类型是 http
- host - 定义域主机（http 的默认主机是 www）
- domain - 定义因特网域名，比如 runoob.com
- :port - 定义主机上的端口号（http 的默认端口号是 80）
- path - 定义服务器上的路径（如果省略，则文档必须位于网站的根目录中）。
- filename - 定义文档/资源的名称


### 字符编码
URL 只能使用 ASCII 字符集.由于 URL 常常会包含 ASCII 集合之外的字符，URL 必须转换为有效的 ASCII 格式。

- URL 编码使用 "%" 其后跟随两位的十六进制数来替换非 ASCII 字符。
- URL 不能包含空格。URL 编码通常使用 + 来替换空格。


