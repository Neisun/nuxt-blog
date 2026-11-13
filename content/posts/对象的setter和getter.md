---
title: 对象的setter和getter
tags:
  - javascript
slug: 530
categories:
  - 技术随笔
date: 2017-11-22 14:13:58
description: "讲解对象属性中的 setter 与 getter 访问器。介绍如何定义读写属性时的拦截逻辑，实现数据校验与惰性计算。"
image: /images/covers/075.jpg
---

> 对象的getter和setter

用几个小例子，来解读一下，对象的getter和setter。
先从字面意义上理解一下，getter和setter。getter，获取值。setter，设置值。其实字面意义上的理解，基本就说明了问题。
看个小例子，琢磨一下，问题所在。
```javascript
var newObj = {
    a:10,
    set a(val) {
        this.a = val;
    }
}
console.log(newObj.a);
// 你猜到结果了么，结果是undefined
```
你可能会疑惑，为什么会这样。因为，你只是设置了setter，并没有设置getter。getter用来获取值，没有设置，自然无法获得。
再来看一个例子，不写setter，看看会出现什么问题。
```javascript
var newObj = {
    a:10,
    get a() {
        return 10;
    }
}
console.log(newObj.a) // 10
newObj.a = 20;
console.log(newObj.a) // 10
// 猜到结果了么，无法设置a的属性，你说是不是很气人
```
上面的例子，说明了，不写setter，无法设置属性的值。
在我们创建一个对象的过程中，我们定义了一个属性，如果没有写setter和getter，那么js有一种机制，会自动给你生成getter和setter，简化来看，就是这样。
```javascript
var newObj = {
  a:10,
  get a() {
    return this._a;
  },
set a(val) {
    this._a = val;
  }
}
// 简化我们创建对象时候，js的机制，其实应该远比这复杂；
```
那么，就算我们知道了这个，又有什么作用？实际开发过程中，我们怎么派的上用场。
看个例子
我们有个需求，如果我们有一个属性是edtion代表了出版的版本迭代次数，从2011年开始，到了2012年，edition自动变成2，以此类推。
我们怎么直接定义这个对象
```javascript
var myObj = {
    year: 2011,
    edition: 1,
    set year(val) {
        this.edition += val - 2011;
    }
}
myObj.year = 2013;
console.log(myObj.year); // undefined,没有设置getter的原因，我们也不需要设置。
// edtion才是我们想要的
console.log(myObj.edition); // 3
```
上边的这种方式，貌似很不友好，虽然year并不被需要，但是，至少可以通过这个属性知道年份。
那么，我们用另一种方式来定义一下。
```javascript
var myObj = {
 year:2011,
 edition:1
}
Object.defineProperty(myObj,'_year',{
  get:function () {
    return this.year
  },
  set:function (val) {
    this.year = val;
    this.edition += val-2011;
  }
})
// 这样一来，year属性就不是没用的属性了。但是修改year是无法直接更改edition的，我们需要修改_year这个属性，才可以。
myObj._year = 2013;
console.loh(myObj.year) // 2013
console.log(myObj.edition) // 3
// 达到了，我们的目的，而且，_year是不可枚举的一个属性。
```

其中，有一个Object.defineProperty(),这个其实很简单，是配置一个对象的属性的。
对象的属性
**value 值
**writable 是否可写
**enumerable 是否可被枚举
**configurable 是否可被配置
**get
**set
用法如下
```javascript
Object.defineProperty(sourceObj,key,{
  value:...
  .....
})
```