---
title: Node.js-web模块（http模块-2）
tags:
  - Node
slug: 343
categories:
  - 技术随笔
  - Node之旅
date: 2017-08-31 10:40:59
description: "Node.js 系列之 web 模块（下），补充 http 模块的常用工具。结合 url、querystring 等模块解析请求，实现更完整的请求响应处理流程。"
image: /images/covers/039.jpg
---

**http模块中常用的其他工具模块api**

> **url模块**

```js
var url = require("url");
var str = "http://user:pass@host.com:8080/p/a/t/h?query=string#hash"
console.log(url.parse(str))
// 会得到如下的对象
/*Url {
    protocol: 'http:',
    slashes: true,
    auth: 'user:pass',
    host: 'host.com:8080',
    port: '8080',
    hostname: 'host.com',
    hash: '#hash',
    search: '?query=string',
    query: 'query=string',
    pathname: '/p/a/t/h',
    path: '/p/a/t/h?query=string',
    href: 'http://user:pass@host.com:8080/p/a/t/h?query=string#hash' }*/
```
```js
// 反过来有一个url.format()方法，将传入的对象转化为url
var url_1 = url.format({
    protocol: 'http:',
    host: 'www.example.com',
    pathname: '/p/a/t/h',
    search: 'query=string'
});
console.log(url_1)
/* =>
'http://www.example.com/p/a/t/h?query=string'
*/
```
```js
// resolve方法，用于拼接，返回上一级菜单，baz和foo是同级文件夹
var url_2 = url.resolve('http://www.example.com/foo/bar', '../baz');
console.log(url_2)
/* =>
http://www.example.com/baz
*/
```

> **querystring**

```js
// querystring 模块用于实现url参数字符串与参数对象的相互转换
var url = require("url");
var querystring = require("querystring");
var str = "http://www.baidu.com:8080/update?name=Davaid&sex=male&job=FE&job=developer";
var qs = url.parse(str).query;
console.log(querystring.parse(qs));
// => { name: 'Davaid', sex: 'male', job: [ 'FE', 'developer' ] }
```

> **zlib模块是用来压缩和解压的**

```js
// 首先我们看一个使用zlib模块压缩HTTP响应体数据的例子。这个例子中，判断了客户端是否支持gzip，并在支持的情况下使用zlib模块返回gzip之后的响应体数据
http.createServer(function (request, response) {
    var i = 1024,
        data = '';

    while (i--) {
        data += '.';
    }

    if ((request.headers['accept-encoding'] || '').indexOf('gzip') !== -1) {
        zlib.gzip(data, function (err, data) {
            response.writeHead(200, {
                'Content-Type': 'text/plain',
                'Content-Encoding': 'gzip'
            });
            response.end(data);
        });
    } else {
        response.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        response.end(data);
    }
}).listen(80);
```
```js
// 接着我们看一个使用zlib模块解压HTTP响应体数据的例子。这个例子中，判断了服务端响应是否使用gzip压缩，并在压缩的情况下使用zlib模块解压响应体数据。
var options = {
    hostname: 'www.example.com',
    port: 80,
    path: '/',
    method: 'GET',
    headers: {
        'Accept-Encoding': 'gzip, deflate'
    }
};

http.request(options, function (response) {
var body = [];

response.on('data', function (chunk) {
    body.push(chunk);
});

response.on('end', function () {
    body = Buffer.concat(body);

    if (response.headers['content-encoding'] === 'gzip') {
        zlib.gunzip(body, function (err, data) {
            console.log(data.toString());
        });
    } else {
        console.log(data.toString());
    }
});
}).end();
```