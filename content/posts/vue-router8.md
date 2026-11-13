---
title: vue-router(8)-（router-link）
tags:
  - vue
  - vue-router
slug: 396
categories:
  - 技术随笔
  - vue-router总结
date: 2017-09-19 16:49:30
description: "vue-router 进阶之七，介绍 router-link 组件的属性与用法。梳理常用属性与导航方式，完善对 vue-router 组件的认识。"
image: /images/covers/049.jpg
---

`<router-link>`链接路由地址的链接，关于它的属性还是有几个非常有趣值得注意的地方，不然在使用的过程中遇到问题你就会各种懵逼，无从下手解决问题。
之前没有仔细看`router-link`的文档，看了才发现，自己确实没有把这个`router-link`用明白，至少可以说是没有用全，用的太片面了。

> **router-link用法**

```html
// 基础用法
<router-link to="/news">新闻</router-link>
// 绑定变量,news是变量
<router-link :to="news">新闻</router-link>
// 命名路由
<router-link :to="{name:'user',params:{userId:001}}">
// 传递查询参数
<router-link :to="{path:'user',query:{foo:'bar'}}">
// replace，可以直接在点击该路由时候，调用replace方法;
<router-link to="/user" replace>
// append方法，基于当前的路由然后添加路径，比如当前路由是/a
// 那么就会跳转到a/user
<router-link to="/user"></router-link>
// tag，渲染标签，可以指定渲染标签
// 默认渲染为a，现在渲染成li标签
<router-link to="/user" tag="li"></router-link>
// 导航默认激活样式,active-class,默认是router-link-active。
// 在router实例中可以配置linkActiveClass:'..'
// 之所以拿出来说明一下，是为了配合下边的exact
<router-link to="/user"></router-link>
// exact
// 在不给router-link添加这个属性时候，凡是跟他相关的路由，比如子路由被激活了，他就会被激活
// 然后激活的样式就会添加在上边，添加了exact属性之后，会将它排除在外，也算比较有趣的属性了。
<router-link to="/" exact>/</router>
```
一个小技巧，尤大大特意把它提出来单独说明的。就是我们`router-link`是渲染成a标签啊，这不满足我们的需求，而且，如果在外层嵌套一些标签，那么active样式就只能加在`router-link`上啊，不能加在外层标签上，这很不好啊。
尤雨溪给出的解决措施
```html
// router-link使用tag属性渲染成我们需要的标签，里边嵌套a标签，总之就是活用tag等属性
<router-link tag="li" to="/foo">
  <a>/foo</a>
</router-link>
```

（完）