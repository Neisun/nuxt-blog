---
title: js拖拽（一）
tags:
  - 原生JS
slug: 194
categories:
  - 技术随笔
  - 页面效果
date: 2017-07-21 16:17:55
description: "用原生 JavaScript 实现页面元素拖拽的第一篇基础教程。从鼠标事件入手，讲解拖拽的坐标计算与移动逻辑，为后续进阶内容做铺垫。"
image: /images/covers/015.jpg
---

> **经常用到的拖拽**

在WEB中经常会出现的交互就是可以放用户拖拽元素，这是一个非常好用的交互方式。今天就先用js原生的方式，实现最普遍的方式，后续会对该方式进行相应的封装，封装成普遍的方式。

要实现拖拽，我们分析一下思路，何为拖拽。就是鼠标在该元素上按下，按住鼠标移动，该元素会跟着鼠标移动，鼠标抬起，元素停止移动。那么对需求分析就是这个样子的：

*   该元素的布局必须是absolute，主要是动态的改变left和top值
*   对该元素绑定一个mousedown事件
*   对该元素绑定一个mousemove事件，核心所在
*   对该元素绑定mouseup事件，解除mousemove事件的绑定，不然会继续移动；
基本上的需求分析都在上边；我们一步步去实现；

> HTML部分

```html
<div id="target"></div>
```
就这么一个简单的div就成，房子盖好了，装修一下吧；

> CSS部分

```css
html,
body {
  margin: 0;
  padding: 0;
}
#target {
  position: absolute;
  width: 100px;
  height: 100px;
  background: red;
  margin: 0;
  padding: 0;
}
```
这就装修好了，那么我们该继续使用了；按照我们的思路，我们的js代码应该是这样的；
```javascript
var oTarget = document.getElementById("target");
oTarget.onmousedown = function (event) {
    oTarget.onmousemove = function (event) {
        oTarget.style.left = event.clientX + "px";
        oTarget.style.top = event.clientY + "px";
    }
}
oTarget.onmouseup = function (event) {
    oTarget.onmousemove = null;
}
```

**上一张图看看，会出现什么样的效果。然后分析代码的问题，接下来修改代码；**

![](http://hunaisong.cn/wp-content/uploads/2017/07/drag-drop_1.gif)

看出问题了么？问题就是鼠标在元素内部点击之后，开始移动，元素会跳动一下，然后该元素的左上角会和鼠标的那个尖尖的点，对齐，并且当我们在该元素上按下鼠标随后快速移出，同样会出现一个没法理解的bug，貌似mouseup事件失效了；这到底怎么回事。

**看一张图，看看出现跳动的原因；**

![](http://hunaisong.cn/wp-content/uploads/2017/07/explain.png)

跳动的原因分析完了；可以按下鼠标然后快速移出元素区域，接着移回元素区域，发现mouseup事件失效怎么回事。

**因为，mousemove事件是应该绑定在document上，因为鼠标是在document上move，同理，也应该把mouseup事件绑定给document上**

分析完之后，重新修改一下代码；
```javascript
var oTarget = document.getElementById("target");
// mousedown事件还是绑定在元素上
oTarget.onmousedown = function (event) {
    var diffX = event.clientX - oTarget.offsetLeft,
        diffY = event.clientY - oTarget.offsetTop;
    // mousemove事件绑定到document上
    document.onmousemove = function (event) {
        oTarget.style.left = event.clientX - diffX + "px";
        oTarget.style.top = event.clientY - diffY + "px";
    }
}
// mouseup事件绑定在document上
document.onmouseup = function (event) {
    document.onmousemove = null;
}
```
**看看效果**

![](http://hunaisong.cn/wp-content/uploads/2017/07/drag-drop_2.gif)

基本满足需求了，其实还是有一个问题的。就是一旦这个元素内部有文本或者图片，文本或者图片是可以被选中然后移动，当我们选中文本或者图片然后快速拖出元素，然后在移回元素，我们发现，功能又一次乱套了，**出BUG！！！**
看图吧，还能说啥；

![](http://hunaisong.cn/wp-content/uploads/2017/07/drag-drop_3.gif)

解决措施相当简单，因为选择文本或者图片属于用户选择方面，我们禁用用户选择就可以；直接在css中写user-select:none；注意兼容性的问题，完善之后的css代码如下：

```css
html,
body {
  margin: 0;
  padding: 0;
}
#target {
  position: absolute;
  margin: 0;
  padding: 0;
  width: 100px;
  height: 100px;
  background: red;

  /*处理用选择问题  */

   user-select: none; 
   -moz-user-select: none;
   -webkit-user-select: none;
   -ms-user-select: none;
  -o-user-select:none;
}
```
这才是完美解决了问题，上一个链接吧。大家自己测试玩去；
[狠狠点击我](http://hunaisong.cn/example/html/drag&drop.html)

下次会对拖拽功能封装，使其具有普遍性；