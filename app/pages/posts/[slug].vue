<script setup lang="ts">
const route = useRoute()
const slug = Number(route.params.slug)

const { data: post } = await useAsyncData(`post-${slug}`, async () => {
  return queryCollection('posts').where('slug', '=', slug).first()
})

const { origin } = useRequestURL()
const pageUrl = computed(() => `${origin}${route.path}`)

type SurroundLink = { title: string; description?: string; path: string }

const { data: surround } = await useAsyncData<SurroundLink[]>(`surround-${slug}`, async () => {
  const list = await queryCollection('posts').order('slug', 'ASC').all()
  const index = list.findIndex((p) => p.slug === slug)
  if (index === -1) return []

  const toLink = (p?: (typeof list)[number]): SurroundLink | null =>
    p
      ? {
          title: p.title,
          description: p.description,
          path: `/posts/${p.slug}`,
        }
      : null

  // [上一篇（时间更早）, 下一篇（时间更晚）]
  return [toLink(list[index - 1]), toLink(list[index + 1])] as SurroundLink[]
})

// 相关文章推荐：按相同分类/标签匹配，排除当前篇
const { data: related } = await useAsyncData(`related-${slug}`, async () => {
  const all = await queryCollection('posts').all()
  const current = all.find((p) => p.slug === slug)
  if (!current) return []

  return all
    .filter((p) => p.slug !== slug)
    .filter(
      (p) =>
        p.categories?.some((c) => current.categories?.includes(c)) ||
        p.tags?.some((t) => current.tags?.includes(t)),
    )
    .slice(0, 4)
})

// 作者信息（与首页一致）
const author = {
  name: '胡乃嵩',
  avatar: { src: '/images/avatar.jpg', alt: '胡乃嵩' },
}

// 格式化发布时间：2017-07-12 14:15:29 -> 2017年7月12日
const formatDate = (date?: string) => {
  if (!date) return ''
  const normalized = date.includes('T') ? date : date.replace(' ', 'T')
  const d = new Date(normalized)
  if (Number.isNaN(d.getTime())) return date.slice(0, 10)
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

// SEO 元信息
useSeoMeta({
  title: () => post.value?.title || '文章',
  description: () => post.value?.description,
  ogTitle: () => post.value?.title,
  ogDescription: () => post.value?.description,
  ogType: 'article',
  ogImage: () => (post.value?.image ? `${origin}${post.value.image}` : undefined),
  articlePublishedTime: () => post.value?.date,
  twitterCard: 'summary_large_image',
})

// 阅读进度条
const progress = ref(0)
const onScroll = () => {
  const el = document.documentElement
  const height = el.scrollHeight - el.clientHeight
  progress.value = height > 0 ? (window.scrollY / height) * 100 : 0
}
onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

// 分享
const copied = ref(false)
const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(pageUrl.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    // 忽略复制失败
  }
}
const shareLinks = computed(() => {
  const url = encodeURIComponent(pageUrl.value)
  const title = encodeURIComponent(post.value?.title || '')
  return {
    weibo: `https://service.weibo.com/share/share.php?url=${url}&title=${title}`,
    twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
  }
})

// 微信分享：生成二维码，扫码后在微信内打开分享
const showWechat = ref(false)
const qrDataUrl = ref('')

const openWechat = async () => {
  showWechat.value = true
  if (!qrDataUrl.value) {
    try {
      const QRCode = (await import('qrcode')).default
      qrDataUrl.value = await QRCode.toDataURL(pageUrl.value, {
        width: 300,
        margin: 1,
      })
    } catch {
      // 忽略二维码生成失败
    }
  }
}
</script>

<template>
  <!-- 阅读进度条 -->
  <div
    class="fixed inset-x-0 top-0 z-50 h-0.5 bg-primary transition-all duration-150"
    :style="{ width: `${progress}%` }"
  />

  <UPage v-if="post" class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8" :ui="{ center: 'min-w-0' }">
    <!-- 面包屑 -->
    <UBreadcrumb :items="[{ label: '首页', to: '/' }, { label: post.title }]" class="m-4" />

    <!-- 封面图 -->
    <img
      v-if="post.image"
      :src="post.image"
      :alt="post.title"
      class="mb-6 aspect-video w-full rounded-xl object-cover"
    />

    <UPageHeader :title="post.title" :description="post.description">
      <div class="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted">
        <div class="flex items-center gap-2">
          <UAvatar :src="author.avatar.src" :alt="author.name" size="xs" />
          <span class="font-medium text-default">{{ author.name }}</span>
        </div>

        <div class="flex items-center gap-1.5">
          <UIcon name="i-lucide-calendar" />
          <time :datetime="post.date">{{ formatDate(post.date) }}</time>
        </div>

        <div v-if="post.categories?.length" class="flex items-center gap-1.5">
          <UIcon name="i-lucide-folder" />
          <UBadge
            v-for="category in post.categories"
            :key="category"
            color="neutral"
            variant="subtle"
          >
            {{ category }}
          </UBadge>
        </div>

        <div v-if="post.tags?.length" class="flex items-center gap-1.5">
          <UIcon name="i-lucide-tag" />
          <UBadge v-for="tag in post.tags" :key="tag" color="primary" variant="subtle">
            {{ tag }}
          </UBadge>
        </div>
      </div>
    </UPageHeader>

    <UPageBody>
      <ContentRenderer :value="post" />

      <!-- 分享 -->
      <div class="flex flex-wrap items-center gap-2">
        <UButton icon="i-lucide-link" variant="outline" color="neutral" size="sm" @click="copyLink">
          {{ copied ? '已复制' : '复制链接' }}
        </UButton>
        <UButton
          icon="i-lucide-qr-code"
          variant="outline"
          color="neutral"
          size="sm"
          @click="openWechat"
        >
          微信
        </UButton>
        <UButton
          icon="i-lucide-share-2"
          variant="outline"
          color="neutral"
          size="sm"
          :to="shareLinks.weibo"
          target="_blank"
        >
          微博
        </UButton>
        <UButton
          icon="i-lucide-twitter"
          variant="outline"
          color="neutral"
          size="sm"
          :to="shareLinks.twitter"
          target="_blank"
        >
          推特
        </UButton>
      </div>

      <!-- 版权声明 -->
      <div class="rounded-lg border border-default/10 bg-elevated/50 p-4 text-sm text-muted">
        <div class="flex items-center gap-2 font-medium text-default">
          <span class="text-base leading-none">©</span>
          <span>版权声明</span>
        </div>
        <p class="mt-2">
          本文由 <span class="text-default">{{ author.name }}</span>
          原创，转载或引用请注明出处与原文链接。
        </p>
      </div>

      <USeparator />

      <!-- 相关文章 -->
      <div v-if="related?.length" class="space-y-4">
        <div class="flex items-center gap-2 text-lg font-semibold text-default">
          <UIcon name="i-lucide-book-open" />
          <span>相关文章</span>
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <ULink
            v-for="item in related"
            :key="item.slug"
            :to="`/posts/${item.slug}`"
            class="group rounded-lg border border-default/10 bg-elevated/50 p-4 transition-colors hover:border-primary/40"
          >
            <p class="line-clamp-2 font-medium text-default group-hover:text-primary">
              {{ item.title }}
            </p>
            <p class="mt-1 text-xs text-muted">{{ formatDate(item.date) }}</p>
          </ULink>
        </div>
      </div>

      <UContentSurround :surround="surround ?? []" />
    </UPageBody>

    <template #right>
      <UContentToc :links="post.body.toc?.links" />
    </template>
  </UPage>

  <!-- 文章不存在 -->
  <div
    v-else
    class="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-24 text-center"
  >
    <p class="text-7xl font-bold text-primary">404</p>
    <h1 class="mt-4 text-2xl font-semibold text-default">文章不存在</h1>
    <p class="mt-2 max-w-md leading-relaxed text-muted">
      你访问的文章可能已被删除或链接有误，返回首页看看其他内容吧。
    </p>
    <UButton to="/" icon="i-lucide-home" size="lg" class="mt-8"> 返回首页 </UButton>
  </div>

  <!-- 微信分享二维码弹窗 -->
  <div
    v-if="showWechat"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    @click="showWechat = false"
  >
    <div class="w-full max-w-xs rounded-xl bg-default p-6 text-center shadow-lg" @click.stop>
      <p class="text-sm font-medium text-default">微信扫一扫分享</p>
      <img
        v-if="qrDataUrl"
        :src="qrDataUrl"
        alt="微信分享二维码"
        class="mx-auto mt-4 h-48 w-48 rounded-lg"
      />
      <p v-else class="mt-4 text-xs text-muted">二维码生成中…</p>
      <p class="mt-4 break-all text-xs text-muted">{{ pageUrl }}</p>
    </div>
  </div>
</template>
