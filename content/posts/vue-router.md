---
title: vue-router(1)
tags:
  - vue
  - vue-router
slug: 346
categories:
  - 技术随笔
  - vue-router总结
date: 2017-09-05 09:30:05
description: "vue-router 系列第一篇，总结动态路由匹配等基础用法。从容易让人困惑的概念入手，讲解路由定义、参数传递与基本导航。"
image: /images/covers/040.jpg
---

**vue-router总结**

用了很久vue-router，但是总是感觉用了一个皮毛，还有许多东西没有用过，仅以此篇做一个汇总与总结。

> **动态路由匹配**

最开始，看到这个名字，蒙蒙的，不知何意。但是看了一下文档，才知道含义。所谓动态是一种写法，是不确定的。就直接拿官网的例子说事。有一个组件，叫user；专门用来放用户信息的。那么是不是每个用户想得到自己的信息都得需要进入这个组件才可以。那么该如何才能让每个用户都进入呢？比如有两个用户，Neisun和David。
```javascript
// App.vue 主程序挂载点
<template>
  <div id="app">
    <!-- 动态路由，例如有一个user组件，放着所有user的信息，也就是所有不同的id都可以进入这个组件 -->
    <router-link to="/user/Neisun">Neisun</router-link>
    <router-link to="/user/David">David</router-link>
    <router-view></router-view>
  </div>
</template>
```
```js
// user.vue user组件
<template>
  <div>
      {{$route.params.id}}
  </div>
</template>
```
```javascript
// 配置路由
import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import User from '@/components/User'
Vue.use(Router)

export default new Router({
  routes: [
    {
      // 动态路由：开头
      path: '/user/:id',
      name: 'user',
      component: User
    },
    {
      path:'/',
      name:'hello',
      component:Hello
    }
  ]
})
// 同时有一点值得一提的是，之前我对路由信息对象使用的比较少，我们刚才写的：id就会被存入，$route.params中，调用的时候{{$route.params.id}}，还有许多路由信息对象，用的时候再提。
```

> **更高级的动态路由匹配**

```javascript
// 这是我们配置的path
    routes: [
        { path: '/' },
        // 匹配动态参数，foo，bar，这两个是params那个对象中的键，值是通过router-link来传入，
        { path: '/params/:foo/:bar' },
        // 匹配一个可选的参数，正则式的写法 ？
        { path: '/optional-params/:foo?' },
        // 匹配id这个动态参数，并且这个id是利用正则匹配的数字，只对数字负责
        { path: '/params-with-regex/:id(\\d+)' },
        // 匹配到 asterisk 下边的任何东西
        { path: '/asterisk/*' },
        // 匹配可选的一级路径 （/foo）?
        { path: '/optional-group/(foo/)?bar' }
    ]
```
```html
<div id="app">
  <h1>Route Matching</h1>
  <ul>
    <li><router-link to="/">/</router-link></li>
    <li><router-link to="/params/foo/bar">/params/foo/bar</router-link></li>
    <li><router-link to="/params/123/456">/params/123/456</router-link></li>
    <li><router-link to="/optional-params">/optional-params</router-link></li>
    <li><router-link to="/optional-params/foo">/optional-params/foo</router-link></li>
    <li><router-link to="/params-with-regex/123">/params-with-regex/123</router-link></li>
    <li><router-link to="/params-with-regex/abc">/params-with-regex/abc</router-link></li>
    <li><router-link to="/asterisk/foo">/asterisk/foo</router-link></li>
    <li><router-link to="/asterisk/foo/bar">/asterisk/foo/bar</router-link></li>
    <li><router-link to="/optional-group/bar">/optional-group/bar</router-link></li>
    <li><router-link to="/optional-group/foo/bar">/optional-group/foo/bar</router-link></li>
  </ul>
  <p>Route context</p>
  <pre>{{ JSON.stringify($route, null, 4) }}
</div>
```
附一张图看看

![](http://www.hunaisong.cn/wp-content/uploads/2017/08/vue-router_1.gif)

> **嵌套路由**

顾名思义，就是路由展示的组件中，还有路由。嵌套路由是我在开发过程中用的最多的了。只是有一点需要注意的，就是定义children的path时候，是默认带上了父级的path，所以定义的时候直接，path:'child'就好，不要path:'/home/child',或者是path:'/child'。
随便写一个例子用吧
```javascript
// 这次我们使用路由的懒加载
const Hello= resolve => require(['../components/Hello.vue'], resolve);
const Home = resolve => require(['../components/Home.vue'], resolve);
const Child1 = resolve => require(['../components/Child1.vue'], resolve);
const Child2 = resolve => require(['../components/Child2.vue'], resolve);
const Child3 = resolve => require(['../components/Child3.vue'], resolve);
export default new Router({
套路由部分，所谓嵌套路由，就是路由中有路由
    // linkActiveClass:'active',
    routes: [
        {
          path:'',
          name:'',
          component:Hello
        },
        { path: '/home', 
          name: 'home', 
          component: Home,
          children:[
            {
              path:'child1',
              name:'child1',
              component:Child1
            },
            {
              path:'child2',
              name:'child2',
              component:Child2
            },
            {
              path:'child3',
              name:'child3',
              component:Child3
            },
          ]
        }
    ]
})
```

> **编程式导航**

编程式路由其实在很大程度与history.pushState非常相像。router.push,router.go,router.replace常用的api。使用的情境也就是在不用router-link的情况下进行路由的跳转。写了一个例子。
```html
<template>
  <div id="home">
      <header>
          <ul>
              <li>
                  <button @click="push($event.target)" data-name='child1'>转到child1</button>
              </li>
              <li>
                   <button @click="go($event.target)" data-name='child2'>后退1</button>
              </li>
              <li>
                   <button @click="replace($event.target)" data-name='child3'>重定向到 /</button>
              </li>
          </ul>
      </header>
      <router-view></router-view>
  </div>
</template>

<script>
// 要先把router引入
import router from '../router/index'
export default {
    name:'home',
    methods:{
        push:function (target) {
            console.log(target.dataset.name)
            router.push({
                path:'/home/'+target.dataset.name,
                params:{
                    userId:'123'
                }
            })
        },
        go:function (target) {
            router.go(-1);
        },
        replace:function (target) {
            router.replace('/')
        }
    }
}
</script>

<style lang="less">
#home {
    ul{
        li {
            list-style: none;
        }
    }
}
```
```javascript
// router配置文件
// 这次我们使用路由的懒加载
const Home = resolve => require(['../components/Home.vue'], resolve);
const Child1 = resolve => require(['../components/Child1.vue'], resolve);
const Child2 = resolve => require(['../components/Child2.vue'], resolve);
const Child3 = resolve => require(['../components/Child3.vue'], resolve);
Vue.use(Router)

export default new Router({
    // 嵌套路由部分，所谓嵌套路由，就是路由中有路由
    // linkActiveClass:'active',
    routes: [
        {
          path:'',
          name:'',
          component:Hello
        },
        { path: '/home', 
          name: 'home', 
          component: Home,
          children:[
            {
              path:'child1',
              name:'child1',
              component:Child1
            },
            {
              path:'child2',
              name:'child2',
              component:Child2
            },
            {
              path:'child3',
              name:'child3',
              component:Child3
            },
          ]
        }
    ]
})
```
附一张图看一下

![](http://www.hunaisong.cn/wp-content/uploads/2017/08/router_2.gif)

> **命名式路由**

命名式路由，看名字挺高大上的哈。其实就是在配置路由routes时候加上相应的name属性，我们一直都在这么做。只不过我们之前的router-link to='path="..."',现在我们可以router-link to="name='..'",二者功能是一样的。
就之前的组件，我们来写一个例子。这一次使用编程式导航传一个params。
Home组件是主组件，我们想把Home下的所有子组件都映射到Home组件。
```javascript
// 路由配置文件
// 这次我们使用路由的懒加载
const Home = resolve => require(['../components/Home.vue'], resolve);
const Child1 = resolve => require(['../components/Child1.vue'], resolve);
const Child2 = resolve => require(['../components/Child2.vue'], resolve);
const Child3 = resolve => require(['../components/Child3.vue'], resolve);
Vue.use(Router)

export default new Router({
    // 命名式路由，给路由起一个名字，我们一直都在这么写，只是忽略了该怎么使用它，其实用法很简单
    // 之前我们router-link传递的参数是path，这一次我们传递一个name就好了。
    // 之所以要改写是因为，我想传递一个params，这就需要动态路由的写法了
    routes:[
      {
        path:'',
        component:Hello
      },
      {
        path:'/home/:userId?',
        name:'home',
        component:Home
      }
    ]
})
```
```html
// Home组件
<template>
    <div id="home">
        <header>
            <ul>
                <li>
                    <button @click="test($event.target)" data-id="child1">child1</button>
                </li>
                <li>
                    <button @click="test($event.target)" data-id="child2" >child2</button>
                </li>
                <li>
                    <button @click="test($event.target)" data-id="child3" >child3</button>
                </li>
            </ul>
        </header>
        <router-view></router-view>
    </div>
</template>

<script>
import router from '../router/index'
export default {
    name: 'home',
    methods: {
        test:function (target) {
            router.push({
                name:'home',
                params:{
                    userId:target.dataset.id
                }
            })
            console.log(this.$route)
        }
    }
}
</script>

<style lang="less">
#home {
    ul {
        li {
            list-style: none;
        }
    }
}
</style>
```
看一下效果了

![](http://www.hunaisong.cn/wp-content/uploads/2017/09/router_3.gif)

> **命名视图**

一个页面可能不止一个位置是动态的，可能有两个或者三个呢，或者更多。那么这种情况需要写多个视图容器，这时候视图容器就应该有名字了，加以区分，所以就有了命名视图。
举个栗子，我们一个页面有三个位置，一个header，一个siderbar，一个main，类似于后台管理系统的布局样式。
```html
// 布局部分代码
<template>
  <div id="app">
    <router-view class="view one"></router-view>
    <router-view class="view two" name="main"></router-view>
    <router-view class="view three" name="siderBar"></router-view>
  </div>
</template>
<style lang="less">
@import url('./common/index.css');
#app {
  height: 100%;
  .one {
    height: 10%;
  }
  .two {
    height: 90%;
    float: left;
    width: 20%;
  }
  .three {
    height: 90%;
    float: left;
    width: 80%;
  }
}
```
```javascript
// 路由配置部分 
// 懒加载组件
const MyHeader = resolve => require(['../components/MyHeader.vue'], resolve);
const Main = resolve => require(['../components/Main.vue'], resolve);
const SiderBar = resolve => require(['../components/Sider.vue'], resolve);
Vue.use(Router)

export default new Router({
    // 命名视图
    routes: [{
        path: '/',
        // 这有component变为components
        components: {
            default: MyHeader,
            siderBar:SiderBar,
            main:Main
        }
    }]
})
```
生效之后，效果图，发现其实视图容器就是div，而且可以给他添加class，来设定样式
![](http://www.hunaisong.cn/wp-content/uploads/2017/09/router_4.jpg)

> **重定向**

路由的重定向，一般在写路由配置中的比较少。
```javascript
    // 重定向和别名
    routes:[
      {
        path:'/a',
        component:A
      },
      {
        path:'/b',
        component:B
      },
      {
        path:'/c',
        component:C
      },
      // 让d转到a
      {
        path:'/d',
        component:D,
        redirect:'/a'
      },
    ]
```
记得之前vue1.0时候可以这么写，router.redirect({'/','/index'})，貌似现在废弃了。
如今的写法是，router.replace(location, onComplete?, onAbort?)；
比如，想让当前的url跳转到/b，那么
```javascript
      router.replace('/b',function(){
        console.log('ok!')
      },function () {
        console.log('no!')
      })
```

> **别名**

别名的写法，我还没有用到过，不过很好理解。
直接官网的解释和写法
『重定向』的意思是，当用户访问 /a时，URL 将会被替换成 /b，然后匹配路由为 /b，那么『别名』又是什么呢？

/a 的别名是 /b，意味着，当用户访问 /b 时，URL 会保持为 /b，但是路由匹配则为 /a，就像用户访问 /a 一样。

上面对应的路由配置为：

```javascript
const router = new VueRouter({
  routes: [
    { path: '/a', component: A, alias: '/b' }
  ]
})
```