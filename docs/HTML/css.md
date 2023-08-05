# html 样式
CSS 可以通过以下方式添加到HTML中:

- 内联样式- 在HTML元素中使用"style" 属性
- 内部样式表 -在HTML文档头部 `<head>` 区域使用`<style>` 元素 来包含CSS
- 外部引用 - 使用外部 CSS 文件

最好的方式是通过外部引用CSS文件.

## 内联样式
当特殊的样式需要应用到个别元素时，就可以使用内联样式。 使用内联样式的方法是在相关的标签中使用样式属性。样式属性可以包含任何 CSS 属性。以下实例显示出如何改变段落的颜色和左外边距。

```html
<p style="color:blue;margin-left:20px;">这是一个段落。</p>
```

## 内部样式表
当单个文件需要特别样式时，就可以使用内部样式表。你可以在`<head>` 部分通过 `<style>`标签定义内部样式表:
```html
<head>
<style type="text/css">
    body {
            background-color:yellow;
        }
    p {
        color:blue;
    }
</style>
</head>
```

## 外部样式表
当样式需要被应用到很多页面的时候，外部样式表将是理想的选择。使用外部样式表，你就可以通过更改一个文件来改变整个站点的外观。
```html
<head>
<link rel="stylesheet" type="text/css" href="mystyle.css">
</head>
```
