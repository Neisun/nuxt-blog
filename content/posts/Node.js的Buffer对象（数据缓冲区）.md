---
title: Node.js的Buffer对象（数据缓冲区）
tags:
  - javascript
  - Node
slug: 294
categories:
  - 技术随笔
  - Node之旅
date: 2017-08-15 14:30:47
description: "讲解 Node.js 中的 Buffer 对象（数据缓冲区）。介绍 Buffer 的由来、创建方式与读写操作，帮助理解 Node 如何在字符串之外处理二进制数据。"
image: /images/covers/031.jpg
---

> **Buffer是个什么鬼**

带着这个疑惑，我开始笑研究了一下Buffer对象。然后对资料做了总结，得出的Buffer真面目。
**Buffer是node.js中的数据块
js语言有字符串数据类型，没有二进制类型。Node.js就创造了一个与String对等的Buffer来对二进制操作
Buffer是一个专门存放二进制数据的缓存区**
Buffer就是这么个东西。
知己知彼，百战不殆。已经知道了，他是个什么鬼了，那么该怎么深入了解这个鬼，那就扒下他的面目。

**一、创建一个Buffer类**

有三种方式，创建一个Buf类；和创建一个数组是如此之相像；
```js
// 1.传入长度，长度表示字节
var buf1 = new Buffer(10);
// 2.通过给定数组来创建
var buf2 = new Buffer([01, 02, 03, 04]);
// 3.通过字符串创建
var buf3 = new Buffer("hello,world!");
```
**二、Buffer常用的api**
_2.1 写入缓冲区_
```js
/**
 * buf.write(string,offset,length,encoding)
 * string,必填，写入的字符串
 * offset,写入缓冲区的起始位置，默认是0
 * length，写入的字节数，默认是buf.length
 * encoding，使用的编码格式，默认是utf-8
 */
```
```js
var buf4 = new Buffer(256);
console.log(buf4.write("test")) // 返回的是写入的字节数
// 所以我们这么写
var len = buf4.write("test");
console.log("写入缓冲区 " + len + " 字节")
```
_2.2 读取缓冲区_
```js
/**
 * buf.toString(encoding,start,end)
 * encoding，编码格式，默认utf-8
 * 读取起始位置
 * 读取结束位置
 */
```
```js
// 打印出26个字母
var buf5 = new Buffer(26);
for (var i = 0; i < 26; i++) {
    buf5[i] = 97 + i;
}
console.log(buf5.toString('ascii', 0, 5))
```
_2.3 转化为JSON对象_
```js
/**
 * buf.toJSON()
 * 返回一个JSON对象
 */
```
```js
var buf6 = new Buffer("hello,world!")
var json = buf6.toJSON();
console.log(json)
```
_2.4 合并缓冲区_
```js
/**
 * Buffter.concat(list,totalLength)
 * list,一个数组，用来存放buf
 * totalLength，可选参数，合并后Buffer对象的总长度
 */
```
```js
var buf7 = new Buffer("Neisun的博客:")
var buf8 = new Buffer("www.hunaisong.cn")
var buf9 = Buffer.concat([buf7, buf8]);
console.log("buf9的内容是" + buf9.toString())
```
_2.5 缓冲区比较_
```js
/**
 * buf.compare(otherBuf)
 * 返回的是一个数字，表示buf在otherBuffter之前，之后或是相同
 */
```
```js
var buf10 = new Buffer("123");
var buf11 = new Buffer("1234")
var result = buf10.compare(buf11)
console.log(result)
if (result === -1) {
    console.log(buf10 + "在" + buf11 + "之前")
} else if (result === 0) {
    console.log(buf10 + "与" + buf11 + "相同")
} else {
    console.log(buf10 + "在" + buf11 + "之后")
}
```
_2.6 拷贝一个缓冲区_
```js
/**
 * buf.copy(targetBuf,targetStart,sourceStart,sourceEnd)
 * targetBuf,必填参数，要拷贝的到的buf对象
 * targetStart,可选参数，数字，默认0
 * sourceStart,可选参数，数字，默认0
 * sourceEnd,可选参数，数字，默认buffer.length
 */
```
```js
var buf12 = new Buffer("1234");
var buf13 = new Buffer(4);
buf12.copy(buf13);
console.log("buf13的内容是" + buf13.toString())
```
_2.7 剪裁缓冲区_
```js
/**
 * buf.slice(start,end)
 * start,剪裁的起点
 * end,剪裁的终点
 */
```
```js
var buf14 = new Buffer("ABCDE");
var buf15 = buf14.slice(0, 3);
console.log("buf15的内容是" + buf15.toString())
```
_2.8 缓冲区的长度_
```js
/**
 * buf.length
 * 返回数字，buffer的长度
 */
```
```js
var buf16 = new Buffer("人生得意须尽欢")
// utf-8编码中文，一个中文三个字符
console.log(buf16.length)
```

> **一个必须要说的区别**

 * Buffer与字符串有个区别，那就是字符串是只读的，对字符串的更改其实就是新建了一个字符串，而原字符串还是没有改变
 * 但Buffer不是，你可以任意在Buffer上修改，而原Buffer也会跟着变化
 * slice方法，Buffer的字符串方法，截取功能和js没有不同
 * 但是js的slice方法，我们一般用一个变量接收截取的数组也好，字符串也好，对这个变量的修改是不会反作用于原数组和字符串的。但是Buffer会，他更像一个指针。
举个栗子：
```js
var arr = [0, 1, 2, 3, 4];
var str = "01234";
var myBuf = new Buffer([0, 1, 2, 3, 4]);
// 分别使用slice方法，截取从下脚标2到结尾
var newArr = arr.slice(2);
var newStr = str.slice(2);
var newBuf = myBuf.slice(2);
// 分别打印出来
console.log(newArr)
console.log(newStr)
console.log(newBuf)
// 然后对截取出来的数组，字符串，buf的第一位做修改，然后打印数据源
newArr[0] = 5;
newStr[0] = "5"; // 字符串是改不了的
newBuf[0] = 5;
console.log(arr) // [0,1,2,3,4,5]
console.log(str) // "01234"
console.log(myBuf) // <Buffer 00 01 05 03 04>,发现原Buffer也发生了变化，这就是不同之处。
```