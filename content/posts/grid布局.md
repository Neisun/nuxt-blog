---
slug: 536
title: grid布局
date: 2017-12-26 09:45:00
tags:
    - css3
categories:
    - 技术随笔
    - 页面效果
description: "讲解 CSS Grid 网格布局的用法。介绍 grid 容器与项目的关键属性，通过示例展示二维布局的灵活与强大。"
image: /images/covers/081.jpg
---
## grid布局，可能主导未来布局方式

这话，说的很大。但不是我说的，我也只是引用。不过话也说过来，正是因为看到了可能主导未来，才引起我的注意，我才会来研究一下他的使用方式。

### 最基本的使用方式

来看一下我们的结构，然后是布局的代码。最后附上一张图片，来展示我们的效果。

结构代码很简便，一个大盒子，套了6个小盒子。

```html
<div class="wrapper">
    <div class="item1"></div>
    <div class="item2"></div>
    <div class="item3"></div>
    <div class="item4"></div>
    <div class="item5"></div>
    <div class="item6"></div>
</div>
```
然后，我们给了一个布局。

```css
.wrapper {
    display: grid;
    grid-template-columns: 100px 100px 100px;
    grid-template-rows: 50px 50px;
}

.item1 {
    background: red;
}

.item2 {
    background: blue;
}

.item3 {
    background: green;
}

.item4 {
    background: orange;
}

.item5 {
    background: yellow;
}

.item6 {
    background: purple;
}
```
效果图如下

![](/hunaisong.github.io/img/pic01.png)

总结一下

- 给父容器盒子设定属性`display:grid`
- 然后我们设置n*m的格子，通过`grid-template-columns`, `grid-template-rows`分别来设置每列的宽度和每行的高度，这样设置完后。容器内的元素会自动填充。

### 放置一下我们的item元素

上个例子，是按照最原始的方式进行排列。子元素会自动填满我们的格子。如果我们把布局改为3*3，那么只有6个子元素，所以，还填不满呢。我们就利用剩余的那部分，进行布局。

如果改成3*3，布局，那么对父元素来说，布局改成这样。

```css
.wrapper {
    display: grid;
    grid-template-columns: 100px 100px 100px;
    grid-template-rows: 100px 100px 100px;
}
```
![](/hunaisong.github.io/img/pic02.png)

我想把布局改成让item1独占一行，怎么设置？

```css
/* 想让item1独占一行 */
.item1 {
    background: red;
    grid-column-start: 1;
    grid-column-end: 4;
}
```

![](/hunaisong.github.io/img/pic03.png)

- 容易困惑的地方，`grid-column-start`与`grid-column-end`后边的数字是什么意思。这个数字就是我们分成三份，实际上是有四条边界线。看图就理解了。

![](/hunaisong.github.io/img/pic04.png)


如果我想让item2占据两行，怎么设置，根据上边的设置，我们很快就想到，我们应该这么设置。

```css
/* 想让item2独占两行 */
.item2 {
    background: blue;
    grid-row-start: 2;
    grid-row-end: 4;
}
```

![](/hunaisong.github.io/img/pic05.png)

grid布局好倒是好，就是提供了众多的属性和配置，反倒显得繁琐了。

[一个比较好的文档](http://www.css88.com/archives/8510)