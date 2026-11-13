---
title: Node.js-事件循环
tags:
  - Node
slug: 368
categories:
  - 技术随笔
  - Node之旅
date: 2017-09-08 14:18:25
description: "讲解 Node.js 的事件循环机制。从事件与循环两个熟悉的概念切入，说明单线程模型如何通过事件循环实现异步非阻塞。"
image: /images/covers/042.jpg
---

当看到事件循环这个概念，其实是有一种熟悉的感觉。为什么这么说，因为在平时写js过程中，我们会写事件，同时也会写循环语句。那么二者结合在一起，是个什么鬼！？
来看看鬼吧。
Node.js 是单进程单线程应用程序，但是通过事件和回调支持并发，所以性能非常高。
Node.js 的每一个 API 都是异步的，并作为一个独立线程运行，使用异步函数调用，并处理并发。
Node.js 基本上所有的事件机制都是用设计模式中观察者模式实现。
Node.js 单线程类似进入一个while(true)的事件循环，直到没有事件观察者退出，每个异步事件都生成一个事件观察者，如果有事件发生就调用该回调函数.
这是菜鸟教程对Node.js事件的解释。
说白了，啥意思。就是一张图
Node.js 使用事件驱动模型，当web server接收到请求，就把它关闭然后进行处理，然后去服务下一个web请求。
当这个请求完成，它被放回处理队列，当到达队列开头，这个结果被返回给用户。
这个模型非常高效可扩展性非常强，因为webserver一直接受请求而不等待任何读写操作。（这也被称之为非阻塞式IO或者事件驱动IO）
在事件驱动模型中，会生成一个主循环来监听事件，当检测到事件时触发回调函数。

![](http://www.hunaisong.cn/wp-content/uploads/2017/09/event_loop.jpg)

整个事件驱动的流程就是这么实现的，非常简洁。有点类似于观察者模式，事件相当于一个主题(Subject)，而所有注册到这个事件上的处理函数相当于观察者(Observer)；

从这我大概能得出这么几点，
1. Node.js是单线程的，因为js就是单线程的，你不可能把语言的根本给改了。
2. 虽然是单线程的，但是每个API都是异步的，每一个异步api都是独立的线程，并且支持回调函数，这样处理并发事件
3. 我们创建的单线程程序会被放入事件队列中（event loop），然后当触发了事件，就找到相应的handler，然后处理事件。

那么该怎么去绑定和监听事件呢？
```js
// 引入events内置模块，实例化EventEmitter类，来绑定和监听事件
var events = require("events");
var eventEmitter = new events.EventEmitter();
```
```js
// 绑定一个事件
eventEmitter.on('eventName',eventHandler)
// 绑定事件，給事件一个名称（eventName），然后回调函数（eventHandler）是处理这个事件的
```
```js
// 触发一个事件
eventEmitter.emit('eventName');
```
这个机制和vue很相似。
一个实例，来看看怎么玩
比如，我写了一个连接服务器的程序，然后通过服务器接收数据
```js
var events = require("events");
var eventsEmitter = new events.EventEmitter();

console.log('准备数据连接')
eventsEmitter.on('connection',function () {
    console.log("连接成功!")
    eventsEmitter.emit('data_receive')
})
eventsEmitter.on('data_receive',function () {
    console.log('数据接收成功')
})
eventsEmitter.emit('connection')
console.log('程序执行完毕')
```
![](http://www.hunaisong.cn/wp-content/uploads/2017/09/event.gif)