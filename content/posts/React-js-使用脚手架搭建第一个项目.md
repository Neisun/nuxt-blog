---
slug: 533
title: React.js-使用脚手架搭建第一个项目
date: 2017-12-25 15:58:54
tags:
    - React.js
categories:
    - 技术随笔
    - React.js
description: "使用脚手架搭建第一个 React 项目。介绍初始化步骤、目录结构与启动流程，迈出 React 开发的第一步。"
image: /images/covers/078.jpg
---
> 写在前面

学习React.js也有一段时间了，之前一直都在引入式的进行练习。这一次，跟着中文网的教程来到了最后的一步，利用构建工具，来完成我们的项目。这是一个类似于黑白棋的小游戏。本次着重说明地是，如何利用构建工具完成项目的初始化。下边就开始进行吧。

# 准备工作

- 确保你安装了Node.js
- 确保你npm的版本不是很低

## 安装客户端

    cnpm i create-react-app -g

## 初始化项目

    create-react-app app

> 上述过程比较慢，安装依赖都在一步完成。而且，目测，走的是npm安装依赖，如果是cnpm 绝不可能这么慢，大概需要5分钟

## 启动项目

    cd app
    
    npm run start 

> 这样，一个项目就被初始化。

