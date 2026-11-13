---
title: Node.js-Post/Get
tags:
  - Node
slug: 427
categories:
  - 技术随笔
  - Node之旅
date: 2017-09-21 14:13:46
description: "讲解 Node.js 处理 POST 与 GET 请求。介绍如何接收请求数据、解析参数并返回响应，是搭建接口的基础。"
image: /images/covers/057.jpg
---

之前学习Node.js中web模块时候涉及到请求。请求离不开`post/get`，本次就是综合之前所学，做一次小小的总结。

**`get请求`**

get请求方式大概是最常用的请求了，基本上网页开头的请求都是get请求。写一个案例，将发起请求的url中的所有参数放到页面中。
```js
/*
 * @Author: hunaisong 
 * @Date: 2017-09-21 11:19:19 
 * @Last Modified by: hunaisong
 * @Last Modified time: 2017-09-21 14:02:16
 */
// 依赖的模块
var http = require('http'),
    url = require('url'),
    util = require('util');
// 创建服务器
http.createServer((req, res) => {
    // 利用url.parse工具将url转换为对象
    var urlObj = url.parse(req.url);
    // 写请求头
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    // 这个end必须写，要不你会发现页面一直loading状态，因为我忘写过。。
    res.end(util.inspect(urlObj, true, true));
}).listen(8082)
```
效果图

![](http://www.hunaisong.cn/wp-content/uploads/2017/09/get.jpg)

**`post请求`**

因为初涉node.js，我有点不会写代码了。我不知道用什么方式去来一个post请求，所以索性来一个表单。案例参考菜鸟教程来的，十分感谢这个网站。
```js
/*
 * @Author: hunaisong 
 * @Date: 2017-09-21 11:02:50 
 * @Last Modified by: hunaisong
 * @Last Modified time: 2017-09-21 14:06:06
 */
var http = require("http"),
    qs = require("querystring");

// html字符串
var postHtml = '<html lang="en">' +
    '<head>' +
    '<title>Node.js 表单</title>' +
    '</head>' +
    '<body>' +
    '<form method="post">' +
    '姓名：<input type="text" name="name" value=""></br>' +
    '性别：<input type="text" name="sex" value=""></br>' +
    '<input type="submit" name="" value="提交">' +
    '</form>' +
    '</body>' +
    '</html>'

http.createServer((req, res) => {
    // 存储数据的body
    var body = "";
    // data事件
    req.on("data", (chunk) => {
        body += chunk;
    })
    // end事件
    req.on("end", () => {
        // 解析一下body，变成对象
        body = qs.parse(body);
        // 这个字符编码charset表忘写，不然乱码
        res.writeHead(200, { 'Content-Type': 'text/html;charset=utf8;' });
        if (body.name && body.sex) {
            res.write('姓名：' + body.name);
            res.write('</br>');
            res.write('性别：' + body.sex);
        } else {
            res.write(postHtml)
        }
        res.end()
    })
}).listen(3000)
```

效果图

![](http://www.hunaisong.cn/wp-content/uploads/2017/09/post.gif)

（完）