---
title: 图片展示demo
tags:
  - CSS
  - HTML
  - javascript
slug: 473
categories:
  - 技术随笔
  - 页面效果
date: 2017-09-27 14:13:44
description: "实现一个图片展示的页面效果 demo。通过简单的交互展示图片的加载与切换，作为前端展示类效果的练习。"
image: /images/covers/063.jpg
---

网站上有一种效果就是，为了节约空间，把所有的图片都用链接替代，并且，在你点击链接的时候，会在页面的某个位置。这个效果还是蛮好用的，只不过这种方式稍微有点过时，不过也算是一个不错的demo。最近准备把一些常见的，常用的效果都收集一下。
一张gif图，展示一下这种demo的效果，看看怎么着手去做。

![](http://www.hunaisong.cn/wp-content/uploads/2017/09/pic_demo.gif)

布局部分，很简单的布局，主要是看看js部分。
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>图片展示demo</title>
    <style>
        * {
            margin: 0;
            padding: 0;
        }

        body {
            background: #eee;
        }

        h1 {
            text-align: center;
            line-height: 1.2;
            margin: 30px 0;
        }

        ul {
            width: 800px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
        }

        ul li {
            width: 25%;
            list-style: none;
            text-align: center;
            background: #ccc;
            margin: 0 5px;
            cursor: pointer;
        }

        ul li:hover {
            background: orange;
        }

        ul li:hover a {
            color: #fff;
        }

        ul li a {
            color: #000;
            text-decoration: none;
            display: inline-block;
            width: 100%;
        }

        #pic-wrapper {
            border: 1px solid darkmagenta;
            width: 400px;
            height: 300px;
            margin: 0 auto;
        }

        #desc {
            width: 400px;
            margin: 0 auto;
            color:red;
        }
    </style>
</head>

<body>
<div>
    <h1>图片展示</h1>
    <ul>
        <li>
            <a href="../img/girl.jpg" title="beautiful girl">girl</a>
        </li>
        <li>
            <a href="../img/eye.jpg" title="beautiful eye">eye</a>
        </li>
        <li>
            <a href="../img/heart.jpg" title="beautiful heart">heart</a>
        </li>
        <li>
            <a href="../img/sky.jpg" title="beautiful sky">sky</a>
        </li>
    </ul>
    <div id="pic-wrapper">
        <img src="" alt="选择一个图片" id="pic">
    </div>
    <p id="desc">选择一个图片</p>
</div>
<script>
    function showPic(e) {
        // 根据e.target.tagName判断一下是否a标签
        if (e.target.tagName == 'A') {
            // 阻止一下默认行为，防止页面跳转
            e.preventDefault();
            // 获取一下a标签的href与title
            var src = e.target.href;
            var title = e.target.title;
            var oPic = document.getElementById('pic');
            var oDesc = document.getElementById('desc');
            // 设置img的src与提示文字
            oPic.src = src;
            // 设置文本节点部分，本想用innerHTML，后来觉得用nodeValue更好一些
            // 在使用过程中一个问题，想当然以为oDesc.nodeValue就可以直接设置，大错特错。
            // 忽略了文本节点，文本节点也是一个节点，他是oDesc的第一个节点，所以,oDesc.firstChild就是这个文本节点，
            // 文本节点的属性nodeValue只有在获取到文本节点才能用
            oDesc.firstChild.nodeValue = title;
        } else {
            return false;
        }
    }
    var aLi = document.getElementsByTagName('li');
    for (var i = 0, len = aLi.length; i < len; i++) {
        aLi[i].addEventListener('click', showPic, false)
    }
</script>
</body>

</html>
```
这是一个非常简单的demo，在做这个小demo的时候，有两点问题需要注意一下，一个是e.target问题，一个是nodeValue问题。别的部分都是很简单的。
（完）