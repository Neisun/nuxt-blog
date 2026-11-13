---
title: 第一篇-Gulp基本的api
tags:
  - Gulp
  - 前端自动化工具
slug: 222
categories:
  - 技术随笔
  - 前端自动化工具
  - 自动化工具之Gulp
date: 2017-07-30 12:48:55
description: "Gulp 系列第一篇，介绍 gulp 的基本 API。讲解 task、src、dest、watch 等核心方法，帮助读者快速建立对 Gulp 自动化流程的整体认识。"
image: /images/covers/019.jpg
---

> **前端自动化之路**
废话不多说，直接来分析gulp的使用方法。

> **1.安装**

gulp需要全局安装一次 _npm i gulp -g_，然后需要在项目中安装一次，方便调用。 _npm i gulp --save-dev_

> **2.开始使用**
需要在项目的根目录下创建一个 _gulpfile.js_ 文件，这个文件就是我们创建任务时候用的文件。比如
```javascript
var gulp = require('gulp');
gulp.task('default',function(){
    console.log('hello world');
});
```
> **2.1开启任务**

上边定义了一个 _default_ 任务，我们可以这么调用 _gulp task_，也就是 _gulp default_。由于是 _default_ 任务，所以可以运行 _gulp_，不用写任务的名称了。
> **3.api介绍**

_gulp.js_ 有4个基本的api，_gulp.task_,_gulp.src_,_gulp.dest_,_gulp.watch_。
> **3.1gulp.task**

gulp是利用Node的工作流来运行。基本语法就是
```javascript
// name表示的是你定义的每个任务的名字，
// 比如是压缩js的，那就可以起一个名字叫uglify-js，名字可以随意起，但要有语义化
gulp.task("name",function(){
  // 在这里定义任务
})
```
上边这是最简单的方式，还有一些复杂的方式，我觉得也需要掌握。
比如你写了一堆任务,task1,task2,...，总不能每个任务都gulp task1 gulp task2然后每个任务都敲一遍命令，那就惨了。
所以我们可以定义一个空任务，目的就是执行task1,task2,task3。形式如下。
```javascript
gulp.task("myTask",["task1","task2","task3"])
//也就是说myTask任务是依赖于task1,task2,task3任务的，你执行myTask任务就等于把task1,task2,task3都执行了。
//如果task1,task2,task3之间没有依赖关系，那么执行顺序就是你书写数组的顺序。
```
但是如果有了依赖关系呢？
```javascript
var gulp = require("gulp");
// one任务 延迟5s后执行，一个异步任务。
gulp.task("one", function () {
    setTimeout(function () {
        console.log("one is done!")
    }, 5000)
})
// two任务，依赖于one任务
gulp.task("two", ["one"], function () {
    console.log("two is done")
})
// 表面上，是不是应该two任务需要等one任务执行完后才会执行，但结果是这样的。放一张图
```
![](http://hunaisong.cn/wp-content/uploads/2017/07/gulp-task.gif)

人家没有吊one任务直接执行了two任务，这块是一个坑，需要注意。如果我想让任务one执行完了，在执行two任务，怎么搞。
方式有三种，我们们一一来尝试。
**第一种方式：**使用回调函数。在异步函数执行完成后使用一个回调函数，告诉gulp这个异步任务执行完毕，并且这个回调函数就是任务函数的第一个参数。说了一大堆理论。我们来看看代码
```javascript
var gulp = require("gulp");
// one 异步任务
gulp.task("one", function (cb) {//cb 魏任务提供回调函数，用来通知任务已经完成
    setTimeout(function () {
        console.log("one is done!");
        cb(); //执行回调函数，表示任务已经完成
    }, 5000)
})
// 此时two任务会在 one任务执行完成后开始执行
gulp.task("two", ["one"], function () {
    console.log("two is done")
})
看一下图
```
![](http://hunaisong.cn/wp-content/uploads/2017/07/task-two.gif)

**方法二：**

定义任务时返回一个流对象。适用于任务就是操作gulp.src获取到的流的情况。
```javascript
gulp.task('one',function(cb){
  var stream = gulp.src('client/**/*.js')
      .pipe(dosomething()) //dosomething()中有某些异步操作
      .pipe(gulp.dest('build'));
    return stream;
});

gulp.task('two',['one'],function(){
  console.log('two is done');
});
// 需要有实际任务时候再使用
```
**方法三：**

返回一个promise对象，例如
```javascript
var Q = require('q'); //一个著名的异步处理的库 https://github.com/kriskowal/q
gulp.task('one',function(cb){
  var deferred = Q.defer();
  // 做一些异步操作
  setTimeout(function() {
     deferred.resolve();
  }, 5000);
  return deferred.promise;
});

gulp.task('two',['one'],function(){
  console.log('two is done');
});
```
综合看来，我最倾向于的方式是第一种，干净利落写一个回调函数，直接搞定。
> **3.2 gulp.src**

任务的源，其实就是你要执行操作的文件地址。
主要就是利用类似正则的写法来匹配文件，这个的话。我直接copy大神的代码，做一个速查表。
```
* 匹配文件路径中的0个或多个字符，但不会匹配路径分隔符，除非路径分隔符出现在末尾
** 匹配路径中的0个或多个目录及其子目录,需要单独出现，即它左右不能有其他东西了。如果出现在末尾，也能匹配文件。
? 匹配文件路径中的一个字符(不会匹配路径分隔符)
[...] 匹配方括号中出现的字符中的任意一个，当方括号中第一个字符为^或!时，则表示不匹配方括号中出现的其他字符中的任意一个，类似js正则表达式中的用法
!(pattern|pattern|pattern) 匹配任何与括号中给定的任一模式都不匹配的
?(pattern|pattern|pattern) 匹配括号中给定的任一模式0次或1次，类似于js正则中的(pattern|pattern|pattern)?
+(pattern|pattern|pattern) 匹配括号中给定的任一模式至少1次，类似于js正则中的(pattern|pattern|pattern)+
*(pattern|pattern|pattern) 匹配括号中给定的任一模式0次或多次，类似于js正则中的(pattern|pattern|pattern)*
@(pattern|pattern|pattern) 匹配括号中给定的任一模式1次，类似于js正则中的(pattern|pattern|pattern)
```

大神举得例子：
```
* 能匹配 a.js,x.y,abc,abc/,但不能匹配a/b.js
*.* 能匹配 a.js,style.css,a.b,x.y
*/*/*.js 能匹配 a/b/c.js,x/y/z.js,不能匹配a/b.js,a/b/c/d.js
** 能匹配 abc,a/b.js,a/b/c.js,x/y/z,x/y/z/a.b,能用来匹配所有的目录和文件
**/*.js 能匹配 foo.js,a/foo.js,a/b/foo.js,a/b/c/foo.js
a/**/z 能匹配 a/z,a/b/z,a/b/c/z,a/d/g/h/j/k/z
a/**b/z 能匹配 a/b/z,a/sb/z,但不能匹配a/x/sb/z,因为只有单**单独出现才能匹配多级目录
?.js 能匹配 a.js,b.js,c.js
a?? 能匹配 a.b,abc,但不能匹配ab/,因为它不会匹配路径分隔符
[xyz].js 只能匹配 x.js,y.js,z.js,不会匹配xy.js,xyz.js等,整个中括号只代表一个字符
[^xyz].js 能匹配 a.js,b.js,c.js等,不能匹配x.js,y.js,z.js
```

**主要举的例子，要明白就好。**

当有多种匹配模式可以使用数组

```javascript
//使用数组的方式来匹配多种文件
gulp.src(['js/*.js','css/*.css','*.html'])
```
使用数组的方式还有一个好处就是可以很方便的使用排除模式，在数组中的单个匹配模式前加上!即是排除模式，它会在匹配的结果中排除这个匹配，要注意一点的是不能在数组中的第一个元素中使用排除模式
```javascript
gulp.src([*.js,'!b*.js']) //匹配所有js文件，但排除掉以b开头的js文件
gulp.src(['!b*.js',*.js]) //不会排除任何文件，因为排除模式不能出现在数组的第一个元素中
```
此外，还可以使用展开模式。展开模式以花括号作为定界符，根据它里面的内容，会展开为多个模式，最后匹配的结果为所有展开的模式相加起来得到的结果。展开的例子如下:
```javascript
a{b,c}d 会展开为 abd,acd
a{b,}c 会展开为 abc,ac
a{0..3}d 会展开为 a0d,a1d,a2d,a3d
a{b,c{d,e}f}g 会展开为 abg,acdfg,acefg
a{b,c}d{e,f}g 会展开为 abdeg,acdeg,abdeg,abdfg
```
**3.3 gulp.dest**

目标位置，dest => destination，输出的源位置。
和src类似。

gulp.dest()方法是用来写文件的，其语法为：

gulp.dest(path[,options])
path为写入文件的路径
options为一个可选的参数对象，通常我们不需要用到

要想使用好gulp.dest()这个方法，就要理解给它传入的路径参数与最终生成的文件的关系。
gulp的使用流程一般是这样子的：首先通过gulp.src()方法获取到我们想要处理的文件流，然后把文件流通过pipe方法导入到gulp的插件中，最后把经过插件处理后的流再通过pipe方法导入到gulp.dest()中，gulp.dest()方法则把流中的内容写入到文件中，这里首先需要弄清楚的一点是，我们给gulp.dest()传入的路径参数，只能用来指定要生成的文件的目录，而不能指定生成文件的文件名，它生成文件的文件名使用的是导入到它的文件流自身的文件名，所以生成的文件名是由导入到它的文件流决定的，即使我们给它传入一个带有文件名的路径参数，然后它也会把这个文件名当做是目录名，例如：
```javascript
var gulp = require('gulp');
gulp.src('script/jquery.js')
    .pipe(gulp.dest('dist/foo.js'));
//最终生成的文件路径为 dist/foo.js/jquery.js,而不是dist/foo.js
要想改变文件名，可以使用插件gulp-rename
```
下面说说生成的文件路径与我们给gulp.dest()方法传入的路径参数之间的关系。
gulp.dest(path)生成的文件路径是我们传入的path参数后面再加上gulp.src()中有通配符开始出现的那部分路径。例如：
```javascript
var gulp = reruire('gulp');
//有通配符开始出现的那部分路径为 **/*.js
gulp.src('script/**/*.js')
    .pipe(gulp.dest('dist')); //最后生成的文件路径为 dist/**/*.js
//如果 **/*.js 匹配到的文件为 jquery/jquery.js ,则生成的文件路径为 dist/jquery/jquery.js
```
再举更多一点的例子
```javascript
gulp.src('script/avalon/avalon.js') //没有通配符出现的情况
    .pipe(gulp.dest('dist')); //最后生成的文件路径为 dist/avalon.js

//有通配符开始出现的那部分路径为 **/underscore.js
gulp.src('script/**/underscore.js')
    //假设匹配到的文件为script/util/underscore.js
    .pipe(gulp.dest('dist')); //则最后生成的文件路径为 dist/util/underscore.js

gulp.src('script/*') //有通配符出现的那部分路径为 *
    //假设匹配到的文件为script/zepto.js    
    .pipe(gulp.dest('dist')); //则最后生成的文件路径为 dist/zepto.js
```
通过指定gulp.src()方法配置参数中的base属性，我们可以更灵活的来改变gulp.dest()生成的文件路径。
当我们没有在gulp.src()方法中配置base属性时，base的默认值为通配符开始出现之前那部分路径，例如：
```javascript
gulp.src('app/src/**/*.css') //此时base的值为 app/src
//上面我们说的gulp.dest()所生成的文件路径的规则，其实也可以理解成，
//用我们给gulp.dest()传入的路径替换掉gulp.src()中的base路径，最终得到生成文件的路径。

gulp.src('app/src/**/*.css') //此时base的值为app/src,也就是说它的base路径为app/src
     //设该模式匹配到了文件 app/src/css/normal.css
    .pipe(gulp.dest('dist')) //用dist替换掉base路径，最终得到 dist/css/normal.css
//所以改变base路径后，gulp.dest()生成的文件路径也会改变

gulp.src('script/lib/*.js') //没有配置base参数，此时默认的base路径为script/lib
    //假设匹配到的文件为script/lib/jquery.js
    .pipe(gulp.dest('build')) //生成的文件路径为 build/jquery.js

gulp.src("script/lib/*.js, {base:'script'}") //配置了base参数，此时base路径为script
    //假设匹配到的文件为script/lib/jquery.js
    .pipe(gulp.dest('build')) //此时生成的文件路径为 build/lib/jquery.js    
用gulp.dest()把文件流写入文件后，文件流仍然可以继续使用。
```
**3.4 gulp.watch**

顾名思义，用来监视文件变化。在实际开发中，文件变化了，我们可以实时的刷新浏览器。
语法：
```javascript
gulp.watch(glob[, opts], tasks)
```
glob 为要监视的文件匹配模式，规则和用法与gulp.src()方法中的glob相同。
opts 为一个可选的配置对象，通常不需要用到
tasks 为文件变化后要执行的任务，为一个数组
```javascript
gulp.task('uglify',function(){
  //do something
});
gulp.task('reload',function(){
  //do something
});
gulp.watch('js/**/*.js', ['uglify','reload']);
```
gulp.watch()还有另外一种使用方式：
```javascript
gulp.watch(glob[, opts, cb])
```
glob和opts参数与第一种用法相同
cb参数为一个函数。每当监视的文件发生变化时，就会调用这个函数,并且会给它传入一个对象，该对象包含了文件变化的一些信息，type属性为变化的类型，可以是added,changed,deleted；path属性为发生变化的文件的路径
```javascript
gulp.watch('js/**/*.js', function(event){
    console.log(event.type); //变化类型 added为新增,deleted为删除，changed为改变 
    console.log(event.path); //变化的文件的路径
}); 
```
这就是我们常用的api语法和一些实例，写下来做一份记录。