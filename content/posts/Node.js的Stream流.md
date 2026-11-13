---
title: Node.js的Stream流
tags:
  - javascript
  - Node
slug: 297
categories:
  - 技术随笔
  - Node之旅
date: 2017-08-18 11:19:11
description: "介绍 Node.js 中流的概念与使用。从「似曾相识」的感受切入，讲解可读流、可写流与管道操作，理解流式处理带来的优势。"
image: /images/covers/032.jpg
---

> **似曾相识燕归来**

第一次看到流这个概念有种“似曾相识燕归来”的感觉。为什么呢，总觉得之前在哪里接触过。后来看到管道流的时候，恍然大悟。Gulp里曾经提到过一次，只不过当时的着眼点在于使用gulp完成自动化配置。
那么，这个Stream流是个什么东西？

> **Stream是什么东西？**

Stream到底是什么？这是我在学习Stream时候，就在一直思考的问题。我就是想弄清楚这个概念的意思。是偏执么？No！而是说，如果你连你在接触的东西是什么都不知道，那你还研究什么呢！
看一下菜鸟教程给出的解释：一个抽象的接口，Node中许多对象实现了这个接口。这个解释，冠冕堂皇，狗屁不通。估计是直接生硬的翻译过来的。
那么我的理解是。就是读取文件时候，都是需要把文件读取完成之后，在进行下一步操作，如果文件太大，内存不足。就会阻塞线程，所以，需要有别的方式去解决问题。这个方式就是采用数据流，边读边进行下一步操作。

> **上一个demo**

比如我现在要读的这个.txt文件大的不得了，内存都放不下了，可以上天了
```js
// 准备copy一个test.txt文件到当前文件夹下，并命名为test2.txt
// 基础的写法，不使用数据流
var fs = require("fs");
fs.readFile(__dirname+"/test.txt",function (err,data) {
    if(err) console.log(err);
    console.log("读取的内容是"+data);
    fs.writeFile(__dirname+"/test2.txt",data,function (err) {
        if (err) console.log(err);
        console.log("拷贝成功！")
    })
})
```
上边已经做了假设，因为这个文件超大，所以采用上述的方式去做，估计这个时候系统已经卡死了。那么我们用流的方式去改写一下。
```js
var fs = require("fs");
// 创建一个可读流
var rs = fs.createReadStream(__dirname + "/test.txt");
// 创建一个可写流
var ws = fs.createWriteStream(__dirname + "/test2.txt");
// 可读流触发的data事件，在读的过程中会源源不断的触发这个事件
rs.on("data", function (chunk) {
    // 可读事件流收到data事件时，将内容写到可写流
    ws.write(chunk)
    console.log("读取")
})
// 可读流触发的end事件
rs.on("end", function () {
    // 可读事件流完成会发出end事件，此时关闭可写流
    ws.end();
    console.log("结束")
})*/
```

> **Stream类型和触发的事件**

```js
// Stream 四种流类型
/**
 * Readable - 可读操作。
 * Writable - 可写操作。
 * Duplex - 可读可写操作.
 * Transform - 操作被写入数据，然后读出结果。
 */

// 所有的 Stream 对象都是 EventEmitter 的实例。常用的事件有：
/**
 * data - 当有数据可读时触发。
 * end - 没有更多的数据可读时触发。
 * error - 在接收和写入过程中发生错误时触发。
 * finish - 所有数据已被写入到底层系统时触发。
 */
EventEmitter会下一次内容记录。
```

> **可读流**

```js
// 创建可读流
var rs = fs.createReadStream(__dirname + "/test.txt");
// 设置编码，处理中文
rs.setEncoding("UTF8");

// 处理事件流 data end error
rs.on("data", function (chunk) {
    // chunk是必填的形参
    data += chunk;
})
rs.on("end", function () {
    console.log(data)
})
rs.on("error", function (err) {
    console.log(err.stack)
})
console.log("执行完毕")
```

> **可写流**

```js
// 把文件写入流中
var fs = require("fs");
var data = "我就是一个测试文件"
var ws = fs.createWriteStream(__dirname+"/output.txt")
// 使用utf8编码，写入文件
ws.write(data,"utf8")
// 标记文件末尾
ws.end();
// 处理一下事件流 end error finish。。。
ws.on("finish",function () {
    console.log("写入完成")
})
ws.on("error",function (err) {
    console.log(err.stack)
})
console.log("执行完毕")
```

> **管道流**

盗一张图

![](http://www.hunaisong.cn/wp-content/uploads/2017/08/bVcla61.png)


管道流，看到这里，一切又是那么熟悉，在配置gulpfile.js时候的pipe不就是管道流么。配置过gulpfile.js的盆友，下边应该是手到擒来。
```js
// 读文件+写文件+链式流
var fs = require("fs");
fs.createReadStream(__dirname+"/test.txt")
.pipe(fs.createWriteStream(__dirname+"/output2.txt"))
console.log("执行完毕")
```

> **链式流**

与jQuery一样，可以采用链式操作。将管道流连起来写。管道流和链式流更配哦~
```js
// 链式流压缩文件
var fs = require("fs"),
    zlib = require("zlib");
// 创建一个读取流
fs.createReadStream(__dirname + "/test.txt")
    // 压缩
    .pipe(zlib.createGzip())
    // 写入流
    .pipe(fs.createWriteStream(__dirname + "/test.txt.gz"))

console.log("执行完毕")
```
```js
// 链式流解压文件
var fs = require("fs"),
    zlib = require("zlib");
// 创建一个读取流
fs.createReadStream(__dirname + "/test.txt.gz")
    // 解压
    .pipe(zlib.createGunzip())
    // 写入流
    .pipe(fs.createWriteStream(__dirname + "/test3.txt"))
console.log("解压完毕")
```
至此，Stream基本重要的点，都涵盖了。在写的时候，建议直接写链式流，可读性与代码量俱佳。