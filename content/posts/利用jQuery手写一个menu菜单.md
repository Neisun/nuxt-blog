---
title: 利用jQuery手写一个menu菜单
slug: 129
categories:
  - 技术随笔
  - 页面效果
date: 2017-07-08 23:17:17
tags:
description: "在后端管理系统缺少 UI 库支持时，用 jQuery 手写一个下拉菜单组件。介绍菜单的数据结构、事件绑定与展开收起逻辑，兼顾代码的可维护性与复用性。"
image: /images/covers/006.jpg
---

> **层出不穷的menu菜单**

现如今各种各样的前端UI框架真是快要晃晕了我们的头，最近在做关于后台系统界面的项目，由于缺少UI支持，产品还是一个半文案半秘书一样的存在。逼迫我不得不去对项目进行优化，尤其是在选择一个适合项目的UI框架上着实废了一番心思。现在UI框架给予web方面的支持还是存在着一些缺陷，所以最好这个menu菜单，我们自己去写和封装。（BootStrap等等虽好，但是类名的写法有点杂乱无章并且会有类名污染的问题）

我们知道，在一个后台系统中，一般都是左边是menu菜单作为页面的导航，右侧是内容区。而且为了节省页面的空间，我们会把左侧的菜单分类，每个主分类下边会有各个子标签，我们点击子标签，右侧的内容区会展示出相应的内容。啰里啰嗦的说了一通，不如直接上代码来的比较实际。
> **上代码**

这里我选择用jQuery来操作DOM，因为jQuery强大的链式操作可以节省相当多的麻烦。以下都是默认引入了jq。
> **页面结构-HTML部分**
```html
<ul>
    <li class="level1">
        <a href="#">衬衫</a>
        <ul class="level2">
            <li>
                <a href="#">长袖衬衫</a>
            </li>
            <li>
                <a href="#">断续衬衫</a>
            </li>
            <li>
                <a href="#">长袖T恤</a>
            </li>
            <li>
                <a href="#">长袖T恤</a>
            </li>
        </ul>
    </li>
    <li class="level1">
        <a href="#">裤子</a>
        <ul class="level2">
            <li>
                <a href="#">男士裤子</a>
            </li>
            <li>
                <a href="#">女士裤子</a>
            </li>
            <li>
                <a href="#">八分裤子</a>
            </li>
            <li>
                <a href="#">短裤</a>
            </li>
        </ul>
    </li>
    <li class="level1">
        <a href="#">风衣</a>
        <ul class="level2">
            <li>
                <a href="#">男士风衣</a>
            </li>
            <li>
                <a href="#">女士风衣</a>
            </li>
            <li>
                <a href="#">加厚风衣</a>
            </li>
            <li>
                <a href="#">时尚风衣</a>
            </li>
        </ul>
    </li>
</ul>
```

> 页面样式-css部分

```css
// 在实际开发过程中建议选择less或者sass，先定义好页面的一些原色，比如警告什么颜色，背景色，激活什么颜色；
// 激活时候的样式
.active {
    background: orange;
}

ul,
li {
    list-style: none;
    margin: 0;
    padding: 0 0 0 0;
}

a {
    text-decoration: none;
}

.level1 {
    background: #ccc;
    width: 200px;
}

.level1 a {
    color: #fff;
    width: 100%;
    display: inline-block;
}
.level2 {
    display: none;
}
.level2 li {
    padding: 0 0 0 20px;
    line-height: 20px;
    height: 20px;
    background: #fff;
}

.level2 li a {
    color: #000;
}
```

> js部分

```javascript
    // 展示了jqury强大的链式操作，仅仅需要这几步就搞定了一个样式虽丑，但功能符合要求的menu菜单
$(function (params) {
    $('.level1>a').on('click', function (params) {
        $(this).addClass('active').next().show() //当前元素的下一个元素也就是ul菜单显示
            .parent().siblings().children('a').removeClass('active').next().hide();
    })
})
```

> 效果图

![](http://hunaisong.cn/wp-content/uploads/2017/07/menu.gif)