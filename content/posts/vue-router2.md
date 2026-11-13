---
title: vue-router(2)
tags:
  - vue
  - vue-router
slug: 361
categories:
  - 技术随笔
  - vue-router总结
date: 2017-09-07 14:13:32
description: "vue-router 进阶之一，介绍导航钩子。梳理全局、路由与组件级钩子的触发时机与用途，并补充 history 模式相关的说明。"
image: /images/covers/041.jpg
---

上一次把基础的部分都大致说了一次。其实其中露了一个基础部分。就是history模式，因为使用路由之后，可能url看起来比较丑。比较怪异吧。详细部分就不说明了，就直接去官网看一下就行了。
来看看vue-router进阶部分

> **导航钩子**

导航钩子分为三种，一种是全局的钩子，一种是某个路由独享的钩子函数，另一种是组件独享的钩子函数；看起来怎么那么麻烦呢，其实看一下就会发现。无非两种情况，进入阶段和离开阶段。分析到此，基本就可以往下梳理他的麻烦api了。

**全局钩子**

全局钩子，意思很明确，作用于全局的钩子函数。他官方给出的api有如下几个，并且，非常可恶的是，官方文档说明不是太全面。
1.router.beforeEach
官方文档的解释和用法，就不用多说了；
官方解释，基本上每个钩子函数都有这三个钩子函数
```js

to: Route: 即将要进入的目标 路由对象

from: Route: 当前导航正要离开的路由

next: Function: 一定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参数。

next(): 进行管道中的下一个钩子。如果全部钩子执行完了，则导航的状态就是 confirmed （确认的）。

next(false): 中断当前的导航。如果浏览器的 URL 改变了（可能是用户手动或者浏览器后退按钮），
那么 URL 地址会重置到 from 路由对应的地址。

next('/') 或者 next({ path: '/' }): 跳转到一个不同的地址。当前的导航被中断，然后进行一个新的导航。
// next('/')或者next({path:'/'})需要进行条件判断，不然死循环。如下代码展示了用法

_确保要调用 next 方法，否则钩子就不会被 resolved。_，每次都需要调用next()方法，
不然路由不会跳转，切记切记！

```

看代码吧
```js
router.beforeEach((to,from,next)=> {
  console.log('global beforeEach')
  console.log(from)
  console.log(to);
  if (to.path==="/c") {
    next('/404')
  }else{

    next();
  }
})
```

2.rotuer.afterEach(to,from)
参数部分一致，但没有next函数
看代码
```js
router.afterEach((to,from)=>{
  console.log(from)
  console.log(to)
})
```
3.router.beforeResolve
router.beforeResolve(guard) (2.5.0+): 此时异步组件已经加载完成，看来组件是异步加载的时候使用，但是当我import组件的时候，同样是生效，我不知道为什么。
```js
router.beforeResolve((to,from,next)=>{
  console.log('全局 异步组件加载完毕')
  next()
})
```

**某个路由独享的钩子函数**

官网只给出了beforeEnter，不知道有没有其他的，查了资料，貌似没有。
看一下代码了解一下使用方式，另外所有参数的api都是一样的
```js
      {
        path:'/c',
        component:C,
        beforeEnter: (to, from, next) => {
          // ...
          console.log(from)
          console.log(to)
          next()
        },
      },
```
**组件中的钩子函数**

这个也比较好理解，就是你定义的每个.vue就属于一个组件，然后在.vue中写钩子函数。
beforeRouteEnter
beforeRouteUpdate (2.2 新增)
beforeRouteLeave
官网给出三个api，其中参数一样。
```js
//在B组件中使用
<template>
  <div>

## B组件

  </div>
</template>

<script>
export default {
  beforeRouteEnter (to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当钩子执行前，组件实例还没被创建
  },
  beforeRouteUpdate (to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`
  },
  beforeRouteLeave (to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
  }
}
</script>

<style>

</style>

```
```js
// 在beforeRouterEnter阶段，如果想访问实例，通过这种方式
beforeRouteEnter (to, from, next) {
  next(vm => {
    // 通过 `vm` 访问组件实例
  })
}
```