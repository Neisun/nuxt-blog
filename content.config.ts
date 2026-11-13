import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'

export default defineContentConfig({
  collections: {
    posts: defineCollection({
      type: 'page',
      source: 'posts/**/*.md',
      // 声明你 frontmatter 里用到的字段，它们会被提升到顶层
      schema: z.object({
        title: z.string(),
        date: z.string(),
        slug: z.number(),
        description: z.string().optional(),
        image: z.string().optional(),
        tags: z.array(z.string()).nullable().optional(),
        categories: z.array(z.string()).optional(),
      }),
    }),
  },
})
