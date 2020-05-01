# Untitled



使用 `call` 和 `apply` 函数的时候要注意，如果传递给 `this` 的值不是一个对象，JavaScript 会尝试使用内部 `ToObject` 操作将其转换为对象。因此，如果传递的值是一个原始值比如 `7` 或 `'foo'`，那么就会使用相关构造函数将它转换为对象，所以原始值 `7` 会被转换为对象，像 `new Number(7)` 这样，而字符串 `'foo'` 转化成 `new String('foo')` 这样，例如：

```text
function bar() {
  console.log(Object.prototype.toString.call(this));
}

//原始值 7 被隐式转换为对象
bar.call(7); // [object Number]
bar.call('foo'); // [object String]
```

