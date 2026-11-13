---
title: Node.js-连接Mysql
tags:
  - javascript
  - Mysql
  - Node
slug: 490
categories:
  - 技术随笔
  - Node之旅
date: 2017-10-09 11:19:02
description: "讲解 Node.js 连接 MySQL 数据库的方法。介绍驱动安装、建立连接与执行查询的基本流程，打通 Node 与数据库的交互。"
image: /images/covers/065.jpg
---

今天是九月份的最后一天，同时九月份最后一篇博文。真真的是无心工作，只想为祖国庆生。说说今天的内容，Node.js进行的有条不紊，开始向数据库方面过渡。对于数据库，我是门外汉，只是粗略懂一点点基础。所以，当使用Node.js连接Mysql的时候，我很蒙，不知道怎么做，顾虑重重。首先不知道数据库语法，创建数据库，创建表，查数据库，查表，新增表里边的一条信息，更新表里的一条信息，删除表里的一条信息，等等顾虑，甚至说，我连数据库怎么安装都忘光了。
（九月份写下的草稿，十月份才发，放假期间什么都没做。。。）
所以说，作为一个数据库门外汉，想搞这些东西，那就需要付出更多的努力和花费更大的精力。

**先看看怎么安装吧**

去Mysql官网，找一下，然后就可以根据你的系统安装了，本人屌丝程序员，玩不转Mac系统，就用的windows版的。
我是把Mysql那一套都安装了，省得每次开机之后我需要找到命令行工具启动Mysql服务器。里边有一个Mysql Noticer 每次就根据这个图形界面启动就行了。数据库启动了之后，下一步做什么？当然是测试一下，数据库到底能不能连接上，连接不上的话，启动了数据库又有啥用。
你可以用很多方式去测试，我倾向于用一个图形化界面。Navicat这个还是非常好用的，用这个可以快速建数据库，以及建表等等。
安装的话，倒也简单容易，需要下载一个破解版的，不然就只能试用，过期了就不让你用了。
安装好了Navicat之后，咱们用它来连接一下数据库。

![](http://www.hunaisong.cn/wp-content/uploads/2017/09/Navicat.jpg)

好了，用这个连接一下，测试看看能不能连接成功。
接下来就是重头戏，关于使用Node.js连接Mysql。
对了连接之后，你需要使用Navicat创建一个test数据库，并且创建一个表，这个表我是直接用的菜鸟教程中的`websites.sql`

**Node.js-连接Mysql测试**

```javascript
/*
 * @Author: hunaisong 
 * @Date: 2017-09-27 14:40:06 
 * @Last Modified by: hunaisong
 * @Last Modified time: 2017-09-30 11:15:59
 */
// 用来测试node连接mysql的
// 引入mysql依赖
var mysql = require('mysql');
// 创建连接的基本配置信息
var connection = mysql.createConnection({
    // 主机
    host: 'localhost',
    // 用户
    user: 'root',
    // 密码
    password: '123456',
    // 数据库名称
    database: 'test'
});
// 连接数据库
connection.connect();
// 调用数据库库语法语句，然后来一个callback
connection.query('SELECT 1 + 1 AS solution', function(error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0].solution);
});

```

**从数据库中查数据**

要了解的数据库语言
`select * from table(数据库表的名称)`
```javascript
/*
 * @Author: hunaisong 
 * @Date: 2017-09-29 13:26:46 
 * @Last Modified by: hunaisong
 * @Last Modified time: 2017-09-30 11:17:40
 */
// 从数据库查询
var mysql = require('mysql');
var connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'123456',
    port:'3306',
    database:'test'
})
connection.connect();
// 创建sql语句 websites就是你创建那个表的名称啊
var sql = 'SELECT * FROM websites';
// 调用sql语句以及一个callback
connection.query(sql,function (err,results) {
    if (err) {
        console.log('[SELECT ERROR] - ',err.message);
        return;
    }else{
        console.log('----------SELECT-------------');
        console.log(results);
        console.log('------------------------------\n\n');
    }
})
// 获取完数据之后断开连接
connection.end();
```

**增加一条数据**

向数据库内添加一条数据
要了解的数据库语言
`insert into table (field1,field2,field3) value (val1,val2,val3);`
```javascript
/*
 * @Author: hunaisong 
 * @Date: 2017-09-29 14:23:09 
 * @Last Modified by: hunaisong
 * @Last Modified time: 2017-10-09 10:44:27
 */
// 向数据库中插入数据
var mysql = require('mysql');
var connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'123456',
    port:'3306',
    database:'test'
});
connection.connect();
// 创建数据库语法字符串
var addSql = 'insert into websites (id,name,url,alexa,country) values (0,?,?,?,?)';
// 创建添加的参数
var addParams = ['菜鸟工具', 'https://c.runoob.com','23453', 'CN'];
connection.query(addSql,addParams,(err,result) => {
    if (err) {
        console.log('[insert info] - ',err.message);
    }else {
        console.log(result);
    }
})
connection.end();
```
刷新你的数据库，你会看到数据被写入进去。

**修改某一条数据**

在上个例子的基础之上，我们把最新插入的数据更改一下。
需要了解的数据库语言
`update table set filed1 = new-value1,field2=new-value2 where id = num;`
看一下，在node中如何使用，并修改数据
```javascript
/*
 * @Author: hunaisong 
 * @Date: 2017-09-29 15:15:31 
 * @Last Modified by: hunaisong
 * @Last Modified time: 2017-09-29 16:06:10
 */
// 上个例子中在数据库中插入了一条数据，现在想将这条数据更新
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    port: '3306',
    database: 'test'
})
connection.connect();
var updateSql = 'update websites set name = ?,url = ? where id = ?';
var updateParams = ['百度', 'www.baidu.com', 6];
connection.query(updateSql, updateParams, (err, result) => {
    if (err) {
        console.log(err)
    } else {
        console.log(result);
        console.log('更新成功');
    }
})
connection.end();
```

**删除一条数据**

还是在原来的基础之上，对更改的那条数据进行删除处理
需要了解的数据库语言
`delete from table where id = num;`
```javascript
/*
 * @Author: hunaisong 
 * @Date: 2017-09-29 16:46:27 
 * @Last Modified by: hunaisong
 * @Last Modified time: 2017-09-29 16:57:33
 */
// 删除数据
var mysql = require('mysql');
var connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'123456',
    port:'3306',
    database:'test'
});
connection.connect();
var deleteSql = 'delete from websites where id=6';
connection.query(deleteSql,(err,result) => {
    if (err) {
        console.log(err)
    }else {
        console.log(result);
        console.log('删除成功');
    }
})
connection.end();
```

到此，我们的node不但可以连接数据，并且可以对数据库做一些最为基础的操作。


**总结一下吧：**
1. 确保你的数据库是开启的，不然没法连接。
2. 安装mysql依赖包，安装之后引入 `var mysql = require('mysql')`
3. 创建连接参数
```js
var connection = mysql.createConnetcion({
  host,
  user,
  password,
  // 默认3306
  port,
  database
})
```
4. 连接数据库，connection.connect();
5. 创建数据库语言与参数
6. connection.query(mysqlLanguage,params,callback)
7. 如果没有后续操作，记得关闭连接`connection.end()`

个人觉得，入门级别的node操作mysql，这些内容足矣，慢慢消化。

（完）