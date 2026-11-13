---
title: Mock.js-大前端时代
tags:
  - javascript
  - Mock.js
slug: 305
categories:
  - 技术随笔
  - Mock-大前端必备
date: 2017-08-22 17:25:00
description: "介绍 Mock.js 在前端开发中的作用。通过模拟接口数据，摆脱与后端联调的依赖，提升页面开发效率，讲解基本语法与拦截请求的用法。"
image: /images/covers/034.jpg
---

> **不完美的开发**

前端开发，是一页面和各种交互编织在一起的开发过程。但是，页面需要展示的数据，是从后台的接口中得到。在这个过程中，你需要不断和后端进行联调，琐碎不说，大大降低了开发的效率。我有很多时候都是页面结构早已经写好，就等着后端的接口填充数据。这个时候，如果接口始终没给出来，那就意味着，你需要陪着加班。不是说，加班不行。而是，这种加班真的是毫无意义的waste time。
有了这种痛苦的体验，有的大神受不了了。提出，前端一定就必须在开发过程中需要依赖后端给出数据接口么。我们自己可不可假造数据。有了这种需求的驱动，一个造数据的神器诞生了 =>**Mock.js**

> **告别依赖，正式开启大前端时代**

有了这个利器，之后。我们就可以利用它造假数据，然后把数据填充到页面中，页面也不会显得单调，也不需要你手动去一个个粘贴复制数据了。
这就在开发过程中，脱离后端。但是，数据结构要和后端商量好。最后在去掉Mock的假数据，放入真正的数据。

> **使用方式**

最近在仿写一个新闻资讯类的app，我截一个图，放在下边。

![百度百家示意图](http://www.hunaisong.cn/wp-content/uploads/2017/08/baidubaijia_news.jpg)

这个页面的数据结构：
```javascript
var template = {
    slider: [ //轮播图
        {
            image:"", //图片地址
            title:"" // 图片标题
        }

    ],
    newList: [
        {
            title: "", //新闻标题
            thumbnail: "", // 缩略图
            updatedTime: "", // 更新时间
            kind: "" // 什么种类，是热门？猜你喜欢？
        }
    ]
}
```
那么该怎么使用Mock.js，非常简单。就写了一个在页面引入js的方式，去使用。基于Node的使用方式，其实是一样的。不一一赘述。
首先需要在页面引入，Mock.js。
```javascript
// Mock.js
<script src="../js/lib/mock.js"></script>
// jq，方便ajax请求
<script src="../js/lib/jquery-3.2.1.min.js"></script>
```
接下来，我们已经可以使用Mock了
```javascript
//Mock.mock(url,template)
/**
 * url,必填参数，拦截的url请求
 * template，数据模板
 */
```
按照刚才的数据格式，我们来造一个数据模板
```javascript
// 内置语法中构造随机的语法
var Random = Mock.Random;
// 因为数据中一个kind，是“热门”，“猜你喜欢”，这是随机的，所以咱们构造一个；
Random.extend({
    kind: function (date) {
        var kinds = ["热点", "猜你喜欢"];
        return this.pick(kinds)
    }
})
var template = {
    sliderImage: [{
            // 随机造一个560x350的图片
            image: Random.image("560x350"),
            // 随机造一个5-10长度的title
            title: Random.csentence(5, 10)
        },
        {
            image: Random.image("560x350"),
            title: Random.csentence(5, 10)
        },
        {
            image: Random.image("560x350"),
            title: Random.csentence(5, 10)
        },
    ],
    'newsList|15-20': [{
        title: Random.csentence(8, 20),
        thumbnail: Random.image("218x146"),
        // 随机造一个 1-5的随机数字，当做更新时间
        'updatedTime|1-5': 1,
        // 调用随机kind，造出随机的kind
        kind: Random.kind()
    }]
}
// 这就是数据模板了
```
数据模板有了，我们来使用一下，看看造出的数据。
```javascript
Mock.mock("http://mockjs", template);
$("#test").click(function () {
    $.ajax({
        url: "http://mockjs",
        dataType: "json",
        async: true,
        type: "GET",
        beforeSend: function () {
            console.log("发送之前！")
        },
        success: function (data) {
            console.log(data)
        },
        complete: function () {
            console.log("请求完成！")
        },
        error: function (error) {
            console.log(error)
        }
    })
})

```
附一张图，看看我们造出的数据

![](http://www.hunaisong.cn/wp-content/uploads/2017/08/data.jpg)

这就是，造出的数据。其实差不多完美了。不足之处就在于，我们发现newsList那个数组中每一项都是一样的，这样不好。我们通过js来自己改写一下吧。完整的js如下。
```javascript
var Random = Mock.Random;
// 一个随机数，15-35之间，模仿新闻条数
var RandomNum = Math.floor((Math.random() * 20 + 15));
// 存放新闻的数组
var arr = [];
Random.extend({
    kind: function (date) {
        var kinds = ["热点", "猜你喜欢"];
        return this.pick(kinds)
    }
})
// 遍历一下，把刚才构造好的数据放进去
for (var i = 0; i < RandomNum; i++) {
    arr.push({
        title: Random.csentence(8, 20),
        thumbnail: Random.image("218x146"),
        'updatedTime|1-5': 1,
        kind: Random.kind()
    })
}
var template = {
    sliderImage: [{
            image: Random.image("560x350"),
            title: Random.csentence(5, 10)
        },
        {
            image: Random.image("560x350"),
            title: Random.csentence(5, 10)
        },
        {
            image: Random.image("560x350"),
            title: Random.csentence(5, 10)
        },
    ],
    // 'newsList|15-20': [{
    //     title: Random.csentence(8, 20),
    //     thumbnail: Random.image("218x146"),
    //     'updatedTime|1-5': 1,
    //     kind: Random.kind()
    // }]
    newList: arr
}
Mock.mock("http://mockjs", template);
$("#test").click(function () {
    $.ajax({
        url: "http://mockjs",
        dataType: "json",
        async: true,
        type: "GET",
        beforeSend: function () {
            console.log("发送之前！")
        },
        success: function (data) {
            console.log(data)
        },
        complete: function () {
            console.log("请求完成！")
        },
        error: function (error) {
            console.log(error)
        }
    })
})
```
上一张图，看看现在的数据结构

![](http://www.hunaisong.cn/wp-content/uploads/2017/08/data_new.jpg)

这个数据就能满足我们的需求了，现在我们就可以开心的填充页面了。

想详细的知道mock用法，直接看文档，文档地址：[mock.js文档](http://mockjs.com/)

经典的用法案例：[mock.js经典例子用法](http://www.cnblogs.com/CyLee/p/6072399.html)


随机应变，应对一切需求的数据，就看你怎么使用文档了。（完）