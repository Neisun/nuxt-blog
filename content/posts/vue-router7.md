---
title: vue-router(7)
tags:
  - vue
  - vue-router
slug: 392
categories:
  - 技术随笔
  - vue-router总结
date: 2017-09-13 15:38:29
description: "vue-router 进阶之六，讲解滚动行为的处理。介绍如何控制路由切换后的页面滚动位置，提升单页应用的浏览体验。"
image: /images/covers/048.jpg
---

继续vue-router的进阶。
顺带复习一下上一次说的内容，上一次提到的是数据获取的问题。分为两个阶段，一种是导航完成之后的数据获取就是created阶段的数据获取，另外一种是在beforeRouteEnter这个钩子函数中进行数据获取。

今日的内容是vue-router的滚动行为，比如一个新闻列表，有100条，你点击了其中的第51条，那么会跳转到详情页，然后你返回新闻列表页，发现不是你之前点击的位置了，而是数据重新加载，滚动到头部的位置了，你又忘了你刚才看过哪一条（假设你看过的没有任何样式上的不同），你会不会觉得这个app特别垃圾，一点都不人性化。

这就是滚动行为的使用情境。就是说让我们点击返回按钮的时候，之前的页面至少还能保留我们刚才的位置，或者说你在点击返回的时候有特殊需要让他滚动到某个位置，这个可怎么破呢？

我们分情况来看

**第一种情况，返回到之前页面，并且滚动位置保留**

这非常简单，只要你用了vue-router就可以，点击返回的时候，滚动到原位置。
这种情况，你啥代码都不用额外添加，很好。
那么，下一种情况。

**第二种情况，打开页面，让所有页面就滚到某个位置**

那么就使用scrollBehavior(to,from,savedPosition)这个函数
而且要使用这个功能必须使用mode:history模式
看看代码
```js
export default new Router({
    mode: 'history',
    routes: [{
            path: '/',
            component: XHome
        },
        {
            path: '/parent',
            component: XParent,
            children: [{
                    path: '',
                    component: XDefault,
                },
                {
                    path: 'foo',
                    component: XFoo,
                    meta: {
                        scrollTop: true
                    }
                },
                {
                    path: 'bar',
                    component: XBar
                },
            ]
        }
    ],
    scrollBehavior(to, from, savedPosition) {
      // 这个功能必须开启history模式，不然无效
        // 我们发现这个savedPosition，储存着页面刚才滚动条的位置信息
        // console.log(savedPosition)
        // 不管三七二十一全部让他滚到300的位置
        return {
          x:0,
          y:300
        }     
    }
})
```

**第三种情况：就是某个页面的滚动到某个位置**

```js
export default new Router({
    mode: 'history',
    routes: [{
            path: '/',
            component: XHome
        },
        {
            path: '/parent',
            component: XParent,
            children: [{
                    path: '',
                    component: XDefault,
                },
                {
                    path: 'foo',
                    component: XFoo,
                    meta: {
                        scrollTop: true
                    }
                },
                {
                    path: 'bar',
                    component: XBar
                },
            ]
        }
    ],
    scrollBehavior(to, from, savedPosition) {
      // 这个功能必须开启history模式，不然无效
        // 我们发现这个savedPosition，储存着页面刚才滚动条的位置信息
        // console.log(savedPosition)
        if (savedPosition) {
            return savedPosition
        } else {
            const position = {}
            if (to.hash) {
                position.selector = to.hash;
            }
            if (to.matched.some(m => m.meta.scrollTop)) {
                position.x = 0;
                position.y = 300
            }
            return position;
        }        
    }
})
```

以上就是vue-router滚动行为比较常用的

**懒加载**

顺便把最后的一个进阶内容提一嘴，就是懒加载。如果把所有的组件都直接打包，很大，那么有一种方式就是组件懒加载的方式，按需加载。

直接写用法了，不墨迹。
```js
// 将Promise中的resolve作为一个函数，然后回调
const Home = resolve => require(['../components/Home.vue'], resolve);
```