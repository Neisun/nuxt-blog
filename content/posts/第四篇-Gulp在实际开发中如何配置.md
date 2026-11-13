---
title: 第四篇-Gulp在实际开发中如何配置
tags:
  - Gulp
  - javascript
  - 前端自动化
slug: 252
categories:
  - 技术随笔
  - 前端自动化工具
  - 自动化工具之Gulp
date: 2017-08-02 10:34:02
description: "Gulp 系列第四篇，聚焦实际开发中的配置实践。结合项目结构讲解多任务组织、环境区分与常见优化，让构建流程更贴近真实工程。"
image: /images/covers/023.jpg
---

最近室友搞对象，天天电话粥到1点，我被搞的困得不要不要的，但是！每天早上还是要定期来写一篇博客，就当我吐槽和发泄了哈。
> **玩转Gulp**
带着一身疲惫来到公司。。。为啥是一身疲惫，因为没睡好！！！不说了，说多了都是眼泪。直接开车吧。买没买票的都来啊，要发车了。
前几篇文章中以及把具体怎么玩Gulp给说明了。但是在实际开发中，是该怎么玩，还没有仔细说明一下。首先，实际开发是区分dev和prod环境，gulp的配置也主要是基于这两种环境做了一个区分。
先看一下，项目的目录。上一张小图。

![](http://www.hunaisong.cn/wp-content/uploads/2017/08/mulu.jpg)

*   build文件夹：主要放配置文件的
*   dist文件夹，项目打包后输出文件夹
*   node_modules，你还用我说？
*   src，项目源文件
*   gulpfile.js，你还用我说？
*   package.json，你还用我说？
再上一张图，尔等看好了。

![](http://www.hunaisong.cn/wp-content/uploads/2017/08/mulu01.jpg)

基本的项目目录我就是这么规定，一般来讲基本不出其右，对，就是这么自信。

该看的也看了，不该看的，也给你看了，还想咋地。那么接下来就是写基本配置的时候了。我们分步骤来！！

**1.gulpfile.config.js 用来配置各种文件的源和输出位置，也就是src和dest**

我们来看看代码。

```javascript
var SRC_DIR = "src/" //src目录
var DIST_DIR = "dist/" //dist目录

var Config = {
    // 给index.html配置，
    // 因为是一个随便写的测试项目，我就一个html文件，若你还有别的，那就在写一个关于别的html的配置即可
    html:{
        src:SRC_DIR+"*.html",
        dest:DIST_DIR
    },
    // css文件配置
    css:{
        src:SRC_DIR+"css/*.css",
        dest:DIST_DIR+"css"
    },
    // js文件配置
    js:{
        src:SRC_DIR+"js/*.js",
        dest:DIST_DIR+"js"
    },
    // img文件配置
    img:{
        src:SRC_DIR+"images/**/*",
        dest:DIST_DIR+"img"
    },
    // 静态资源配置
    assets:{
        src:SRC_DIR+"assets/**/*",
        dest:DIST_DIR+"assets"
    }
}
// 模块暴露出去，暴露出去后别人才能看啊，要不夏天为什么那么多大白腿，真是的。
module.exports = Config;
```
**2.gulpfile.dev.js 开发环境的配置**
开发环境，恩。你要满足你自己的需求，无需压缩，需要实时刷新浏览器，可能还涉及到less和sass编译等等。总之就是看你的需要。
那么，上代码。
```javascript
// dev开发环境，需要开启服务器，实时刷新，不需要压缩
var gulp = require("gulp"),
    plugins = require("gulp-load-plugins")(),
    // 知道gulpfile.config为什么暴露么，就是这它看得和用的，没错~
    Config = require("./gulpfile.config");
// 以一个函数的形式，包裹这些，作为私有的作用域，恩，就是这样的节奏。
function dev() {
    // html部分
    gulp.task("html-dev",function () {
      gulp.src(Config.html.src)  
      .pipe(gulp.dest(Config.html.dest))
      .pipe(plugins.connect.reload())
    })
    // css部分
    gulp.task("css-dev",function () {
      gulp.src(Config.css.src)  
      .pipe(gulp.dest(Config.css.dest))
      .pipe(plugins.connect.reload())
    })
    // js部分
    gulp.task("js-dev",function () {
      gulp.src(Config.js.src)  
      .pipe(gulp.dest(Config.js.dest))
      .pipe(plugins.connect.reload())
    })
    // img部分
    gulp.task("img-dev",function () {
      gulp.src(Config.img.src)  
      .pipe(gulp.dest(Config.img.dest))
      .pipe(plugins.connect.reload())
    })
    // assets部分
    gulp.task("assets-dev",function () {
      gulp.src(Config.assets.src)  
      .pipe(gulp.dest(Config.assets.dest))
      .pipe(plugins.connect.reload())
    })
    // 服务器任务
    gulp.task("connect-dev",function () {
        plugins.connect.server({
            root:"dist",
            livereload:true
        })
    })
    // 监测文件修改
    gulp.task("watch-dev",function () {
        gulp.watch(Config.html.src,["html-dev"]);
        gulp.watch(Config.css.src,["css-dev"]);
        gulp.watch(Config.js.src,["js-dev"]);
        gulp.watch(Config.img.src,["img-dev"]);
        gulp.watch(Config.assets.src,["assets-dev"]);
    })
    // 定义一个包含多任务的任务，名字dev；
    gulp.task("dev",["html-dev","css-dev","js-dev","img-dev","assets-dev","connect-dev","watch-dev"])
}
module.exports = dev;
```
**3.gulpfile.prod.js 配置生产环境**
生产环境，那就有点说到了。总之，就是一切需要压缩的那必须得压缩，能整合就得整合，表问我为什么，问用户体验和速度。只是为了多户多停留那么一到两秒，然后带来的效益。咳咳，说得层次有点高了。老老实实敲你的代码去！
```javascript
// prod环境 需要压缩，不需要实时刷新
var gulp = require("gulp"),
    plugins = require("gulp-load-plugins")(),
    Config = require("./gulpfile.config");

function prod() {
    // html部分
    gulp.task("html-prod",function () {
      gulp.src(Config.html.src)  
      .pipe(plugins.minifyHtml())
      .pipe(gulp.dest(Config.html.dest))
    })
    // css部分
    gulp.task("css-prod",function () {
      gulp.src(Config.css.src) 
      .pipe(plugins.cssnano())
      .pipe(plugins.rename({
          suffix:".min"
      })) 
      .pipe(gulp.dest(Config.css.dest))
    })
    // js部分
    gulp.task("js-prod",function () {
      gulp.src(Config.js.src)  
      .pipe(plugins.uglify())
      .pipe(plugins.rename({
          suffix:".min"
      }))
      .pipe(gulp.dest(Config.js.dest))
    })
    // img部分
    gulp.task("img-prod",function () {
      gulp.src(Config.img.src)  
      .pipe(plugins.imagemin([
        //   最新版写法
        plugins.imagemin.gifsicle({interlaced: true}),
        plugins.imagemin.jpegtran({progressive: true}),
        plugins.imagemin.optipng({optimizationLevel: 5}),
        plugins.imagemin.svgo({plugins: [{removeViewBox: true}]})
      ]))
      .pipe(gulp.dest(Config.img.dest))
    })
    // assets部分
    gulp.task("assets-prod",function () {
      gulp.src(Config.assets.src)  
      .pipe(gulp.dest(Config.assets.dest))
    })

    gulp.task("prod",["html-prod","css-prod","js-prod","img-prod","assets-prod"])
}
module.exports = prod;
```
**一切貌似都搞定了哈，那么怎么用命令开启呢。额，所以重中之重！还没配置gulpfile.js呢，人家gulp就认识他，不认识你写的乌七八糟的配置。**
```javascript
var dev = require("./build/gulpfile.dev");
var prod = require("./build/gulpfile.prod");
dev();
prod();
```
gulpfile.js你只需要把dev和prod暴露出来的模块引入，在执行函数就可以了。
打开命令行工具，输入gulp dev 和gulp prod就能直接开启任务。但是！！！不够高大上是不是，而且还有一个问题，dist文件夹是不是得给他设置一个命令专门用来删除它，而且在生产环境中每次打包是不是应该先删除dist文件夹比较好。我觉得对，元芳你怎么看。

![](http://www.hunaisong.cn/wp-content/uploads/2017/08/yuanfang.jpg)

要删除文件夹的话，还得需要一个插件。

![](http://www.hunaisong.cn/wp-content/uploads/2017/08/rimraf.jpg)

然后我们想用别的命令开启任务，恩，比如npm run dev 或者npm run build 又或者 npm run clean ，那么所有的这些都应该在package.json中的scripts中配置。
```javascript
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "gulp dev",
    "clean": "rimraf dist",
    "build": "rimraf dist && gulp prod"
  }
```
至此，你的项目就可以完美在dev和prod环境中随意切换。
gulp的自动化配置完结。