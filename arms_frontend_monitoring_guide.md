# 阿里云用户体验监控 UEM（前端监控）接入指南

## 一、定位与选型结论

### 为什么选用户体验监控 UEM

- 阿里云全家桶生态，与现有 OSS / ECS 同一账号，国内访问快；
- 免费额度对个人博客足够，几乎零成本；
- 相比自建 Sentry，免去服务器内存（4GB+）与运维成本。

> 说明：该产品早期叫「ARMS 前端监控」，现已升级为「用户体验监控 UEM」（RUM，真实用户监控），入口在云监控可观测平台。

### 核心价值

把「用户浏览器里发生的 JS 错误 / 性能问题 / 接口异常」自动收集到云端，替代手动打开控制台看报错，支持历史回溯与告警。

### 与已有埋点的分工（互补，不冲突）

| 工具              | 定位             | 视角                                               |
| ----------------- | ---------------- | -------------------------------------------------- |
| 百度统计          | 后台访问分析     | 业务 / 运营：来源、渠道、停留时长、关键词          |
| 不蒜子            | 前台访问量展示   | 全站 PV / UV + 单篇文章阅读量                      |
| **ARMS 前端监控** | 稳定性与体验监控 | 技术 / 工程：JS 错误、页面性能、接口监控、访问分析 |

---

## 二、前置条件

- 阿里云账号（复用 OSS / ECS 的账号即可）；
- 前端监控服务已开通（控制台点击开通即可）。

---

## 三、开通与创建应用（新版控制台路径）

1. 登录阿里云控制台，搜索「用户体验监控」或「ARMS」，进入「用户体验监控 UEM」；
2. 选择区域（如 `cn-beijing`，选离用户近的即可）；
3. 首次进入会提示「开通服务」并创建默认工作台（workspace），确认开通；
4. 开通后进入「接入中心」，选择「前端应用 → Web」；
5. 创建应用：名称填 `my-blog`，类型选 `Web`；
6. 创建后，在「接入向导」里拿到接入脚本（脚本内 `endpoint` 即应用专属的上报地址）。

---

## 四、接入方式（脚本引入）

控制台「接入向导」会生成一段**可直接复制的脚本**，形如：

```html
<script>
  !(function (c, b, d, a) {
    c[a] || (c[a] = {});
    c[a] = {
      endpoint:
        "https://proj-xtrace-53a481f95bc6b6a0e66684c566b4c574-cn-beijing.cn-beijing.log.aliyuncs.com/rum/web/v2?workspace=default-cms-1296498984870663-cn-beijing&service_id=crkjeszabr@1af3d2e1fb111749e665f",
      // 设置环境信息，参考值：'prod' | 'gray' | 'pre' | 'daily' | 'local'
      env: "prod",
      // 设置路由模式， 参考值：'history' | 'hash'
      spaMode: "history",
      collectors: {
        // 页面性能指标监听开关，默认开启
        perf: true,
        // WebVitals指标监听开关，默认开启
        webVitals: true,
        // Ajax监听开关，默认开启
        api: true,
        // 静态资源开关，默认开启
        staticResource: true,
        // JS错误监听开关，默认开启
        jsError: true,
        // 控制台错误监听开关，默认开启
        consoleError: true,
        // 用户行为监听开关，默认开启，trackUserInteractions 开启后追踪所有用户交互元素，支持热力图分析
        click: {
          enable: true,
          trackUserInteractions: true,
        },
      },
      // 链路追踪配置开关，默认关闭
      tracing: false,
      // SessionReplay会话回放开关，默认关闭，默认采样率 1%
      replay: false,
    };
    with (b)
      with (body)
        with (insertBefore(createElement("script"), firstChild))
          setAttribute("crossorigin", "", (src = d));
  })(window, document, "//sdk.rum.aliyuncs.com/v2/browser-sdk.js", "__rum");
</script>
```

> 以上即为新版 UEM（用户体验监控）「接入向导」实际生成的脚本，其中 `endpoint` 为你的应用专属上报地址，直接复制即可，无需再改。

---

## 五、Nuxt 落地位置

在 `nuxt.config.ts` 的 `app.head.script` 数组中追加一条**内联脚本**，与百度统计、不蒜子并列：

```ts
script: [
  // ...已有的百度统计、不蒜子
  {
    innerHTML: `!(function(c,b,d,a){c[a]||(c[a]={});c[a]={endpoint:'https://proj-xtrace-53a481f95bc6b6a0e66684c566b4c574-cn-beijing.cn-beijing.log.aliyuncs.com/rum/web/v2?workspace=default-cms-1296498984870663-cn-beijing&service_id=crkjeszabr@1af3d2e1fb111749e665f',env:'prod',spaMode:'history',collectors:{perf:true,webVitals:true,api:true,staticResource:true,jsError:true,consoleError:true,click:{enable:true,trackUserInteractions:true}},tracing:false,replay:false};with(b)with(body)with(insertBefore(createElement("script"),firstChild))setAttribute("crossorigin","",src=d)})(window,document,"//sdk.rum.aliyuncs.com/v2/browser-sdk.js","__rum");`,
    type: 'text/javascript',
    tagPosition: 'bodyOpen',
  },
],
```

> 说明：
>
> - `with(...)insertBefore(createElement("script"), ...)` 是**动态注入** `browser-sdk.js`，动态插入的脚本天然不阻塞首屏渲染，即「异步接入」效果，故无需再额外加 `async`；
> - 该脚本内部 `with(body)` 依赖 `document.body`，必须放在 `<body>` 起始处执行（`tagPosition: 'bodyOpen'`）。若放进 `<head>`，脚本执行时 `document.body` 还是 `null`，会抛 `Cannot convert undefined or null to object`。

---

### 5.1 故障排查：`Cannot convert undefined or null to object`

- **现象**：控制台报 `Uncaught TypeError: Cannot convert undefined or null to object`，位置在 `(index):1`；
- **根因**：接入脚本里的 `with(b)with(body)...` 中 `body` 解析为 `document.body`；脚本被注入到 `<head>`，执行时 `<body>` 尚未解析，`document.body` 为 `null`，`with(null)` 触发该异常；
- **解决**：给该脚本条目加 `tagPosition: 'bodyOpen'`，让它在 `<body>` 起始处执行，此时 `document.body` 已存在。

---

## 六、验证

1. 部署后打开博客页面；
2. 回到控制台「前端监控」，观察是否有上报数据（PV、页面性能）；
3. 可选：在浏览器控制台手动执行 `throw new Error('test')`，几秒后应在「JS 错误」面板看到该错误。

---

## 七、日常使用（重点看三个面板）

| 面板     | 关注什么                                                                |
| -------- | ----------------------------------------------------------------------- |
| JS 错误  | 有没有 bug（运行时错误、Promise 异常、资源加载失败，带堆栈 + 用户环境） |
| 页面性能 | 快不快（LCP / INP / CLS / TTFB，资源与接口耗时）                        |
| 访问分析 | 谁在访问（PV / UV、来源、地域、设备，与百度统计互补）                   |

可选：配置告警（JS 错误率超阈值 → 邮件 / 钉钉通知）。

---

## 八、性能指标速查（LCP / INP / CLS 等）

UEM 页面性能面板里的一堆缩写，本质是把「加载快不快、交互顺不顺、页面稳不稳」量化成数字。分两类：三大核心指标（Core Web Vitals）+ 辅助指标。

### 8.1 三大核心指标（Core Web Vitals）

| 缩写 | 全称                      | 中文           | 衡量维度             | 达标线  |
| ---- | ------------------------- | -------------- | -------------------- | ------- |
| LCP  | Largest Contentful Paint  | 最大内容绘制   | 加载快不快           | ≤ 2.5s  |
| INP  | Interaction to Next Paint | 交互到下次绘制 | 交互响应快不快       | ≤ 200ms |
| CLS  | Cumulative Layout Shift   | 累计布局偏移   | 页面稳不稳（跳不跳） | ≤ 0.1   |

- **LCP（加载）**：页面上最大那块内容（通常是大图 / 标题）出现在屏幕上的时间；
- **INP（交互）**：点击一个按钮 / 链接到页面真正响应这次点击的延迟（2024 年起取代旧指标 FID）；
- **CLS（稳定）**：加载过程中元素乱跳 / 位移的程度，常见于图片没设宽高，文字先出、图片加载后把文字挤下去。

### 8.2 辅助指标

| 缩写 | 全称                   | 中文         | 一句话意思                                                   |
| ---- | ---------------------- | ------------ | ------------------------------------------------------------ |
| FCP  | First Contentful Paint | 首次内容绘制 | 第一块内容（哪怕一个字）渲染出来的时间，比 LCP 早            |
| TTFB | Time to First Byte     | 首字节时间   | 浏览器发请求 → 收到服务器第一个字节的耗时，衡量网络 / 服务器 |
| FP   | First Paint            | 首次绘制     | 浏览器画出第一个像素（可能只是背景色）的时间                 |
| TTI  | Time to Interactive    | 可交互时间   | 页面完全能稳定交互的时间                                     |
| TBT  | Total Blocking Time    | 总阻塞时间   | FCP 到 TTI 之间主线程被长任务卡住的总时长                    |
| FID  | First Input Delay      | 首次输入延迟 | 旧版交互指标，已被 INP 取代，看到可忽略                      |

> FMP（First Meaningful Paint，首次有意义绘制）已被 LCP 取代，基本不再使用。

时间轴：

```
请求发出 → [TTFB 服务器响应] → [FP 画第一个像素] → [FCP 第一块内容] → [LCP 最大内容] → [TTI 可交互]
```

### 8.3 博客场景重点看这几个

本站是纯静态 SSG 博客，交互少、内容多，优先级：

1. **LCP**：文章首屏大图 / 标题多久出来；
2. **CLS**：文章图片若没写宽高，加载时文字会跳，CLS 就高；
3. **TTFB**：走 OSS 网络一般没问题，能反映 CDN / 网络质量；
4. **INP**：博客交互少，基本不会超标，不必盯。

一句话记忆：**LCP 管加载、INP 管响应、CLS 管稳定**，FCP / TTFB 是前奏和分解项。

---

## 九、计费

前端监控有免费额度，按上报量计费，个人博客流量基本落在免费额度内，以控制台为准。
