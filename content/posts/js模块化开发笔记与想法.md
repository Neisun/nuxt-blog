---
title: js模块化开发笔记与想法
tags:
  - AMD
  - javascript
  - requirejs
slug: 481
categories:
  - 技术随笔
  - 模块化开发
date: 2017-09-29 11:24:07
description: "记录关于 JavaScript 模块化开发的一些笔记与思考。结合实践谈谈对模块划分、依赖管理与代码组织的理解。"
image: /images/covers/064.jpg
---

提到模块化开发，这个概念，既陌生又熟悉。陌生在于对于概念，熟悉在于看了一下写法之后，发现其实在不知不觉中我们都已经在使用了。
开发一个项目，需要分工，怎么保证在以后项目合并之后不会出现变量冲突问题，又或者说，我想拿同事写的功能使用，并且不会出现问题。
于是出现了一些写法。由于js语法并没有模块或者说是块级作用域这么个概念，大家想到了一个东西，是`function`，js中一个`function`就是一个块级作用域，他拥有自己的作用域，就是模块化开发最好的媒介，注意，是媒介，它本身与模块化没什么关系，只不过，我们利用它进行所谓的模块化开发。

来看看不借助于工具的几种写法。
```javascript
/*
 * @Author: hunaisong 
 * @Date: 2017-09-27 15:46:40 
 * @Last Modified by: hunaisong
 * @Last Modified time: 2017-09-27 16:28:39
 */
// 关于模块化开发

// 原始写法，调用时候m1(),m2()
function m1(params) {
    console.log('m1')
}

function m2(params) {
    console.log('m2')
}
/**
 * 原始写法：
 * 原始写法，利用函数的局部作用域，来自成一个模块，但是谁能保证多人协同开发过程中不会有变量冲突的时候
 * 这种写法会带来上述的问题
 */

// 对象写法 调用时候，module1.m1()....
var module1 = {
    num: 0,
    m1: function(params) {
        // 
    },
    m2: function(params) {
        // 
    }
}
module1.num = 5;
console.log(module1.num)
/**
 * 对象写法：
 * 优点在于可以一目了然，确实比较清晰
 * 缺点，把所有的东西都暴露出去了，内部状态外部也可以改写
 */

// 立即执行函数模式 调用 module2.m1(),module2.m2()...
var module2 = (function() {
    var num = 0;
    var m1 = function(params) {
        // 
    }
    var m2 = function(params) {
        // 
    }
    return {
        m1: m1,
        m2: m2
    }
})()
/**
 * 立即执行函数:
 * js开发过程中最标准的模块化方式
 * 优点:可以将公共接口暴露出去
 * 缺点：没办法访问里边的num
 * module2.num undefined
 */

// 放大模式
// 如果一个模块很大，必须分成几个部分，或者一个模块需要继承另一个模块，这时就有必要采用"放大模式"（augmentation）。
var module3 = (function(mod) {
    mod.m3 = function (param) { 
        // 
     }
     mod.count = 'module3新建的属性'
     return mod;
})(module2);
console.log(module3.count)
// 在这个例子中，我把module2当做依赖，module3需要继承module2，并且为他创建了新的方法m3

// 宽放大模式
// 与放大模式类似，为什么叫宽放大模式，需要看下边的例子
var module4 = (function (mod) {
    mod.name = 'Neisun';
    return mod;
})(module4)
console.log(module4.name) 
//报错，为什么？因为本身module4就是undefined，立即执行函数返回了本身，什么没有给任何定义
// 如此才有了宽放大模式
var module5 = (function (mod) {
    mod.name = 'Neisun';
    return mod;
})(window.module5 || {})
console.log(module5.name);

// 输入全局变量
// 何为模块，就是利用模块的独立性，失去了独立性，模块什么都不是
// 如果有依赖关系，需要显式注入
var module6 = (function ($,YAHOO) {

})(jQuery,YAHOO);

```

以上的这些都是常规的写法。在模块化开发中有两个避不开的规范**`CMD`**与**`AMD`**，这两个概念有什么区别？
在说区别之前先说一下`COMMONJS`，这是nodejs的规范，但是这个规范不适用于浏览器，所以有人就想，既然服务器端nodejs有了模块化的规范，那么客户端也就是浏览器端就不能有么。于是CMD与AMD就出来了。

**为什么要有一个规范**

其实，我也在考虑这个问题。只要保证我写的东西或者别人写的东西能用不就行了么，非要费那么大气力去搞这些东西？
后来，看了一下，阮一峰老师的博客，有点豁然开朗的感觉。A、B、C三个人，三种不同的写法，写了三种功能，要是A想用B写的功能，发现用不了，无法搬砖了。
所以，这就是标准的意义所在，如同法律，是一种约束。这样大家的代码可以通用了，岂不美哉。插件其实就是这么来的。
AMD规范中有一种插件挺不错的，通用性比较高--**`require.js`**。
首先是在页面中引入，require.js文件。
先看一下项目的结构

![](http://www.hunaisong.cn/wp-content/uploads/2017/09/require.jpg)

**第一步，引入require.js，同时设置入口文件**

```javascript
<script src="js/lib/require.js" data-main="js/main">
// data-main表示一个路径，这个路径是主入口文件：js文件下的main.js，其中后缀.js可以不写，因为require.js默认加载这个js文件
// 这个路径还是非常重要的，为什么？以后所有的依赖都是基于这个路径，如果路径搞不明白，你的依赖模块就加载不出来。
```

**第二步，看看入口文件怎么写**

在这个例子中，我想把jquery作为依赖注入到main.js中，同时给页面一个按钮，点击这个按钮，看看jq是否被引入，能够触发事件

```javascript
require.config({
    paths:{
        'jquery':'lib/jq'
    }
});
require(['jquery'],function ($) {
    // 我们在页面上写一个按钮，点击时候alter一下
    $('#btn').click(function (e) {
        alert('事件触发，jq被注入');
    });
}
```
把页面加载出来的网页头部信息拿来看看

![](http://www.hunaisong.cn/wp-content/uploads/2017/09/head.jpg)

发现，jq文件确实被引入了，而且事件也被触发了。
当然，这是jq文件，是别人写好的模块，我们可以拿来使用（而且，jq是按照AMD的规范写的，所以才可以直接拿来用）

**第三步，自己用AMD规范写一个模块**
我想定义一个模块，专门用来返回当前日期
```javascript
/*
 * @Author: hunaisong 
 * @Date: 2017-09-29 09:32:18 
 * @Last Modified by: hunaisong
 * @Last Modified time: 2017-09-29 10:40:42
 */
// module1模块，写一个返回当前日期
// 使用define函数来定义一个模块
define(function() {
    var date = function () {
        var time = new Date();
        // console.log(time);
        return time;
    }
    return {
        date:date
    }
});
// main.js部分
require.config({
    paths:{
        'jquery':'lib/jq',
         // 在这引入了module1模块
        'module1':'module/module1',
    }
})
require(['jquery'],function ($) {
    // 我们在页面上写一个按钮，点击时候alter一下
    $('#btn').click(function (e) {
        alert('事件触发，jq被注入');
    })
    // 此处使用了module1模块
    $('#time').click(function () {
        require(['module1'],function (module1) {
            alert(module1.date())
        })
    })
})
```

如果一个模块中有别的依赖模块怎么办
```javascript
// module2
// 依赖一个叫test.js的文件（模块），数组形式注入，然后需要注意的是路径，在第一步中强调过，这个路径是基于main.js的路径
define(['module/test'], function(test) {
    return function foo() {
        test();
    };
});
// test
define(function () {
    return function () {
        console.log(111)
    };
})
```
熟练使用这种写法，可以定义各种模块。
总结一下吧：
1.必须引入`require.js` 然后`data-main`，定义的是入口文件，这个文件的路径贯穿始终，引入模块的路径都是基于这个路径
2.然后是入口文件写法
```javascript
// 配置一下依赖的路径
require.config({
  paths:{
   // ...
  }
})
// 使用require(['deps1','deps'],function(deps1,deps2){....})
require(['deps1','deps2'],function () {
  // ...
})
```
3.自己用AMD语法写模块
```javascript
// 用define语法来写模块,如果有依赖，注意依赖路径，是基于main.js路径
define(['deps'],function (deps) {
  // ....
})
```

语法部分就是上部分。
说一下我的看法，我有一点疑惑就是为什么要使用require.js。疑惑主要在于，我以为他会把所有的依赖文件自动打包成一个文件，这样就减少了http请求，但实际情况并不是这样。如果你想合并，还需要使用r.js，关于这个我不想多做赘述。我发现的优点就是不会阻塞页面，是异步加载的，而且是按需加载的，方便模块间依赖关系的管理。


（完）