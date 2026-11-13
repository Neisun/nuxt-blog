---
slug: 538
title: vuex用法总结
date: 2018-01-03 15:49:54
tags:
    - vuex
categories:
    - 技术随笔
    - vuex总结
description: "总结 Vuex 状态管理的用法。梳理 state、getter、mutation、action 与 module，说明如何集中管理 Vue 应用的状态。"
image: /images/covers/083.jpg
---
# vuex

vuex也算用了比较久了，从来没有做过一次总结。每次新建项目，都是按照之前的或者照着官网copy一份，这次决定总结一下。

vuex是为了解决状态管理的，因为vue的组件之间数据传递，分为父子组件数据传递，同级组件数据传递。

正好，来复习一下组件之间的数据传递问题。

- 父向子数据传递

这个是最简单的形式，通过子组件的`props`来传递。

- 子向父数据传递

数据传递是由上至下的方式，也就是说子组件不能直接修改父组件的数据，这是不允许同时也是没办法办到的事情。这时候，我们一般用事件监听的方式，来进行数据传递。子组件中监听的事件触发父组件中的事件，在父组件中的事件去更改数据，即可。

- 同级组件之间数据传递

可以用Bus Event的形式，就是新建一个vue实例，把数据放到这个新的实例中。这样数据就可以在同级组件之间共享了。

- 更好的方案，`vuex`。

vuex是专门用来处理状态管理的插件，vue全家桶的一员。一般当项目比较大的时候，用来处理数据是非常方便的。

## 常规的写法与用法

> 只记录下项目开发中我们该怎么使用，想详细的了解当然还是去官网去看。

vuex主要由这几部分组成

- state，作为唯一的共享的状态，放置共享的数据
- mutation，放置操作数据的功能函数，实际触发
- action，类似于trigger，在这里我们可以commit或者dispatch放在mutation的函数
- getters,作为返回state中的数据，有点类似于计算属性

我总结完这些，我看了都闹心，用语言总结的不好。

索性写个小demo来做一个总结。最简单的+1按钮demo，用来学习最好。

```js
// 这种写法，是直接把所有东西写在一起了，不推荐，但是最基础，也最一目了然。
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const state = {
    count: 0
}
const mutations = {
    add(state) {
        state.count += 1;
    }
}
const actions = {
    add(commit) {
        commit('add')
    }
}
const getters = {
    count(state) {
        return state.count
    }
}

export default new Vuex.Store({
    state, 
    mutations, 
    actions, 
    getters
})
```
定义完之后，怎么在组件中触发和显示state中的数据呢？

这是button的组件，触发add事件

```js
<template>
    <div>
        <button @click="myAdd">add</button>
    </div>
</template>

export default {
  name: "AddButton",
  methods: {
    //   最原始的方式去触发add
    myAdd() {
        this.$store.commit('add')
    }
  },
computed:{
    // 通过计算属性的方式显示state的数据
    count(){
        return this.$store.state.count;
    }
  }
  created(){
    //   console.log(this.$store)
  }
```
```js
// 不要忘了在入口文件引入store，不然都白扯
import Vue from 'vue'
import App from './App'
import store from './store'
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  store,
  components: { App }
})
```

这种写法，优势在于省事。。。，不麻烦，快捷。但是你知道弊端在哪么，就是数据多了，各种功能操作多了，然后你一个个去`this.$store.commit`还有`this.$store.state`很显然不是一回事。最重要的是，如果都写在一个文件里，那么协同开发起来，总会出一点问题。所以最好的方式把state，actions，mutations，getters都单独出来。

## 项目开发中最常用的配置

那就开始啦，把那些state,mutations,actions,getters细分。


```js
// index.js
// 在此创建state，然后呢，把其他的需要引入进来
import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import * as actions from './actions'
import * as getters from './getters'
Vue.use(Vuex)

const state = {
    count:0,
    number:0,
}

export default new Vuex.Store({
    state,
    mutations,
    actions,
    getters
})
```
```js
// 储存一个常量，作为action和mutation之间的媒介
// 为啥要分出常量？
// 不然没法子把mutation与action单独提出来，不然这二者怎么关联呢，你说呢
export const ADD_NUMBER = 'ADD_NUMBER'
```
```js
// mutations.js
import * as types from './mutation-types'

const mutations = {
    // 我们可以使用 ES2015 风格的计算属性命名功能来使用一个常量作为函数名
    // 加入额外的参数，number，术语叫payload，负载，一般传递的是一个对象形式
    // 当然不传递对象也行，随你便
    // 我这里就传递了一个number
    [types.ADD_NUMBER](state,number) {
        let num = Number(number);
        state.number = num;
        state.count += num;
    }
}
export default mutations
```
```js
// actions.js
import * as types from './mutation-types'
export const add = function ({commit,state},number) {
    commit(types.ADD_NUMBER,number)
}
```
```js
// getters.js
export const count = function (state) {
    return state.count;
}
```
```js
// 不要忘了在入口文件引入store，不然都白扯
import Vue from 'vue'
import App from './App'
import store from './store'
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  store,
  components: { App }
})
```
这些准备工作就大功告成了，在组件中使用和显示数据。

```js
<template>
    <div>
        <!-- 对象展开符的弊端出来了，就是传参如果是基于事件对象，那么略显麻烦 -->
        <button @click="add($event.target.dataset.number)" data-number="1" >+1</button>
        <button @click="add($event.target.dataset.number)" data-number="2" >+2</button>
        <button @click="add($event.target.dataset.number)" data-number="3" >+3</button>
        <button @click="add($event.target.dataset.number)" data-number="4" >+4</button>
        <p>{{count}}</p>
    </div>
</template>

<script>
import {mapActions} from 'vuex'
import {mapGetters} from 'vuex'
export default {
    name:'Add',
    methods:{
        // 同样也是对象展开符的形式，语法糖罢了
        ...mapActions([
            'add'
        ]),
        // 本质上
        myAdd(){
            // 当有异步操作时候用dispatch比较ok
            // this.$store.dispatch('add')
            // 同步操作，我们commit就行
            this.$store.commit('add')
            // 二者触发的都是actions中的方法，并不是直接操作mutations，mutations由actions操作就可以了
        }
    },
    computed:{
        // 用对象展开符直接把state中的数据列出来，然后我们在页面中通过计算属性渲染出来
        // 同样也是个语法糖
        ...mapGetters([
            'count'
        ]),
        // 本质上
        myCount(){
            return this.$store.state.count;
        }
    }
}
```
基本上，我们在项目开发的过程中使用这种配置足矣。还有更高级的用法，比如按照模块划分的情况，下次决定按照写一个官网给出的购物车案例，来更全面的使用vuex。最近要开始新项目了，不知道有没有时间了，也可能是在公司的最后一个或者两个项目了，注定要说再见了。但该给自己沉淀的还是沉淀。

