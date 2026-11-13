---
title: ES6之Promise
tags:
  - javascript
  - Node
slug: 509
categories:
  - 技术随笔
  - ES6
date: 2017-10-17 11:20:41
description: "讲解 ES6 Promise 的用法与原理。从回调地狱的痛点切入，介绍 then、catch、all 等方法，理解异步编程的优雅写法。"
image: /images/covers/069.jpg
---

> **这是一篇关于Promise的总结**

在我们想了解一样新鲜事物的时候，我们会怎么进行呢，首先知道这样事物是什么东西，然后需要知道这样事物这样事物有什么功能和作用，能给我们带来什么，那么就按照这个了解新鲜事物的流程来了解一下promise。

**Promise是什么**

古人云，一诺千金，promise翻译成汉语就是诺言。而promise对象和一诺千金也比较相像，一诺，成功，失败。在代码世界中，就是这么纯粹，是就是，不是就不是。
那么官方给出的解释是什么样的，看一下呗。
来自于MDN的解释：
Promise 对象用于一个异步操作的最终完成（或失败）及其结果值的表示。(简单点说就是处理异步请求。我们经常会做些承诺，如果我赢了你就嫁给我，如果输了我就嫁给你之类的诺言。这就是promise的中文含义：诺言，一个成功，一个失败。)；
而在我们看了张鑫旭的博客之后，对Promise又有了一个全新的认识。张老师认为，Promise其实是Future，因为这个对象提供的功能是预测，在代码界扮演了一个先知的角色。从前代码结构是，从上至下，依次进行。而它，调出这个圈子，以旁观者的身份来对代码进行预测，是一种思维方式的转变。
[张鑫旭对Promise的感性解释](http://www.zhangxinxu.com/wordpress/2014/02/es6-javascript-promise-%E6%84%9F%E6%80%A7%E8%AE%A4%E7%9F%A5/)

再回到，MDN那理性的解释，我们不难分析出：
从MDN的解释中，我们大致也了解了使用promise对象的情景，那就是需要异步操作的时候。这还不并不是最准确的使用情景，最常见的使用场景是，有n多请求，然而我们想要我们的请求是有个顺序，那么就需要在我们的请求中不断回调。

```javascript
// 举个例子
// 比如一个ajax请求
var url = 'https://hq.tigerbrokers.com/fundamental/finance_calendar/getType/2017-02-26/2017-06-10',
    result;
    var xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.send();
xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            result = xhr.responseText;
            console.log(JSON.parse(result));
            // 再来一个请求，无限的嵌套，代码格式混乱，术语成为回调地狱
        }
    }
// 如果有多个请求，那我们就需要不断的在代码中嵌套，一个回调地狱就产生了。
// 这里向简书的作者波神致敬，直接拿的他给的url用。
```
如果用promise怎么写呢？
```javascript
function getJSON(url) {
    // 返回的是一个实例化的promise对象
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open('get', url, true);
        xhr.send();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    try {
                        var msg = JSON.parse(xhr.responseText);
                        resolve(msg)
                    } catch (error) {
                        reject(error);
                    }
                } else {
                    reject(new Error(xhr.responseText));
                }
            }
        }
    })
}
// 调用
getJSON(url)
    .then((msg) => {
        console.log(msg)
    })
    .catch((err) => {
        console.log(err)
    })
```
咋一看，代码量更多，貌似更复杂了呢。
但实际上，加入了错误处理，代码更健壮。
但是有一个问题没有解决，就是怎么继续在第一次的请求基础上继续请求，既然不用嵌套的方式了。
```javascript
getJSON(url)
.then((result) => {
    console.log(result)
})
.then(function () {
    // 在这里写代码
})
```
这就是使用promise的魅力所在，使用then进行链式操作，避免了函数的层层嵌套，造成回调地狱，虽说我不入地狱谁入地狱，但你还能总入地狱么。。。

**Promise的基本写法**

```javascript
function testPromise() {
    return new Promise((resolve, reject) => {
        if (condition) {
            resolve(data)
        } else {
            reject(err)
        }
    })
}
```

**resolve和reject**

这是promise中的两个回调函数
resolve 把promise对象的状态置为成功，同时传递一个参数，这个参数用于后续使用比如then((data) => {})，这个data就是resolve传过来的(resolve(data));
reject 把promise对象的状态置为失败,同时传递一个参数，用来提示错误信息的。
基本的使用方式，在上述的小例子中已经可以看到。

**then与catch**

then是promise对象中的方法，用于后续操作，可以用来链式操作，为啥呢？因为他也属于一个promise对象
catch也是promise对象中的方法，用于后续操作，可以用来链式操作，用来提示错误信息的。

**三种状态**

promise对象有三种状态，这三种状态就是resolve和reject更改的状态
Fulfilled 可以理解为成功的状态
Rejected 可以理解为失败的状态
Pending 既不是 Fulfilld 也不是 Rejected 的状态，可以理解为 Promise 对象实例创建时候的初始状态

**接下来就是promise中常用的api**

`Promise.all`
promise.all([p1,p2]) ，p1和p2也是promise对象，这个方法必须是所有的传入promise对象状态变成Fulfilled(成功),才会返回。也就是只要有一个promise对象状态不成功，那就不可以。这个方法可以处理一次有多个请求，并且请求之间有依赖关系，比如第二个请求必须依赖第一个请求。
```javascript
// 一个小例子
function add(num) {
    return ++num;
}

function test(num) {
    return new Promise((resolve, reject) => {
        if (typeof num == 'number') {
            resolve(num);
        } else {
            reject('错误')
        }
    })
}
Promise.all([test(add(0)), test(add(1))]).then((data) => {
    console.log(data)
})
// 两个数据被存到一个数组中，并且顺序就是你传入all方法中的顺序
```
`Promise.race`
```javascript
// promise.race方法，与all类似。all是必须都为resolve了，才会执行then。
// race是传入的n多promise对象中，处理相应最快的那个
// 。下边是MDN的小例子，来例证；
var p1 = new Promise(function(resolve, reject) {
    // 这里顺便科普一下setTimeout的第三个参数
    // setTimeout的第三个参数就是一个回调函数传入的参数。
    setTimeout(resolve, 500, "one");
});
var p2 = new Promise(function(resolve, reject) {
    setTimeout(resolve, 100, "two");
});

Promise.race([p1, p2]).then(function(value) {
    console.log(value); // "two"
    // 两个都完成，但 p2 更快
});

var p3 = new Promise(function(resolve, reject) {
    setTimeout(resolve, 100, "three");
});
var p4 = new Promise(function(resolve, reject) {
    // 注意是reject啦
    setTimeout(reject, 500, "four");
});
// then是有两个回调函数的，promise.then(onCompleted, onRejected);
Promise.race([p3, p4]).then(function(value) {
    console.log(value); // "three"
    // p3 更快，所以它完成了              
}, function(reason) {
    // 未被调用
});

var p5 = new Promise(function(resolve, reject) {
    setTimeout(resolve, 500, "five");
});
var p6 = new Promise(function(resolve, reject) {
    // 注意是reject啦
    setTimeout(reject, 100, "six");
});

Promise.race([p5, p6]).then(function(value) {
    // 未被调用             
}, function(reason) {
    console.log(reason); // "six"
    // p6 更快，所以它失败了
});
// 误区，并不是出现错误，所以用catch捕捉不到错误。catch是在抛出错误之后，才可以捕获得到。
```

以上就是关于ES6中promise的基础和使用

（完）