---
title: Node.js-web模块部分（http模块-1）
tags:
  - Node
slug: 325
categories:
  - 技术随笔
  - Node之旅
date: 2017-08-30 17:21:04
description: "Node.js 系列之 web 模块（上），讲解 http 模块创建服务器与客户端的基本用法。介绍如何监听请求、返回响应，迈出搭建 Web 服务的第一步。"
image: /images/covers/038.jpg
---

> **Node.js-web模块部分**

Node.js提供了一个模块--http模块，用来创建服务器端和客户端。
http是node的一个内置模块，使用方式：
```js
var http = require("http");
```
我们先来搭建一个最简单的服务器；
**搭建最简单的服务器**
```js
// 使用http的createServer，方法搭建一个HTTP服务器
http.createServer((request,response) => {
  // 设置响应头部
  response.writeHead(200,{'content-type':'text/plain'});
  // 设置响应的输出
  response.end("hello world");
  // 监听8081端口
  console.log(request.headers)
}).listen(8080);
//打开浏览器输入localhost:8080就能看到了
```
如图所示：

![](http://www.hunaisong.cn/wp-content/uploads/2017/08/server_1.jpg)

**利用http模块发送请求**

我们在另一个js文件中写一个客户端的请求
客户端的请求写法
```js
/**
 * http.request(options,callback)
 * options,定义请求的url，端口，方法，等等
 * callback，参数response，用来接收响应体
 */
```
```js
// 你要发送这个请求，那么就必须确保你请求的服务器启动啦，这就是为什么，另起一个js文件写的原因。
var options = {
    hostname:'localhost',
    port:8080,
    method:'get',
    headers:{'content-type':'text/plain'}
}
var request = http.request(options,(response) => {
    // 打印出响应体的头部信息
    console.log(response.headers)
})
request.write('test');
request.end();
```
再来看看比较经典的案例，这两个例子是连在一起来分析；服务器端开启服务器，并读取发送请求的页面的url，然后对url解析，读取url的路径，然后找到该文件，读取该文件，把该文件写入到响应中。
一个开启服务器的例子；
```js
var http = require("http");
// url解析模块
var url = require("url");
// 文件模块
var fs = require("fs");
// 路径模块
var path = require("path");
http.createServer((request,response) => {
    // 调用url模块，来获取url信息。具体用法会说明一下
    var pathname = url.parse(request.url).pathname;
    // 首先得到的pathname是'/index.html'，所以需要把'/'截取掉，然后需要对路径进行处理
    pathname = path.join(__dirname,pathname.slice(1));
    fs.readFile(pathname,(err,data) => {
        if (err) {
            console.log(err);
            // 错误，写入404
            response.writeHead(404,{'Content-Type':'text/html'})
        }else {
            // 正确，写入200，statusCode
            response.writeHead(200,{'Content-Type':'text/html'});
            // 把文件的内容写入到相应中
            response.write(data.toString());
        }
        // 发送相应数据
        response.end();
    })
}).listen(8083)
```
客户端发送请求例子
```js
var http = require("http");
var options = {
    hostname:'localhost',
    path:'/index.html',
    method:'get',
    headers:{'Content-Type':'text/html'},
    port:8083,
}

var request = http.request(options,(response) => {
    var body = "";
    response.on('data',(chunk) => {
        body+=chunk;
    })
    response.on('end',() => {
        console.log(body);
    })
})
request.end()
```
下次会分析一下，其他http模块中其他api的用法；比如url等等