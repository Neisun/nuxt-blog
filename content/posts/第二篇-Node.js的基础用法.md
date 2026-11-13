---
title: 第二篇-Node.js的基础用法
tags:
  - javascript
  - Node
slug: 273
categories:
  - 技术随笔
  - Node之旅
date: 2017-08-08 15:42:53
description: "Node.js 系列第二篇，讲解基础用法。涵盖模块引入、变量作用域、常用全局对象与基本语法，为后续深入学习文件系统、网络模块做铺垫。"
image: /images/covers/027.jpg
---

学一门语言，其实就是需要知道，他能做啥。那么Node能做啥？
> **Node能做啥？**
NodeJS的作者说，他创造NodeJS的目的是为了实现高性能Web服务器，他首先看重的是事件机制和异步IO模型的优越性，而不是JS。但是他需要选择一种编程语言实现他的想法，这种编程语言不能自带IO功能，并且需要能良好支持事件机制。JS没有自带IO功能，天生就用于处理浏览器中的DOM事件，并且拥有一大群程序员，因此就成为了天然的选择。

如他所愿，NodeJS在服务端活跃起来，出现了大批基于NodeJS的Web服务。而另一方面，NodeJS让前端众如获神器，终于可以让自己的能力覆盖范围跳出浏览器窗口，更大批的前端工具如雨后春笋。

因此，对于前端而言，虽然不是人人都要拿NodeJS写一个服务器程序，但简单可至使用命令交互模式调试JS代码片段，复杂可至编写工具提升工作效率。

NodeJS生态圈正欣欣向荣。
> **我使用Node过程中引起我重视的点**

**1.首先是如何运行。**

你写的再天花乱坠，但是不知道怎么去运行。那真是笑死人了。

一般来说运行node，用命令行。我用的是windows系统，所以，git Bash Here ，直接打开Bash，然后键入Node，运行；

![](http://www.hunaisong.cn/wp-content/uploads/2017/08/clipboard.png) 
![](http://www.hunaisong.cn/wp-content/uploads/2017/08/clipboard1.png)

**2.require，module，exports**
记得之前使用vue的时候，在项目的配置文件中经常会看到这样的字眼。
require，是引入模块，可以是你自己写的js文件，也可以是node_modules中你的包，引入你自己定义的模块，需要写上src，也就是目标的位置。而且你只能写"./"开头的相对位置，除非你在环境变量中加入了你要require的文件的环境变量，否则，免谈。
```javascript
var test = require("./src/test.js");// 引入当前文件夹下，src文件夹下的test.js文件
```

module，exports，这两个一时让我有点傻傻分不清楚。
exports是一个对象，记住了，他是对象。哎，无处不在的对象，万物皆对象。他是当前模块导出的对象。别的模块通过require就能得到。看看怎么用吧。
```javascript
// hello.js
function hello () {
  console.log("hello world!")
}
exports.hello = hello;
// index.js
var hello = require("./hello");
hello.hello();
// 你引入的hello是一个对象，hello对象下边的hello是一个方法，有点绕。主要是我把命名重复了。
// 咱改一下吧
var module = require("./hello");
module.hello();
```
module对象说是可以访问到当前模块的一些信息。但最多的用途是替换当前模块的导出对象。一般导出的对象是一个普通的对象，我们可以把它变成函数
```javascript
module.exports = function () {...};
// 而且这是我见过用的最多的方式
```
总结一下：
**require用来引入模块
exports.name = ...,导出模块
module.exports = ...,导出模块**
基本的就这么些，都是js语法。