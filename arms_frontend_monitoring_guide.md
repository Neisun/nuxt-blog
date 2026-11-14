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
6. 创建后，在「接入向导」里拿到 **`pid`** 和接入脚本。

---

## 四、接入方式（脚本引入）

控制台「接入向导」会生成一段**可直接复制的脚本**，形如：

```html
<script>
    !(function(c,b,d,a){c[a]||(c[a]={});c[a]=
    { 
    endpoint: 'https://proj-xtrace-53a481f95bc6b6a0e66684c566b4c574-cn-beijing.cn-beijing.log.aliyuncs.com/rum/web/v2?workspace=default-cms-1296498984870663-cn-beijing&service_id=crkjeszabr@1af3d2e1fb111749e665f',
      // 设置环境信息，参考值：'prod' | 'gray' | 'pre' | 'daily' | 'local'
      env: 'prod', 
      // 设置路由模式， 参考值：'history' | 'hash'
      spaMode: 'history',
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
          trackUserInteractions: true
        },
      },
      // 链路追踪配置开关，默认关闭
      tracing: false,
      // SessionReplay会话回放开关，默认关闭，默认采样率 1%
      replay: false,
    }
    with(b)with(body)with(insertBefore(createElement("script"),firstChild))setAttribute("crossorigin","",src=d)
})(window, document, "//sdk.rum.aliyuncs.com/v2/browser-sdk.js", "__rum");
</script>
```

> ⚠️ 以上为老版 ARMS 前端监控脚本示例，仅作格式参考；新版 UEM 的 `pid` 和脚本内容**以控制台「接入向导」实际生成的为准**。

---

## 五、Nuxt 落地位置

在 `nuxt.config.ts` 的 `app.head.script` 数组中追加一条**内联脚本**（放在 `head` 里同步执行，**不加 `async`**，尽早初始化以捕获错误）：

```ts
script: [
  // ...已有的百度统计、不蒜子
  {
    innerHTML: '!(function(c,b,d,a){c[a]||(c[a]={});c[a].config={pid:"your-pid",appType:"web",imgUrl:"https://arms-retcode.aliyuncs.com/r.png?"};with(b)with(body)with(insertBefore(createElement("script"),firstChild))setAttribute("crossorigin","",src=d)})(window,document,"https://retcode.alicdn.com/retcode/bl.js","__bl");',
    type: 'text/javascript',
  },
],
```

> 落地时用控制台生成的脚本替换 `innerHTML` 内容即可。

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
| 页面性能 | 快不快（LCP / FID / CLS / TTFB，资源与接口耗时）                        |
| 访问分析 | 谁在访问（PV / UV、来源、地域、设备，与百度统计互补）                   |

可选：配置告警（JS 错误率超阈值 → 邮件 / 钉钉通知）。

---

## 八、计费

前端监控有免费额度，按上报量计费，个人博客流量基本落在免费额度内，以控制台为准。
