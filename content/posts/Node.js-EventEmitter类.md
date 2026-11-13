---
title: Node.js-EventEmitter类
tags:
  - javascript
  - Node
slug: 388
categories:
  - 技术随笔
  - Node之旅
date: 2017-09-12 16:44:09
description: "讲解 Node.js 的 EventEmitter 事件发射器类。说明事件监听与触发的一系列方法，以及它在事件循环与各种模块中的基础作用。"
image: /images/covers/047.jpg
---

> **EventEmitter类**

上一次提到了事件循环，事件循环中任何事件的监听都少不了EventEmitter的实例化对象，没有这个对象提供的一系列方法，都是徒劳。
并且，在node中使用的各种模块也都是EventEmitter的实例，很有趣，要不然怎么能都有公共的api比如on，emit等等方法接口呢。

直接上一个最简单但是比较常用的api用法例子

```js
/*
 * @Author: hunaisong 
 * @Date: 2017-09-12 16:13:32 
 * @Last Modified by: hunaisong
 * @Last Modified time: 2017-09-12 16:30:08
 */
// 此案例用来大体上全面展示一下eventEmitter类的api用法
var events = require("events");
var eventEmitter = new events.EventEmitter();

// 监听器1
var listener1 = function () {
    console.log("监听器 listener1 执行")
}
// 监听器2
var listener2 = function () {
    console.log("监听器 listener2 执行")
}
// 绑定
eventEmitter.addListener("connection",listener1);
eventEmitter.on("connection",listener2);

// 查看有几个监听器连接
var count = require("events").EventEmitter.listenerCount(eventEmitter,"connection");
console.log(count+" 个监听器监听连接事件")

// 触发
eventEmitter.emit("connection")

// 移除绑定的事件
eventEmitter.removeListener("connection",listener1);
console.log("监听器 listener1 被移除了")

// 再次触发
eventEmitter.emit("connection")

// 再次获取执行中的监听器个数
count = require("events").EventEmitter.listenerCount(eventEmitter,"connection");
console.log(count+" 个监听器监听连接事件")

// 程序执行完毕
console.log('程序执行完毕')
```
图示

![](http://www.hunaisong.cn/wp-content/uploads/2017/09/event-1.gif)