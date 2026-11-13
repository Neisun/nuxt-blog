// 批量为文章 frontmatter 写入 description 和 image 字段
// 用法：node scripts/add-meta.mjs
import fs from 'node:fs'
import path from 'node:path'

const POSTS_DIR = 'content/posts'

// slug -> description 映射（按文章内容生成）
const descriptions = {
  70: '总结原生 select 元素在表单中的正确使用方式与常见使用技巧。',
  106: '深入讲解 HTML5 原生拖拽 API 的用法与注意事项。',
  113: '介绍 HTML5 History API 实现前端路由与历史状态管理。',
  120: '一首名为《我以为》的歌词分享。',
  122: '实现表单输入框自动跳转到下一个输入框的交互技巧。',
  129: '用 jQuery 手写实现一个常见的下拉 menu 菜单。',
  134: '聊聊健身的初衷：塑造身材、保持健康，以及健身如何成为一种生活方式。',
  140: '用 jQuery 实现商品列表切换的页面效果案例。',
  148: 'JavaScript 中函数绑定（bind/call/apply）的用法总结。',
  151: 'CSS3 transition 过渡动画的基本用法与示例。',
  169: '封装函数库时自定义事件机制的实现基础。',
  180: '实现一个带下拉列表的常规导航栏。',
  184: '一些关于挣钱与生活的感悟语录分享。',
  189: '辨析 offsetWidth、clientWidth、scrollWidth 三个宽度的区别。',
  194: 'JavaScript 实现元素拖拽的第一篇基础教程。',
  205: '购物车等场景中复选框（CheckBox）的使用技巧。',
  209: '用 select 元素实现穿梭框的写法。',
  217: '总结常见的表单验证写法。',
  222: 'Gulp 系列第一篇：介绍 Gulp 的基本 API。',
  229: 'Gulp 系列第二篇：常用插件的介绍与使用。',
  234: 'Gulp 系列第三篇：最基本的使用与配置。',
  244: '实现表格的过滤与折叠功能。',
  252: 'Gulp 系列第四篇：在实际开发中的配置实践。',
  259: '网页换肤（主题切换）的思路与实现方法。',
  264: '选项卡（Tab）组件的实现。',
  270: 'Node.js 系列第一篇：Node.js 的入门介绍。',
  273: 'Node.js 系列第二篇：基础用法。',
  280: 'Node.js 系列第三篇：文件系统（fs）模块。',
  282: '夏去秋来的季节随笔，记录时光流转的感想。',
  286: '关于职场中受排挤、被惦记的一点感悟与思考。',
  294: 'Node.js Buffer 缓冲区对象的用法。',
  297: 'Node.js Stream 流的概念与使用。',
  302: 'Node.js path 路径模块的用法。',
  305: 'Mock.js 前端数据模拟工具的用法。',
  310: '实现自动居中的导航栏。',
  318: 'Node.js 遍历目录与处理文件编码。',
  322: '这一周的生活记录与感想。',
  325: 'Node.js http 模块入门（上）。',
  343: 'Node.js http 模块进阶（下）。',
  346: 'vue-router 系列第一篇：动态路由匹配等基础用法总结。',
  361: 'vue-router 进阶：导航钩子（全局/路由/组件级）的用法。',
  368: 'Node.js 事件循环机制。',
  373: 'vue-router 进阶：路由元信息 meta 的用法。',
  376: 'vue-router 进阶：路由切换时的过渡效果实现。',
  383: 'vue-router 基于路由的过渡效果。',
  386: 'vue-router 进阶：导航完成前后两种数据获取方式。',
  388: 'Node.js EventEmitter 事件发射器类。',
  392: 'vue-router 进阶：滚动行为的处理。',
  396: 'vue-router 进阶：router-link 组件的属性与用法。',
  399: '实现箭头指示的页面效果。',
  403: 'Node.js 模块系统（CommonJS）。',
  406: 'Node.js 中的函数用法。',
  408: 'Node.js 路由的实现。',
  412: 'Node.js 全局对象。',
  421: 'JavaScript call 方法的用法。',
  425: 'Node.js util 实用工具模块。',
  427: 'Node.js 处理 POST 与 GET 请求。',
  452: 'Node.js net 网络模块。',
  461: '手写一个简单的 JS 模板引擎。',
  463: '前端模块化开发的基础知识。',
  465: 'Node.js Express 框架基础。',
  471: '辨析事件对象中 e.target 与 e.currentTarget 的区别。',
  473: '图片展示的页面效果 demo。',
  481: '关于 JS 模块化开发的笔记与思考。',
  490: 'Node.js 连接 MySQL 数据库。',
  497: '实现文件上传并显示进度条。',
  501: '输入框输入时的底部动态效果。',
  506: '浏览器渲染机制解析。',
  509: 'ES6 Promise 的用法与原理。',
  512: 'ES6 let 与 const 的用法与区别。',
  516: 'ES6 Class 类的使用。',
  520: '总结 JavaScript 常用创建对象的方式。',
  525: '用 JavaScript 实现点击图片下载。',
  528: 'JavaScript 函数的一些小知识点。',
  530: '对象的 setter 与 getter 访问器属性。',
  531: 'JavaScript 中的继承机制。',
  532: '用面向对象思想创建一个控件。',
  533: '用脚手架搭建第一个 React 项目。',
  534: 'React 基础教程。',
  535: 'CSS 宽高固定等间距布局的 demo。',
  536: 'CSS Grid 网格布局的用法。',
  537: '阿里云 OSS 的 Web 直传实现。',
  538: 'Vuex 状态管理的用法总结。',
  539: 'Webpack 3.x 通用配置总结。',
  540: 'Webpack 中的代理（proxy）配置。',
  541: '十一月总结与十二月展望的生活随笔。',
  542: '实现图片上传前的本地预览。',
  543: '记录 x++ 与 ++x 等常见易混问题的笔记。',
  544: '总结常用的数组 API。',
  545: 'JavaScript 异步编程方式的总结。',
  546: '深入理解 JavaScript 对象。',
  547: '用 dva-cli 构建 React 项目。',
  548: '用面向对象方式实现简单的表单验证。',
}

function main() {
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'))

  // 解析每个文件的 slug
  const posts = files.map((file) => {
    const content = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8')
    const slug = Number(content.match(/^slug:\s*(\d+)/m)?.[1])
    return { file, slug, content }
  })

  // 按 slug 升序排序，按时间顺序分配图片
  posts.sort((a, b) => a.slug - b.slug)

  let done = 0
  for (const [i, post] of posts.entries()) {
    const num = String(i + 1).padStart(3, '0')
    const image = `/images/covers/${num}.jpg`
    const description = descriptions[post.slug]

    if (!description) {
      console.warn(`⚠️ 缺少 description：slug=${post.slug} file=${post.file}`)
      continue
    }

    // 跳过已经写过的
    if (/^image:\s/m.test(post.content)) {
      console.warn(`⚠️ 已有 image 字段，跳过：${post.file}`)
      continue
    }

    const newContent = post.content.replace(
      /^(---\r?\n)([\s\S]*?)(\r?\n---)/,
      (_m, open, body, close) =>
        `${open}${body}\ndescription: ${JSON.stringify(description)}\nimage: ${image}${close}`,
    )

    fs.writeFileSync(path.join(POSTS_DIR, post.file), newContent)
    done++
  }

  console.log(`完成！共写入 ${done} 篇文章的 description 和 image 字段。`)
}

main()
