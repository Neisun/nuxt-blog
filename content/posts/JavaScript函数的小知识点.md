---
title: JavaScript函数的小知识点
slug: 528
categories:
  - 技术随笔
date: 2017-11-20 17:09:51
tags:
description: "记录 JavaScript 函数的一些小知识点。从声明、表达式到闭包与作用域，补充函数使用中容易被忽略的细节。"
image: /images/covers/074.jpg
---

> 源于意外

没有这个意外，我还真不知道JavaScript中函数的length和arguments.length区别。
写下此篇，记录一下。同时也告诫自己，不能随便忽视任何一个知识点，还有一些细节。
这个意外，源自于编辑器自带的提示。
我写了一个函数，当我想执行函数的时候，发现函数竟然有length属性。然后，我就联想到arguments不是也有length属性么，难道二者不同。
结果，还真有所不同。
```javascript
function test(a,b,c,d) {
  console.log(a,b);
  console.log(arguments.length)
}
// 如上所示，我创建了一个test函数，里边有四个形参，a,b,c,d
// 并且函数，在实际执行的时候，只使用了a,b两个形参
// 我们打印出test.length看看
console.log(test.length); // 4，也就是说function.length表示形参的个数
test('a','b'); // a,b 2 
// 说明一个问题就是arguments.length表示函数实际使用形参的个数
```
不深奥，不难理解。但是足够击垮你自认为了解挺多的信心。
一个细节，一个知识点。
给自己提个醒！