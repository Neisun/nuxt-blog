---
slug: 544
title: 常用数组API
date: 2017-11-29 10:47:51
tags:
    - javascript
categories:
    - 技术随笔
    - JavaScript技巧与常见问题
description: "总结常用的数组 API。从遍历、筛选到映射与归并，梳理 map、filter、reduce 等方法的用法与适用场景。"
image: /images/covers/089.jpg
---
## 数组基本的api汇总

>Array.of(item1,item2)

ES6新增的方法，用来将传入的参数依次转化为数组的项
```js
var ar3 = Array.of(1, 2, 3, 4, 5);
console.log(ar3); // [1,2,3,4,5]
```
>Array.from(obj,callback,thisObj)

ES6新增的Array.from方法，用于将传入的对象，通过callback函数，转化为一个新的数组
- 传入的obj有格式要求，key必须是数字，而且需要有length属性
- 当callback存在时候，必须设置return，不然会得到undefined


```js
var myObj = {
    0: 'a',
    1: 'b',
    2: 'c',
    length: 3
}
var ar4 = Array.from(myObj, function(value, index) {
    console.log(value, index, arguments.length);
    return value;
}, myObj);
console.log(ar4);
// Array.from的应用，快速形成一个0~9的数组，与箭头函数搭配起来还是蛮方便的
var ar5 = Array.from({ length: 10 }, (v, i) => i);
console.log(ar5);
```
>Array.isArray(arr)

用来判断变量类型，是否是数组

正好，我们来整理一下，判断是否是数组的几种方式，这个在面试的过程中，经常会被提及。

```js
var a = [];
console.log(a instanceof Array); // true instanceOf 表示a的原型链中是否有Array
console.log(Array.prototype.isPrototypeOf(a)) // true a.isPrototypeOf(b) 表示 a是否是b的原型对象
console.log(a.constructor === Array); // a的构造器是否是Array,从原型中继承过来的
console.log(Object.getPrototypeOf(a) === Array.prototype) // Object.getPrototypeOf(a)，得到a的原型对象
console.log(Object.prototype.toString.apply(a)); // 这是最为靠谱的方式 ，能直接看出来结果 '[object Array]'
console.log(Array.isArray(a)) //ES6出品，新鲜出炉，简单方便
```
为什么说上边的一些方式不怎么靠谱呢

```js
var b = {
    __proto__: Array.prototype
}
// 再把上述的6种方式来一遍看看
console.log('-----我是分割线------')
console.log(b instanceof Array); // true
console.log(b.constructor === Array); // true
console.log(Array.prototype.isPrototypeOf(b)) // true
console.log(Object.getPrototypeOf(b) === Array.prototype); // true
console.log(Object.prototype.toString.apply(b) === '[object Array]'); // false
console.log(Array.isArray(b)) // false
```
### 几种能改变原数组的api
>push

返回值是修改后数组的length

```js
var arr = [1, 2, 3, 4];
var l = arr.push(5);
console.log(arr, l);
```
>pop

返回的是被删除的元素

```js
var item = arr.pop();
console.log(arr, item);
```
>shift

返回被删除的元素

```js
var item1 = arr.shift();
console.log(arr, item1);
```
>unshift

返回修改后数组的length

```js
var length1 = arr.unshift(1);
console.log(arr, length1);
```
>splice

返回的是删除的元素组成的数组，如果木有删除，就会返回一个空数组
```js
var newArr = [1, 2, 3, 4, 5];
// 在数组中某个位置增加元素，而且是起始位置之前添加元素，也就是说不包含起始位置
var a = newArr.splice(1, 0, 100);
console.log(newArr, a);
// 在数组中某个位置删除元素
var b = newArr.splice(1, 1);
console.log(newArr, b);
// 来几个非常规的操作
var animals = ['cat', 'dog', 'horse', 'tiger', 'elephant'];
// 起始位置是负数的
animals.splice(-3, 0, 'monkey');
console.log(animals) // ['cat','dog','monkey','horse','tiger','elephant'],如果是负数，怎么计算，用length+负数的起始位置
// 如果删除的个数大于length
var person = ['john', 'neo', 'joe'];
person.splice(1, 100);
console.log(person); // ['john] 就只剩下了john，其他的都被干掉了
// 接着上边删除个数大于length的一个特例
var newPerson = ['john', 'neo', 'joe'];
newPerson.splice(0, 100, 'Neisun', 'Davaid');
console.log(newPerson); //["Neisun", "Davaid"]
```
>reverse

反转一个数组

```js
var c = [1, 2, 3, 4, 5];
var d = c.reverse();
console.log(c, d)
```

>sort

排序，一般`arr.sort(fn)`

```js
var f = [321, 323, 134, 42, 2, 3, 53, 12345];
// 有小到大
f.sort(function(num1, num2) {
    var result = num1 - num2;
    if (result == 0) {
        return 0;
    } else if (result > 0) {
        return 1;
    } else {
        return -1;
    }
})
console.log(f);
```
>copyWithin

    copyWithin()，用于数组内的元素的替换，这个方法，不知道用处何在，而且，贼垃圾个人感觉，反正无论怎么操作，都不会改变数组的长度，返回的值是引用的数组
    另外这个东西是ES6新增的，而且支持程度比较低
    copyWithin(被替换的位置，替换元素的起始位置，替换元素的结束位置（可选）)；
    copyWithin(target,start[,end])

```js
var job = ['老师', '律师', '工程师', '医生', '公务员'];
var res = job.copyWithin(3, 0, 1); // 医生被替换成老师
console.log(job, res);
```

>fill

fill，个人感觉还是有些用处的,fill(value,start[,end])
```js
var g = ['a', 'b', 'c', 'd'];
g.fill('f', 0); // 全部替换成f
var h = [1, 2, 3, 4];
h.fill(10, 0, 1); // 替换第一个元素
console.log(g);
console.log(h);
```
### 不会改变元素的api

>concat

concat(item1,item2,arr)，返回一个全新的数组，包含你添加的每一项

```js
var m1 = [1, 2, 3];
var m2 = m1.concat(4, [10, 11, 12]);
console.log(m1, m2)
```
>join(sth)

数组变字符串，不传参数默认","隔开，传参数，用参数隔开
```js
var m3 = ['cat', 'dog', 'tiger', 'wolf'];
var m4 = m3.join('--');
console.log(m4)
```
>slice

    slice(start,end)，如果end不填，那么就从start位置截取到最后
    如果start是负数，那么length+start，就是开始的位置，并且end要比这个数字大才行
```js
var m5 = [1, 2, 3, 4, 5];
var m6 = m5.slice(0, 2);
var m7 = m5.slice(-10, 3) // 空的
console.log(m6);
console.log(m7);
// slice最常用的功能，用来获取最后一位
var lastItem = m5.slice(-1); //length-1，当然你也可以lengt-1来获取
console.log(lastItem)
```
>toString/toLocaleString

```js
var m8 = ['a', 1, 100, new Date()];
console.log(m8);
var m9 = m8.toString()
var m10 = m8.toLocaleString();
console.log(m9)
console.log(m10);
```
>indexOf

    indexOf(target,startIndex),查找元素第一次在数组中出现的索引，没有就返回-1,startIndex表示从哪个位置开始查找，默认是0，即从头开始查找
```js
var m11 = ['a', 'b', 'c', 'd', 'a'];
console.log(m11.indexOf('c')) // 2 返回的是c的index
console.log(m11.indexOf('c', 3)) // -1 因为是从3位置开始找，没找到，返回-1
console.log(m11.indexOf('c', -10)) // 2 传入的参数-10，length+startIndex<0，会从头开始查找数组，类似于重置了一样，也就是这个参数无效了
```
>lastIndexOf

从尾部开始查找

```js
var m12 = ['a', 'b', 'c', 'd', 'a'];
console.log(m12.lastIndexOf('a')) // 4
```
### 重头戏部分，数组遍历的api

不总结不知道，一总结吓了我一跳。没先到数组内置的遍历api有这么多

>for

这个自然不用多说。遍历的时候，最好把length提前存好，提高性能。

>for of 

这个api不单单可以遍历数组，是可迭代对象的内置功能。
```js
let iterable = [10, 20, 30];

for (let value of iterable) {
    value += 1;
    console.log(value);
}
// 11
// 21
// 31
```
>forEach

```js
forEach((fn,thisObj);
forEach(function(value,index,arr){
},thisObj)
* value,数组的每一项
* index，每一项下标
* arr表示传入的数组
* thisObj，表示，传入的this指向的对象
```

```js
var list = [
    { name: '123' },
    { name: '456' },
    { name: '789' },
]
var obj = {
    job: 'FE'
}
// 如果使用箭头函数，this貌似不能定义
list.forEach((value, index, list) => {
    console.log(value, index);
    console.log(this.job)
}, obj);
// 结果
// {name:'123'},0
// undefined
// {name:'456'},1
// undefined
// {name:'789'},2
// undefined
// 直接定义一个匿名函数，this的指向倒是可以指定
list.forEach(function(value, index, list) {
    console.log(value, index, list)
    console.log(this.job)
}, obj)
// 结果
// {name:'123'},0
// FE
// {name:'456'},1
// FE
// {name:'789'},2
// FE
// forEach不能退出循环，只能return出去
```
> every

```js
arr.every(function(value,index,arr){
    // ...
})
```

传入的函数用来检测数组的每一项，如果有一项不符合，就返回false，只有都符合条件的情况下，返回true。传入的函数，必须要有return语句，并将return语句作为判断条件。

```js
var list1 = [100, 10, 1, 123, 50];
var boolean = list1.every((value, index, list1) => {
    // return value<500;
    return value >= 100;
});
console.log(boolean); // false
```
> some

```js
arr.some(function (value,index,arr) {
    // ...
    // return ...;
})
与every正好相反。根据return语句作为条件判断，遍历数组的每一项，只要有一项符合条件就返回true,都不符合条件情况才返回false
```
```js
var list2 = [100, 10, 1, 123, 50];
var bool = list2.some((value, index, list2) => {
    // return value>100;
    return value < 0;
})
console.log(bool) // false
```
> filter

顾名思义，过滤器。根据传入的函数，来过滤数组的元素，将符合要求的元素组成一个数组返回。同样可以传入this指向对象，this对于箭头函数不生效。

```js
arr.filter(function (value,index,arr) {
    // return ...;
},thisObj)
```
```js
var list3 = [100, 10, 1, 123, 50];
var newList = list3.filter((value, index, list3) => {
    return value >= 50;
})
console.log(newList) // [100, 123, 50]
```
> map

可以直接映射到数组的每一项，返回新的数组

```js
arr.map(function(value,index,value){
    // ...
})
```
```js
var num = [1, 2, 3];
var newNum = num.map((value, index, num) => {
    return value * 2;
});
var testNum = num.map((value, index, num) => value * 2);
console.log(newNum) // [2,4,6]
console.log('testNum', testNum); // [2,4,6]
var str = '12345';
var strArr = Array.prototype.map.call(str, function(value) {
    return value;
})
console.log(strArr) // ['1','2','3','4','5']
```
> reduce

```js
arr.reduce(fn,initialValue),reduce接收一个fn，作为累加器，从左向右进行
arr.reduce(function (preValue,value,index,arr) {
    // 如果initialValue没有定义，那么preValue就默认为数组的第一项
},initialValue)
```
```js
// 比如求叠加，求阶乘
var numList = [1, 2, 3, 4, 5, 6, 7, 8];
var r = numList.reduce((previous, value, index, numList) => {
    return previous + value;
})
console.log(r);
var r_ = numList.reduce((previous, value, index, numList) => {
    return previous * value;
})
console.log(r_);
var testObj = [
    { num: 100 },
    { num: 20 },
    { num: 1 },
];
// 不是计算纯数字的数组，用这种方式，传入一个起始的值就行
var r__ = testObj.reduce((previous, item, index, testObj) => {
    return previous + item.num;
}, 0)
console.log(r__);
```
>reduceRight

从右向左，不多说。


> entries,返回一个数组的迭代器对象，对于这个理解不多


> find,findIndex

find用来查找符合条件的第一个元素，并返回该元素，findIndex是返回index，没有就返回-1，和indexOf很像，不过可以定义回调函数

```js
var newLists = [1, 3, 5, 7, 8, 9];

function f1(value, index, arr) {
    return value % 2 == 0;
}

function f2(value, index, arr) {
    return value > 20;
}
console.log(newLists.find(f1)) // 8 返回这个元素
console.log(newLists.find(f2)) // undefined 找不到，返回undefined
console.log(newLists.findIndex(f1)) // 4 找到元素，返回index
console.log(newLists.findIndex(f2)) // -1 找不到返回-1
```

### map与reduce 的练习题

```js
// map的练习，数组变成['Adam','Lisa','Bart']
var myArr = ['adam', 'LISA', 'barT'];
var upperArr = myArr.map((value) => {
    return value.toLowerCase().charAt(0).toUpperCase() + value.substring(1);
});
console.log(upperArr);
// 当然使用forEach也能办到
var arrList = [];
myArr.forEach((item) => {
    var newItem = item.toLowerCase().charAt(0).toUpperCase() + item.substring(1);
    arrList.push(newItem);
})
console.log(arrList);

// map与reduce练习
// 字符串先变成数组[1,2,3,4,5],然后变成数值12345
// 不能使用number，parseInt等内置方法
var myStr = '12345';

function strInit(s) {
    var arr = Array.prototype.map.call(s, function(value) {
        return value * 1;
    })
    var result = arr.reduce((pre, value) => {
        return pre * 10 + value;
    })
    return result;
}
console.log(strInit(myStr))
```
参考

1. [【深度长文】JavaScript数组所有API全解密](http://louiszhai.github.io/2017/04/28/array/)
2. [廖雪峰JavaScript教程](https://www.liaoxuefeng.com/wiki/001434446689867b27157e896e74d51a89c25cc8b43bdb3000)