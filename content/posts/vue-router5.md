---
title: vue-router(4)
tags:
  - vue
  - vue-router
slug: 376
categories:
  - 技术随笔
  - vue-router总结
date: 2017-09-11 17:17:14
description: "vue-router 进阶之三，继续补充路由进阶内容。结合示例说明更灵活的路由配置与使用方式，帮助加深对 vue-router 的理解。"
image: /images/covers/044.jpg
---

新的一周开始，该做的还得继续做下去不是，哈哈。那么就继续我们的`vue-route`进阶部分的使用吧。

**每天都记得回头看一下曾经的自己，要比过去的自己更好**

言归正传，犊子扯多了，犊子也累。
那么进阶的内容是啥呢，就是一个路由再切换的时候，就是.vue在动态的展示。可是直接跳出来是不是特别突兀和单调乏味，没有效果和交互，还要前端干啥子呦。

回忆一下，`vue`的语法，怎么添加过渡效果？
对，就是给你想添加过渡效果的位置添加`trantion`标签，如果是多个元素那就`transition-group`标签。
然后就是根据类名添加过渡效果，详细的忘了的话可以参考vue教程里边的语法，非常方便的。

**全局设置过渡效果**

如果需要进入每个页面时候的效果都是一样的，那么就给全局添加过渡效果就好，这样会作用于每一个组件。
```js
<transition>
  <router-view></router-view>
</transition>
```
写一个案例
```js
// App.vue中部分代码
    <router-link to="/a">/a</router-link>
    <router-link to="/b">/b</router-link>
    <router-link to="/c">/c</router-link>
    <router-link to="/d">/d</router-link>
    <button @click="go">go</button>
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>

// 定义的类名过渡效果样式
.fade-enter,.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,.fade-leave {
  opacity: 1;
}
.fade-enter-active,.fade-leave-active {
  transition: opacity 2s;
}
// 记得过渡效果两个阶段，四个过程的图片么，可以去看看
```

效果是这样子

![](http://www.hunaisong.cn/wp-content/uploads/2017/09/vue-router_5-1.gif)

**给每个组件又或者说是可以给单个路由设置过渡效果**

看一下官网案例代码，就一目了然，然后配合一个小demo
```js
const Foo = {
  template: `
    <transition name="slide">
      <div class="foo">...</div>
    </transition>
  `
}

const Bar = {
  template: `
    <transition name="fade">
      <div class="bar">...</div>
    </transition>
  `
}
```
看一下我写的demo代码
```js
// A.vue
  <transition name="color">
    <div>

## A组件

    </div>
  </transition>

.color-enter-active,.color-leave-active {
  transition: color 2s ease;
}
.color-enter,.color-leave-to {
  color:red;
}
.color-enter-to,.color-leave {
  color:#000;
}
```
```js
// 404.vue
 <transition name="slide">

# 
         啊哦，你找的页面不存在哦！

 </transition>

.slide-enter-active,.slide-leave-active{
    transition: all 1s ease;
}
.slide-enter{
    transform: translateX(-200px);
}
.slide-enter-to {
    transform: translateX(0)
}
.slide-leave {
    transform: translateX(0)
}
.slide-leave-to {
    transform: translateX(200px)
}
```
效果图

![](http://www.hunaisong.cn/wp-content/uploads/2017/09/vue-router_5-2.gif)

**基于路由的动态过渡**
```js
<!-- 使用动态的 transition name -->
<transition :name="transitionName">
  <router-view></router-view>
</transition>
// 接着在父组件内
// watch $route 决定使用哪种过渡
watch: {
  '$route' (to, from) {
    const toDepth = to.path.split('/').length
    const fromDepth = from.path.split('/').length
    this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
  }
}
```