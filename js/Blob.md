## Blob 是什么

Blob（Binary Large Object）表示二进制类型的大对象。在数据库管理系统中，将二进制数据存储为一个单一个体的集合。

Blob 对象表示一个不可变、原始数据的类文件对象。Blob 表示的不一定是JavaScript原生格式的数据。File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。

## 生成Blob

要从其他非blob对象和数据构造一个 Blob，需要使用 Blob() 构造函数。

Blob() 构造函数返回一个新的 Blob 对象。 blob的内容由参数数组中给出的值的串联组成。
### 语法：
```
var aBlob = new Blob( array, options );
```
### 参数
- array 是一个由ArrayBuffer, ArrayBufferView, Blob, DOMString 等对象构成的 Array ，或者其他类似对象的混合体，它将会被放进 Blob。DOMStrings会被编码为UTF-8。
- options 是一个可选的BlobPropertyBag字典，它会指定如下两个属性：
    - type，默认值为 ""，它代表了将会被放入到blob中的数组内容的MIME类型。
    - endings，用于指定包含行结束符\n的字符串如何被写入。 它是以下两个值中的一个：        
      - "native"，代表行结束符会被更改为适合宿主操作系统文件系统的换行符，或者         
      - "transparent"，默认值，代表会保持blob中保存的结束符不变 

使用字符串构造一个blob对象
```js
var debug = {hello: "world"};
var blob = new Blob([JSON.stringify(debug)], {type : 'application/json'});
```
生成的blob对象如下：
```js
Blob {
  size: 17
  type: "application/json"
  __proto__: Blob
}
```
Blob 对象含有两个属性：size 和 type。其中 size 属性用于表示数据的大小（以字节为单位），type 是 MIME 类型的字符串。

> MIME(Multipurpose Internet Mail Extensions)多用途互联网邮件扩展类型。是设定某种扩展名的文件用一种应用程序来打开的方式类型，当该扩展名文件被访问的时候，浏览器会自动使用指定应用程序来打开。多用于指定一些客户端自定义的文件名，以及一些媒体文件打开方式。

### 方法

#### slice()

Blob.slice() 方法用于创建一个包含源 Blob的指定字节范围内的数据的新 Blob 对象。

**语法**

```
var blob = instanceOfBlob.slice([start [, end [, contentType]]]};
```
**参数**
- start 可选
    表示被会被拷贝进新的 Blob 的字节的起始位置。如果传入的是一个负数，那么这个偏移量将会从数据的末尾从后到前开始计算。举例来说, -10 将会是  Blob 的倒数第十个字节。它的默认值是0， 如果你传入的start的长度大于源 Blob 的长度，那么返回的将会是一个长度为0并且不包含任何数据的一个 Blob 对象。
- end 可选
    end-1的对应的字节将会是被拷贝进新的Blob 的最后一个字节。如果传入了一个负数，那么这个偏移量将会从数据的末尾从后到前开始计算。举例来说， -10 将会是 Blob 的倒数第十个字节。它的默认值就是它的原始长度(size).
- contentType 可选
    给新的 Blob 赋予一个新的文档类型。这将会把它的 type 属性设为被传入的值。它的默认值是一个空的字符串。

#### stream()

返回一个ReadableStream对象，读取它将返回包含在Blob中的数据。
```
var stream = blob.stream();
```
#### text()
返回一个 Promise 对象且包含 blob 所有内容的 UTF-8 格式的 USVString。
> Unicode 标量值（ Unicode scalar values ）：字符的代号。

在JavaScript中返回时， USVString 映射到 String 。它通常仅用于执行文本处理的 API，需要一串 unicode 标量值才能进行操作。

#### arrayBuffer()
返回一个 Promise 对象且包含 blob 所有内容的二进制格式的 ArrayBuffer。

> FileReader.readAsArrayBuffer() 这个方法与之类似，但 arrayBuffer() 返回一个 promise 对象，而不是像 FileReader 一样返回一个基于事件的 API。

## Blob 使用场景

### 分片上传

File 对象是特殊类型的 Blob，可以用在任意的 Blob 类型的上下文中。  

针对大文件传输的场景，我们可以使用 slice 方法对大文件进行切割，然后分片进行上传。

### 存储下载数据

从互联网上下载的数据可以存储到 Blob 对象中。  
例如，在一些需要鉴权的图片接口中，我们可以使用fetch的方式，将鉴权信息附在请求里，下载得到blob对象，然后使用下面的方法，将blob作为url使用。或者在前端直接通过构建Blob对象进行前端文件下载。
```
axios.get('https://xxxxxx', {responseType: 'blob'})
.then(res => {
    let url = URL.createObjectURL(res.data)
    let a = document.createElement('a')
    a.setAttribute('download', '图片')
    a.href = url
    a.click()
})
```

#### Blob 用作 URL

Blob 可以很容易的作为 <a>、<img> 或其他标签的 URL。Blob URL/Object URL 是一种伪协议，允许 Blob 和 File 对象用作图像，下载二进制数据链接等的 URL 源。

在浏览器中，我们使用 URL.createObjectURL 方法来创建 Blob URL，该方法接收一个 Blob 对象，并为其创建一个唯一的 URL。这个 URL 的生命周期和创建它的窗口中的 document 绑定。这个新的URL 对象表示指定的 File 对象或 Blob 对象。相当于这个方法创建了一个传入对象的内存引用地址

其形式为 blob:<origin>/<uuid>，在`chrome`中生成对应的示例如下：  
```
"blob:chrome-extension://lecdifefmmfjnjjinhaennhdlmcaeeeb/0f36aeda-9351-4e38-9379-93efc9360f6b"
```

**示例**

将页面中的配置信息下载下来供用户方便使用。
```
const config = {
  name: 'lsqy',
  password: 'yourpassword',
  ak: 'XXXXXXXXXX',
  sk: 'XXXXXXXXXX'
}

// 生成blob对象
const blobContent = new Blob(
  [JSON.stringify(config, null, 2)],
  {type : 'application/json'}
);
// 构建下载链接
const blobUrl = window.URL.createObjectURL(blobContent)

const link = document.createElement('a')
link.download = filename
link.href = blobUrl
// 触发点击
link.click()
```

> 当你结束使用某个 URL 对象之后，应该通过调用`URL.revokeObjectURL()`这个方法来让浏览器知道不用在内存中继续保留对这个文件的引用了。

如果你拿到了一个blobURL，想要重新转成blob，只能将此url当作下载链接重新下载
```
axios.get('blob:XXX', {responseType: 'blob'})
.then(res => {
    // use res.data
})
```

#### Blob 转换为 Base64

Base64 是一种基于 64 个可打印字符来表示二进制数据的表示方法，它常用于在处理文本数据的场合，表示、传输、存储一些二进制数据，包括 MIME 的电子邮件及 XML 的一些复杂数据。

绝大多数现代浏览器都支持一种名为 Data URLs 的特性，允许使用 base64 对图片或其他文件的二进制数据进行编码，将其作为文本字符串嵌入网页中。

Data URLs 由四个部分组成：前缀（data:）、指示数据类型的 MIME 类型、如果非文本则为可选的 base64 标记、数据本身：
```
data:[<mediatype>][;base64],<data>
```

mediatype 是个 MIME 类型的字符串，例如 "image/jpeg" 表示 JPEG 图像文件。如果被省略，则默认值为 text/plain;charset=US-ASCII。

如果数据是文本类型，你可以直接将文本嵌入（根据文档类型，使用合适的实体字符或转义字符）。如果是二进制数据，你可以将数据进行 base64 编码之后再进行嵌入。比如嵌入一张图片：
```
<img alt="logo" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...">
```
在编写 HTML 网页时，对于一些简单图片，通常会选择将图片内容直接内嵌在网页中，从而减少不必要的网络请求，如果你使用[webpack](https://juejin.im/post/5ee0e6e0e51d4510a178a3eb)打包的话，可以启用 `file-loader` 和 `url-loader`，配置小于某个大小的图片使用`Data URL`潜入到网页中。


使用base64还可以实现上传图片时的本地预览功能
```
readBlob(event) {
    const self = this;
    const reader = new FileReader();
    reader.onload = function () {
      const base64 = this.result;
   		// todo 这里将base64赋值给 img 标签的 src，用于本地预览
   		// img.src = base64
   		
     self.uploadImage(base64); // 上传base64数据到服务器
    };
    reader.readAsDataURL(event.target.files[0]);
  }

```
对于 FileReader 对象来说，除了支持把 Blob/File 对象转换为 Data URL 之外，它还提供了 readAsArrayBuffer() 和 readAsText() 方法，用于把 Blob/File 对象转换为其它的数据格式。

## Blob 与 ArrayBuffer

- Blob和ArrayBuffer都能存储二进制数据。Blob相对而言储存的二进制数据大（如File文件对象）。
- ArrayBuffer对象表示原始的二进制数据缓冲区，即在内存中分配指定大小的二进制缓冲区（容器），用于存储各种类型化数组的数据，是最基础的原始数据容器，无法直接读取或写入， 需要通过具体视图来读取或写入，即TypedArray对象或DataView对象对内存大小进行读取或写入；Blob对象表示一个不可变、原始数据的类文件对象。
- ArrayBuffer 是存在内存中的，可以直接操作。而 Blob 可以位于磁盘、高速缓存内存和其他不可用的位置。
- 
- 可以相互转换。
**Blob => ArrayBuffer**
```
let blob = new Blob([1,2,3,4])
let reader = new FileReader();
reader.onload = function(result) {
    console.log(result);
}
reader.readAsArrayBuffer(blob);
```
**ArrayBuffer => Blob**

```
let blob = new Blob([buffer])
```

## blob与复制粘贴

**粘贴**
有时会遇到 在输入框拦截图片进行上传的场景，这时候就是监听paste事件，并获取剪切板内的文件
```
handlePaste (e) {
  if (this.paste) {
    this.uploadFiles(e.clipboardData.files);
  }
}
```
我们拿到的files就是基于blob的file类型。你可以使用`FileReader`的所有方法将blib变成你想要的样子

**复制**
有时候我们需要点击按钮或右键菜单触发一个复制事件，将文本或图片扔进剪切板里。这时候我们也需要生成一个blob对象
如果是文本对象

```
"text/html": new Blob(["<i>Markup</i> <b>text</b>. Paste me into a rich text editor."], { type: "text/html" }),
"text/plain": new Blob(["Fallback markup text. Paste me into a rich text editor."], { type: "text/plain" })
```
如果是图片等文件类型数据，就需要自己fetch请求下载图片为blob，然后扔到剪切板里
```
 new ClipboardItem({
      [blob.type]: blob
    })
```

参考文档

1. [你不知道的 Blob](https://juejin.im/post/5ed604aaf265da770e1bcc18?utm_source=gold_browser_extension)
2. [前端通过Blob实现文件下载](https://www.cnblogs.com/lsqy/p/11447528.html)
3. [MDN | Blob](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob)