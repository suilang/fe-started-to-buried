# Untitled

数据分为基本数据类型\(String, Number, Boolean, Null, Undefined，Symbol\)和对象数据类型。

1、基本数据类型：变量对应的是一个值

2、引用数据类型：**变量对应的是一个地址，地址指向堆内存中的某个对象，**

> 请注意，基本数据类型不是全存在栈中，只有直接声明的变量才会在栈中。
>
> 基本类型如果是全局的，也放在堆上。位于引用类型内的基本类型，也是放在堆上。

浅拷贝是按位拷贝对象，它会创建一个新对象，这个对象有着原始对象属性值的一份拷贝。如果属性是基本类型，拷贝的就是基本类型的值；如果属性是内存地址（引用类型），拷贝的就是内存地址 ，因此如果原始对象中的某个引用属性改变了指针所指向的对象的属性，就会影响到另一个对象。

上图说话：

![](.gitbook/assets/image%20%282%29.png)

```javascript
// 定义引用类型 refObj1
const refObj1 = [1, 2, 3];

// 定义原始对象
const SourceObj = {
    field1: 'source',
    refObj1,
}

// 执行浅拷贝操作， 获得 CopiedObj
const CopiedObj = {...SourceObj}; // 浅拷贝方法下面会具体介绍

// 打印拷贝对象数据
CopiedObj.field1; // 'source'
CopiedObj.refObj1; // [1, 2, 3];

// 改变原始对象
SourceObj.field1 = 'no source';
SourceObj.refObj1[0] = 999;

// 打印拷贝对象数据
CopiedObj.field1; // 'source' 未受影响
CopiedObj.refObj1; // [999, 2, 3]; 受到影响
```

上面的代码可以复制到浏览器控制台执行一遍，这样你会更加清晰一些。

如上代码所示，浅拷贝创建了一个新的对象，并新建两个属性，将原始对象中队形属性的值完整的复制过来，包括field1中存储的基本类型的值，和refObj1中存储的一个数组的地址。

因此，虽然存在两个变量 `SourceObj.refObj1` 和 `CopiedObj.refObj1` ，但只存在一个数组对象。



