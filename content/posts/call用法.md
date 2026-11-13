---
title: call用法
tags:
  - javascript
slug: 421
categories:
  - 技术随笔
  - JavaScript技巧与常见问题
date: 2017-09-20 13:39:25
description: "讲解 JavaScript 中 call 方法的用法。通过示例说明如何改变函数执行时的 this 指向，并与 apply、bind 做对比。"
image: /images/covers/055.jpg
---

在看Node.js过程中，用到了工具模块。工具模块是用来实现Node.js的继承的。简单浏览过程中突然联想到了，`JavaScript`中的一些继承用法。其中有一种继承方式是使用call改变this指向，来实现继承。但是，一直对这个用法迷迷糊糊，究其原因一是使用少，二是确实存在误区。
借着这个机会对call用法做一个总结，就当做一份笔记，如果以后忘记可以拿过来看看，唤起记忆~

> **call的用法**

最简单的用法
```javascript
obj1.method.call(obj2,arg1,arg2);
/**
 * call的用法很有趣
 * obj1.method.call(obj2,arg1,arg2),后边的参数是任何形式
 * 把obj1的method给obj2用，但其实，obj2根本就没有这个方法，obj2.method是没有的。
 * 这里是把this的指向变了，由obj1 => obj2
 */
```
举例说明
```javascript
// 定义一个Person的构造函数，传入一个sayHello方法
function Person() {
    this.name = 'Neisun';
    this.sayHello = function () {
        console.log('Hello,'+this.name);
    }
}
// 定义一个Animal的构造函数，没有sayHello方法
function Animal() {
    this.name = 'Cat';
}
var person = new Person();
var animal = new Animal();

// 先调用一下sayHello方法
person.sayHello(); // Hello,Neisun
// 把这个方法给animal用
person.sayHello.call(animal); //Hello,Cat  
// 实际上animal并没有sayHello这个方法，类似于我借你用了，其实是this指向发生了变化
// 这里一直有一个误区，就是以为animal中也有了sayHello这个方法，其实，压根就没有。
// 另外，person.sayHello.call(animal),也是执行了函数，但this指向变化了
```
上边的例子是简单的，看个稍微复杂点的例子。我创建一个Doggy构造函数，希望Cat构造函数能够完全继承Doggy所有的东西，怎么写？
```javascript
// 创建一个Doggy类，给他一个方法shout
function Doggy() {
    this.name = '汪星人';
    this.shout = function () {
        console.log(this.name+'在汪汪叫~');
    }
}
// 我想让Cat继承这个方法
function Cat() {
    Doggy.call(this);
    // 通过重新设置name覆盖继承来的name
    this.name = '喵星人';
}
var cat = new Cat();
var dog = new Doggy();
dog.shout(); // 汪星人在汪汪叫~；
cat.shout(); // 喵星人在汪汪叫~（变种猫！）
```

**综上所述的总结和例子，call改变this指向，你可以单独把一个a.method的指向改变，=> b，也可以把整个构造函数的this指向改变（继承了）;**

**这就是call的用法，另外call第二，第n个参数不限制，apply传递的是数组，这一点区别于apply。只是这一点不同，其他的方法，apply与call一样**。