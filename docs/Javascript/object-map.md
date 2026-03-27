# Object 和 Map 的区别

## 前言

本文整理了 Object 和 Map 两种数据结构的区别，以及 Map 的时间复杂度分析，帮助理解在面试中常见的问题。

## 一、Object

### 1.1 定义

Object 是 JavaScript 的一种数据类型，用于存储各种键值集合和更复杂的实体。可以通过 `Object()` 构造函数或者使用对象字面量的方式创建对象。

```javascript
const obj = new Object() // 得到一个空对象 {}
const obj2 = {} // 得到一个空对象 {}
```

### 1.2 特点

- 以键值对的形式存储数据
- 键（key）必须是 String 类型或 Symbol 类型，其他类型会自动转换成 String 类型
- 属性值可以是任何类型的数据，包括基本类型、对象类型和函数类型

### 1.3 Object 方法

#### 静态方法

| 方法 | 说明 |
|------|------|
| `Object.assign()` | 将一个或多个源对象的所有可枚举自有属性的值复制到目标对象中 |
| `Object.create()` | 使用指定的原型对象和属性创建一个新对象 |
| `Object.defineProperties()` | 向对象添加多个由给定描述符描述的命名属性 |
| `Object.defineProperty()` | 向对象添加一个由给定描述符描述的命名属性 |
| `Object.entries()` | 返回包含给定对象自有可枚举字符串属性的所有 `[key, value]` 数组 |
| `Object.freeze()` | 冻结一个对象，其他代码不能删除或更改其任何属性 |
| `Object.fromEntries()` | 从一个包含 `[key, value]` 对的可迭代对象中返回一个新的对象 |
| `Object.keys()` | 返回一个包含所有给定对象自有可枚举字符串属性名称的数组 |
| `Object.values()` | 返回包含给定对象所有自有可枚举字符串属性的值的数组 |
| `Object.hasOwn()` | 如果指定属性是指定对象的自有属性，则返回 `true` |

#### 实例方法

| 方法 | 说明 |
|------|------|
| `Object.prototype.hasOwnProperty()` | 返回一个布尔值，表示对象自身是否包含指定的属性 |
| `Object.prototype.isPrototypeOf()` | 返回一个布尔值，表示该方法所调用的对象是否在指定对象的原型链中 |
| `Object.prototype.propertyIsEnumerable()` | 返回一个布尔值，指示指定属性是否是对象的可枚举自有属性 |
| `Object.prototype.toString()` | 返回一个代表该对象的字符串 |
| `Object.prototype.valueOf()` | 返回指定对象的基本类型值 |

### 1.4 删除键值对

Object 中并没有提供方法删除键值对，需要使用 `delete` 运算符：

```javascript
let obj = {
    name: '张三',
    age: '100'
}
delete obj.name // true
// 或者
delete obj['name'] // true
console.log(obj) // {age: 100}
```

## 二、Map

### 2.1 定义

Map 也是以键值对形式存储数据的，它的键（key）可以是任意类型，是一种更加完善的 Hash 结构实现。创建 Map 结构通常使用 `new Map()` 来实现。

```javascript
const map = new Map()
map.set(1, 2)
console.log(map) // Map(1) {1 => 2}
map.get(1) // 2
map.has(1) // 查看是否有该键值 true
```

### 2.2 注意事项

设置对象属性同样适用于 Map 对象，但容易造成困扰，因此并不推荐这样做：

```javascript
const map = new Map()
map['a'] = 1
console.log(map) // Map(0) {a: 1, size: 0}
map.get('a') // undefined
map.has('a') // false
```

这种设置属性的方式不会改变 Map 的数据结构，它使用的是通用对象的特性。`'a'` 的值未被存储在 Map 中，无法被查询到，因此 Map 的 size 属性是 0。

### 2.3 Map 键的唯一性

Map 的键（key）具有**唯一性**，确定后再次创建会覆盖。Map 的键实际上是跟内存地址绑定的，只要内存地址不一样，就视为两个键：

```javascript
const map = new Map();
// 使用数组作为 Key，获取值时返回 undefined
// 因为这是一个引用数据类型，设置的和获取的并不是同一个引用地址
map.set(['a'], 555);
map.get(['a']) // undefined

const k1 = ['a'];
const k2 = ['a'];
map.set(k1, 111).set(k2, 222);
map.get(k1) // 111
map.get(k2) // 222
```

### 2.4 将 NaN 作为 Map 的键

NaN 也可以作为键。虽然 NaN 与任何值甚至与自己都不相等（`NaN !== NaN` 返回 true），但是因为所有的 NaN 的值都是无法区分的：

```javascript
const map = new Map()
map.set(NaN, "not a number")
map.get(NaN) // "not a number"
const otherNaN = Number("foo") // NaN
map.get(otherNaN) // "not a number"
```

### 2.5 Map 的迭代

由于 Map 内置有迭代器 iterator，因此可以使用 `forEach` 和 `for of` 实现迭代，迭代的顺序按插入的顺序进行。

### 2.6 Map 的方法

| 方法 | 说明 |
|------|------|
| `Map.prototype.clear()` | 移除 Map 对象中所有的键值对 |
| `Map.prototype.delete()` | 移除 Map 对象中指定的键值对 |
| `Map.prototype.entries()` | 返回一个新的迭代器对象，包含 Map 对象中所有键值对 `[key, value]` |
| `Map.prototype.forEach()` | 以插入顺序为 Map 对象中的每个键值对调用一次 callbackFn |
| `Map.prototype.get()` | 返回与指定的键 key 关联的值，若不存在则返回 `undefined` |
| `Map.prototype.has()` | 返回一个布尔值，用来表明 Map 对象中是否存在与指定的键 key 关联的值 |
| `Map.prototype.keys()` | 返回一个新的迭代器对象，包含 Map 对象中所有元素的键 |
| `Map.prototype.set()` | 在 Map 对象中设置与指定的键 key 关联的值，并返回 Map 对象 |
| `Map.prototype.values()` | 返回一个新的迭代对象，包含 Map 对象中所有的值 |

## 三、Object 和 Map 的区别

| 区别点 | Object | Map |
|--------|--------|-----|
| **键的类型** | 只能是 String 类型或 Symbol 类型 | 可以是任何类型的数据，包括对象、函数、布尔值、数字等 |
| **迭代** | 本身不具备迭代器，默认不能使用 `for of` | 内置有迭代器，可以使用 `for...of` 循环和 `forEach` 循环进行迭代 |
| **添加键值对** | 使用 `obj[key] = value` | 使用 `map.set(key, value)` 方法 |
| **删除键值对** | 需要使用 `delete obj[key]` | 可以使用内部方法 `map.delete(key)` |
| **检查键是否存在** | 使用 `obj.hasOwnProperty(key)` | 使用 `map.has(key)` 方法 |
| **获取键值** | 使用 `obj[key]` | 使用 `map.get(key)` 方法 |
| **遍历键值对** | 使用 `for...in` 循环和 `Object.keys()`、`Object.values()`、`Object.entries()` 等方法 | 使用 `for...of` 循环和 `Map.keys()`、`Map.values()`、`Map.entries()` 等方法 |
| **序列化** | 可以使用 `JSON.stringify` 进行序列化操作 | 无法被序列化，因为键可以是任意类型，JSON 序列化会得到 `{}` |
| **顺序** | 无序的 | 有序的，按照插入的顺序 |

## 四、Map 的时间复杂度

### 4.1 基本回答

Map 的查找时间复杂度：
- **最好情况：O(1)**
- **最坏情况：O(n)**

### 4.2 详细解释

Map 的时间复杂度主要取决于其具体实现方式（哈希表）：

1. **理想情况（O(1)）**：如果能够将键均匀分布在整个哈希表中，避免冲突，那么 Map 的查找、插入和删除操作的时间复杂度可以达到 O(1)，即常数时间复杂度。

2. **冲突情况**：
   - 如果哈希函数导致很多键落在同一个桶中，形成**链表**，时间复杂度将退化为 **O(n)**，其中 n 是链表中的条目数量
   - 如果形成**红黑树**，时间复杂度为 **O(log n)**

### 4.3 面试回答建议

**面试官**：请说下知道了键，在 Map 中查找值的时间复杂度是多少？

**回答**：有可能是 O(1)，也有可能 O(n)。

**面试官**：那在什么情况下时间复杂度为 O(1) 呢？

**回答**：在 Map 的结构简单没有冲突的时候，因为这样的话需要的键值直接在 Map 的第一层，不需要遍历就可以找到准确的值。反之，如果哈希冲突严重，就可能造成 O(n) 的情况。

## 五、总结

1. Object 和 Map 都是键值对存储结构，但在键的类型、迭代方式、操作方法等方面有显著差异
2. Map 提供了更完善的 Hash 结构实现，键可以是任意类型
3. Map 的时间复杂度取决于哈希表的实现和冲突情况，理想情况下为 O(1)
4. 在实际开发中，应根据具体场景选择合适的数据结构：
   - 需要字符串或 Symbol 作为键，且需要 JSON 序列化时，选择 Object
   - 需要任意类型作为键，需要保持插入顺序，或需要频繁增删键值对时，选择 Map

## 参考资料

- [MDN - Object](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object)
- [MDN - Map](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map)