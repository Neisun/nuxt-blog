---
title: Node.js-实用工具
tags:
  - Node
slug: 425
categories:
  - 技术随笔
  - Node之旅
date: 2017-09-20 15:48:42
description: "介绍 Node.js 的 util 实用工具模块。讲解 inherits、format 等常用方法，帮助提升 Node 开发的便捷性。"
image: /images/covers/056.jpg
---

Node.js中的一个内置模块，用来补充处理原生js的不足之处。util中有诸多的api，并不是每个都用得到，在这里，我也只是管中窥豹，浅尝辄止。主要用一下常用的api，所有的api还得查文档。基本上许多东西都是从文档中来，真要用脑袋记，港真，我记不住，而且容易记混。
废话不多说，直接看看，比较常用的api。

**`util.inherits`**

与原生js类似，Node.js也有自己的继承方式。
```js
// util.inherits() 是一个实现对象间原型继承的函数
var util = require("util");

function Base() {
    this.name = "base";
    this.year = "2017";
    this.location = "地球";
    this.show = function () {
        console.log(this.year+'年，'+this.name+' 入侵了，'+this.location)
    }
}
Base.prototype.sayHello = function () {
    console.log('Hello,'+this.name+'!');
}

function Sub() {
    this.name = "sub"
}
// 让Sub继承Base
util.inherits(Sub,Base);
var base = new Base();
var sub = new Sub();
// sub.show(); // 报错，没有这个方法，这是这么回事？
sub.sayHello(); // Hello,Sub! 
// sayHello是Base在原型中定义的方法，而sub继承了，但是在构造函数中的方法却没有继承。
// 原来util.inherits的继承只能继承原型链中的方法，构造函数内的方法和属性，他继承不了
```

**`util.inspect`**

用来将对象变成字符串的方法，实际中的用途是用来调试和错误输出
```js
/**
 * util.inspect(obj,[showHidden],[depth],[colors])
 * 将一个对象转化为字符串的方法，通常用来调试和错误输出
 * obj必填参数
 * showHidden，true/false，是否显示更多信息
 * depth表示最大递归层数
 * colors颜色打印
 */
var obj = {
    name:'Neisun',
    sex:'male',
    hobby:function () {
        console.log('play billiards');
    }
}
console.log(util.inspect(obj));
// { name: 'Neisun', sex: 'male', hobby: [Function: hobby] }
console.log(util.inspect(obj,true,2,true));
// { name: 'Neisun',
// sex: 'male',
// hobby:
//  { [Function: hobby]
//    [length]: 0,
//    [name]: 'hobby',
//    [arguments]: null,
//    [caller]: null,
//    [prototype]: hobby { [constructor]: [Circular] } } }
```

**`util.isArray()`**

判断是否是数组，返回true或者false；
```js
console.log(util.isArray([])); // true
console.log(util.isArray({})); // fasle
```

**`util.isDate()`**

判断是否是Date对象，返回true或者false;
```js
console.log(util.isDate(new Date())); // true
console.log(util.isDate(Date())); // false
```

<!--more-->
util的方法有很多，不一一赘述，得去官网查看api；
[Node.js中文网](http://nodejs.cn/api/util.html)