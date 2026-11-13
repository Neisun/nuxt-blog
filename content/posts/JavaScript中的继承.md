---
slug: 531
title: JavaScript中的继承
date: 2017-12-05 10:44:17
tags:
    - javascript
categories:
    - 技术随笔
    - 面向对象
description: "讲解 JavaScript 中的继承机制。从原型链到多种继承方式，梳理实现继承的思路与各自优缺点。"
image: /images/covers/076.jpg
---
## JavaScript中的继承

> 写在前面

这个系列的文章中，我反复强调的就是JavaScript中没有类的概念。这个概念必须要牢牢的根植于每个JavaScript开发者的心中，我们所做的一切工作都是在针对于JavaScript这门语言没有类而在模仿其他编程语言的写法。我们利用的是对象，确切地说利用函数这个特殊的对象。其实，JavaScript才是真真正正的面向对象，你说呢？

> 不得不提的new

我们在实现继承过程中，主要利用的就是构造函数+原型的方式。然后，我们会`new`一个或者多个实例（数量不限，你想多少就多少）；那么，为什么要使用`new`这个关键字，又或者说在`new`一个函数，生成一个实例的过程中，发生了什么？让我们针对这个做一个小小的测试。

```js
function Person(age) {
    this.name = "Neisun";
    this.age = age;
}
var m1 = Person(20);
var m2 = new Person(21);
console.log(m1); // undefined
console.log(m2); // Person {age:21,name:'Neisun'}
```
这个例子说明一个问题，使用new和不使用new的区别。
- 不使用new，就是当做一个普通的函数去执行，然后这个构造函数并没有什么返回值，所以结果必然是undefined。
- 使用new，会创建一个实例对象，并且会返回这个实例对象。

**那么，稍微总结一下`new`的过程中发生了什么？**

1. 创建一个空对象
1. 继承原型对象
1. 改变this指向
1. 如果没有其他返回的对象，就返回这个对象

基本上就是这四个过程。

### 原型链继承

原型链式的继承方式可以说是最简单的方式。其中最核心的地方，就是讲父类的实例作为子类的原型。

```js
function Animal(name) {
    // 私有的属性
    this.name = name || 'animal';
    this.types = ['tiger','elephant'];
    this.sleep = function () {
        console.log(this.name+' 正在睡觉');
    }
}
// 公有属性
Animal.prototype.eat = function (food) {
    console.log(this.name+' eat '+food);
}
// 创建一个Cat类
function Cat() {
    
}
// 直接把Cat类的原型等于Animal的一个实例对象，传递了cat形参，是为了验证到底能不能传参？
// 我向父类实例中传递了参数，没有问题。
Cat.prototype = new Animal('cat');
// 还有一种更优的方法，Cat.prototype = Object.create(Animal.prototype)
var cat1 = new Cat();
console.log(cat1) // 一个Cat{},__proto__指向animal
console.log(cat1.name); // cat
console.log(cat1.types); // ['tiger','elephant'];
cat1.sleep(); // cat sleep
cat1.eat('fish'); // cat eat fish
// 改变cat1实例的数组，向数组中添加项
cat1.types.push('lion');
// 一个新的实例 cat2
var cat2 = new Cat();
// 发现实例cat2中的数组也发生了变化
console.log(cat2.types)
// ["tiger", "elephant", "lion"]
```
总结一下：
- 优点就是非常简洁
- 缺点也显而易见了，就是改变引用数据类型。引用类型数据是所有子实例共享，这样导致其他实例也会跟着变化。
- 还有一点需要澄清。有人说这种方式不能传参数，我不赞同。我创建了cat1实例就是传参了。

### 借用构造函数

```js
function Animal(name) {
    // 私有的属性与方法
    this.name = name || 'animal';
    this.types = ['tiger', 'elephant'];
    this.sleep = function() {
        console.log(this.name + ' 正在睡觉');
    }
}
// 公有的
Animal.prototype.eat = function(food) {
    console.log(this.name + ' eat ' + foot);
}
// Cat 类，使用call改变指向
function Cat(name) {
    Animal.call(this,name);
}
var cat1 = new Cat('cat1');
console.log(cat1.name);
console.log(cat1.types);
cat1.sleep();
cat1.eat('fish'); // 报错，没有eat这个方法
cat1.types.push('lion');
var cat2 = new Cat('cat2');
console.log(cat1.types);
console.log(cat2.types)
```
总结一下：
- 这种方法可以避免引用数据类型的问题
- 但是无法实现原型上方法的继承

### 混合方式（构造函数+原型链）

```js
// 组合方式继承，构造函数+原型的方式
// 还是老样子，我们来一个Animal类
function Animal(name) {
    // 私有属性与方法
    this.name = name || 'animal';
    this.types = ['tiger','elephant'];
    this.sleep = function () {
        console.log(this.name+' 正在睡觉!');
    }
}
// 公有的
Animal.prototype.eat = function (food) {
    console.log(this.name+' eat '+food);
}

// 一个Cat类
function Cat(name) {
    Animal.call(this,name);
}
Cat.prototype = new Animal(); // 现在我推荐用Object.create(Animal)
var cat = new Cat('cat');
console.log(cat);
var cat1 = new Cat('cat1');
var cat2 = new Cat('cat2');
console.log(cat1.name);
console.log(cat2.name);
cat1.types.push('lion');
console.log(cat1.types);
console.log(cat2.types);

// 构造函数继承的缺点，父类元素原型上的方法，这种方式可以很好的继承了
// 缺点，子类实例上多了父类实例的原型
// 这种方式其实用处最为广泛的，那个缺点是一点小小的瑕疵
```
### 寄生混合方式

```js
// 一个生孩子的函数，obj传递的是父类的原型
function babyGet(obj) {
    var F = function() {

    };
    F.prototype = obj;
    return new F();
}

// 还是老样子，创建一个Animal作为父类
function Animal(name) {
    this.name = name || 'animal';
    this.types = ['tiger', 'elephant'];
    this.sleep = function() {
        console.log(this.name + ' 正在睡觉');
    }
}
Animal.prototype.eat = function(food) {
    console.log(this.name + ' eat ' + food);
}

// 再来一个Cat 类
function Cat(name) {
    Animal.call(this, name);
}
// 先得到父类的原型对象
var proto = babyGet(Animal.prototype);
// 构造函数属性指向指向Cat
proto.constructor = Cat;
// 再让Cat的原型等于proto
Cat.prototype = proto;
console.log(Cat.prototype)
var cat1 = new Cat('cat1');
var cat2 = new Cat('cat2');
console.log(cat1);
console.log(cat1.name);
console.log(cat1.types);
cat1.sleep();
cat1.eat('fish');

// 这是绝佳的方式，只是实现起来有些麻烦；
```
综上所述，基本上就是这四种方式。这四种方式使用最为广泛的当属于混合方式。最好的方式是寄生混合方式，但略显繁琐。

至此，面向对象编程部分算是基本形成了一个体系。