---
title: CSS动画-transition
slug: 151
categories:
  - 技术随笔
  - 令人着迷的CSS动画
date: 2017-07-12 14:15:29
tags:
description: "讲解 CSS3 过渡动画的核心属性。从 transition-property、duration 到 timing-function、delay，逐一说明各属性的含义与取值，并给出组合使用的示例。"
image: /images/covers/010.jpg
---

> **css3最令人着迷的地方**

css本无可厚非，它的出现给网页带来了视觉冲击和非常好的交互体验。但就其本身的语言来说没有太多的可说东西，只要去读读文档，外加写点东西，就能够掌握大部分常用的语法。但是在动画出现之前，所有的类似于动画的操作都是由js部分完成，单独靠css是解决不了这些问题的。

css的动画出现，照亮了这一片黑暗的领域，让我们在做类似的效果的时候，不再用js这把杀牛刀，也可以做出比较好的效果。

今天主要说的是transition，也就是“过渡”。过渡的几个属性，在此一一详细的介绍一下，因为属性很少，实用。
1.  transition-property：需要使用过渡的样式，比如width
2.  transition-duration：过渡持续的时间（单位 s）
3.  transition-timing-function：过渡函数，ease，linear等等，这里边还有一个贝塞尔曲线函数
4.  transition-delay：过渡效果延迟执行时间（单位 s）
这就是transition所有的属性，相当简单，而且我们在书写transtion的时候，都是写的简写；形式就是这样的
```css
transition: width 1s 1s linear;
```
直接简写就好，效率比较高；
接下来，做一个demo，给女神高圆圆做一个小小的效果；
分析一下需求；
1. 先让女神的照片从纵向拉长
2. 然后横向变宽
3. hover结束的时候，效果反过来执行；
直接看代码；
```html
<div class="img-wrapper"><img src="../img/godness.jpeg" alt="" /></div>
```
```css       
* {
    margin: 0;
    padding: 0;
}
.img-wrapper {
    width: 100px;
    height: 100px;
    margin: 50px auto;
}
.img-wrapper img {
    width: 100%;
    height: 100%;
    /*transition里可以连续写多个属性，然后以','隔开，多种属性叠加的效果可以非常漂亮*/
    transition:height 1s linear,width 1s 1s linear;
}
.img-wrapper img:hover {
    width: 200%;
    height: 200%;
}
```
点这里查看效果，<span style="color: #ff0000;">[狠狠点击我](http://hunaisong.cn/example/html/transition.html)</span>

未完待续，下次会记录animation的一些用法和关键性的属性，transition部分结束。