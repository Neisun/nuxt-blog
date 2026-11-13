---
title: let与const
tags:
  - ES6
  - javascript
slug: 512
categories:
  - 技术随笔
  - ES6
date: 2017-10-23 14:44:47
description: "讲解 ES6 中 let 与 const 的用法与区别。对比 var，说明块级作用域、暂时性死区与常量声明等新特性带来的改变。"
image: /images/covers/070.jpg
---

上一次提到了ES6中的`Promise`，个人觉得既然有一定的时间，那么就把ES6中的其他部分看一看，为什么呢？因为ES6必然会在不久的将来被各大浏览器所兼容和实现。
这一次我们来看看ES6中新增的两个定义变量的方式。

> **`let`与`const`**

有的小伙伴会问，为什么把`let`与`const`归为一类。这其实并不是什么问题，二者都是用来声明变量的，与`var`非常的类似。

<!--more-->

> `let`部分

`let`与`var`非常类似，说是近亲我觉得都不为过。
使用方式上
```javascript
var a = 1;
let b = 2;
```

**不同之处**

1.`let`定义的变量可以在`{}`形成自己独有的变量，也就是形成一个块级作用域，比如
```javascript
// 例子一
if (true) {
    let c = 3;
    var d = 4;
    console.log(c);
}
console.log(c); // 报错，c is not defined
console.log(d); // 4
```
```javascript
// 例子二，非常经典的案例
var arr1 = [];
for (var i = 0; i < 10; i++) {
    arr1[i] = function() {
        console.log(i);
    }
}
arr1[5](); // 10 因为i是全局的变量，它会保存着最后给变量的赋值
var arr2 = [];
for (let i = 0; i < 10; i++) {
    arr2[i] = function() {
        console.log(i);
    }
}
arr2[5](); 
// 5 使用`let`定义之后，就不是全局变量，而是局部的，这样你在根据下标调用函数的时候，就可以获取到你想要的数字了。
```
2.`let`不存在变量提升
我们记得，当我们使用`var`定义一个变量的时候，可以在变量声明之前使用，顶多就会得到一个`undefined`，并不会报什么错误，因为变量会提升到最顶端。
但是使用let时候，如果在变量声明之前使用变量，会报错误，not defined 。
看例子
```javascript
console.log(abc); // undefined
var abc = 1;
console.log(bcd); // 报错，bcd is not defined
let bcd = 2;
```
3.暂时性死区
这其实也是由于，`let`不存在变量提升所引起的。（temporal dead zone）
看例子
```javascript
// 看例子
var tmp = '123'; // 先使用 var 定义一个全局的tmp变量
if (true) {
     tmp = 'hhhhh';
     let tmp;
 }
```
上述代码报错，tmp is not defined
使用`let`定义了变量之后，变量所在的代码块就是块级，相当于被锁死，跟外界没有关系，在上述的代码中，在let之前使用定义好的变量，当然会报错，又回到了let不支持变量提升，没有声明变量，就想直接使用，不好意思，报错。
**比较隐蔽的死区**
```javascript
// 比较隐蔽的死区，函数形参中的变量
function test(x = y, y = 2) {
    return [x, y];
}
// console.log(test()) // y is not defined 报错，为啥，y没有提前定义和声明，然后你就直接去赋值给x，必须报错
// 再来看看，怎么给它改成木有问题的，只要提前把变量声明了
function fn(y = 2, x = y) {
    return [x, y]
}
console.log(fn())
```
4.不允许重复定义变量
```javascript
/*{
    // 错误的
    let a = 1;
    var a = 2;
    // 又或者说，以下边这种方式，错误的
    let b = 1;
    let b = 2;
    // 用var倒是无所谓了，后者会把前者给覆盖掉，可见var是非常随便的
    var c = 1;
    var c = 2;
}*/
```
5.块级作用域问题
```javascript
// 看一个例子，你知道会输出什么？
var time = new Date();

function fn1() {
    console.log(time);
    if (true) {
        var time = '时间';
    }
}
fn1(); // undefined 
```
为什么会这样呢？
上述代码改写一下你就知道了；
```javascript
var newTime = new Date();

function fn2() {
    var newTime;
    console.log(newTime);
    if (true) {
        newTime = '时间'
    }
}
fn2(); // undefined
```
明白了么，因为变量冲突，外部设置全局变量，在函数内部也设置了同样的变量，并且变量声明提升，才导致上述问题的出现。
使用`let`
```javascript
// let 写法
function fn3() {
    let time = new Date();
    if (true) {
        let time = '时间';
        console.log(time)
    }
    console.log(time);
}
fn3(); // 两个time不冲突，因为在两个块级中的变量，各自有各自的作用域；
```
6.块级作用域与函数声明
```javascript
function f() { console.log('I am outside!'); }

(function() {
    if (true) {
        // 重复声明一次函数f
        function f() { console.log('I am inside!'); }
    }

    f();
}());
```
上面代码在 ES5 中运行，会得到“I am inside!”，因为在if内声明的函数f会被提升到函数头部，实际运行的代码如下。
```javascript
// ES5 环境
function f() { console.log('I am outside!'); }

(function() {
    // 在 if 中声明的函数会被提升到函数头部
    function f() { console.log('I am inside!'); }
    if (false) {}
    f();
}());
```
在ES6中理论上会得到 I am outside!但在实际中却不是这样，因为规则变更会对老代码产生巨大影响，所以呢。浏览器有自己的实现方式：
-- 允许在块级作用域内声明函数。
-- 函数声明类似于var， 即会提升到全局作用域或函数作用域的头部。
-- 同时， 函数声明还会提升到所在的块级作用域的头部。

> const部分

const是用来定义一个常量，那么什么是常量
常量在我们看来就是一个不变的量
const声明的是一个常量，一旦设置，就不可写，只能读取

```javascript
const str = '你好';
const number = 10;
const boolean = true;
```
上述三种是比较常见的常量
```javascript
// 接着上述代码
str = 'hello' // 报错Uncaught TypeError: Assignment to constant variable；证明不可更改
```
接着往下看，比较好玩的事情
```javascript
// 定义一个对象
const obj = {
    name:'David Beckham'
};
obj.name = 'Leo Nado';
console.log(obj.name)
// 上述代码行得通么，不是说const定义的变量是不可更改的么
```
这就需要说一下`const`本质。`const`设定变量不是说不可更改，而是变量指向的内存地址不可改动。对于简单数据类型来说，`string`，`number`，`boolean`来说，值保存在变量指向的那个内存地址。但对于引用数据类型来说，指向内存地址的是一个指针，const只能保证那个指针的指向不变。

**const定义变量与let类似，只在块级作用域生效**
```javascript
if (true) {
    var name = 'test';
    const sex = 'male'
}
console.log(name) // test
console.log(sex)  // sex is not defined
```
**const也不能重复定义变量，重复定义只会报错，并不会像var那样随便~，变量会被覆盖掉；**

感谢[阮一峰的博客](http://es6.ruanyifeng.com/?search=as&x=0&y=0#docs/let)，从阮一峰老师的博客中学到颇多内容。