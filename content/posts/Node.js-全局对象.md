---
title: Node.js-全局对象
tags:
  - Node
slug: 412
categories:
  - 技术随笔
  - Node之旅
date: 2017-09-19 15:51:07
description: "介绍 Node.js 的全局对象。梳理 global、process、console 等常用全局对象与变量，帮助快速上手 Node 开发。"
image: /images/covers/054.jpg
---

js中有全局对象，window；Node.js同样也设置了全局对象和全局变量。
Node.js中全局对象`global`，全局变量有很多。常用的如下几部分，做个介绍和小小的汇总。

> **全局变量**

```js
/**
 * JavaScript中有全局对象，即window对象
 * Node.js同样也不例外，也有自己的全局对象，在任何位置都可以直接调用，当然我们使用更多的是全局变量；
 */

// global全局对象
console.log(global);

// __filename,正在执行脚本的名称
console.log(__filename);
// E:\learnNodeIn7days\Global\index.js

// __dirname，正在执行文件的路径
console.log(__dirname);
// E:\learnNodeIn7days\Global

// 定时器,清除定时器
var t = setTimeout(function() {
    console.log(110);
}, 2000);

clearTimeout(t);

var i = setInterval(function () {
    console.log(120)
},2000)

clearInterval(i);

// console同样也是一个全局变量
console.log('hello world!');
// console.assert(1>2,'明显错了');
console.info('info')
console.error('err')
console.time('test');
console.timeEnd('test');
console.trace();

// 还有一个是process，process是一个对象，关于进程的api，api繁多，需要的时候需要查手册
```
一个小小的demo
```js
var fs = require("fs");
var path = require("path");
console.log('程序开始执行：');
var counter = 10;
console.log("计数:%d",counter);
console.time('获取数据');
var data = fs.readFileSync(path.join(__dirname,'test.txt'));
console.info(data.toString());
console.timeEnd('获取数据');
console.log("程序结束");
```
效果图

![](http://www.hunaisong.cn/wp-content/uploads/2017/09/global.jpg)