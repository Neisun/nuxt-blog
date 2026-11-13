---
title: e.target与e.currentTarget
tags:
  - javascript
slug: 471
categories:
  - 技术随笔
  - JavaScript技巧与常见问题
date: 2017-09-27 13:43:38
description: "辨析事件对象中 e.target 与 e.currentTarget 的区别。通过事件冒泡场景说明二者指向的差异，避免事件处理中的常见误区。"
image: /images/covers/062.jpg
---

e.target与e.currentTarget看上去就是那么的像，用的时候，如果不在控制台输出一下，我好多时候没有分清楚。有人说，至于分的那么清楚么？
我说，确实应该分清楚，因为许多事件并不是直接绑定在相应的元素节点上的，而是在父元素上添加事件监听器。如果不分清楚，怎么确定是哪个元素触发事件监听器呢。
一个小小的demo来加以区分
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>e.target与e.currentTarget</title>
    <style>
        #div1 {
            width: 200px;
            height: 200px;
            background: red;
        }
        #div2 {
            width: 100px;
            height: 100px;
            background: blue;
        }
    </style>
</head>
<body>
    <div id="div1">
        <div id="div2">

        </div>
    </div>
    <script>
        var oDiv1 = document.getElementById('div1')
        var oDiv2 = document.getElementById('div2')
        oDiv1.addEventListener('click',function (e) {
            // e.target当前触发事件的目标元素
            console.log(e.target)
            // 添加事件监听器的元素
            console.log(e.currentTarget)
        },false)
    </script>
</body>
</html>
```
结合上边的案例，就可以知道，

**e.currentTarget是添加事件监听器的元素**

**e.target是当前触发事件的元素**

别在搞混淆了，总是搞混淆。。。