---
title: 第二篇-Gulp常用的插件
tags:
  - Gulp
  - 前端自动化
slug: 229
categories:
  - 技术随笔
  - 前端自动化工具
  - 自动化工具之Gulp
date: 2017-07-30 21:53:45
description: "Gulp 系列第二篇，梳理常用插件。结合具体场景介绍文件压缩、合并、重命名、浏览器刷新等插件，说明如何组合插件搭建实用的构建任务。"
image: /images/covers/020.jpg
---

> **Gulp常用的插件**
自动化工具离不开各种插件的帮助，一般前端项目常用的插件是各种压缩软件，压缩完后需要改名字，那么就需要重命名软件，然后又编译预编译语言的软件，开启本地服务器实时刷新的软件，还有js检查软件，甚至css语法检查软件，总之就是对着你的项目需求，涵盖所有了。
下面就一一说明一下。

**1. 自动加载插件 gulp-load-plugins**
在写gulpfile.js中每次使用插件，都需要require。很麻烦，这插件的诞生就是解决问题所在。具体使用方法如下。
```
// 首先先安装
npm i gulp-load-plugins --save-dev  
```
```javascript
// 接着使用
var gulp = require("gulp"),
    plugins = require("gulp-load-plugins")();//需要立即执行
// 接着用它来加载别的插件 用法如下
// 比如我们定义了一个压缩css的任务
gulp.task("minify-css",function () {
  gulp.src("*.css")
  .pipe(plugins.cssnano()) //像这样调用，gulp-cssnano插件，
   // 针对于名字长的插件比如，gulp-minify-html,
   // 那么只需要去掉gulp前缀，然后携程驼峰的形式，plugins.minifyHtml(),
  .pipe(gulp.dest("dist/css/"))
})
```
**2\. gulp-uglify 压缩js**
```javascript
var gulp = require("gulp"),
    plugins = require("gulp-load-plugins")();//需要立即执行
gulp.task("minify-js",function () {
  gulp.src("*.js")
  .pipe(plugins.uglify())
  .pipe(gulp.dest("dist/js/"))
})
```
**3\. gulp-cssnano 压缩css**
```javascript
var gulp = require("gulp"),
    plugins = require("gulp-load-plugins")();//需要立即执行
gulp.task("minify-css",function () {
  gulp.src("*.css")
  .pipe(plugins.cssnano())
  .pipe(gulp.dest("dist/css/"))
})
```
**4\. gulp-minify-html 压缩html**
```javascript
var gulp = require("gulp"),
    plugins = require("gulp-load-plugins")();//需要立即执行
gulp.task("minify-html",function () {
  gulp.src("*.html")
  .pipe(plugins.minifyHtml())
  .pipe(gulp.dest("dist/html/"))
})
```
**5\. gulp-imagemin 压缩img**
```javascript
var gulp = require("gulp"),
    plugins = require("gulp-load-plugins")();//需要立即执行
gulp.task("minify-img",function () {
  gulp.src("src/img/*.*")
  // 网上的多数版本都不对，当你弄不准如何使用一个插件的时候，直接去npm官网查，看一下用法
  // 这是3.x版本以上的用法
  .pipe(imagemin([
    imagemin.gifsicle({interlaced: true}),
    imagemin.jpegtran({progressive: true}),
    imagemin.optipng({optimizationLevel: 5}),
    imagemin.svgo({plugins: [{removeViewBox: true}]})
]))
  .pipe(gulp.dest("dist/css/"))
})
```
**6\. gulp-rename 重命名**
```javascript
var gulp = require("gulp"),
    plugins = require("gulp-load-plugins")();//需要立即执行
gulp.task("minify-js",function () {
  gulp.src("*.js")
  .pipe(plugins.uglify())
  .pipe(plugins.rename({
     suffix:".min" //这个配置有非常多，可以去npm网查看。
   }))
  .pipe(gulp.dest("dist/html/")) // *.min.js
})
```
**7\. gulp-connect 服务器**
```javascript
var gulp = require("gulp"),
    plugins = require("gulp-load-plugins")();//需要立即执行
gulp.task("server",function () {
  plugins.connect({
   root:"dist" //服务器根目录
   livereload:true, // 开启实时刷新
   port:3000 //修改端口 
   // 这些是比较常用的配置，更多的配置还是查看npm官网，想怎么用就看你的了。
  })
})
后来需要检测文件变化，然后开启刷新，下一篇文章会讲解。本次只讲解插件。
```
**8\. gulp-less 编译less**
```javascript
var gulp = require("gulp"),
    plugins = require("gulp-load-plugins")();//需要立即执行
gulp.task("less",function () {
  gulp.src("*.less")
  .pipe(plugins.less()) //其实到底需不需要这个插件，看你编辑器，
   // 许多编辑器自带编译，我觉得大可不必多此一举
  .pipe(gulp.dest("dist/css/")) 
})
```
**9\. gulp-concat 文件合并**
为了减少http请求
```javascript
var gulp = require("gulp"),
    plugins = require("gulp-load-plugins")();//需要立即执行
gulp.task("concat",function () {
  gulp.src("*.js")
  .pipe(plugins.concat("all.js"))
  .pipe(gulp.dest("dist/js/")) // all.js
})
```
至于js和css检查，我不喜欢用，因为编辑器自带检查，配置了反而会麻烦一些。
但是还是要会的。
npm install jshint gulp-jshint --save-dev 必须都安装一遍
```javascript
// 直接拿官网的例子了 
const jshint = require('gulp-jshint');
const gulp   = require('gulp');

gulp.task('lint', function() {
  return gulp.src('./lib/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('YOUR_REPORTER_HERE'));
});
```
**基本上项目能用到的插件就这些了，还是那句话，需要看自己的需要，随意支配你的想法。**