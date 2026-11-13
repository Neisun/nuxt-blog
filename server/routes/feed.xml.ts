import { queryCollection } from '@nuxt/content/server'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = String(config.public.siteUrl).replace(/\/+$/, '')

  const posts = await queryCollection(event, 'posts').order('date', 'DESC').all()

  const toRFC822 = (date: string) => {
    const normalized = date.includes('T') ? date : date.replace(' ', 'T')
    const d = new Date(normalized)
    return Number.isNaN(d.getTime()) ? new Date().toUTCString() : d.toUTCString()
  }

  const items = posts
    .map((post) => {
      const url = `${siteUrl}/posts/${post.slug}`
      return `<item><title><![CDATA[${post.title}]]></title><link>${url}</link><guid>${url}</guid><pubDate>${toRFC822(post.date)}</pubDate><description><![CDATA[${post.description ?? ''}]]></description></item>`
    })
    .join('')

  const feed = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>胡乃嵩的博客</title><link>${siteUrl}</link><description>胡乃嵩的个人博客，记录现代前端、服务端开发与 AI 应用方向的实践与思考。</description><language>zh-CN</language><atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />${items}</channel></rss>`

  setHeader(event, 'Content-Type', 'application/rss+xml')
  return feed
})
