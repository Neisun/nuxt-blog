---
title: Node.js-模块系统
tags:
  - ES6
  - Node
slug: 403
categories:
  - 技术随笔
  - Node之旅
date: 2017-09-14 14:47:03
description: "讲解 Node.js 的模块系统（CommonJS）。介绍 require、module.exports 与模块加载机制，理解 Node 组织代码的基本方式。"
image: /images/covers/051.jpg
---

早在开篇Node系列文章时候，其实就在第二篇文中说了。不过当时没有系统说明，权当这是基础部分。但总觉得不妥，需要细化，细分，做出总结性的划分。

> **模块系统**

所谓模块，在node.js中有内置的模块，有通过npm安装的包文件，也是模块，同样的我们自己的定义的js当然也是一个模块，你可以在别的js文件中引入，然后使用。问题在于，怎么把我们自己写的文件变成模块----简单来讲就是暴露出去。

> **语法篇**

怎么暴露呢。node.js有两种方式去暴露。
代码演示

> 方式一:exports.name

```js
// test.js
/*
 * @Author: hunaisong 
 * @Date: 2017-09-14 13:36:36 
 * @Last Modified by: hunaisong
 * @Last Modified time: 2017-09-14 13:38:57
 */
// exports. 是一种暴露的方式，exports是一个对象
// exports.test可不就是直接test中的一个键么
exports.test = function () {
    console.log('hello world!')
}
```
在同级文件夹下的index.js文件中引入
```js
// test暴露出去了,引入，然后调用
var testModule = require("./test")
testModule.test();
```

> 第二种方式：module.exports = ...

这种方式可以做出一些改变，因为第一种方式怎么暴露都是对象，exports本身就是对象。但第二种方式就灵活的多了。
上代码
```js
// hello.js 与index.js文件夹同级
/*
 * @Author: hunaisong 
 * @Date: 2017-09-14 13:30:07 
 * @Last Modified by: hunaisong
 * @Last Modified time: 2017-09-14 13:34:11
 */
function Hello() {
    var name;
    this.setName = function (thyName) {
        name = thyName
    }
    this.sayHello = function () {
        console.log("Hello "+name)
    }
}

module.exports = Hello;
```
index.js中使用
```js
var Hello = require("./hello")
var hello = new Hello();
hello.setName('小明');
hello.sayHello();
```

顺带说一下export default、export。
这个其实是ES6的写法，export default 每个js文件中有且只有一个，而export可以存在多个。
比如```js
export default const str = '你好';
export const test = function () {..};
export const say = function () {..};
....
```
引入的语法用import，这是ES6中模块化语法。希望以后能得到浏览器的支持。因为确实很方面，作为模块化开发来说。