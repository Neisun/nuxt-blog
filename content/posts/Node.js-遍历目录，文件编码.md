---
title: Node.js-遍历目录，文件编码
tags:
  - Node
slug: 318
categories:
  - 技术随笔
  - Node之旅
date: 2017-08-24 16:48:16
description: "讲解 Node.js 遍历目录与处理文件编码的方法。以递归遍历目录为例，说明如何读取文件并处理编码问题，是文件系统操作的实用补充。"
image: /images/covers/036.jpg
---

> **遍历目录**

这其实属于文件系统那一章节的内容。就单独拿出来说一下。
遍历目录的话，简洁的写法需要使用递归。
一个简单的递归，计算N的阶乘。
```javascript
// 遍历目录，需要的基础
// 就是递归，使用递归能很好的遍历目录
function test(n) {
	if (n === 1) {
		return n;
	} else {
		return n * test(n - 1)
	}
}
```
用递归写一个读取文件夹内容下的文件的函数
```javascript
var fs = require("fs");
var path = require("path");
function read (dir) {
	var files = fs.readdirSync(dir);
	files.forEach((file) => {
		var stats =  fs.statSync(dir+"/"+file); 
		if (stats.isDirectory()) {
                       // 递归调用
			read(dir+"/"+file)
		}else {
			console.log(path.join(dir,file))
		}
	})
}
// 路径在引入了path内置模块之后，可以不用字符串拼接了，直接调用path.join(dir,file);
```

> **文件编码**

这个问题，我不知道，该怎么去理解好。
使用NodeJS编写前端工具时，操作得最多的是文本文件，因此也就涉及到了文件编码的处理问题。我们常用的文本编码有UTF8和GBK两种，并且UTF8文件还可能带有BOM。在读取不同编码的文本文件时，需要将文件内容转换为JS使用的UTF8编码字符串后才能正常处理。
BOM用于标记一个文本文件使用Unicode编码，其本身是一个Unicode字符（"\uFEFF"），位于文本文件头部。在不同的Unicode编码下，BOM字符对应的二进制字节如下：

    Bytes      Encoding
----------------------------
    FE FF       UTF16BE
    FF FE       UTF16LE
    EF BB BF    UTF8

因此，我们可以根据文本文件头几个字节等于啥来判断文件是否包含BOM，以及使用哪种Unicode编码。但是，BOM字符虽然起到了标记文件编码的作用，其本身却不属于文件内容的一部分，如果读取文本文件时不去掉BOM，在某些使用场景下就会有问题。例如我们把几个JS文件合并成一个文件后，如果文件中间含有BOM字符，就会导致浏览器JS语法错误。因此，使用NodeJS读取文本文件时，一般需要去掉BOM。例如，以下代码实现了识别和去除UTF8 BOM的功能。

**移除BOM**

```javascript
function readText(pathname) {
    var bin = fs.readFileSync(pathname);

    if (bin[0] === 0xEF && bin[1] === 0xBB && bin[2] === 0xBF) {
        bin = bin.slice(3);
    }

    return bin.toString('utf-8');
}
```

**GBK转UTF**

NodeJS支持在读取文本文件时，或者在Buffer转换为字符串时指定文本编码，但遗憾的是，GBK编码不在NodeJS自身支持范围内。因此，一般我们借助iconv-lite这个三方包来转换编码。使用NPM下载该包后，我们可以按下边方式编写一个读取GBK文本文件的函数。
```javascript
var iconv = require('iconv-lite');

function readGBKText(pathname) {
    var bin = fs.readFileSync(pathname);

    return iconv.decode(bin, 'gbk');
}
```
（完）