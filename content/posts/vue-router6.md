---
title: vue-router(6)
tags:
  - vue
  - vue-router
slug: 386
categories:
  - 技术随笔
  - vue-router总结
date: 2017-09-12 11:32:52
description: "vue-router 进阶之五，讲解数据获取。对比导航完成后获取与导航完成前获取两种方式，说明各自的适用场景与写法。"
image: /images/covers/046.jpg
---

> **数据获取**

之前写项目时候数据获取都是在created阶段获取数据，还没有在别的阶段获取过数据。
其实，细分的话，有两种情况来获取数据。

> **导航完成之后数据获取**

就是上述所说的方式，即在created阶段获取数据，至于怎么获取数据，就看你自己了。官网提供了一个案例，我觉得挺不错的，贴出来。
```js
<template>
  <div class="post">
    <div class="loading" v-if="loading">
      Loading...
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>

    <div v-if="post" class="content">
      <h2>{{ post.title }}</h2>
      <p>{{ post.body }}</p>
    </div>
  </div>
</template>

export default {
  data () {
    return {
      loading: false,
      post: null,
      error: null
    }
  },
  created () {
    // 组件创建完后获取数据，
    // 此时 data 已经被 observed 了
    this.fetchData()
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': 'fetchData'
  },
  methods: {
    fetchData () {
      this.error = this.post = null
      this.loading = true
      // replace getPost with your data fetching util / API wrapper
      getPost(this.$route.params.id, (err, post) => {
        this.loading = false
        if (err) {
          this.error = err.toString()
        } else {
          this.post = post
        }
      })
    }
  }
}
```

> **在导航前加载数据**

这种方式，港真，还真没有使用过。因为之前我不知道。。。
好啦，看看这是怎么回事吧。
通过这种方式，我们在导航转入新的路由前获取数据。我们可以在接下来的组件的 beforeRouteEnter 钩子中获取数据，当数据获取成功后只调用 next 方法。
```js

export default {
  data () {
    return {
      post: null,
      error: null
    }
  },
  beforeRouteEnter (to, from, next) {
    getPost(to.params.id, (err, post) => {
      if (err) {
        // display some global error message
        next(false)
      } else {
        next(vm => {
          vm.post = post
        })
      }
    })
  },
  // 路由改变前，组件就已经渲染完了
  // 逻辑稍稍不同
  watch: {
    $route () {
      this.post = null
      getPost(this.$route.params.id, (err, post) => {
        if (err) {
          this.error = err.toString()
        } else {
          this.post = post
        }
      })
    }
  }
}
```

**在为后面的视图获取数据时，用户会停留在当前的界面，因此建议在数据获取期间，显示一些进度条或者别的指示。如果数据获取失败，同样有必要展示一些全局的错误提醒。**

我的个人分析：在进入相应的路由之前,beforeRouteEnter函数中开始获取数据，记得在next中没有this了，使用vm，如同上述案例说明的那样就好。
另外就是需要watch一下$route。