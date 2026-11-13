---
title: select的应用（穿梭框的写法）
tags:
  - jQuery
  - 原生JS
slug: 209
categories:
  - 技术随笔
  - 页面效果
date: 2017-07-25 10:04:44
description: "用 select 元素实现穿梭框的写法。介绍左右两个列表之间的选中、添加、移除与批量操作，梳理状态同步的实现细节。"
image: /images/covers/017.jpg
---

> **后台系统常见的功能**

在后台系统中常见的是需要把左侧的多选框中的内容添加到右侧，或者反过来，比如elementui中的穿梭框。

[ElementUi穿梭框](http://element.eleme.io/#/zh-CN/component/transfer)，其实在功能的实现上一点都不困难，今天使用一个小demo，简易完成此功能。

还是老样子，做事情要分析一下。那么我们的需求是什么？

没图不太好分析，那么上一张图，就着图进行分析。

![](http://hunaisong.cn/wp-content/uploads/2017/07/show.png)

*   选中左侧的多选框中的项，点击添加到右侧按钮，选中的项被添加到右侧
*   点击全部添加到右侧按钮，所有的选项会被添加到右侧
*   双击选项也会被添加到右侧
*   以上功能对右侧也是同样适用
需求分析完毕

看一下，代码的结构。
```html
<div class="container clearfix">
    <div class="left box">
        <select id="select_left" class="select" multiple>
            <option value="选项一">选项一</option>
            <option value="选项二">选项二</option>
            <option value="选项三">选项三</option>
            <option value="选项四">选项四</option>
        </select>
        <div class="control">
            <button type="button" id="selctedToRight">选中添加到右侧</button>
            <button type="button" id="allToRight">全部添加到右侧</button>
        </div>
    </div>
    <div class="right box">
        <select id="select_right" class="select" multiple>

        </select>
        <div class="control">
            <button type="button" id="selectedToLeft">选中添加到左侧</button>
            <button type="button" id="allToLeft">全部添加到左侧</button>
        </div>
    </div>
</div>
```
```less
// 直接使用less写了
// 定义一个基本像素
@px:10px;
// margin和padding的公共函数
.margin-padding (@m,@p) {
    margin: @m;
    padding: @p;
}
// 宽高公共函数
.width-height(@w,@h) {
    width: @w;
    height: @h;
}
// 请浮动
.clearfix::after {
    display: block;
    clear: both;
    height: 0;
    content: "";
}
// 浮动函数
.float {
    float: left;
}
// 暴力重置
*{
    .margin-padding(0,0);
}
// container
.container {
    margin: @px*3 auto;

    .width-height(@px*50,@px*28);
    .box {
        .width-height(@px*23.5, @px*28);
        .float;
        &:last-child {
                margin-left: 10px;
            }
        .select {
            .width-height(100%, 90%);
        }
        .control {
            .width-height(100%, 10%);
        }
    }
}
```
```js
//如果使用jq写，那么相对来说非常简单。因为jq中的appendTo函数可以直接完成这个操作，我们看一下代码
$(function () {
    // 选中的添加到右侧
    $("#selctedToRight").click(function (e) {
        // appendTo参数可以直接是选择器，不需要必须传入jq对象
        $("#select_left option:selected").appendTo("#select_right");
    })
    // 全部全部添加到右侧
    $("#allToRight").click(function (e) {
        $("#select_left option").appendTo("#select_right");
    })
    // 选中添加到左侧
    $("#selectedToLeft").click(function (e) {
        $("#select_right option:selected").appendTo("#select_left");
    })
    // 全部添加到右侧
    $("#allToLeft").click(function (e) {
        $("#select_right option").appendTo("#select_left");
    })
    // 双击添加到对侧
    $(".select option").dblclick(function (e) {
        // 这里需要做判断，判断option的父级是哪一边，然后添加到相反的一边
        var $parent = $(this).parent();
        // 这些是为了，确定jq对象之间的关系，然后才能准确判断出到底该怎么判断
        // $parent和$("#select_left")这两个jq对象不是相同的，而他们的第0个对象是一样的，都是select那个节点
        // console.log($parent[0])
        // console.log($("#select_left"))
        // console.log($parent[0] == $("#select_left")[0])
        // if ($parent[0] === $("#select_left")[0]) {
        //     $(this).appendTo("#select_right");
        // } else {
        //     $(this).appendTo("#select_left");
        // }
        // if判断简写成三元表达式，简化代码
        $parent[0] === $("#select_left")[0] ? $(this).appendTo("#select_right") : $(this).appendTo(
            "#select_left");
    })
})
```

jq固然简单，但是你说你不会写原生，你还是个前端er？原生相对来说，代码量会多一些。
但是逻辑和jq都是相同的，不同之处在代码中已经给出。
```js
// 使用原生来重写写一遍，可以自己定义一个函数用来获取id节点。。。
// 如果还想简化代码，可以把所有的if变成三元表达式
var oSTR = document.getElementById("selctedToRight"),
    oATR = document.getElementById("allToRight"),
    oSTL = document.getElementById("selectedToLeft"),
    oATL = document.getElementById("allToLeft"),
    oSl = document.getElementById("select_left"),
    oSr = document.getElementById("select_right"),
    oLop = document.getElementById("select_left").children,
    oRop = document.getElementById("select_right").children;
// 选中的添加到右侧
oSTR.onclick = function (e) {
    var arr = [];
    // 如果不使用一个数组接收，最多只能还会剩两个，
        原意在于，option长度发生了变化，for循环没法执行，循环出问题，
        所以会导致这个现象的出现
    for (var i = 0; i < oLop.length; i++) {
        if (oLop[i].selected) {
            arr.push(oLop[i]);
        } else {

        }
    }
    for (var j = 0; j < arr.length; j++) {
        oSr.appendChild(arr[j])
    }
}
// 全部添加到右侧
oATR.onclick = function (e) {
    var arr = [];
    for (var i = 0; i < oLop.length; i++) {
        arr.push(oLop[i]);
    }
    for (var j = 0; j < arr.length; j++) {
        oSr.appendChild(arr[j]);
    }
}
// 选中部分添加到左侧
oSTL.onclick = function (e) {
    var arr = [];
    for (var i = 0; i < oRop.length; i++) {
        if (oRop[i].selected) {
            arr.push(oRop[i]);
        }
    }
    for (var j = 0; j < arr.length; j++) {
        oSl.appendChild(arr[j]);
    }
}
// 全选添加到左侧
oATL.onclick = function (e) {
    var arr = [];
    for (var i = 0; i < oRop.length; i++) {
        arr.push(oRop[i]);
    }
    for (var j = 0; j < arr.length; j++) {
        oSl.appendChild(arr[j]);
    }
}
// 在来个双击事件
var options = document.getElementsByTagName("option");
for (var i = 0; i < options.length; i++) {
    options[i].ondblclick = function (e) {
        if (this.parentElement===oSl) {
            oSr.appendChild(this);
        }else {
            oSl.appendChild(this);
        }
    }
}
</pre>
效果图是这样的，当然可以进行优化，画面很美的那种。

![](http://hunaisong.cn/wp-content/uploads/2017/07/select.gif)