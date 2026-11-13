---
slug: 535
title: css的宽高固定等间距布局demo
date: 2017-12-22 11:15:59
tags:
    - css
categories:
    - 技术随笔
    - 页面效果
description: "实现 CSS 宽高固定、等间距布局的 demo。通过百分比、flex 等方式实现自适应的等间距排列，处理间距计算的细节。"
image: /images/covers/080.jpg
---
## 逛论坛看到的一个布局问题

今天在看论坛时候看到一个非常有趣的布局问题，而且解法多种多样，挺有意义的。每个解法的背后，都是对css的别样理解。

这个布局是这样的。

![布局图](/hunaisong.github.io/img/example.png);

- 图标宽高固定，60*60
- 间距要求都相等
- 在不同设备也要求同样的效果

> 方案一 

最先联想到弹性盒布局

```html
<ul class="list-group">
    <li class="gap"></li>
    <li class="list-item"></li>
    <li class="gap"></li>
    <li class="list-item"></li>
    <li class="gap"></li>
    <li class="list-item"></li>
    <li class="gap"></li>
</ul>
```
```css
.list-group {
    display: flex;
    background: yellow;
}

.gap {
    flex: 1;
}

.list-item {
    width: 60px;
    height: 60px;
    background: #ccc;
}
```
> 方案二


```html
<!-- 整体分三部分，外边容器，肯定display:flex，然后第一个share-item和第三个share-item的flex设置1，里边的item-inner设置固定宽高，60*60，然后让其居中 -->
<ul class="share-list">
    <li class="share-item">
        <div class="item-inner"></div>
    </li>
    <li class="share-item">
        <div class="item-inner"></div>
    </li>
    <li class="share-item">
        <div class="item-inner"></div>
    </li>
</ul>
```
```css
.share-list {
    display: flex;
    background: yellow;
}

.share-item:nth-child(1),
.share-item:nth-child(3) {
    flex: 1;
}

.share-item:nth-child(2) {
    width: 60px;
}

.item-inner {
    background: #ccc;
    width: 60px;
    height: 60px;
    margin: 0 auto;
}
```
> 方案三

```html
<!-- 采用table的方式布局 -->
<table>
    <tr>
        <th class="gap"></th>
        <th class="list-item"></th>
        <th class="gap"></th>
        <th class="list-item second"></th>
        <th class="gap"></th>
        <th class="list-item"></th>
        <th class="gap"></th>
    </tr>
</table>
```
```css
table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    table-layout: fixed;
}
tr {
    background: yellow;
}
.list-item {
    width: 60px;
    height: 60px;
    background: #ccc;
}
```

> 方案四

```html
<!-- (100%-60*3)/4 => 25%-45px -->
<!-- 通过计算得出，每个间隙的宽度，25%-45,于是给容器元素一个padding，负责左右两边的25%，内部搭配space-between属性，margin不要忘了 -->
<div class="wrapper">
    <ul class="list-group">
        <li class="list-item"></li>
        <li class="list-item"></li>
        <li class="list-item"></li>
    </ul>
</div>
```
```css
.wrapper {
    padding: 0 25%;
    background: yellow;
}
.list-group {
    display: flex;
    justify-content: space-between;
    margin: 0 -45px;
}
.list-item {
    width: 60px;
    height: 60px;
    background: #ccc;
}
```

