---
title: 比较常规的nav导航（带有下拉列表）
slug: 180
categories:
  - 技术随笔
  - 页面效果
date: 2017-07-17 23:33:02
tags:
description: "实现一个带下拉列表的常规导航栏。参考常见 UI 框架的效果，介绍多级菜单的展开收起、hover 交互与样式处理，适合后台或门户类页面复用。"
image: /images/covers/012.jpg
---

> 开发过程中常见到的nav导航

最近没写文章，实在是罪过。对不起自己（/(ㄒoㄒ)/~~）。经常看到页面上有一些比较常见的导航栏，很早之前大家都是手写，最近都是各种框架各种上。看到layUI框架的导航栏效果还是蛮有创意的，这次我们就直接仿照他的样子，手写一个这样的nav。
HTML部分很简单，就直接上代码。

> HTML部分

```html
<nav>
    <ul class="nav-list">
        <li class="nav-list-item"><a href="#" class="item">最新活动</a></li>
        <li class="nav-list-item"><a href="#" class="item">产品</a></li>
        <li class="nav-list-item"><a href="#" class="item">大数据</a></li>
        <li class="nav-list-item">
            <a href="#" class="item">
                解决方案
                <span class="arrow"></span>
            </a>
            <dl class="child">
                <dd><a href="#">移动模块</a></dd>
                <dd><a href="#">后台模板啊大撒旦撒</a></dd>
                <dd><a href="#">电商平台</a></dd>
            </dl>
        </li>
        <li class="nav-list-item"><a href="#" class="item">社区</a></li>
        <span class="line"></span>
    </ul>
</nav>
```

> CSS部分有一点说道
```css
        * {
            margin: 0;
            padding: 0;
        }

        ul li {
            list-style: none;
        }

        a {
            text-decoration: none;
        }

        .nav-list {
            padding: 0 30px;
            background: #393D49;
            position: relative;
            font-size: 0;
        }
        /*可以采用float布局，然后记得清除浮动就可以  */
        /*值得说道的是若是直接变成inline-block的话，一个留白的问题  */
        /*这个问题会影响到，鼠标滑过效果，也就是底下的那条线，因为有留白，
        会影响取值，导致那条线取值不准确  */
        /*解决措施一大堆，我选择的是给
        父级元素font-size:0,然后inline-block元素的font-size设定正常值  */

        .nav-list-item {
            display: inline-block;
            line-height: 60px;
            font-size: 14px;
            position: relative;
        }

        .nav-list-item a {
            display: block;
            padding: 0 20px;
            color: #c2c2c2;
        }

        .nav-list-item a:hover {
            color: #fff;
        }

        .line {
            display: inline-block;
            position: absolute;
            bottom: 1px;
            left: 0;
            height: 5px;
            width: 0;
            background: #5FB878;
            transition: all .3s ease;
        }

        .arrow {
            display: block;
            width: 0;
            height: 0;
            border: 6px solid transparent;
            position: absolute;
            top: 28px;
            right: 0;
            border-top-color: #c2c2c2;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .nav-list-item:hover .arrow {
            border-top-color: transparent;
            border-bottom-color: #c2c2c2;
            top: 22px;
        }

        .child {
            position: absolute;
            top: 65px;
            left: 0;
            border: 1px solid #ccc;
            min-width: 100px;
            display: none;
        }

        .child a {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }

        .child a:hover {
            background: #ccc;
        }
```

> js部分

```javascript
//默认引入jq库，有一个小小说明，mouseenter和mouseover的区别，mouseover会作用于子元素，
mouseenter就第一次从子元素进入到父元素时候会触发。
$(".nav-list-item").mouseenter(function (e) {
            $(this).find(".child").stop().slideDown();
            var $width = $(this).outerWidth();
            var $prevs = $(this).prevAll();
            var posLeft = 30;
            $prevs.each(function (params) {
                posLeft = posLeft + $(this).outerWidth();
            })
            $(".line").css({
                "width": $width + "px",
                "left": posLeft + "px"
            })
        }).mouseleave(function (params) {
            $(this).find(".child").stop().slideUp();
        })
```

> 效果图

![](http://hunaisong.cn/wp-content/uploads/2017/07/nav.gif)