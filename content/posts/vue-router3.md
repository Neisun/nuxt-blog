---
title: vue-router(3)
tags:
  - vue
  - vue-router
slug: 373
categories:
  - 技术随笔
  - vue-router总结
date: 2017-09-08 16:48:52
description: "vue-router 进阶之二，讲解路由元信息 meta 的用法。通过定义路由的 meta 字段，实现权限控制、面包屑等基于元信息的逻辑。"
image: /images/covers/043.jpg
---

继续vue-router进阶部分，这一次的内容是vue-router路由元信息。

> **路由元信息**

至于为什么起这么个名字，表问我。其实就是生硬的翻译过来的，因为meta是元的意思。
看看怎么用呗
当你定义一个路由的时候，可以给他添加一个meta对象
比如这样
```js
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      children: [
        {
          path: 'bar',
          component: Bar,
          // a meta field
          meta: { requiresAuth: true }
        }
      ]
    }
  ]
})
```
```js
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!auth.loggedIn()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next() // 确保一定要调用 next()
  }
})
```
上边官网的例子是通过判定某个路由是否配置了权限的属性进而检测一下是否登录了，如果登录了那么就继续跳转到当前路由，否则跳转到login那个路由。

下边这个例子，是我个人写的，因为没法检测是否登录，我就检测路由是否是‘/c’,如果是就跳转到404页面
```js
// routes路由配置
    routes:[
      {
        path:'/a',
        component:A,
        meta:{
          requireAuth:true
        },
      },
      {
        path:'/b',
        component:B,
        meta:{
          requireAuth:true
        },
      },
      {
        path:'/c',
        component:C,
        meta:{
          requireAuth:true
        },
      },
      // 让d转到a
      {
        path:'/d',
        component:D,
        redirect:'/a'
      },
      {
        path:'/404',
        component:Com404,
      }
    ]
// 我给每一个路由都添加了meta信息
```
```js
// main.js中定义
router.beforeEach((to, from, next) => {
  // to and from are both route objects
  if (to.matched.some(record => record.meta.requireAuth)) {
    if (to.fullPath==="/c") {
      next('/404')
    }else{
      next();
    }
  }else {
    next()
  }
})
```
效果图

![](http://www.hunaisong.cn/wp-content/uploads/2017/09/meta.gif)