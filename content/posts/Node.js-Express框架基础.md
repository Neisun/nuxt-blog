---
title: Node.js-Express框架基础
tags:
  - Express
  - Node
slug: 465
categories:
  - 技术随笔
  - Node之旅
date: 2017-09-26 16:46:28
description: "讲解 Node.js 的 Express 框架基础。介绍路由、中间件与请求响应处理，快速搭建一个结构清晰的 Web 应用。"
image: /images/covers/061.jpg
---

Express是一个简洁且灵活的框架。搭配node.js可以快速搭建一个功能完备的网站。

**安装**

`npm/cnpm i express --save`

express中还有许多有用的中间件
其中有三种中间价用的最多，就提前给安装上

`cnpm i body-parser cookie-parser multer --save`
```
body-parser - node.js 中间件，用于处理 JSON, Raw, Text 和 URL 编码的数据。
cookie-parser - 这就是一个解析Cookie的工具。通过req.cookies可以取到传过来的cookie，并把它们转成对象。
multer - node.js 中间件，用于处理 enctype="multipart/form-data"（设置表单的MIME编码）的表单数据。
```

**Hello world!实例**

```js
/*
 * @Author: hunaisong 
 * @Date: 2017-09-26 10:34:42 
 * @Last Modified by: hunaisong
 * @Last Modified time: 2017-09-26 10:38:06
 */
// hello,world案例
var express = require('express'),
    app = express();
app.get('/', (req, res) => {
    res.send('Hello world!')
})
var server = app.listen(8082, '127.0.0.1', () => {
    var host = server.address().address;
    var port = server.address().port;
    // %s表示字符串
    // %d表示number
    // %j表示json
    // %单个百分号，表示一个占位符
    console.log('实例地址:http://%s:%s', host, port)
})
```

**请求和响应-api**

```
Request 对象 - request 对象表示 HTTP 请求，包含了请求查询字符串，参数，内容，HTTP 头部等属性。常见属性有：
req.app：当callback为外部文件时，用req.app访问express的实例
req.baseUrl：获取路由当前安装的URL路径
req.body / req.cookies：获得「请求主体」/ Cookies
req.fresh / req.stale：判断请求是否还「新鲜」
req.hostname / req.ip：获取主机名和IP地址
req.originalUrl：获取原始请求URL
req.params：获取路由的parameters
req.path：获取请求路径
req.protocol：获取协议类型
req.query：获取URL的查询参数串
req.route：获取当前匹配的路由
req.subdomains：获取子域名
req.accepts()：检查可接受的请求的文档类型
req.acceptsCharsets / req.acceptsEncodings / req.acceptsLanguages：返回指定字符集的第一个可接受字符编码
req.get()：获取指定的HTTP请求头
req.is()：判断请求头Content-Type的MIME类型
```
```
Response 对象 - response 对象表示 HTTP 响应，即在接收到请求时向客户端发送的 HTTP 响应数据。常见属性有：
res.app：同req.app一样
res.append()：追加指定HTTP头
res.set()在res.append()后将重置之前设置的头
res.cookie(name，value [，option])：设置Cookie
opition: domain / expires / httpOnly / maxAge / path / secure / signed
res.clearCookie()：清除Cookie
res.download()：传送指定路径的文件
res.get()：返回指定的HTTP头
res.json()：传送JSON响应
res.jsonp()：传送JSONP响应
res.location()：只设置响应的Location HTTP头，不设置状态码或者close response
res.redirect()：设置响应的Location HTTP头，并且设置状态码302
res.send()：传送HTTP响应
res.sendFile(path [，options] [，fn])：传送指定路径的文件 -会自动根据文件extension设定Content-Type
res.set()：设置HTTP头，传入object可以一次设置多个头
res.status()：设置HTTP状态码
res.type()：设置Content-Type的MIME类型
```

**路由部分**

```js
/*
 * @Author: hunaisong 
 * @Date: 2017-09-22 16:13:35 
 * @Last Modified by: hunaisong
 * @Last Modified time: 2017-09-26 10:52:04
 */

//  配置请求路由，最简单的写法
var express = require('express'),
    app = express();
// get请求
app.get('/', function(req, res) {
    res.send('主页 get 请求')
})
// post 请求
app.post('/', function(req, res) {
    res.send('主页 post 请求')
})
// user页面get请求
app.get('/user', function(req, res) {
    res.send('user 页面')
})
// del_user页面get请求
app.get('/del_user', function(req, res) {
    res.send('del_user 页面')
})
// 正则匹配ab*cd页面get请求
app.get('/ab*cd/', function(req, res) {
    res.send('正则匹配 页面')
})
var server = app.listen(8081, '127.0.0.1', function() {
    console.log('服务器启动')
    var port = server.address().port;
    var host = server.address().address;
    console.log('访问地址：http://%s:%s', host, port)
})
```

**静态文件**

一个网站会有存放静态资源的地方比如页面，js文件，css文件，图片等等都属于静态资源。
怎么让页面显示静态资源？
```js
/*
 * @Author: hunaisong 
 * @Date: 2017-09-25 14:28:00 
 * @Last Modified by: hunaisong
 * @Last Modified time: 2017-09-25 14:50:39
 */
// 加载静态文件
var express = require('express'),
    app = express();
// 这一步很关键，是用来加载静态资源的，public文件夹是用来存放静态文件的。
// 最需要注意的是public文件夹的路径，一般是与你bash的文件夹保持同级目录
// 比如 node Express/index.js ，那么public应该与Express文件夹同级
app.use(express.static('public'))
app.get('/', function(req, res) {
    res.send('Hello,world!')
})

var server = app.listen(8081, '127.0.0.1', function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('访问地址：http://%s:%s', host, port)
})
// 我在public文件中放置一个test.txt文件，启动服务器之后，我们输入localhost:8081/test.txt，就会出现我们定义好的test.txt文件
// 各种静态资源都可以，比如放置一个user.jpg图片同样也是可以获取到的
```
效果图

![](http://www.hunaisong.cn/wp-content/uploads/2017/09/static.gif)

**get提交一个表单**

```html
// 表单部分 myGet.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>get页面</title>
</head>
<body>
    <form action="/get" method="get">
        <div>
            姓名：<input type="text" name="name" value="">
        </div>
        <div>
            性别：<input type="text" name="sex" value="">
        </div>
        <div>
            <input type="submit" name="" value="提交">
        </div>
    </form>
</body>
</html>
```
```js
// myGet.js文件
/*
 * @Author: hunaisong 
 * @Date: 2017-09-26 11:06:09 
 * @Last Modified by: hunaisong
 * @Last Modified time: 2017-09-26 11:23:39
 */
// get提交表单
var express = require('express'),
    app = express(),
    path = require('path');

// 设置myGet.html路由时候打开的文件
app.get('/myGet.html',(req,res) => {
    res.sendFile(path.join(__dirname,'myGet.html'));
})
// get方式提交表单会把参数放入到url中
app.get('/get',(req,res) => {
    // 设置一下回复头信息，不然中文会乱码
    res.writeHead(200,{'Content-Type':'text/plain;charset=utf8'})
    var response = {
        name:req.query.name,
        sex:req.query.sex
    }
    res.end(JSON.stringify(response))
})
var server = app.listen(8082);
```

**post 提交一个表单**

```html
// post页面 myPost.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>post提交表单</title>
</head>
<body>
    <form action="/post" method="post">
        <div>
            姓名：<input type="text" name="name" value="">
        </div>
        <div>
            性别：<input type="text" name="sex" value="">
        </div>
        <div>
            <input type="submit" name="" value="提交">
        </div>
    </form>
</body>
</html>
```

```js
/*
 * @Author: hunaisong 
 * @Date: 2017-09-26 11:27:03 
 * @Last Modified by: hunaisong
 * @Last Modified time: 2017-09-26 13:28:51
 */
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    path = require('path');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/myPost.html',(req,res) => {
    res.sendFile(path.join(__dirname,'myPost.html'));
})
app.post('/post',(req,res) => {
    res.writeHead(200,{'Content-Type':'text/plain;charset=utf8'})
    var response = {
        name:req.body.name,
        sex:req.body.sex
    }
    res.end(JSON.stringify(response))
})
app.listen(8082);
```

**上传文件**

上传文件同样需要一个html页面
```html
// upload.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>上传</title>
</head>
<body>
    // 上传的页面的表单需要设置enctype
    <form action="/upload" method="post" enctype="multipart/form-data">
        <input type="file" name="image" value="">
        <input type="submit" name="" value="上传文件">
    </form>
</body>
</html>
```

```js
// upload.js 注释较多，能繁琐一些，但都是比较实用的注释
/*
 * @Author: hunaisong 
 * @Date: 2017-09-26 13:30:58 
 * @Last Modified by: hunaisong
 * @Last Modified time: 2017-09-26 15:19:24
 */
var express = require('express'),
    app = express(),
    path = require('path'),
    multer = require('multer'),
    fs = require('fs');
// 设置储存在内存中什么位置，并且形成一个数组，因为只有一个上传表单，简写处理，如果有多个，参考multer介绍 
// 需要app.use不要忘记了。。。,设置dest如果直接tmp会在跟目录下创建文件夹，储存临时文件，如果设置/tmp/是会存在内存中
app.use(multer({ dest: '/tmp/' }).array('image'));
// 设置upload.html路由部分
app.get('/upload.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'upload.html'));
})
// 设置post之后跳转的页面
app.post('/upload', (req, res) => {
    // 上传的文件会存放在req.files数组中，第一个文件就是当前上传的文件
    console.log(req.files[0]);
    // 提前定义一个写入文件的路径
    var des_file = __dirname + '/assets/' + req.files[0].originalname;
    // console.log(des_file)
    // 上传文件需要先对文件进行读取
    fs.readFile(req.files[0].path, (err, data) => {
        if (err) {
            console.log(err)
        } else {
            // 如果没有错误，那么写入文件
            fs.writeFile(des_file, data, (err) => {
                if (err) {
                    console.log(err)
                } else {
                    // 创建一个对象来展示上传成功并且展示出文件名
                    response = {
                        message: 'File upload successfully!',
                        filename: req.files[0].originalname
                    }
                }
                console.log(response)
                res.writeHead(200, { 'Content-Type': 'text/plain;charset=utf8' })
                res.end(JSON.stringify(response))
            })
        }
    })
})
var server = app.listen(8082, () => {

});
```

**cookie部分**

```js
/*
 * @Author: hunaisong 
 * @Date: 2017-09-26 10:04:44 
 * @Last Modified by: hunaisong
 * @Last Modified time: 2017-09-26 15:24:12
 */
var express = require('express'),
    app = express(),
    // cookie-parser是格式化cookie必备良药
    cookieParser = require('cookie-parser');
app.use(cookieParser());
app.get('/', (req, res) => {
    console.log("Cookie：", req.cookies);
    res.end(JSON.stringify(req.cookies))
})
var server = app.listen(8082);
```

至此，Express框架最基础的部分告一段落，Express框架还有相当多的东西，我是管中窥豹，只见一斑。

[Express 4.x API 中文手册](http://www.expressjs.com.cn/4x/api.html)