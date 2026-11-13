---
slug: 540
title: webpack中代理配置
date: 2019-04-29 14:54:15
tags:
    - javascript
categories:
    - 技术随笔
description: "讲解 webpack 中代理（proxy）配置。通过 devServer.proxy 解决本地开发跨域问题，说明代理转发与路径重写的写法。"
image: /images/covers/085.jpg
---

> 不知道有没有人跟我有一样的感受，每次需要用到代理配置的时候去查文档，尤其webpack的文档，非常头疼，而且关于代理配置也没有太明白，直接拿来就用

最新版的webpack4.x版本中，配置代理如下

```js
devServer:{
    // 不检查host
    disableHostCheck:true,
    proxy:{
        '/api':{
            // 代理的域名
            target:'htpps://www.api.com',
            // 是否跨域
            changeOrigin:true,
            // 关闭https安全验证
            secure:false,
            // websocket
            ws:true,
            // 替换/api为"",当然也不一定为空，看你接口的情况
            pathRewrite:{
                '^/api':''
            }
        }
    }
}
```
接下来，我们请求就会这么写了，比如我要请求的接口是https://www.api.com/list/1，代码如下

```js
$.get('/api/list/1').then(res => {
    // todo
})
```
那么困惑在，pathRewrite是干嘛用的，明明我写了/api替换成https://www.api.com。

后来发现其实是我自己想错了。因为我们都是在本地启动服务，所以请求实际上是*localhost:/api/list/1*这样的形式，但是域名不对，所以通过 */api* 这个标识来替换*localhost*为*https://www.api.com*

于是我们的请求接口的地址就变成了,*htttps://www.api.com/api/list/1*，你觉得这样对么？是不是多了一个 */api* 呢？

这就是*pathRewrite*发挥作用的时候了，我们通过正则找到 */api*然后将其替换为""，一切都迎刃而解了。

以上就是关于webpack中代理的常用配置和困惑说明。
