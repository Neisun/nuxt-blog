---
title: Node.js-路由部分
tags:
  - Node
slug: 408
categories:
  - 技术随笔
  - Node之旅
date: 2017-09-19 14:38:34
description: "讲解 Node.js 中路由的实现。通过解析请求路径分发不同处理逻辑，理解路由在搭建 Web 服务中的作用。"
image: /images/covers/053.jpg
---

Node.js路由部分，我不知道这一章节是否需要单独拿出来说一下。我甚至不清楚，这个路由是什么意思。如果是前端的路由，我能理解，这个Node.js的路由我还没想好怎么去给他下一个定义。

理解好这一节，得需要熟练使用两个内置模块，http和url模块。

使用http创建服务器和发送请求，使用url模块来解析。

顺带稍微复习一下url模块的用法；

url模块有三种最常用的api,url.parse,url.format,url.resolve；
看一下用法
```js
//  关于Node.js的路由部分，先来展开熟悉一下url的用法
var url = require("url");
var str = 'http://www.baidu.com:8080/upload?foo=bar&hello=world'

// url.parse字符串解析成对象
var parse = url.parse(str);
console.log(parse)
// 解析的结果
/*
Url {
  protocol: 'http:',
  slashes: true,
  auth: null,
  host: 'www.baidu.com:8080',
  port: '8080',
  hostname: 'www.baidu.com',
  hash: null,
  search: '?foo=bar&hello=world',
  query: 'foo=bar&hello=world',
  pathname: '/upload',
  path: '/upload?foo=bar&hello=world',
  href: 'http://www.baidu.com:8080/upload?foo=bar&hello=world' }
*/

// url.format
// 先创建一个对象
var urlObj = {
    // 协议
    protocol:'https:',
    // 主机(包含端口号)
    host:'www.hunaisong.cn:8080',
    // 端口号
    port:'8080',
    // 域名
    hostname:'www.hunaisong.cn',
    // 搜索部分，？后边部分，包含？
    search:'?type=jishu&name=js',
    // 搜索内容部分，？后边部分，不包含？
    query:'type=jishu&name=js',
    // 路径名字
    pathname:'/update',
    // 路径，包含路径之后所有
    path:'/update?type=jishu&name=js',
    // 完整的href
    href:'https://www.hunaisong.cn:8080/update?type=jishu&name=js'
}
// 进行格式化
var s = url.format(urlObj);
console.log(s)
// 结果
// https://www.hunaisong.cn:8080/update?type=jishu&name=js

// 还有一个resolve

var l = url.resolve('www.hunaisong.cn/upload/pic','../delete/article');
console.log(l);
// 结果
// www.hunaisong.cn/delete/article
```
那么接下来单刀直入，直奔主题，不多赘述。
我们想写一个方法，这个方法用来看出来请求的url，并且能区分出，请求的路由部分；
最直接的模式，不把模块区分出来，直接写。
看看写法
```js
// 最常规的写法
http.createServer((request,response) => {
    // console.log(request.url);
    var pathname = url.parse(request.url).pathname;
    console.log('Request from '+pathname+' received!');
    console.log('About to route a request for '+pathname);
    response.writeHead(200,{'Content-Type':'text/plain'});
    response.write('Hello world!');
    response.end();
}).listen(8088);
```
效果图

![](http://www.hunaisong.cn/wp-content/uploads/2017/09/route.jpg)

如果按模块区分，分成两个部分，一个是server,一个是route部分；
```js
//server.js
/*
 * @Author: hunaisong 
 * @Date: 2017-09-19 10:33:54 
 * @Last Modified by: hunaisong
 * @Last Modified time: 2017-09-19 13:50:13
 */
var http = require("http");
var url = require("url");

function start(route) {
    // 请求部分
    function onRequest(request,response) {
        var pathname = url.parse(request.url).pathname;
        console.log('Request from '+pathname+' received!');
        // 传入依赖函数，并且调用依赖函数
        route(pathname);
        response.writeHead(200,{'Content-Type':'text/plain'});
        response.write('Hello world!');
        response.end()

    }
    http.createServer(onRequest).listen(8088)
    console.log('Server started!')
}

// 暴露模块
exports.start = start;
```
```js
// router.js
/*
 * @Author: hunaisong 
 * @Date: 2017-09-19 10:58:06 
 * @Last Modified by: hunaisong
 * @Last Modified time: 2017-09-19 11:07:37
 */

function route(pathname) {
    console.log("About to route a request for " + pathname);
}

// 暴露模块
exports.route = route;
```
```js
// 主入口js，main.js文件
/*
 * @Author: hunaisong 
 * @Date: 2017-09-19 10:19:35 
 * @Last Modified by: hunaisong
 * @Last Modified time: 2017-09-19 13:51:40
 */
var server = require("./server");
var router = require("./router");

server.start(router.route);
```
大功告成，按模块划分，结束。