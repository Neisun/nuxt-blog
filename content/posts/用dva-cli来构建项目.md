---
slug: 547
title: 用dva-cli来构建项目
date: 2017-12-26 15:49:27
tags:
    - react.js
categories:
    - 技术随笔
    - React.js
description: "用 dva-cli 构建 React 项目。介绍 dva 的目录约定与数据流，快速搭建一个基于 Redux 的 React 应用。"
image: /images/covers/092.jpg
---
# React很繁荣

react.js很繁荣，社区也是相当的活跃，于是我们就没有理由不会用了。前段时间了解了react的基础语法。这段时间决定，更深入的使用一下react，那就是用构建工具来开发一个项目。我这次用的是`dva-cli`，蚂蚁金服开源出来的一个轮子。

决定用这个客户端，来重构一下，公司的智能小家电项目。项目倒是不难，就是来练手。

## 开始使用

基本就是先安装dva-cli。

> 安装

    npm/cnpm install dva-cli -g

> 然后，我们初始化一个项目

    dva new <projectname>

>启动项目

    cd <projectname> 
    npm run start 开发环境下
    npm run build 生产环境下压缩，打包

> 引入一些东西

- 首先引入fastclick，解决300ms延迟的问题
- 然后引入rem.js（目前，只能在模板的html中用写在script中，因为从外部引入，会报错，具体原因，不是很明确）
- 样式重置，直接放在了index.css中了。

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no" />
    <script src="https://as.alipayobjects.com/g/component/fastclick/1.0.6/fastclick.js"></script>
    <script>
        if ('addEventListener' in document) {
            document.addEventListener('DOMContentLoaded', function() {
                FastClick.attach(document.body);
            }, false);
        }
        if (!window.Promise) {
            document.writeln('<script src="https://as.alipayobjects.com/g/component/es6-promise/3.2.2/es6-promise.min.js"' + '>' + '<' + '/' + 'script>');
        }
    </script>
    <script>
      !function(e,t){function n(){t.body?t.body.style.fontSize=12*o+"px":t.addEventListener("DOMContentLoaded",n)}function d(){var e=i.clientWidth/10;i.style.fontSize=e+"px"}var i=t.documentElement,o=e.devicePixelRatio||1;if(n(),d(),e.addEventListener("resize",d),e.addEventListener("pageshow",function(e){e.persisted&&d()}),o>=2){var a=t.createElement("body"),s=t.createElement("div");s.style.border=".5px solid transparent",a.appendChild(s),i.appendChild(a),1===s.offsetHeight&&i.classList.add("hairlines"),i.removeChild(a)}}(window,document);
    </script>
    <link rel="stylesheet" href="/index.css" />
    <title>Dva Demo</title>
</head>

<body>
    <div id="root"></div>
</body>

</html>
```
> 安装antd-mobile，babel-plugin-import，可以按需加载组件，不然打包可能会非常大

    npm/cnpm install antd-mobile babel-plugin-import --save
    接着，我们还需要在.roadhogrc文件中改一下
      "extraBabelPlugins": [
            "transform-runtime"
            "transform-runtime",
            ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": "css" }]
        ],
    这样就大功告成，完成了项目基本的配置。

## 关于样式的问题

我发现，在项目中改antd-mobile样式不生效。后来发现，如果我们想改antd-mobile样式，需要这么改。直接上写法代码，当然我用的是less

```less
    :global {
        .am-navbar-light {
            /* background-color:#38383c; */
            background: #38383c;
            color: #fff;
            .am-navbar-title {
                color: #fff;
            }
        }
    }
```
## 关于在js组件中进行路由的跳转

我不知道是因为版本的原因还是别的原因，文档中对于这块没有提一嘴，特别烦躁。这还是经过尝试打印出this对象发现的。。。，跑到segmentfault上提问，给出的回答也是云里雾里，真是乱花渐欲迷人眼。

```js
this.props.history.push('/path');
```

## 如果想在遍历的元素或者组件上添加事件同时传递别的参数

> 在事件中，我们很多时候向传递别的参数，不单单是event对象，比如我想传递index下标

```js
handleClick = (index,e) => {
    // 处理逻辑吧
}
this.state.items.map((item,index) => {
    return (
        <div onClick={this.handleClick.bind(this,index)}></div>
    )
})
```