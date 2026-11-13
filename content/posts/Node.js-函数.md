---
title: Node.js-函数
tags:
  - Node
slug: 406
categories:
  - 技术随笔
  - Node之旅
date: 2017-09-14 17:30:35
description: "介绍 Node.js 中函数的用法。从普通函数到回调函数，说明函数在 Node 异步编程中的角色与常见写法。"
image: /images/covers/052.jpg
---

函数最熟悉不过，也是最强大的，没有之一。
在node.js中使用最频繁的函数形式，莫过于，函数中形参传递函数。

**在js中可以在一个函数中，传递一个函数作为参数，Node.js基本就是利用这个**

看一个最简单的例子
```javascript
//  写一个js
function test(sayName,name) {
    sayName(name)
}
function sayName(name) {
    console.log('Hello, '+name+'!')
}

test(sayName,"Neisun")
```
再来看看node.js中，调用模块时候的方式
```javascript
// 联想到Node.js中内置模块中的一些用法
// 比如创建一个http 服务器
var http = require("http");
http.createServer(onRequest).listen('8888')

// 把请求函数单独提出来
function onRequest(request,response) {
    response.writeHead(200,{"Content-Type":"text/plain"});
    response.write("Hello world!");
    response.end();
}
```

node.js就是利用这方式，创建我们各种常用的程序很值得思考。

（完）