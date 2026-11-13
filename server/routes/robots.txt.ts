export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = String(config.public.siteUrl).replace(/\/+$/, '')

  const body = `User-Agent: *\nDisallow:\n\nSitemap: ${siteUrl}/sitemap.xml\n`

  setHeader(event, 'Content-Type', 'text/plain')
  return body
})
