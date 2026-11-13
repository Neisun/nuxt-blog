---
title: Node.js的工具模块---path模块
tags:
  - javascript
  - Node
slug: 302
categories:
  - 技术随笔
  - Node之旅
date: 2017-08-21 10:07:24
description: "讲解 Node.js 最常用的工具模块之一——path。介绍处理文件路径的常用 API，如 join、resolve、basename 等，并提示路径标准化中的坑点。"
image: /images/covers/033.jpg
---

> **最常用的一个工具模块，path模块**

在操作文件时候，路径是一个问题哦。好在我们有工具模块，其中的path模块就是处理文件路径。
path有几个常用的api。下边就一一展示。

**一个坑：**

标准化之后的路径里的斜杠在Windows系统下是\，而在Linux系统下是/。如果想保证任何系统下都使用/作为路径分隔符的话，需要用.replace(/\\/g, '/')再替换一下标准路径

> **path.normalize()**

```js
var path = require("path");
// path.normalize() 规范化路径
console.log(path.normalize("test/dist/lib/..")) //解析为test\dist
console.log(path.normalize("test/dist/lib/."))  // 解析为test\dist\lib
```

> **path.join()，用于连接路径**

```js
console.log(path.join("test","dist/lib"))
console.log(path.join("/test","dist","lib"))
```

> **path.resolve()**

```js
// path.resolve() 解析为绝对路径
// 特点：相当于不断的调用系统的cd命令 
console.log(path.resolve('foo/bar', '/tmp/file/', '..', 'a/../subfile')) //  E:\tmp\subfile
```

> **path.relative()**

```js
console.log(path.relative("test/dist/lib/aa","test/dist/output/bb"))  // ../../output/bb
```

> **path.dirname()**

```js
console.log(path.dirname("/foo/bar/baz/asdf/quux.html")) // /foo/bar/baz/asdf
```

> **path.basename()**

```js
// 文件名称 path.basename(p, [ext]) 
// 特点：返回指定的文件名，返回结果可排除[ext]后缀字符串 
console.log(path.basename("/foo/bar/baz/asdf/quux.html")) //quux.html
console.log(path.basename("/foo/bar/baz/asdf/quux.html",".html")) //quux
```

> **path.extname()**

```js
// 扩展名称 path.extname(p) 
// 特点：返回指定文件名的扩展名称 
console.log(path.extname("/foo/bar/baz/asdf/quux.html")) // .html
```