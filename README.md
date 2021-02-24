
## 写在前面

这是一项从零开始的整理计划，也是我的个人笔记。

本项目的名字，起名为**前端从入门到入土**，毕竟一入前端深似海，何时才能长久眠。

> 从踏入前端领域开始，就一路迷茫的走了过来，该学什么，要学什么，一概不知，只能是工作中需要用什么，就学会用什么。但是这样很不好，知其然而不知其所以然，面试会被问哭的。

希望能将一些基础的知识点系统而简明的整理出来。给刚入门者指个方向，也给自己指个归路。

如果你收获了知识，请`star`一下，关注后续的更新。非常感谢～

> 咕咕咕～

有些文章内部含有`html+css`代码，可移步[掘金地址](https://juejin.cn/user/536217407721965/posts)  

## 目录

### 代码规范

- [论如何优雅的写出不会挨揍的代码](推荐代码规范.md)  
    No code is the best way to write secure and reliable applications. Write nothing; deploy nowhere. 

### html

- [html 语义化](html/html-yu-yi-hua.md)  
    语义元素可以清楚地向浏览器和开发者描述其意义。即元素本身传达了关于标签所包含内容类型的一些信息。

### js

- [重新介绍javascript--类型](js/zhong-xin-jie-shao-javascript-lei-xing.md)  
    JavaScript 是一种**弱类型**或者说**动态**语言。这意味着你不用提前声明变量的类型，在程序运行过程中，类型会被自动确定。

- [初学者不容错过的双等\(==\)知识点](js/chu-xue-zhe-bu-rong-cuo-guo-de-shuang-deng-zhi-shi-dian.md)  
    问：2 == true 返回什么？ 答：false

- [clone：你是浅还是深](js/clone.md)  
    **知识点1**: 基本数据类型不是全存在栈中，只有直接声明的变量才会在栈中。
    **知识点2**: 位于引用类型内的基本类型，也是放在堆上

- [继承与原型链](js/ji-cheng-yu-yuan-xing.md)  
    JavaScript 是动态的，并且本身不提供一个 `class` 实现。在 ES2015/ES6 中引入了 `class` 关键字，但那只是语法糖，JavaScript 仍然是基于原型的。不断向上追溯的原型共同组成了原型链

- [this及箭头函数](js/this.md)  
    如果你猜到我指向哪，我就让你嘿嘿嘿～

- [apply、call、bind的区别与精简实现](js/apply、call、bind.md)  
    箭头函数永不为奴

- [你所不知道的变量提升](js/bian-liang-ti-sheng.md)  
    `let / const` **也有变量提升** ，这也是暂时性死区的由来。

- [执行上下文和执行栈](js/zhi-hang-shang-xia-wen-he-zhi-hang-zhan.md)  
    执行上下文是评估和执行 JavaScript 代码的环境的抽象概念。Javascript 代码都是在执行上下文中运行。  

- [词法作用域及作用域链](js/ci-fa-zuo-yong-yu-ji-zuo-yong-yu-lian.md)  

- [简单的闭包介绍](js/jian-dan-de-bi-bao-jie-shao.md)  
    三百字的讲解与五百字的应用

- [事件机制](js/shi-jian-ji-zhi.md)  

- [函数式编程](js/han-shu-shi-bian-cheng.md)  
    函数式编程的思维过程是完全不同的，它的着眼点是**函数**，而不是**过程**，它强调的是如何通过函数的组合变换去解决问题，而不是我通过写什么样的语句去解决问题。

- [web worker详解](js/web-worker.md)  
    Web Worker为Web内容在后台线程中运行脚本提供了一种简单的方法。线程可以执行任务而不干扰用户界面。

- [遇见Blob](js/Blob.md)  
    Blob 对象表示一个不可变、原始数据的类文件对象。Blob 表示的不一定是JavaScript原生格式的数据。File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。

- [Promise实现及讲解](js/Promise.md)


### css

- [position的6种属性及吸顶特效](css/position.md)  

- [回流与重绘](css/hui-liu-yu-zhong-hui.md)  
    每次这两个都会被同时提及，关系就好像KFC边上一定会有MC一样亲密的让人摸不到头脑。
    
- [移动端1px方案与viewport的使用](css/yi-dong-duan-1px-fang-an.md)  
     | 工具人: 这是1px，设计师： 不，这不是]
     
- [css常用布局](css/css-chang-yong-bu-ju.md)  

- [css层叠上下文](css/css-ceng-die-shang-xia-wen.md)  
    有猫
    
- [Sass vs Less](css/SassVsLess.md)  
    我简单写写，你简单看看，咋样

- [除了解决边距重叠，BFC还可以这么用](css/BFC.md)  
    相邻的两个盒子（可能是兄弟关系也可能是祖先关系）的外边距可以结合成一个单独的外边距。 这种合并外边距的方式被称为折叠，结合而成的外边距称为折叠外边距。
    
- [傻傻分不清css长度的(百分比|负值)基准是谁](css/傻傻分不清css长度百分比相对于谁.md)  

- [精心整理33个css知识干货](css/知识总结.md)  

  
### 工程化

- [带你撸个属于自己的react项目|webpack+babel+typescript+eslint](工程化/随手建一个属于自己的项目.md)  

- [前端模块化](工程化/前端模块化.md)  

### 网络

- [JSON Web Token(JWT)简单介绍](网络/JSONWebToken.md)  

- [遇见跨域](网络/跨域.md)  

### React

- [ReactHook防抖及节流](react/hook防抖及节流.md)  