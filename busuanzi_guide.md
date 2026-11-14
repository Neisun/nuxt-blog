# 不蒜子（busuanzi）访问量展示接入指南

> 目的：在页脚展示全站访问量（PV / UV），可选展示单篇阅读量。
> 状态：待实施（本文档为思路方案，代码改动尚未落地）。

## 一、为什么不蒜子

- 国内最经典的「前台访问量展示」方案，纯前端、零后端；
- 与百度统计互补：百度统计做「后台分析」，不蒜子做「前台展示」，两者互不冲突；
- 接入成本极低：一段脚本 + 几个 `<span>` 标签即可。

> 权衡：不蒜子数据存在第三方服务器，准确性一般、偶有抽风，仅适合「撑门面」的访问量展示，不影响核心统计（核心数据仍在百度统计）。

## 二、整体接入思路

1. 脚本写死在 `nuxt.config.ts` 的 `app.head.script`，全站加载；
2. 页脚放展示标签（`layouts/default.vue`），脚本通过固定 `id` 自动填充数字；
3. （可选）文章页放单篇阅读量标签（`posts/[slug].vue`）；
4. 重新部署，验证数字显示。

## 三、接入步骤

### 步骤 1：引入脚本（nuxt.config.ts）

在 `app.head.script` 中新增一条：

```ts
script: [
  { src: 'https://hm.baidu.com/hm.js?xxx', async: true }, // 已有：百度统计
  { src: 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js', async: true },
],
```

### 步骤 2：页脚展示全站访问量（layouts/default.vue）

在 `UFooter` 中新增一行：

```html
<p class="text-sm text-muted">
  <span id="busuanzi_container_site_pv">
    本站总访问量 <span id="busuanzi_value_site_pv"></span> 次
  </span>
  ·
  <span id="busuanzi_container_site_uv">
    访客数 <span id="busuanzi_value_site_uv"></span> 人
  </span>
</p>
```

### 步骤 3：（可选）单篇阅读量（posts/[slug].vue）

在文章标题附近新增：

```html
<span id="busuanzi_container_page_pv">
  阅读 <span id="busuanzi_value_page_pv"></span> 次
</span>
```

### 步骤 4：部署验证

1. 本地 `pnpm dev` 打开页面，页脚应显示「本站总访问量 … 次 · 访客数 … 人」；
2. 推送部署后，生产环境同样显示。

## 四、注意事项

- 不蒜子通过**固定 `id`** 匹配填充数字，`id` 不能改；
- 脚本使用 `async` 加载，数字会「后到」一小会儿，属正常现象；
- 不蒜子数据为第三方累计、无法清零、准确性一般，仅作展示用途；
- 若不蒜子服务故障，标签通常会自动隐藏，不影响页面其他功能。
