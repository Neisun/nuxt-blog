// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/content', '@nuxt/ui'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  icon: {
    clientBundle: {
      scan: true,
    },
  },
  fonts: {
    providers: {
      google: false,
      googleicons: false,
    },
  },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_SITE_URL || 'https://blog.myhns.cn',
      artalk: {
        server: process.env.NUXT_PUBLIC_ARTALK_SERVER || '',
        site: process.env.NUXT_PUBLIC_ARTALK_SITE || '',
      },
    },
  },
  nitro: {
    prerender: {
      routes: ['/sitemap.xml', '/feed.xml', '/robots.txt'],
    },
  },
  app: {
    head: {
      htmlAttrs: { lang: 'zh-CN' },
      title: '胡乃嵩的博客',
      titleTemplate: '%s · 记录现代前端、服务端开发与 AI 应用方向的实践与思考',
      meta: [
        {
          name: 'description',
          content: '胡乃嵩的个人博客，记录现代前端、服务端开发与 AI 应用方向的实践与思考。',
        },
        {
          name: 'keywords',
          content: '前端开发, 全栈开发, AI, Nuxt, Vue, TypeScript, Node.js, 博客, 胡乃嵩',
        },
        { name: 'author', content: '胡乃嵩' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: '胡乃嵩的博客' },
        { property: 'og:title', content: '胡乃嵩的博客' },
        {
          property: 'og:description',
          content: '胡乃嵩的个人博客，记录现代前端、服务端开发与 AI 应用方向的实践与思考。',
        },
        { property: 'og:image', content: '/images/avatar.png' },
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: '胡乃嵩的博客' },
        {
          name: 'twitter:description',
          content: '胡乃嵩的个人博客，记录现代前端、服务端开发与 AI 应用方向的实践与思考。',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        {
          rel: 'alternate',
          type: 'application/rss+xml',
          title: '胡乃嵩的博客',
          href: '/feed.xml',
        },
      ],
      script: [
        // 接入百度统计
        {
          src: 'https://hm.baidu.com/hm.js?9b0d77e9822c91ddd7cdb157e5a782ec',
        },
        // 接入不蒜子
        {
          src: 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js',
          async: true,
        },
        // 接入阿里云用户体验监控 UEM（RUM），脚本内部依赖 document.body，须放在 body 起始处
        {
          innerHTML: `!(function(c,b,d,a){c[a]||(c[a]={});c[a]={endpoint:'https://proj-xtrace-53a481f95bc6b6a0e66684c566b4c574-cn-beijing.cn-beijing.log.aliyuncs.com/rum/web/v2?workspace=default-cms-1296498984870663-cn-beijing&service_id=crkjeszabr@1af3d2e1fb111749e665f',env:'prod',spaMode:'history',collectors:{perf:true,webVitals:true,api:true,staticResource:true,jsError:true,consoleError:true,click:{enable:true,trackUserInteractions:true}},tracing:false,replay:false};with(b)with(body)with(insertBefore(createElement("script"),firstChild))setAttribute("crossorigin","",src=d)})(window,document,"//sdk.rum.aliyuncs.com/v2/browser-sdk.js","__rum");`,
          type: 'text/javascript',
          tagPosition: 'bodyOpen',
        },
      ],
    },
  },
})
