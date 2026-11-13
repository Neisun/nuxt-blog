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
        { property: 'og:image', content: '/images/avatar.jpg' },
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
    },
  },
})
