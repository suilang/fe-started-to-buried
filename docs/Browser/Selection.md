# 浏览器光标及选区

在使用 `Input` 或 `Textarea` 的场景中，经常需要获取光标的位置或选择范围，以及设置光标的位置或选择范围。

## 获取光标位置

光标位置分为两种，数据层面的 `Range`，处于屏幕中的实际位置的 `Position`。我们先来说一下 `Range`。

`Range`对象表示页面上的一个连续的文本范围或者一个节点范围。它包含了起始节点和结束节点，以及这两个节点之间的文本内容。

`Range`对象的数据结构如下所示：

```typescript
{
    startContainer: Node, // 范围的起始节点
    startOffset: number, // 范围在起始节点中的偏移量
    endContainer: Node, // 范围的结束节点
    endOffset: number, // 范围在结束节点中的偏移量
    commonAncestorContainer: Node // 范围的公共祖先节点
}
```

其中，`startContainer` 和 `endContainer` 表示范围的起始节点和结束节点，可以是文本节点、元素节点等。`startOffset` 和` endOffset` 表示范围在起始节点和结束节点中的偏移量，即范围的起始位置和结束位置。`commonAncestorContainer` 表示范围的公共祖先节点，即起始节点和结束节点的最近共同父节点。

通过这些属性，可以对 `Range` 进行进一步的操作和处理，例如获取范围内的文本内容、插入新的节点等。

### 获取 Range

获取 `Range` 可以通过如下方法

```js
let selection = window.getSelection();
// 或者使用 let selection = document.getSelection();
if (selection.rangeCount > 0) {
  let range = selection.getRangeAt(0);
  // other code
}
```

### 获取选中的文本

```js
let range = selection.getRangeAt(0);
let textContent = range.toString();
console.log(textContent);
```

### 获取光标或选区位置

有时候我们希望获取光标或选区在屏幕中的位置，来做一些定位或特殊处理，可以在得到 Range 后，调用`getBoundingClientRect`来获取定位。

定位信息`rect`包含光标或选区在屏幕中的绝对定位。

```js
let range = selection.getRangeAt(0);
let rect = range.getBoundingClientRect();
console.log(rect);
```

如果我们希望能相对某个父元素进行定位，则同步调用父元素的`dom.getBoundingClientRect`，得到`rect2`，将两个值对应的定位信息相减，就能得到相对位置。

## 通过点击位置获取 Range

有时候我们可能希望通过点击位置获取一下点击后光标的位置。有两种方法可以实现。

1. 遍历点击位置的元素，逐个查找哪个位置离点击位置最近。这里不详细讲解。

2. 通过浏览器自带能力

当我们点击一个位置，在对应的 event 中，我们可以获取到点击位置的`{x, y}`，此时可以调用下面的脚本，来获取`Range`。

```js
if (document.caretRangeFromPoint) {
  domRange = document.caretRangeFromPoint(x, y);
} else {
  // @ts-ignore
  const position = document.caretPositionFromPoint(x, y);

  if (position) {
    domRange = document.createRange();
    domRange.setStart(position.offsetNode, position.offset);
    domRange.setEnd(position.offsetNode, position.offset);
  }
}
```

## 设置光标或选区

如果是`<input>`和`<textarea>`等可编辑元素，可以直接使用`setSelectionRange`。

```js
let inputElement = document.getElementById('inputId');
let position = inputElement.value.length - 1; // 倒数第二个位置
inputElement.setSelectionRange(position, position);
```

如果不是`<input>`或`<textarea>`等可编辑元素，可以使用`document.createRange()`方法来创建一个`Range`对象，然后使用`range.setStart()`和`range.setEnd()`方法来设置选区的起始和结束位置。最后，使用`window.getSelection()`方法获取当前的选区对象，并使用`selection.removeAllRanges()`方法清除之前的选区，再使用`selection.addRange()`方法将创建的`Range`对象添加到选区中，从而使选区生效。

```js
// 创建 Range 对象
let range = document.createRange();

// 设置 Range 对象的起始和结束位置
let startNode = document.getElementById('startNode');
let endNode = document.getElementById('endNode');
range.setStart(startNode, 0); // 设置起始位置，此处假设起始位置是节点的第一个字符
range.setEnd(endNode, 1); // 设置结束位置，此处假设结束位置是节点的第二个字符

// 获取当前的选区对象并添加 Range 对象
let selection = window.getSelection();
selection.removeAllRanges(); // 清除之前的选区
selection.addRange(range);
```
