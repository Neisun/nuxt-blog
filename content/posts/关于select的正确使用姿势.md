---
title: 关于select的正确使用姿势
slug: 70
categories:
  - 技术随笔
  - 页面效果
date: 2017-07-05 00:33:03
tags:
description: "原生 select 下拉框在表单中的正确使用姿势。结合 label、placeholder 与 disabled 等属性，梳理 select 的常见用法、取值方式与样式兼容性问题，并给出实用的优化技巧。"
image: /images/covers/001.jpg
---

> **form表单中经常使用的元素**

select是我们在form表单中经常使用的元素，但是最近在工作过程中，发现公司的前端对这个元素的使用存在着许多问题和误区，那么如何是使用它的正确姿势呢？今天我们就来一起探讨一下。
> **进入正题**

我们创建了一个select，代码如下；
```html
<select id="my_select" name="select">
    <option value="1">春江潮水连海平</option>
    <option value="2">海上明月共潮生</option>
    <option value="3">滟滟随波千万里</option>
    <option value="4">何处春江无月明</option>
</select>
```
我们想获取到第一个select的第一个option的value和text值，最正确的打开方式是什么样子呢？
首先获取当前节点，这是必须的。接下来的操作可能就是五花八门了，我们只说最标准的方式。最标准的方式应该是，使用select元素自带的api来调用。
代码如下：
```javascript
// 获取到当前的select
var select = document.getElementById('my_select');
//我们直接使用select的options来获取，这是最标准的方式，最提倡使用的方式。
var text = select.options[0].text;
var value =select.options[0].value;
```
那么当我们改变下拉列表时候，怎么才能知道，当前选项的value呢？当改变下拉列表的时候，有一个事件会触发，onchange事件，而其中还会有一个非常重要的东西，selectedIndex,表示当前选中的option的index;
我们写一段代码，让每次select改变的时候，都会alert出当前选中的text；
```javascript
select.onchange = function (event) {
        console.log(this.options[this.options.selectedIndex].text)   
}
```
关于删除select的option，方式有很多，基本上掌握常用的就可以，常用的方式是这三种；
```javascript
//DOM方式
select.removeChild(0);
//select自带的api
select.remove(0);
//select.options方式
select.options[0] = null;
```
而对option进行移动和排序，那最简单的方式，就是使用DOM的appendChild和insertBefore方式
```javascript
//会有一个非常奇妙的现象出现，就是使用开发者工具查看，我们发现option的顺序确实发生了变化，但是select默认的第一个值，却仍然是原来的值，可能跟浏览器的渲染有关系。
select.insertBefore(select.options[1],select.options[0]);
```
> 全部代码如下
```html
<select name="select" id="my_select">
        <option value="1">春江潮水连海平</option>
        <option value="2">海上明月共潮生</option>
        <option value="3">滟滟随波千万里</option>
        <option value="4">何处春江无月明</option>
</select>
```
```javascript
<script>
// 获取到当前的select
        var select = document.getElementById('my_select');
        // 获取select最正确的方式,使用DOM的方式不标准,但也是可以的
        var text = select.options[0].text;
        var value =select.options[0].value;
        // 在select发生变化的时候获取到,当前选中的值;selectedIndex是关键，这个是当前选项options的index，完美！
        select.onchange = function (event) {
         alert(this.options[this.options.selectedIndex].text);   
        }
</script>
```