---
title: 第三篇-Node.js的文件系统
tags:
  - javascript
  - Node
slug: 280
categories:
  - 技术随笔
  - Node之旅
date: 2017-08-14 17:36:51
description: "Node.js 系列第三篇，介绍文件系统（fs）模块。演示文件的读写、删除、重命名与目录操作，说明同步与异步两种调用方式的使用场景。"
image: /images/covers/028.jpg
---

JavaScript是没有操作文件的能力，但是Node.js可以做到。

Node.js提供了操作文件的接口，但是接口有太多。主要使用一些常用的接口。
> **Node.js的文件系统API**
**一、读取文件**

Node.js提供了两种方式读取文件，一个是异步的方式读取文件，一个是同步的方式读取文件。
```javascriptvar fs = require("fs");
// 我们来定义一个函数，用来读取文件
function readFile (fileUrl) {
  console.log("--开始读取--");
  fs.readfile(fileUrl,function(err,data){
    if(err){
      console.log("--读取失败--")
    }
    console.log("读取到的数据是："+data.toString());
  })
}
readFile("./src/test.txt");
// 执行函数，就能读取到文件的信息
// 上边是异步读取数据，同步读取数据是
// 同步读取函数
function readFileSync(fileUrl) {
    console.log("----开始同步读取----");
    var data = fs.readFileSync(fileUrl);
    console.log("同步读取的数据是" + data.toString());
    console.log("----读取结束----")
}
readFileSync("./src/test.txt");
// 推荐使用异步读取数据，速度快，性能好，不会阻塞；
```
**二、写文件**
```javascript// fs.writeFile(filename,data,[options],callback);
/**
 * filename, 必选参数，文件名
 * data, 写入的数据，可以字符或一个Buffer对象
 * [options],flag,mode(权限),encoding，都是选填
 * callback 读取文件后的回调函数，参数默认err
 */
// 写文件
var w_data = "我是写入的内容";
fs.writeFile("./src/test.txt",w_data,function (err) {
  if (err) {
    console.error(err);
  }
  console.log("写入成功")
})
// 有一点不得不提，就是如果你写入的文件是已经存在的文件，那么之前的内容会被覆盖掉。
// 下边的方法就是把你写入内容追加到原来的文件中；
```
**三、追加内容**
```javascript// fs.appendFile(filename,data,[options],callback)
/**
 * filename,必填参数，文件名
 * data，追加的内容
 * options，选填，flag，mode。。。
 * callback，默认参数err
 */
// 追加内容
var appendData = "我是被追加的内容";
fs.appendFile("./src/test.txt",appendData,function (err) {
  if (err) {
    console.error(err);
  }
  console.log("追加内容成功！")
})
```
**四、关于打开文件，读取文件，截取文件，写入文件，关闭文件**

我把这些归为一类，因为所有的这些命令都是基于打开文件，也就是说没有文件打开，其他的命令毫无意义，不会生效的。

_4.1 先来看看打开文件_
```javascript
fs.open(filename,flag,[mode],callback)
参数说明
/**
 * filename,必填参数
 * flags，必填参数，详细参考这些参数设置
 * mode，选填，设置权限
 * callback，默认参数第一个err，第二个fd，这个fd是个啥玩意，解释如下
 * fd为一个整数，表示打开文件返回的文件描述符，window中又称文件句柄
 */
/*Flag	描述
r	以读取模式打开文件。如果文件不存在抛出异常。
r+	以读写模式打开文件。如果文件不存在抛出异常。
rs	以同步的方式读取文件。
rs+	以同步的方式读取和写入文件。
w	以写入模式打开文件，如果文件不存在则创建。
wx	类似 'w'，但是如果文件路径存在，则文件写入失败。
w+	以读写模式打开文件，如果文件不存在则创建。
wx+	类似 'w+'， 但是如果文件路径存在，则文件读写失败。
a	以追加模式打开文件，如果文件不存在则创建。
ax	类似 'a'， 但是如果文件路径存在，则文件追加失败。
a+	以读取追加模式打开文件，如果文件不存在则创建。
ax+	类似 'a+'， 但是如果文件路径存在，则文件读取追加失败。
*/
```

一个实例写法
```javascript
fs.open("./src/test.txt","r+",function (err,fd) {
  if (err) {
    console.error(err);
  }
  console.log(fd)// fd 是一个windows系统的句柄，类似于给文件一个标识，后边会用到
  // 还记得定时器么，浏览器就会给每个定时器一个id，我们每次清除定时器，就是清除对应id的定时器
  console.log("文件被打开了")
  // 文件被打开，但是，是在内存中打开的，你根本看不到的，不用在这做纠结。
})
```
_4.2 读取文件_
文件被打开了，那么我肯定是要读取的呀！
```javascript
file.read(filename,buffer,offset,length,position,callback)
/**
 * fd, 使用fs.open打开成功后返回的文件描述符
 * buffer, 一个Buffer对象，v8引擎分配的一段内存
 * offset, 整数，向缓存区中写入时的初始位置，以字节为单位
 * length, 整数，读取文件的长度
 * position, 整数，读取文件初始位置；文件大小以字节为单位
 * callback(err, bytesRead, buffer), 读取执行完成后回调函数，bytesRead实际读取字节数，被读取的缓存区对象
 */
```
读取文件的实例
```javascript
fs.open("./src/test.txt","r+",function (err,fd) {
    if (err) {
        console.error(err)
    }
    console.log("文件被打开了")
    console.log("准备读取文件");
    var buffer = new Buffer(1024);
    // fd 在read的时候用到了，其实类似于一个文件的标识
    fs.read(fd,buffer,0,buffer.length,0,function (err,bytesRead,buffer) {
        if (err) {
            console.error(err)
        }
        console.log(bytesRead+" 字节被读")
        if (bytesRead>0) {
            console.log("读取的内容"+buffer.toString())
        }
    })
})
```
_4.3 截取文件_
```javascript
fs.// fs.ftruncate(fd,len,callback)
/**
 * fd,打开文件时候的fd
 * len,要截取的长度
 * callback,回调函数，没有参数
 */
```
截取文件实例，截取完成后关闭文件
```javascript
// 这是一套，打开文件，截取文件，读取文件，最后关闭文件
fs.open("./src/test.txt","r+",function (err,fd) {
    if (err) {
        console.log(err)
    }
    console.log("打开文件成功！")
    console.log("准备截取文件");
    // 也就是说，文件被截取之后，能读到的就是被截取的部分
    fs.ftruncate(fd,10,function (err) {
        if (err) {
            console.log(err)
        }
        console.log("截取文件成功！");
        console.log("开始读取文件");
        fs.read(fd,buffer,0,buffer.length,0,function (err,bytesRead) {
            if (err) {
                console.error(err)
            }
            console.log(bytesRead+" 字节被读取");
            if (bytesRead>0) {
                console.log(buffer.slice(0,bytesRead).toString())
            }
            // 关闭文件
            fs.close(fd,function (err) {
                if (err) {
                    console.log(err)
                }
                console.log("文件关闭")
            })
        })
    })
})
文件被截取之后，能读到就是被截取的部分
```
_4.4 关闭文件_
具体用法，如上例所示
```javascript
fs.close(fd,callback)
/**
 * fd,打开文件时候的fd
 * callback,回调函数，参数err
 */
```
_4.5 写入文件_
```javascript
// fs.write(fd,buffer,offset,length,position,callback);
/**
 * fd, 使用fs.open打开成功后返回的文件描述符
 * buffer, 一个Buffer对象，v8引擎分配的一段内存
 * offset, 整数，从缓存区中读取时的初始位置，以字节为单位
 * length, 整数，从缓存区中读取数据的字节数
 * position, 整数，写入文件初始位置；
 * callback(err, written, buffer), 写入操作执行完成后回调函数，written实际写入字节数，buffer被读取的缓存区对象
 */
```
写入文件实例
```javascript
fs.open("./src/test.txt","r+",function (err,fd) {
    if (err) {
        console.error(err)
    }
    console.log("文件被打开了");
    console.log("准备写入文件");
    var buf = new Buffer("写入的内容");
    fs.write(fd,buf,0,buf.length,0,function (err,written,buffer) {
        if (err) {
            console.error(err)
        }
        // 写入文件的字符数，一个中文，utf8编码三个字节
        console.log(written);
        // 我们会发现之前的text.txt文件被改写了
        console.log(buffer.toString())
    })
    fs.close(fd,function (err) {
        if (err) {
            console.error(err)
        }
        console.log("文件被关闭了")
    })
})
```
**五、获取文件信息**
```javascript
// fs.stat(filename,callback)
/**
 * filename，必填参数，文件路径和文件名称
 * callback，第一个参数err，第二个stats，返回一个文件相关的信息
 */
```
获取文件信息实例
```javascript
fs.stat(__dirname+"/test.txt",function (err,stats) {
    if (err) {
        console.error(err)
    }
    console.log(stats)
})
```
一张图片展示一下，获取文件相关信息的图片
![](http://www.hunaisong.cn/wp-content/uploads/2017/08/getInfo.jpg)

**六、创建文件夹**
```javascript
// fs.mkdir(filname,callback)
/**
 * filename,必填参数
 * callback，只有一个err参数
 */
```
```javascript
fs.mkdir(__dirname+"/test/",function (err) {
    if (err) {
        console.error(err)
    }
    console.log("文件夹创建成功！")
})
```
**七、读取文件夹**
```javascript
// fs.readdir(filename,{options},callback)
/**
 * filename,必填参数
 * options，选填参数
 * callback，第一个参数err，第二个参数files，返回的是一个文件的数组
 */
```
读取文件夹实例
```javascript
// 我们在刚才创建的test文件夹下，添加两个文件看看，一个是index.js,index.html
fs.readdir(__dirname+"/test",function (err,files) {
    if (err) {
        console.error(err)
    }
    console.log("读取文件夹成功！")
    console.log(files)
    files.forEach(function (value,index) {
        console.log(value+"---"+index)
    })
})
```
读取文件夹的图片
![](http://www.hunaisong.cn/wp-content/uploads/2017/08/readDir.jpg)

**八、删除文件**
会不会有的人诧异，为什么不是删除文件夹呢，对。因为我前边忘了说了。。。，给自己挖了一个坑。
要完完整整删除一个文件夹，其实还是有些说道的。
因为fs文件系统只能删除空的文件夹，所以，要想完完整整删除一个文件夹，需要，先删除文件夹内的文件，才可以。
先看看怎么删除一个文件吧
```javascript
// fs.unlink(filename,callback)
/**
 * filename,必填参数
 * callback，参数err
 */
```
删除文件的实例
```javascript
// 在新建的test文件夹内在新建一个index.txt文件，然后我们再把它删掉
fs.unlink(__dirname+"/test/index.txt",function (err) {
    if (err) {
        console.error(err)
    }
    console.log("删除成功！")
})
```
**九、删除文件夹**
这是重头戏，非常有趣
```javascript
fs.rmdir(fliename,callback);
/**
 * filename,必填参数
 * callback，参数err
 */
```
```javascript
// 清空文件夹，同步操作
function cleanDir(filename) {
    // 采用同步的方式读目标文件夹，获取files对象
    var files = fs.readdirSync(filename);
    // 遍历files对象，直接forEach了
    files.forEach((item) => {
        var stats = fs.statSync(filename+"/"+item);
        // 判断当前是文件还是文件夹
        if (stats.isDirectory()) {
            // 如果是文件夹就重复调用方法
            cleanDir(filename+"/"+item)
        }else{
            // 如果不是文件夹，那就是文件，直接删除
            fs.unlinkSync(filename+"/"+item);
            console.log("删除文件"+filename+"/"+item+"成功")
        }
    })
}

// 删除每个空文件夹，同步操作
function deleteDir(filename) {
    // 同步方式读取文件夹，得到files
    var files = fs.readdirSync(filename);
    // 判断files下是否存在别的文件夹，也就是判断length
    if (files.length>0) {
        var tempFile = 0;
        files.forEach((item) => {
            tempFile++;
            deleteDir(filename+"/"+item);
        })
        // 如果把子文件夹都删除了，那么母文件夹的filename和上述的不同，需要单独列出来，
        // 做一步判断，然后删除母文件夹
        if (tempFile==files.length) {
            fs.rmdirSync(filename)
            console.log("删除文件夹"+filename+"成功")
        }
    }else{
        fs.rmdirSync(filename)
        console.log("删除文件夹"+filename+"成功")
    }
}
cleanDir(__dirname + "/test");
deleteDir(__dirname + "/test");
```
效果图
![](http://www.hunaisong.cn/wp-content/uploads/2017/08/rmdir.jpg)

至此，基本上Node.js的文件系统最常用的api，大体都接触了个遍。
这就是一篇学习Node.js文件系统的笔记。献给自己以及看到本站的别人。