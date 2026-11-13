---
title: Node.js-net模块
tags:
  - Node
slug: 452
categories:
  - 技术随笔
  - Node之旅
date: 2017-09-22 11:09:27
description: "介绍 Node.js 的 net 网络模块。讲解创建 TCP 服务器与客户端的方法，理解底层网络通信的基本模型。"
image: /images/covers/058.jpg
---

越深入了解`Node.js`,越觉得它的了不起，同时
也觉得压力倍增，因为众多的功能还有api，不但要会使用还需要能记住，这一点让我颇感压力。虽说并不是需要你把每一个api都记住，但是常用的api也需要掌握。
哎，不能吐槽这些东西，接着往下进行吧。
本次我们进入net模块，net和http模块有点类似，算不算兄弟关系。
net模块又分为两部分
net.Server：TCP server，内部通过socket来实现与客户端的通信。
net.Socket：tcp/本地 socket的node版实现，它实现了全双工的stream接口。
什么是TCP，http基础我是有点弱了。需要买一本书来好好补一补这方面的知识了。先不管这个概念，看看这个东西，我们该怎么用。用一下，基本就知道，他能做什么，他不能做什么了。基本就是这个道理了。
上一个简单的例子；client+server的例子
```js
// myServer.js
/*
 * @Author: hunaisong 
 * @Date: 2017-09-21 21:42:19 
 * @Last Modified by: hunaisong
 * @Last Modified time: 2017-09-21 22:29:09
 */
var net = require("net");

var server = net.createServer((socket) => {
    console.log('服务端：收到来自客户端的请求');
    socket.on('data',(data) => {
        console.log('服务端：来自客户端的数据，内容是('+data+')');
        socket.write('你好，我是服务端发出的信息')
    })
    socket.on('close',() => {
        console.log('服务端：客户端断开连接')
    })
})
server.listen(8089,() => {
    console.log('服务端：开始监听来自客户端的请求')
})
// 这个纯是用来测试这个api
console.log(server.address());
```
```js
// myClient.js
/*
 * @Author: hunaisong 
 * @Date: 2017-09-21 21:49:52 
 * @Last Modified by: hunaisong
 * @Last Modified time: 2017-09-21 21:55:07
 */
var net = require('net');
var client = net.createConnection({port:8089});
client.on('connect',() => {
    console.log('客户端：开始建立与服务器的连接')
})
client.on('data',(data) => {
    console.log('客户端：接收到服务端的数据，内容是('+data+')');
})
client.on('close',() => {
    console.log('客户端：断开连接')
})
client.end('你好，我是客户端发出的信息')
```

效果图
![](http://www.hunaisong.cn/wp-content/uploads/2017/09/net.gif)

以上是最为基础的部分，由于api众多，不想浪费大量时间去一个个尝试api。
有一篇博客不错，关于这部分内容翔实，在这篇博客中我们可以看到基本的api。如果以后真正开发遇到问题可以在这里找到解决措施，并且还可以去官网查查api。
同样`DNS`模块，还有`Domain`模块也是一个道理，时间有限不敢过多投入大量精力。
[博客地址：net模块基础](http://www.cnblogs.com/chyingp/p/6072338.html)