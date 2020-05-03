# 执行上下文和执行栈

#### 什么是执行上下文？

执行上下文是评估和执行 JavaScript 代码的环境的抽象概念。Javascript 代码都是在执行上下文中运行。

 JavaScript 的可执行代码\(executable code\)的类型只有三种，全局代码、函数代码、eval代码。

对应着，JavaScript 中有三种执行上下文类型。

* **全局执行上下文** — 默认的上下文，任何不在函数内部的代码都在全局上下文中。它会执行两件事：创建一个全局的 window 对象（浏览器的情况下），并且设置 `this` 的值等于这个全局对象。一个程序中只会有一个全局执行上下文。
* **函数执行上下文** — 每当一个函数被**调用**时, 都会为该函数创建一个新的上下文。每个函数都有它自己的执行上下文，函数上下文可以有任意多个。
* **Eval 函数执行上下文** — 执行在 `eval` 函数内部的代码也会有它属于自己的执行上下文

举个例子，当执行到一个函数的时候，就会进行准备工作，这里的“准备工作”，就叫做"执行上下文\(execution context\)"。

#### 执行栈

执行栈，是一种拥有 LIFO（后进先出）数据结构的栈，被用来存储代码运行时创建的所有执行上下文。

当 JavaScript 开始要解释执行代码的时候，它会创建一个全局的执行上下文并且压入当前执行栈。每当引擎遇到一个函数调用，它会为该函数创建一个新的执行上下文并压入栈的顶部。

> 程序结束之前， **执行栈**最底部永远有个**全局上下文**

引擎会执行那些执行上下文位于栈顶的函数。当该函数执行结束时，执行上下文从栈中弹出，控制流程到达当前栈中的下一个上下文。

**模拟js执行以下代码：**

```javascript
function fun3() {
    console.log('fun3')
}

function fun2() {
    fun3();
}

function fun1() {
    fun2();
}

fun1();
```

定义执行上下文栈：`ECStack = [];`

1. 向栈中压入全局上下文：`ECStack.push(globalContext);`
2. 执行fun1，创建fun1上下文，并压入执行栈：`ECStack.push(fun1Context);`
3. 执行fun2，创建fun2上下文，并压入执行栈：`ECStack.push(fun2Context);`
4. 执行fun3，创建fun3上下文，并压入执行栈：`ECStack.push(fun3Context);`
5. fun3执行完毕，弹出并销毁fun3上下文：`ECStack.pop();`
6. fun2执行完毕，弹出并销毁fun2上下文：`ECStack.pop();`
7. fun1执行完毕，弹出并销毁fun1上下文：`ECStack.pop();`
8. 所有代码执行完毕，JavaScript 引擎从当前栈中移除全局执行上下文。

#### 怎么创建执行上下文？

创建执行上下文有两个阶段：**1\) 创建阶段** 和 **2\) 执行阶段**。

#### 在创建阶段会发生三件事：

1.  [**This 绑定**](https://juejin.im/post/5eac13735188256d51476f59)。
2. 创建**词法环境**组件。
3. 创建**变量环境**组件。

所以执行上下文在概念上表示如下：

```javascript
ExecutionContext = {
  ThisBinding = <this value>,
  LexicalEnvironment = { ... },
  VariableEnvironment = { ... },
}
```

在函数执行上下文中，`this` 的值取决于该函数是如何被调用的。如果它被一个引用对象调用，那么 `this` 会被设置成那个对象，否则 `this` 的值被设置为全局对象或者 `undefined(严格模式下)`。

**词法环境对象**

> 词法环境和变量环境组件始终为 词法环境对象。

变量环境也是一个词法环境，它有着词法环境的所有属性。

在 ES6 中，**词法环境**组件和**变量环境**的一个不同就是前者被用来存储函数声明和变量（`let` 和 `const`）绑定，而后者只用来存储 `var` 变量绑定。即：

* let、const声明的变量，外部环境引用保存在词法环境组件中。
* var和function声明的变量和保存在环境变量组件中。

每个词法环境对象包含两部分：

* 环境记录器
* 外部环境的引用（可能为空，比如全局词法环境）

以下面代码为例:

```javascript
let a = 1;
const b = 2;
var c = 3;
function test (d, e) {
  var f = 10;
  return f * d * e;
}
c = test(a, b);
```

解析阶段的全局环境内的词法环境和变量环境

```javascript
GlobalLexicalEnvironment = {
  LexicalEnvironment: { // 词法环境组件
    OuterReference: null, // 全局词法环境中外部引用为空
    EnviromentRecord: {
      Type: 'object',
      a: <uninitialized> , // let 和 const 变量绑定但未关联值
      b: <uninitialized> 
    },
  },
  VariableEnvironment: { //变量环境组件
    EnviromentRecord: {
      type: 'object',
      test: <func>,
      c: undefined,  // var变量会被初始为 undefined
    }
  }
}
```

解析test时的词法环境和变量环境

> 注意：只有调用函数时，函数执行上下文才会被创建

```javascript
// 此时 全局上下文已经执行，因此 a、b、c都与对应值关联
GlobalLexicalEnvironment = {
  LexicalEnvironment: {
    OuterReference: null,
    EnviromentRecord: {
      Type: 'object',
      a: 1 ,
      b: 2 
    },
  },
  VariableEnvironment: {
    EnviromentRecord: {
      type: 'object',
      c: 3,,
      test: <func>
    }
  }
}

// test的词法执行上下文开始构建，var变量绑定，形参绑定
FunctionLexicalEnvironment = {
  LexicalEnvironment: {
    OuterReference:  <GlobalLexicalEnvironment>,
    EnviromentRecord: {
      Type: 'Declarative',
      arguments: {0: 1, 1: 2, length: 2}
    },
  },
  VariableEnvironment: {
    EnviromentRecord: {
      Type: 'Declarative',
      f: undefined,
    }
  }
}
```

**插播一条变量提升的知识点：**

在创建执行上下文时，js引擎会检查当前作用域的所有变量声明及函数声明，在执行之前，var声明的变量已经绑定初始undefined，而在let和const只绑定在了执行上下文中，但并未初始任何值，所以在声明之前调用则会抛出引用错误\(即TDZ暂时性死区\)，这也就是函数声明与var声明在执行上下文中的提升。

当进入执行上下文时，

1. 函数的所有形参 \(如果是函数上下文\)
   * 由名称和对应值组成的一个变量对象的属性被创建
   * 如果没有实参，属性值设为 undefined
2. 函数声明
   * 由名称和对应值（函数对象\(function-object\)）组成一个变量对象的属性被创建
   * 如果变量对象已经存在相同名称的属性，则完全替换这个属性
3. 变量声明
   * 由名称和对应值（undefined）组成一个变量对象的属性被创建；
   * 如果变量名称跟已经声明的形式参数或函数相同，则变量声明不会干扰已经存在的这类属性







#### 执行阶段

在此阶段，完成对所有这些变量的分配，最后执行代码。

> 在执行阶段，如果 JavaScript 引擎不能在源码中声明的实际位置找到 `let` 变量的值，它会被赋值为 `undefined`。



  








> 参考文章：
>
> 1. \*\*\*\*[**JavaScript深入之执行上下文栈**](https://github.com/mqyqingfeng/Blog/issues/4)\*\*\*\*
> 2. \*\*\*\*[**\[译\] 理解 JavaScript 中的执行上下文和执行栈**](https://juejin.im/post/5ba32171f265da0ab719a6d7)\*\*\*\*
> 3. \*\*\*\*
