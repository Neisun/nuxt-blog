---
title: 手写一个简单的js模板
tags:
  - javascript
slug: 461
categories:
  - 技术随笔
  - 模板语法
date: 2017-09-25 11:12:57
description: "手写一个简单的 JavaScript 模板引擎。通过字符串替换与正则匹配，实现变量插值与简单逻辑，理解模板引擎的核心原理。"
image: /images/covers/059.jpg
---

使用Ajax加载数据的童鞋都应该知道，我们请求过来的数据一般是json数据，然后我们需要利用字符串将html与数据拼接到一起。这个过程有一点小痛苦，比如json数据中的对象，我们需要完整的写出键的名称。`obj.name,obj.title,obj.....`;
那么我们想用一种方式，用一种变量替换`obj.name => %name%`,类似于jsp语法那样，可以么？
这个是可以的。本次就是一个小demo，利用这个来替换繁琐的`obj.name`键的名称。
看一下整体的代码；
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>简单的模板</title>
    <style>
        #div,.main,.footer {
            height: 50px;
            text-align: center;
            line-height: 50px;
            border:1px dashed red;
            margin: 10px 0;
        }
        .main {
            height: 100px;
            line-height: 100px;
            border: 1px dashed #ccc;
        }
        .footer {
            border: 1px dashed orangered;
        }
    </style>
</head>
<body>
    <script>
        // 定义一个template用来存放字符串
        var template = "";
        // 模仿json数据定义一个对象
        var obj = {
            id:'div',
            title:'标题',
            content:'内容部分',
            footer:'结尾部分'
        };
        // 获取body节点
        var body = document.getElementsByTagName('body')[0];
        template = '<div id="%id%">%title%</div>'+
                   '<div class="main">%content%</div>'+
                   '<div class="footer">%footer%</div>'
            //    先匹配%w+%，然后传一个回调函数，形参m就是匹配的项，%w+%,比如%id%
        var html = template.replace(/%\w+%/g,function (m) {
            console.log(m);
            // 然后去掉%,匹配到obj中的值
            return obj[m.replace(/%/g,"")];
        })
        console.log(html);
        body.innerHTML = html;
    </script>
</body>
</html>
```