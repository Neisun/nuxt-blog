---
title: vue-router(5)-基于路由的过渡效果
tags:
  - vue
  - vue-router
slug: 383
categories:
  - 技术随笔
  - vue-router总结
date: 2017-09-12 10:23:53
description: "vue-router 进阶之四，讲解基于路由的过渡效果。通过分析示例，说明如何为路由切换添加过渡动画，并补充上一次内容的不足。"
image: /images/covers/045.jpg
---

上次内容中的不足之处做一个补充。上次提到可以根据路由然后给出不同的过渡效果。这一次看看实例，主要是分析一下尤大大的案例。虽然他写了例子，但其实听含糊的，初一看这个例子，让我有点困惑，以为他例子的写法是类似于app功能一样，回退添加效果是左滑，前进的效果是右滑。
但其实，他的意思是，根据to，from中的path判断是否在同一个路由下面（案例中包含了父级路由和子路由），如果不是一个路由就添加一种效果，如果是，就添加另一种效果。

尤雨溪的代码
```js
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Home = {
  template: `
    <div class="home">
      <h2>Home</h2>
      <p>hello</p>
    </div>
  `
}

const Parent = {
  data () {
    return {
      transitionName: 'slide-left'
    }
  },
  // dynamically set transition based on route change
  watch: {
    '$route' (to, from) {
      const toDepth = to.path.split('/').length
      const fromDepth = from.path.split('/').length
      this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
    }
  },
  template: `
    <div class="parent">
      <h2>Parent</h2>
      <transition :name="transitionName">
        <router-view class="child-view"></router-view>
      </transition>
    </div>
  `
}

const Default = { template: '<div class="default">default</div>' }
const Foo = { template: '<div class="foo">foo</div>' }
const Bar = { template: '<div class="bar">bar</div>' }

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', component: Home },
    { path: '/parent', component: Parent,
      children: [
        { path: '', component: Default },
        { path: 'foo', component: Foo },
        { path: 'bar', component: Bar }
      ]
    }
  ]
})

new Vue({
  router,
  template: `
    <div id="app">
      <h1>Transitions</h1>
      <ul>
        <li><router-link to="/">/</router-link></li>
        <li><router-link to="/parent">/parent</router-link></li>
        <li><router-link to="/parent/foo">/parent/foo</router-link></li>
        <li><router-link to="/parent/bar">/parent/bar</router-link></li>
      </ul>
      <transition name="fade" mode="out-in">
        <router-view class="view"></router-view>
      </transition>
    </div>
  `
}).$mount('#app')
```

我的写法是在他基础之上，做了一些修改

```js
// App.vue 中主要代码
  <ul>
    <li><router-link to="/">/</router-link></li>
    <li><router-link to="/parent">/parent</router-link></li>
    <li><router-link to="/parent/foo">/parent/foo</router-link></li>
    <li><router-link to="/parent/bar">/parent/bar</router-link></li>
  </ul>
<transition name="fade" mode="out-in">
  <router-view></router-view>
</transition>
```
```css
// 样式部分代码
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave {
  opacity: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
```

和尤雨溪一样，定义了一个parent组件，home组件，还有三个child组件，foo，bar，default

```js
// home.vue，其中foo，bar，default都和home.vue一样
<template>
    <div>
        这里是home页
    </div>
</template>
<script>
export default {

}
</script>
<style lang="less">

</style>
```

其中最值得一提的是parent了
直接看代码
```js
<template>
    <div>
        这里是parent页
        <!-- 绑定一个变量transitionName -->
        <transition :name="transitionName" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>
<script>
export default {
    data: function() {
        return {
            transitionName: 'slide-right'
        }
    },
    watch: {
        '$route': function(to, from) {
            console.log(to);
            console.log(from)
            // 核心判断
            const toDepth = to.path.split('/').length
            const fromDepth = from.path.split('/').length
            this.transitionName = toDepth < fromDepth ? 'slide-left' : 'slide-right'
        }
    }
}
</script>
<style lang="less">

.slide-right-enter-active,.slide-right-leave-active {
  transition: transform 1s ease;
}
.slide-right-enter{
  transform: translateX(-100%);
}
.slide-right-enter-to {
  transform: translateX(0);
}

.slide-left-enter-active,.slide-left-leave-active {
  transition: transform 1s ease;
}
.slide-left-enter{
  transform: translateX(0);
}
.slide-left-enter-to {
  transform: translateX(-100%);
}
</style>
```
效果图

![](http://www.hunaisong.cn/wp-content/uploads/2017/09/vue-router_5-3.gif)