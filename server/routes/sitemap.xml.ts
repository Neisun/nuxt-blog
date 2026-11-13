import { queryCollection } from '@nuxt/content/server'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = String(config.public.siteUrl).replace(/\/+$/, '')

  const posts = await queryCollection(event, 'posts').all()

  const staticPaths = ['', '/tags', '/archives', '/friends', '/about']
  const urls = [
    ...staticPaths.map((path) => ({
      loc: `${siteUrl}${path}`,
      priority: '1.0',
    })),
    ...posts.map((post) => ({
      loc: `${siteUrl}/posts/${post.slug}`,
      priority: '0.8',
    })),
  ]
    .map(
      (u) =>
        `<url><loc>${u.loc}</loc><changefreq>weekly</changefreq><priority>${u.priority}</priority></url>`,
    )
    .join('')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`

  setHeader(event, 'Content-Type', 'application/xml')
  return sitemap
})
