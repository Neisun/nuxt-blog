---
title: 商品列表切换效果-jQuery案例
slug: 140
categories:
  - 技术随笔
  - 页面效果
date: 2017-07-11 16:08:34
tags:
description: "一个使用 jQuery 实现商品列表切换的页面效果案例。通过点击分类或条件切换商品展示，演示如何组织 DOM 操作、事件委托与简单的动画过渡。"
image: /images/covers/008.jpg
---

> **MVVM框架用得多了，被逐渐遗忘的jQuery**

随着MVVM框架的兴起，操作DOM类的js框架渐渐受到冷落。但若是协同开发，我还是首选jQuery，因为文档全面，因为所有人都接触过，不需要太久的时间去过渡。最近在看源码和书籍的时候，发现有一个实用的案例。废话不多说，天气实在是太热了，直接撸代码。
> 上一个GIF图，看看效果

![](http://hunaisong.cn/wp-content/uploads/2017/07/list.gif)

（1）第一个需求，我们先让我们的商品列表中<span style="color: #ff0000;">第7个li（包括第七个）以后的li都隐藏</span>，<span style="color: #ff0000;">但不包括“其他品牌相机”这个li（也就是最后一个li）</span>；

（2）点击<span style="color: #ff0000;">“显示全部品牌”</span>，会把所有的li展示出来；

（3）对应的，<span style="color: #ff0000;">“显示全部品牌”</span>里的文字变成<span style="color: #ff0000;">“显示精简品牌”；</span>

（4）对应的，<span style="color: #ff0000;">“显示全部品牌”<span style="color: #000000;">旁边的字体图标由“+”变成“-”；</span></span>

（5）同时，当显示出全部品牌的时候，商品列表中总会有一些推荐的商品，我们鲜艳的颜色表示出来，如上图所示；

（6）点击按钮能够反复进行此操作；

以上就是我们这个案例的需求，分析完了需求之后，我们要开始对项目进行布局；布局十分的简单，下边是布局的代码；
> HTML布局部分代码
```html
<div class="wrapper">
    <ul class="list clearfix">
        <li><a href="#">佳能</a><i>(30440)</i></li>
        <li><a href="#">索尼</a><i>(27220)</i></li>
        <li><a href="#">三星</a><i>(20808)</i></li>
        <li><a href="#">尼康</a><i>(17821)</i></li>
        <li><a href="#">松下</a><i>(12289)</i></li>
        <li><a href="#">卡西欧</a><i>(8142)</i></li>
        <li><a href="#">富士</a><i>(14894)</i></li>
        <li><a href="#">柯达</a><i>(9520)</i></li>
        <li><a href="#">宾得</a><i>(2195)</i></li>
        <li><a href="#">理光</a><i>(4114)</i></li>
        <li><a href="#">奥林巴斯</a><i>(12205)</i></li>
        <li><a href="#">明基</a><i>(1466)</i></li>
        <li><a href="#">爱国者</a><i>(3091)</i></li>
        <li><a href="#">其他品牌相机</a><i>(7275)</i></li>
    </ul>
    <div class="showmore">
        <a href="#"><i class="fa fa-plus-square-o"></i><span>显示全部品牌</span></a>
    </div>
</div>
```
布局部分，不多说；我们再来看看样式部分，样式部分稍微说一下，因为用了float布局，可能引起高度塌陷问题，需要清除一下浮动；
顺带说一下，字体图标直接用的fontAwesome，需要在页面出引入相应的css文件和字体fonts，这一点别忘了。
> CSS样式部分
```css   
/*暴力重置*/

* {
    margin: 0;
    padding: 0;
}

/*wrapper及子元素 样式*/

.wrapper {
    border: 1px solid #ccc;
    width: 600px;
    margin: 20px auto;
    position: relative;
    font-size: 14px;
}

.wrapper a {
    text-decoration: none;
}

ul li {
    list-style: none;
    width: 30%;
    float: left;
    text-align: center;
}

.showmore {
    text-align: center;
    margin: 30px 0 0 0;
    padding: 10px;
}

.showmore a {
    border: 1px solid #ddd;
    padding: 5px 8px;
}

.showmore a span {
    margin: 0 0 0 5px;
}
/*推荐商品样式*/
.recommend a,
.recommend i {
    color: orange;
}
/*清除浮动*/

.clearfix::after {
    display: block;
    content: "";
    clear: both;
    height: 0;
}
```
我们再看看js部分，是怎么一步步实现，推荐写法是链式操作，用jQuery不写链式，感觉浪费了这么优秀的框架；在顺带提一句，页面默认是引入了jq，而且引入了的是3.2.1最新版本，这里边有一个挺大的坑，这是后话；
> js部分
```javascript      
$(function () {
    // 先把有用的节点，都获取一下
    // $content节点是我们需要动态展示的li，它是第7个li之后的li（包括第7个），但是不包括最后一个li，使用jq的选择器，很是方便直接就能获取到这个集合；
    var $content = $("ul li:gt(5):not(:last)");
    // 获取到我们点击的按钮
    var $toggleBtn = $("div.showmore a");
    //  获取到所有的li方便我们筛选一下，方便获取到推荐商品节点
    var $list = $("ul li");
    $content.hide();
    $toggleBtn.click(function (e) {
        // 利用jq的is方法做判断，判断$content那部分商品是否隐藏的
        if ($content.is(":hidden")) {
            $content.show();
            $(this).find("i").removeClass("fa-plus-square-o").addClass("fa-minus-square-o")//更改字体图标
                .next().text("显示精简品牌");//更改按钮的文字
            // 根据内容来给相应的推荐商品添加样式，用的filter过滤器，同时配合contains来匹配内容
            $list.filter(":contains('佳能'),:contains('索尼'),:contains('三星')").addClass(
                "recommend");
        } else {
            // 反之情况，就是复原，不多说
            $content.hide();
            $(this).find("i").removeClass("fa-minus-square-o").addClass("fa-plus-square-o")
                .next().text("显示全部品牌");
            $list.filter(":contains('佳能'),:contains('索尼'),:contains('三星')").removeClass(
                "recommend");
        }
    })
})
```
这里说一下这个大坑，因为是状态切换，起初用的是toggle，无论怎么调试，发现绑定toggle函数的节点都会消失，后来才知道，1.9版本之后，把多事件切换给删除了，删除了，删除了！现在他只能做一些显示和隐藏；痛到无语，这么好的功能咋就删了呢！？？

当然可以点击这里查看效果：<span style="color: #ff0000;">[狠狠点击我](http://hunaisong.cn/example/html/product-list.html#)</span>