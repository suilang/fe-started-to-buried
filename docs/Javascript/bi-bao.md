# 闭包

在理解闭包之前，有个重要的概念需要先了解一下，就是js 执行上下文

每当引擎遇到一个函数调用，它会为该函数创建一个新的执行上下文并压入栈的顶部。

#### 在创建阶段会发生三件事：

1.  **This 绑定**。
2. 创建**词法环境**组件。
3. 创建**变量环境**组件。

当该函数执行结束时，执行上下文从栈中弹出，控制流程到达当前栈中的下一个上下文。执行上下文中声明的所有变量都将被删除。

先看个栗子：

```javascript
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f();
}
checkscope(); // local scope
```

依据[词法作用域](https://juejin.im/post/5eae96066fb9a043867d4dd0)逻辑，查找变量的时候，会先从当前上下文的变量对象中查找，如果没有找到，就会从父级\(词法层面上的父级\)执行上下文的变量对象中查找，一直找到全局上下文的变量对象。

因此，`内部函数f`在执行时，找到定义位置的父级函数`checkscope`内的`scope`并将其返回，然后内部函数与外部函数的上下文依次弹出并销毁。

再看另一个栗子：

```javascript
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f;
}
const f2 = checkscope();
f2(); // local scope
```

与上个栗子不同，这里并没有在函数内部调用f，而是将`f`返回赋值给`f2`，因此，随着`checkscope`函数的结束，因为`f2`持有对函数`f`的引用，`f`没有被销毁，又因为`f`持有外部函数的作用域，所以`scope`也没有被销毁。

由此得出结论：

* 闭包就是内部函数，我们可以通过在一个函数内部或者 `{}` 块里面定义一个函数来创建闭包。闭包可以访问外部作用域，即使这个外部作用域已经执行结束。
* 闭包在没有被外部使用的情况下，随执行结束销毁
* 闭包的外部作用域是在其定义的时候已决定，而不是执行的时候。

## 闭包与循环

闭包只存储外部变量的引用，而不会拷贝这些外部变量的值。

```javascript
function initEvents(){
  for(var i=1; i<=3; i++){
    setTimeout(function showNumber(){
     console.log(i)
    },10);
  }
}
initEvents(); // 4，4，4
```

这个示例中，我们创建了3个闭包，皆引用了同一个变量 `i`，由于变量 `i` 随着循环自增，因此最终输出的都是同样的值。

在 `for` 语句块中使用 `let` 变量声明，将在每次循环中为 `for` 语句块创建一个新的局部变量。

```javascript
function initEvents(){
  for(let i=1; i<=3; i++){
    setTimeout(function showNumber(){
     console.log(i)
    },10);
  }
}
initEvents();
```

## 函数与私有状态

通过闭包，我们可以创建拥有私有状态的函数，闭包使得状态被封装起来。

## 自增生成器函数

通过闭包，我们可以创建自增生成器函数。同样，内部状态是私有的。示例如下：

```javascript
function createAGenerate(count, increment) {
  return function(){
    count += increment;
    return count;
  }
}
let generateNextNumber = createAGenerate(0, 1);
console.log(generateNextNumber()); //1
console.log(generateNextNumber()); //2
console.log(generateNextNumber()); //3
let generateMultipleOfTen = createAGenerate(0, 10);
console.log(generateMultipleOfTen()); //10
console.log(generateMultipleOfTen()); //20
console.log(generateMultipleOfTen()); //30
```

## 对象与私有状态

以上示例中，我们可以创建一个拥有私有状态的函数。同时，我们也可以创建多个拥有同一私有状态的函数。基于此，我们还可以创建一个拥有私有状态的对象。

```javascript
function TodoStore(){
  let todos = [];
  
  function add(todo){
    todos.push(todo);
  }
  function get(){
    return todos.map(toTodoViewModel);
  }
  
  function toTodoViewModel(todo) {
     return { id : todo.id, title : todo.title };
  }
  
  return Object.freeze({
    add,
    get
  });
}
```

`TodoStore()` 函数返回了一个拥有私有状态的对象。在外部，我们无法访问私有的 todos 变量，并且 add 和 get 这两个闭包拥有相同的私有状态。在这里，`TodoStore()` 是一个工厂函数。  



## 闭包 vs 纯函数

闭包就是那些引用了外部作用域中变量的函数。

为了更好的理解，我们将内部函数拆成闭包和纯函数两个方面：

* 闭包是那些引用了外部作用域中变量的函数。
* 纯函数是那些没有引用外部作用域中变量的函数，它们通常返回一个值并且没有副作用。

在上述例子中，`add()` 和 `get()` 函数是闭包，而 `isPriorityTodo()` 和 `toTodoViewModel()` 则是纯函数。  


装饰器函数也使用了闭包的特性。

## 垃圾回收

在 `Javascript` 中，局部变量会随着函数的执行完毕而被销毁，除非还有指向他们的引用。当闭包本身也被垃圾回收之后，这些闭包中的私有状态随后也会被垃圾回收。通常我们可以通过切断闭包的引用来达到这一目的。

## 避免全局变量

在 `Javascript` 中，我们很容易创建出全局变量。任何定义在函数和 `{}` 块之外的变量都是全局的，定义在全局作用域中的函数也是全局的。

## 参考文章

[\[译\]发现 JavaScript 中闭包的强大威力](https://juejin.im/post/5c4e6a90e51d4552266576d2)

