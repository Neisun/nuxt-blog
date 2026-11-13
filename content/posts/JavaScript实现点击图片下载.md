---
title: JavaScript实现点击图片下载
tags:
  - javascript
slug: 525
categories:
  - 技术随笔
date: 2017-11-17 16:47:23
description: "用 JavaScript 实现点击图片下载。讲解如何触发浏览器下载图片，并处理跨域与文件名等细节。"
image: /images/covers/073.jpg
---

> 需求，一切都是需求

缘起于项目。
最近有点小忙，白天写项目，改需求。晚上回去运动，运动完书都不想看了。只想歇着。我知道这种状态不对，也想改过来。能抽出的时间要尽量利用起来。而且，说好的戒烟，我没有做到。向着那句话去了，变成自己讨厌的样子了。我不想这样，也不要这样。需要寻求突破。
废话说的多了，本篇是11月的第一篇文章。果真是在打自己的脸，没有坚持住。因为项目的需求，要前端实现一个点击图片下载的功能。
说一下，我原来的思路。
原来的想法是，直接将图片的src给a标签的href，target="_blank"，让它新开一个页面，然后自己右键保存。。。。
后来，觉得这种交互的用户体验实在是有点差，这么搞，还要我大前端干啥子呦，我们的宗旨就是（并不是没有蛀牙，我不是高露洁），让用户舒坦。

实现起来，其实非常简单与潇洒。

> a标签的download属性

H5中给a标签新增了一个download属性，结合a标签的href，可以直接调用浏览器的下载功能。

> 自定义事件

看上去，这个自定义事件和我们要实现的功能毛关系都没有。先别管这个，我们看一下。自定义事件的三个过程。
```javascript
// 创建一个自定义事件
var event = document.createEvent('MouseEvent') // event的类型有很多，这里用到了MouseEvent
// 初始化事件
event.initEvent('click',false,false) // 初始化事件触发的条件，false，false（canBubble,cancelable）
// elment元素触发事件
element.dispatchEvent(event);
```
好了，介绍完之后呢。就是重头戏了，我们来实现，点击一个img，浏览器下载图片吧

> 功能实现

```html
// html
<img src="../img/timg.jpg" alt="允儿" id="img" style="cursor:pointer">
```
```javascript
// js部分代码
var oImg = document.getElementById('img');
// 下载图片功能
function downLoadPic(url, name) {
    var a = document.createElement('a');
    var evt = document.createEvent('MouseEvent');
    a.download = name;
    a.href = url;
    evt.initEvent('click', false, false);
    a.dispatchEvent(evt);
}
// function中我们先动态创建了一个a标签，然后添加download属性，href属性
// 紧接着，自定义事件就派上用处了，创建a标签之后，咱们直接触发click事件，不就直接下载了么
oImg.onclick = function() {
    var filename = 'girl';
    var url = oImg.src;
    downLoadPic(url, filename);
}
```
大功告成！
上一张，效果图，顺便带你看看美丽的允儿。

![](http://www.hunaisong.cn/wp-content/uploads/2017/11/yuner.gif)

（完）