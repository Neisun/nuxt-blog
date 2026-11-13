---
slug: 532
title: JavaScript面向对象-创建一个控件
date: 2017-11-27 17:55:35
tags: 
    - javascript
categories: 
    - 技术随笔
    - 面向对象
description: "用面向对象思想创建一个控件。通过封装属性与方法，演示如何把功能组织成可复用的控件类。"
image: /images/covers/077.jpg
---
## 面向对象编程的实例
最近在读，你不知道的JS系列丛书。讲到_行为委托_方面，有几个非常好的demo，在这里做一个汇总记录。主要是学习编程的思维方式和写法。个人觉得写法也是挺棒的，简洁不啰嗦。
### 第一种写法
> 第一种方式是利用‘类’的方式实现一个UI控件的写法

我们知道，在js中根本就不存在所谓的类，类语法是其他编程语言中的。但是js为了实现这个“类”。可以说是煞费苦心！
其利用了函数这个特殊的对象，来实现类。继而又把这种类型的函数，强行改名叫“构造函数”。其实与别的函数一样，没有任何区别。
说说区别：
1. 函数名大写，这是编程的惯例罢了。你不大写，也能运行，没错。但是，会被前辈喷，说你不规范，不标准。其实压根就没有这种规范和标准。
2. 调用的方式上，使用new的方式去调用。

这就是区别了。有一种说法是，** 只要是使用new方式调用的函数，都可以叫做构造函数**。
关于JavaScript类的吐槽到这里结束。。
下边来干点正事。

我们配合jQuery使用，来创建一个关于按钮的控件
```js
$(function ($) {
    // 首先定义一个父类,用来设置宽高，以及目标元素
    function Super(width,height) {
        this.width = width || '50';
        this.height = height || '50';
        this.$element = null;
    }
    // 在原型上添加添加一个render函数
    // 设置样式和插入到节点
    Super.prototype.render = function ($where) {
        if (this.$element) {
            this.$element.css({
                width:this.width+'px',
                height:this.height+'px'
            }).appendTo($where)
        }
    }
    // 创建Button类
    function Button(width,height,label) {
        Super.call(this,width,height);
        this.label = label || 'Default';
        this.$element = $('<button>').text(this.label);
    }
    // 用Object.create方式继承Super的原型
    Button.prototype = Object.create(Super.prototype);
    // 其实这个时候，已经可以直接使用Button类
    // 如下直接new一个实例，然后使用render函数渲染到页面中
    /*var btn = new Button(100,100,'点击测试');
    var $body = $('body');
    btn.render($body);*/
    // 但是如果你想给Button类在点击的时候添加个事件呢，而且是直接在render的时候就添加好呢
    // 这个时候需要我们去改写一下原型
    Button.prototype.render = function ($where) {
        // 借用一下Super定义好的方法
        Super.prototype.render.call(this,$where);
        // bind改变一下this指向，强制指向Button
        this.$element.click(this.handlerClick.bind(this));
    }
    Button.prototype.handlerClick = function () {
        console.log('Button'+this.label+' is clicked!')
    }
    // 下面来new几个Button实例
    var btn1 = new Button(60,70,'btn1');
    var btn2 = new Button(50,70,'btn2');
    var $body = $('body');
    btn1.render($body);
    btn2.render($body);
})
```
> 效果图

![效果图](/hunaisong.github.io/img/btn.jpg)

### 第二种写法

> 利用对象委托的方式

```js
$(function($) {
    var Super = {
        // 初始化函数，设置宽高和目标元素
        init: function(width, height) {
            this.width = width || '50';
            this.height = height || '50';
            this.$element = null;
        },
        insert: function($where) {
            if (this.$element) {
                this.$element.css({
                    width: this.width + 'px',
                    height: this.height + 'px'
                }).appendTo($where)
            }
        }
    }
    // 创建对象的关联，在原型上继承父类方法
    var Button = Object.create(Super);
    console.log(Button)
    // 单独设置一个setup函数，因为有label属性需要单独设置
    // 然后把Super中的init直接借用
    Button.setup = function (width,height,label) {
        this.init(width,height);
        this.label = label || 'Default';
        this.$element = $('<button>').text(this.label);
    }
    Button.build = function ($where) {
        this.insert($where);
        this.$element.click(this.handlerClick.bind(this))
    }
    Button.handlerClick  = function () {
        console.log('Button '+this.label+' is clicked!')
    }
    // 创建两个按钮实例，使用create方式继承
    // 别问我为啥不使用new 的形式
    // new的形式前提，有构造函数，而我们创建的都是对象
    var btn3 = Object.create(Button);
    var btn4 = Object.create(Button);
    var $body = $('body');
    console.log(Button,btn3,btn4)
    btn3.setup(70,80,'btn3');
    btn4.setup(80,80,'btn4');
    btn3.build($body);
    btn4.build($body);
})
```
### 第三种写法
> ES6的class写法

```js
$(function($) {
    class Super {
        constructor(width, height) {
            this.width = width || '50';
            this.height = height || '50';
            this.$element = null;
        }
        render($where) {
            if (this.$element) {
                this.$element.css({
                    width: this.width + 'px',
                    height: this.height + 'px'
                }).appendTo($where)
            }
        }
    }
    class Button extends Super {
        constructor(width,height,label) {
            super(width,height);
            this.label = label || 'Default';
            this.$element = $('<button>').text(this.label);
        }
        render($where) {
            super.render($where);
            this.$element.click(this.handlerClick.bind(this))
        }
        handlerClick(e) {
            console.log('Button '+this.label+' is clicked!')
        }
    }
    var $body = $('body');
    var btn5 = new Button(80,80,'btn5');
    var btn6 = new Button(80,80,'btn6');
    btn5.render($body);
    btn6.render($body);
})
```
最终的目的，我们是想创建一个UI控件，用了三种方式去实现。实际开发中用的最多的可能是第一种方式，利用混合方式实现继承来复制类。
但是书中推荐的写法是第二种，利用对象委托的方式。

从这个例子中，我们得到了什么？
1. 大体知道了一个控件的编写过程，然后通过实例来调用。
1. `Object.create`这种方式去继承原型，是最好的方式。
1. 熟悉了ES6 `class`的写法

**最最重要的是，我们有再次通过面向对象的方式进行了编程。**
