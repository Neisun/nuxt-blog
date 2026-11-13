---
title: 'offsetWidth,clientWidth,scrollWidth区别一览'
slug: 189
categories:
  - 技术随笔
  - JavaScript技巧与常见问题
date: 2017-07-19 23:39:55
tags:
description: "辨析 offsetWidth、clientWidth、scrollWidth 三个容易混淆的宽度属性。分别说明它们的计算口径与适用场景，配合图示帮助记忆三者之间的区别。"
image: /images/covers/014.jpg
---

> **经常会混淆的几个属性值**

*   clientWidth，视口宽度（clientHeight同理）
*   scrollWidth，滚动宽度（包括不在视口范围的滚动内容宽度，scrollHeight同理）
*   offsetWidth，元素实际占据空间宽度（包括border和padding，但不包括margin，offsetHeight同理）
我们用一个最简单的textarea来做一番测试

> **HTML部分代码**

```html
<!--直接用textarea来做测试  -->
<textarea rows="3" cols="15" id="txt">金樽清酒斗十千</textarea>
```

> **js部分**

```js
var oTxt = document.getElementById("txt"),
    offsetWidth = oTxt.offsetWidth,
    clientWidth = oTxt.clientWidth,
    scrollWidth = oTxt.scrollWidth;
alert("offsetWidth :"+offsetWidth+"\r\n"+"clientWidth :"+clientWidth+"\r\n"+"scrollWidth :"+scrollWidth)
```

> 没有横向滚动条的时候

![](http://hunaisong.cn/wp-content/uploads/2017/07/pic1.png)

> 有滚动条时候

![](http://hunaisong.cn/wp-content/uploads/2017/07/pic2.png)