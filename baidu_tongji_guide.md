# 百度统计接入指南

> 目的：为博客接入百度统计，实现 PV / UV / 来源 / 停留时长等页面级统计。
> 状态：待实施（本文档为思路方案，代码改动尚未落地）。

## 一、为什么选百度统计

- 国内免费、稳定，个人博客最主流的选择，与已备案域名兼容；
- 零部署成本，注册即用，只需注入一段 JS；
- 相比企业级「行为埋点」（神策 / GrowingIO），页面统计对个人博客完全够用。

## 二、整体接入思路

统计 ID 固定、非敏感，**直接写死在 `nuxt.config.ts` 的 `app.head.script` 中**，全站自动加载。

1. 在百度统计平台注册站点 → 拿到统计 ID（形如 `xxxxxxxx`）；
2. 在 `nuxt.config.ts` 的 `app.head.script` 中写入统计脚本；
3. 重新构建部署，验证数据上报。

> 说明：统计 ID 虽会随代码提交到 Git 仓库，但其本身就会暴露在前端产物（浏览器可看到 `hm.js?xxx`），非敏感信息，无安全顾虑。

## 三、接入步骤

### 步骤 1：注册站点，获取统计 ID

1. 访问 https://tongji.baidu.com ，用百度账号登录；
2. 进入「管理」→「新增网站」，填写：
   - 网站域名：`blog.myhns.cn`
   - 首页地址：`https://blog.myhns.cn/`
3. 创建成功后，在「代码获取」中复制统计代码。其中 `hm.js?` 后面的一串字符就是统计 ID。

### 步骤 2：代码改动（仅 1 个文件）

#### nuxt.config.ts —— 在 app.head 中写入统计脚本

在 `app.head` 中新增 `script` 数组：

```ts
app: {
  head: {
    htmlAttrs: { lang: 'zh-CN' },
    // ...其余 title / meta / link 配置保持不变
    script: [
      { src: 'https://hm.baidu.com/hm.js?你的统计ID', async: true },
    ],
  },
},
```

> 放在 `app.head` 的原因：统计 ID 是固定常量，属于「永远固定存在的资源」，与 favicon、RSS 等同类，适合静态配置，无需走 runtimeConfig / 环境变量。

### 步骤 3：部署验证

1. **本地验证**：`pnpm dev` 后打开页面，Network 面板能看到 `hm.baidu.com/hm.js?xxx` 请求；
2. **生产验证**：推送到 `main` 触发部署后，百度统计后台「实时访客」能看到访问数据。

## 四、注意事项

- 脚本使用 `async` 加载，不阻塞首屏渲染；
- 统计 ID 会提交到 Git 仓库，但非敏感信息（前端本就可见），可接受；
- 后续若更换统计平台 / ID，直接改 `nuxt.config.ts` 重新部署即可。
