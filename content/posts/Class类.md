---
title: Class类
tags:
  - ES6
  - javascript
slug: 516
categories:
  - 技术随笔
  - ES6
date: 2017-10-26 14:19:26
description: "讲解 ES6 Class 类的使用。从构造函数与原型说起，介绍类的定义、继承与静态方法，理解面向对象语法的语法糖本质。"
image: /images/covers/071.jpg
---

> Class类

在ES5中，也就是JavaScript中，是没有类这一概念的。JavaScript是一种弱类型语言，不像传统编程语言那样。这使得JavaScript的继承基本上靠原型来实现。在ES6中，引入了类的概念。使得继承变得非常的容易，更容易理解，也更便于书写。

> Class类的写法

利用`class`关键字，后边跟着一个类的名称就能定义一个类。
你会看到其中有一个constructor关键字是一个函数，没错，叫做构造器。在这个构造器中，放着这个类自己独有的属性与方法。（此处存在一些问题，下个小结会有说明）
在constructor外边放着的方法和属性是这个类所公有的属性和方法，只要是继承了这个类，那么就都可以使用该方法。
```javascript
class Animal {
    constructor() {
        this.name = 'animal';
        this.sayHello = function () {
            console.log('hello');
        }
    }
    otherFunction () {
        // ...
    }
}
```

> 实现一个类的继承

上个小结中，写了一个Animal类。Animal中有许多物种，比如小狗，小猫，狮子老虎大象....，但他们都属于Animal这个类，同样的，每一个物种都会有自己的方法和属性。那么怎么实现不但继承Animal类（作为动物，都有的属性和方法），并且还有自己的属性和方法呢。

我们重新把Animal类，定义一下，然后创建一个叫Cat的类，继承他。

```javascript
// 我们重新定义一个Animal类，让他更丰满一些，有血有肉。
class Animal {
    constructor() {
        this.name = 'animal';
        this.sayHello = function () {
            console.log('animal hello!');
        }
    }
    run () {
        console.log(this.name+' can run!');
    }
}
// 在定义一个Cat类
class Cat extends Animal {
    constructor () {
        super();
        this.name = 'cat';
        this.shout = function () {
            console.log('喵呜~')
        }
    }
}
var cat = new Cat();
cat.run(); // cat can run!
cat.shout(); // 喵呜~
```
这个例子中，我们用Cat类继承了Animal类的方法。
`extends`，关键字是用来实现继承的关键，childClass extends fatherClass，用法是这样的。
`super`，关键字是怎么一回事？其本身就是一个方法，是必须存在于子类的constructor中，ES6中解释是子类没有this对象，通过super()一下，来改写一下。
以上两步实现了继承。
其实，有一个位置，我很是疑惑，就是所谓的constructor中定义的属性和方法，是独有的么？
继续上个例子，我试着在编辑其中写了如下的代码。
```javascript
cat.sayHello(); // animal hello!
// 看到了么，cat竟然可以有sayHello这个方法，这可就不科学了啊，不是说好的，constructor中放着的属性和方法，是独有的么？
```
带着这个疑惑，我又把Cat这个类给改写了。
```javascript
// 我给Cat类中的constructor也添加上了，sayHello这个方法；
class Cat extends Animal {
    constructor () {
        super();
        this.name = 'cat';
        this.sayHello = function () {
            console.log('cat hello!')
        }
        this.shout = function () {
            console.log('喵呜~')
        }
    }
}
// 然后执行以下代码
var cat = new Cat();
var animal = new Animal();
cat.sayHello();
cat.run();
cat.shout();
console.log('----------------------')
animal.sayHello();
animal.run();
```
结果是
```javascript
cat hello!
cat can run!
喵呜~
----------------------
animal hello!
animal can run!
```
由此，得出结论，constructor是存放独有属性和方法，但是同样也会被继承，当然，我们可以在继承的类中去改写，就像例子中的一样。
这段时间公司的网出现问题，好多域名上不去了，阮一峰老师的博客也上不去了，不知道阮一峰老师关于这个constructor是怎么看的。等可以上阮一峰老师的博客的时候，再对文章补充吧。

（完）