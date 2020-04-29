# clone：你是浅还是深

数据分为基本数据类型\(String, Number, Boolean, Null, Undefined，Symbol\)和对象数据类型。

1、基本数据类型的特点：直接存储在栈\(stack\)中的数据

2、引用数据类型的特点：**存储的是该对象在栈中引用，真实的数据存放在堆内存里**

**相信这两句大家都很熟悉，但是，这种描述并不严谨，所以补充如下描述：**

1、基本数据类型：变量对应的是一个值

2、引用数据类型：**变量对应的是一个地址，地址指向堆内存中的某个对象，**

> 请注意，基本数据类型不是全存在栈中，只有直接声明的变量才会在栈中。
>
> 基本类型如果是全局的，也放在堆上。位于引用类型内的基本类型，也是放在堆上。

浅拷贝是按位拷贝对象，它会创建一个新对象，这个对象有着原始对象属性值的一份拷贝。如果属性是基本类型，拷贝的就是基本类型的值；如果属性是内存地址（引用类型），拷贝的就是内存地址 ，因此如果原始对象中的某个引用属性改变了指针所指向的对象的属性，就会影响到另一个对象。

上图说话：

![](../.gitbook/assets/image%20%282%29.png)

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

#### 浅拷贝的实现方式

* `Object.assign()`  ****

  `Object.assign({}, origin)` 

* spread展开 ，适用于对象或数组

  `copyObj = { ...originObj };`

  `copyArr = [ ...originArr ];`

* `for ... in` 或 `for ... of`

简单来讲，深拷贝与浅拷贝唯一的区别在于，如果原始对象中包含引用类型的属性，则会对该属性所对应的对象再次进行浅拷贝。最终，原始对象与拷贝对象就没有任何关联了，就像执行了文件的复制粘贴一样，对源文件的任何操作都不会影响拷贝对象。

上图说话

![](../.gitbook/assets/image%20%283%29.png)

深拷贝实现方式

* `JSON.parse(JSON.stringify(obj))`通过**JSON的2次转换**深拷贝obj，不过无法拷贝**undefined**与**symbol**属性，无法拷贝**循环引用**对象
* 使用第三方工具库库
* 自己实现一个深拷贝函数

理论上，我们只需要实现一个完整的浅拷贝，再加上一个递归调用就可以实现深拷贝，nice～

```javascript
//使用递归的方式进行拷贝， 引入map存储已经拷贝过的对象，防止循环引用
function deepClone(source, map = new Map()) {
  // 基本数据类型直接返回值
  if (typeof source !== 'object' || source === null) {
    return source;
  }
  // 若已经clone，则直接返回clone的对象
  if (s = map.get(source)) {
    return s;
  }
  // 生成clone对象
  const clone = Array.isArray(source) ? [] : {};

  // 递归调用
  for (const key of Object.keys(source)) {
    clone[key] = deepClone(source[key], map);
  }
  // 存储已clone的对象，防止循环引用
  map.set(source, clone);
  return clone;
}

```

> 建议自己手敲一遍，要不我的知识还是我的，到不了你的脑子里～

下面的看看就好了

```javascript
//补充处理 Map、Set 和 Symbol 类型
function deepClonePlus(source, map = new Map()) {
  if (typeof source !== 'object' || source === null) {
    return source;
  }
  if (s = map.get(source)) {
    return s;
  }
  const clone = Array.isArray(source) ? [] : {};
  const allKeys = Reflect.ownKeys(source);

  for (const key of allKeys) {
    const value = a[key];
    const type = Object.prototype.toString.call(value);
    switch (type) {
      case '[object Object]':
      case '[object Array]': clone[key] = deepClone(source[key], map); break;
      case '[object Set]':
        const set = new Set();
        value.forEach(v => set.add(deepClonePlus(v, map)));
        clone[key] = set;
        break;
      case '[object Map]':
        const temoMap = new Map();
        value.forEach((v, i) => temoMap.set(i, deepClonePlus(v, map)));
        clone[key] = temoMap;
        break;
      case '[object Symbol]':
        clone[key] = Object(Symbol.prototype.valueOf.call(value)); break;
      default:
        clone[key] = new value.constructor(value); break;
    }
  }
  map.set(source, clone);
  return clone;
}
```

> 如果你收获了新知识，请给作者点个赞吧～



