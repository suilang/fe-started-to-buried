

## 什么是 Fiber ？
**React Fiber是对核心算法的一次重新实现**， 是异步渲染 ui 的解决方案

## 出现的背景

在react15中，更新过程是同步的。当我们调用`setState`更新页面的时候，React 会遍历应用的所有节点，计算出差异，然后再更新 UI。整个过程是一气呵成，不能被打断的。  

如果页面元素很多，组件树很大的时候，因为更新过程是同步地一层组件套一层组件，逐渐深入的过程，在更新完所有组件之前不停止，函数的调用栈调用得很深，而且很长时间不会返回。整个过程占用的时间可能超过 16 毫秒，就容易出现掉帧的现象。  

举个例子，如果有200个组件要更新，每个组件花费1毫秒，更新完成总共需要200毫秒，在这200毫秒的更新过程中，浏览器唯一的主线程都在专心处理更新操作，无暇去做任何其他的事情。  

如果在这200毫秒内，用户往一个input元素中输入内容，那么敲击键盘不会获得任何响应，因为渲染输入按键结果也是浏览器主线程的工作，但是浏览器主线程被React占用，抽不出空。等React更新过程结束之后，那些字符才会一下子出现在input元素里。  

因为JavaScript单线程的特点，JS 运算、页面布局和页面绘制都是运行在浏览器的主线程当中，他们之间是互斥的关系。如果每个同步任务耗时太长， JS 运算持续占用主线程，程序不会对其他动作作出响应，页面也没法得到及时的更新。  

React的更新过程犯了这个禁忌，而React Fiber就是要改变现状。  

## Fiber 的解题思路

解决主线程长时间被 JS 运算占用这一问题的基本思路，是将运算切割为多个步骤，分批完成。也就是说在完成一部分任务之后，将控制权交回给浏览器，让浏览器有时间进行页面的渲染。等浏览器忙完之后，再继续之前未完成的任务。  

虽然总时间依然很长，但是在每个小片执行完之后，都给其他任务一个执行的机会，这样唯一的线程就不会被独占，其他任务依然有运行的机会。  

旧版 React 通过递归的方式进行渲染，使用的是 JS 引擎自身的函数调用栈，它会一直执行到栈空为止。而Fiber实现了自己的组件调用栈，它以链表的形式遍历组件树，可以灵活的暂停、继续和丢弃执行的任务。

实现方式是使用了浏览器的requestIdleCallback这一 API。

> window.requestIdleCallback()会在浏览器空闲时期依次调用函数，这就可以让开发者在主事件循环中执行后台或低优先级的任务，而且不会对像动画和用户交互这些延迟触发但关键的事件产生影响。函数一般会按先进先调用的顺序执行，除非函数在浏览器调用它之前就到了它的超时时间。

React 框架内部的运作可以分为 3 层：

- Virtual DOM 层，描述页面长什么样。
- Reconciler 层，负责调用组件生命周期方法，进行 Diff 运算等。
- Renderer 层，根据不同的平台，渲染出相应的页面，比较常见的是 ReactDOM 和 ReactNative。

改动最大的当属 Reconciler 层。改动后的 Reconciler 层 称为 `Fiber Reconciler`，它每执行一段时间，会将控制权交还给浏览器。相对应的，将以前的 Reconciler 被命名为`Stack Reconciler`。`Stack Reconciler` 运作的过程是不能被打断的，必须一条道走到黑。

React Fiber把更新过程碎片化，每执行完一段更新过程，就把控制权交还给React负责任务协调的模块，看看有没有其他紧急任务要做，如果没有就继续去更新，如果有紧急任务，那就去做紧急任务。

为了达到这种效果，就需要有一个调度器 (Scheduler) 来进行任务分配。任务的优先级有六种：

- synchronous，与之前的Stack Reconciler操作一样，同步执行
- task，在next tick之前执行
- animation，下一帧之前执行
- high，在不久的将来立即执行
- low，稍微延迟执行也没关系
- offscreen，下一次render时或scroll时才执行

优先级高的任务（如键盘输入）可以打断优先级低的任务（如Diff）的执行，从而更快的生效。

`Fiber Reconciler` 在执行过程中，会分为 2 个阶段。

- 阶段一，生成 Fiber 树，得出需要更新的节点信息。这一步是一个渐进的过程，可以被打断。  
该阶段包括
	- componentWillMount
	- componentWillReceiveProps
	- shouldComponentUpdate
	- componentWillUpdate

- 阶段二，将需要更新的节点一次性批量更新，这个过程不能被打断。  
该阶段包括
	- componentDidMount
	- componentDidUpdate
	- componentWillUnmount

### Fiber树

Fiber 其实指的是一种数据结构，而Fiber树本质来说是一个链表。

阶段一有两颗树，Virtual DOM 树和 Fiber 树，Fiber 树是在 Virtual DOM 树的基础上通过额外信息生成的。

Fiber 树在首次渲染的时候会一次生成。在后续需要 Diff 的时候，会根据已有树和最新 Virtual DOM 的信息，生成一棵新的树。这颗新树每生成一个新的节点，都会将控制权交回给主线程，去检查有没有优先级更高的任务需要执行。如果没有，则继续构建树的过程。

如果过程中有优先级更高的任务需要进行，则 Fiber Reconciler 会丢弃正在生成的树，在空闲的时候再重新执行一遍。

**题外话**

这里会引出一个知识点，就是在react更新过程中，`shouldComponentUpdate`、`componentWillUpdate`等函数会执行几次。当然，答案是：多次。

因此，如果有在阶段一的函数中执行的逻辑，必须保证结果的一致性。另外，如果在这几个函数中有网络请求等逻辑的话，务必对可能的重复调用做处理。



## 参考文档

1. [React Fiber是什么](https://zhuanlan.zhihu.com/p/26027085)
2. [React.Fiber](https://www.jianshu.com/p/ff32dea870ed)
3. [React Fiber 原理介绍](https://segmentfault.com/a/1190000018250127)