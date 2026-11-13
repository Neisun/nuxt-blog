---
title: 第三篇-Gulp最基本的使用与配置
tags:
  - Gulp
  - 前端自动化
slug: 234
categories:
  - 技术随笔
  - 前端自动化工具
  - 自动化工具之Gulp
date: 2017-08-01 09:43:07
description: "Gulp 系列第三篇，讲解最基本的使用与配置。通过一个从零开始的示例演示 gulpfile 的编写、依赖安装与命令执行，跑通完整流程。"
image: /images/covers/021.jpg
---

[![](http://hunaisong.cn/wp-content/uploads/2017/08/gulp.png)](http://www.gulpjs.com.cn/)
> **gulp基础的写法与配置**

在前两篇文章中记录了Gulp的api和插件，这篇博文主要在于记录一下，gulp最基础的使用方式。所谓最基础的就是直接不区分dev和prod环境，直接在gulpfile.js中定义各种任务。目的是快捷，即写即用，项目比较小的时候，可以这么用。缺点呢，代码不够优雅不够简洁，不区分dev和prod环境，相对来说后续上线的时候，你的代码可能还需要做一步处理。
**总之，代码是你来决定的，随风而动，随性而行。**
直接把代码贴出来了。
```javascript
// package.json 部分，项目需要的依赖，就是各种插件
{
  "devDependencies": {
    "gulp": "^3.9.1",
    "gulp-concat": "^2.6.1",
    "gulp-connect": "^5.0.0",
    "gulp-imagemin": "^3.3.0",
    "gulp-load-plugins": "^1.5.0",
    "gulp-minify-css": "1.2.4",
    "gulp-minify-html": "^1.0.6",
    "gulp-rename": "^1.2.2",
    "gulp-uglify": "^3.0.0"
  }
}
// 前端需要的插件，无非就是各种压缩，合并，重命名，开启本地服务器
```
```javascript
// 依赖部分
var gulp = require("gulp"),
    // 加载别的插件用的，一个个require太麻烦。
    plugins = require("gulp-load-plugins")();// 要立即执行

// 以下部分开始配置任务

// html部分
gulp.task("html",function () {
    gulp.src("html/*.html")
    // 压缩
    .pipe(plugins.minifyHtml())
    .pipe(gulp.dest("dist/html"))
    // 刷新
    .pipe(plugins.connect.reload())
})

// css部分
gulp.task("css",function () {
    gulp.src("css/*.css")
    // 压缩
    .pipe(plugins.minifyCss())
    // 重命名
    .pipe(plugins.rename({suffix:".min"}))
    .pipe(gulp.dest("dist/css"))
    // 合并
    .pipe(plugins.concat("all.min.css"))
    .pipe(gulp.dest("dist/all"))
    // 刷新
    .pipe(plugins.connect.reload())
})

// js部分
gulp.task("js",function () {
    gulp.src("js/*.js")
    // 压缩
    .pipe(plugins.uglify())
    // 重命名
    .pipe(plugins.rename({suffix:".min"}))
    .pipe(gulp.dest("dist/js"))
    // 合并
    .pipe(plugins.concat("all.min.js"))
    .pipe(gulp.dest("dist/all"))
    // 刷新
    .pipe(plugins.connect.reload())
})

// jq部分，比如你的项目引用了第三方的库；
// 这是最简单的方式，你可以定义别的文件夹专门存放第三方类库
gulp.task("jq",function () {
    gulp.src("js/lib/jquery-3.2.1.min.js")
    .pipe(gulp.dest("dist/js/lib"))
})
// img
gulp.task("img",function () {
    gulp.src("img/*.{png,jpg,jpeg,gif,ico,svg}")
    .pipe(plugins.imagemin([
        plugins.imagemin.gifsicle({interlaced: true}),
        plugins.imagemin.jpegtran({progressive: true}),
        plugins.imagemin.optipng({optimizationLevel: 5}),
        plugins.imagemin.svgo({plugins: [{removeViewBox: true}]})
    ]))
    .pipe(gulp.dest("dist/img"))
})

// conncet，开启本地服务器
gulp.task("connect",function () {
    plugins.connect.server({
        // 项目根文件夹
        root:"dist",
        // 是否开启实时刷新
        livereload:true,
        // 自定义端口，以免端口冲突无法使用
        port:3000
    })
})

// 监测html,js,css文件，实时刷新浏览器
gulp.task("watch",function () {
    gulp.watch("html/*.html",["html"]);
    gulp.watch("css/*.css",["css"]);
    gulp.watch("js/*.js",["js"]);
})

// 定义default任务，把所有的任务都执行。
gulp.task("default",["html","css","js","img","connect","watch","jq"])
```
**下一篇博文将会对gulp在实际项目中的配置进行讲解。**