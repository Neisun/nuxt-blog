---
title: 购物车等页面CheckBox的使用技巧
tags:
  - jQuery
  - 原生JS
slug: 205
categories:
  - 技术随笔
  - 页面效果
date: 2017-07-24 11:25:38
description: "介绍购物车等页面中复选框的使用技巧。涵盖全选、反选、联动等常见交互，以及如何优雅地处理选中状态与数据统计。"
image: /images/covers/016.jpg
---

> **源于项目的需求**

一个亘古不变的道理，需求驱使功能；在购物车等功能性页面会经常用到CheckBox这个标签。使用频率还是相当高的，好多时候，我们需要操作这些东西，那么该如何去操作是比较正确的，今天做一个记录。
> **分析一下，想做的效果的需求**

*   四个商品，商品下边有功能按钮
*   全选，全不选，反选，提交
*   提交时候，alert出你选择的商品
这就是所有的需求
> **HTML部分**
```html
    <div>
        <input type="checkbox" name="goodsItem" value="连衣裙">连衣裙
        <input type="checkbox" name="goodsItem" value="风衣">风衣
        <input type="checkbox" name="goodsItem" value="鞋子">鞋子
        <input type="checkbox" name="goodsItem" value="裤子">裤子
        <input type="button" name="" value="全选" id="all">
        <input type="button" name="" value="全不选" id="none">
        <input type="button" name="" value="反选" id="op">
        <input type="button" name="" value="提交" id="submit">
    </div>
```
没有样式这一说，只是在实现功能，样式问题不管。所以接下来直接看js部分代码。

> **js部分**

```javascript
// 获取到所有有用的节点
        var oAll = document.getElementById("all"),
            oNone = document.getElementById("none"),
            oOp = document.getElementById("op"),
            oSub = document.getElementById("submit"),
            goods = document.getElementsByName("goodsItem"),
            len = goods.length;
        // 全选
        oAll.onclick = function (e) {
            for (var i = 0; i < len; i++) {
                goods[i].checked = true;
            }
        }
        // 全不选
        oNone.onclick = function (e) {
            for (var j = 0; j < len; j++) {
                goods[j].checked = false;
            }
        }
        // 反选
        oOp.onclick = function (e) {
            // console.log(1)
            for (var k = 0; k < len; k++) {
                goods[k].checked = !goods[k].checked;
            }
        }
        // 提交
        oSub.onclick = function (e) {
            // 用来存放已选
            var arr = [],
                str = "";
            for (var n = 0; n < len; n++) {
                if (goods[n].checked) {
                    arr.push(goods[n]);
                }
            }
            for (var m = 0; m < arr.length; m++) {
                str += arr[m].value + "\r\n";
            }
            alert("选择的商品是：" + "\r\n" + str);
        }
```

> 效果如下

![](http://hunaisong.cn/wp-content/uploads/2017/07/checkbox_1.gif)

那么我们常见的淘宝，京东的全选和全不选其实是通过一个CheckBox控制的，那么我们改写。直接使用一个checkbox控制，而且也没有反选这个反人类的东西，那些交给用户自己去决定。之所以在上述例子中加入反选，为了更深入了解功能使用；那么简化后的结构和代码部分如下
```html
    <div>
        <input type="checkbox" name="goodsItem" value="连衣裙">连衣裙
        <input type="checkbox" name="goodsItem" value="风衣">风衣
        <input type="checkbox" name="goodsItem" value="鞋子">鞋子
        <input type="checkbox" name="goodsItem" value="裤子">裤子
        <input type="checkbox" name="" value="" id="all_none">全选/全不选
        <input type="button" name="" value="提交" id="submit">
    </div>
```
```javascript
var oSub = document.getElementById("submit"),
    oConttol = document.getElementById("all_none"),
    goods = document.getElementsByName("goodsItem"),
    len = goods.length;
        // 提交
        oSub.onclick = function (e) {
            // 用来存放已选
            var arr = [],
                str = "";
            for (var n = 0; n < len; n++) {
                if (goods[n].checked) {
                    arr.push(goods[n]);
                }
            }
            for (var m = 0; m < arr.length; m++) {
                str += arr[m].value + "\r\n";
            }
            alert("选择的商品是：" + "\r\n" + str);
        }
        // 如果改写为使用一个checkbox控制全选和全不选呢
        var oConttol = document.getElementById("all_none");
        oConttol.onclick = function (e) {
            for (var i = 0; i < len; i++) {
                goods[i].checked = this.checked;
            }
        }
//jq代码部分
        // 所有的这些都可以改用jq改写，其中值得注意的是，很多人用attr，这个获取属性的方法是有问题的，
           问题在于checkbox和disabled这种属性中，因为他们甚至不需要写属性值，所以一开始直接用attr获取时候会获得什么？
           undefined，没错就是undefined，很恶心，还不如写原生呢。
           但是jq的作者早就考虑到这个问题，所以有了prop这个方法，用来读写checked和disabled这种属性。
        $("#all_none").click(function (e) {
            var $this = $(this);
            $("input[name=goodsItem]").each(function (index, value) {
                $(this).prop("checked", $this.prop("checked"))
            })
        })
        $("#submit").click(function (e) {
            var str = "";
            $("input[name=goodsItem]:checked").each(function (index, value) {
                str += $(this).val() + "\r\n";
            })
            alert("选择的商品是：" + "\r\n" + str);
        })
```
改写后的效果：

![](http://hunaisong.cn/wp-content/uploads/2017/07/checkbox_2.gif)