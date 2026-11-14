<script setup lang="ts">
import type { UserProps } from '@nuxt/ui'
const authors = ref<UserProps[]>([
  {
    name: '胡乃嵩',
    description: 'hunaisong',
    avatar: {
      src: '/images/avatar.png',
      loading: 'lazy',
    },
  },
])

// 首页个人品牌区
const roles = [
  { label: '前端开发者', color: 'primary' },
  { label: '全栈开发者', color: 'secondary' },
  { label: 'AI 开发者', color: 'info' },
  { label: '开源爱好者', color: 'success' },
] as const

// 微信二维码弹窗
const showWechat = ref(false)

// 首页 Hero 背景图
const heroImage = '/images/wallhaven-exyo5o_2304x1536.png'

// 向下滚动到文章列表
const scrollToPosts = () => {
  document.getElementById('posts')?.scrollIntoView({ behavior: 'smooth' })
}

// 页面级 SEO
const { origin } = useRequestURL()
useSeoMeta({
  ogUrl: () => `${origin}/`,
  ogImage: () => `${origin}/images/avatar.png`,
})
useHead({
  link: [{ rel: 'canonical', href: `${origin}/` }],
})

// 分页
const page = ref(1)
const pageSize = 10

const { data } = await useAsyncData(
  'posts',
  async () => {
    const [list, total] = await Promise.all([
      queryCollection('posts')
        .order('date', 'DESC')
        .skip((page.value - 1) * pageSize)
        .limit(pageSize)
        .all(),
      queryCollection('posts').count(),
    ])
    return { list, total }
  },
  { watch: [page] },
)

const posts = computed(() => data.value?.list ?? [])
const total = computed(() => Number(data.value?.total ?? 0))
</script>

<template>
  <div>
    <!-- 全屏 Hero 背景图 -->
    <section class="relative flex min-h-screen items-center justify-center overflow-hidden">
      <img :src="heroImage" alt="" class="absolute inset-0 h-full w-full object-cover" />
      <div
        class="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-white dark:to-gray-950"
      />

      <div class="relative z-10 mx-auto w-full max-w-3xl px-4 py-24 text-center">
        <UAvatar src="/images/avatar.png" alt="胡乃嵩" size="2xl" class="ring-2 ring-white/60" />
        <h1 class="mt-4 text-3xl font-bold text-white sm:text-4xl">胡乃嵩</h1>
        <div class="mt-3 flex flex-wrap justify-center gap-2">
          <UBadge v-for="role in roles" :key="role.label" :color="role.color" variant="solid">
            {{ role.label }}
          </UBadge>
        </div>
        <p class="mx-auto mt-4 max-w-md leading-relaxed text-white/80">
          记录现代前端、服务端开发与 AI 应用方向的实践与思考。
        </p>
        <div class="mt-6 flex items-center justify-center gap-1">
          <UButton
            icon="i-simple-icons-github"
            variant="ghost"
            size="sm"
            to="https://github.com/Neisun"
            target="_blank"
            aria-label="GitHub"
            class="text-white/80 hover:text-white"
          />
          <UButton
            icon="i-lucide-mail"
            variant="ghost"
            size="sm"
            to="mailto:hunaisong@163.com"
            aria-label="邮箱"
            class="text-white/80 hover:text-white"
          />
          <UButton
            icon="i-lucide-message-circle"
            variant="ghost"
            size="sm"
            aria-label="微信"
            class="text-white/80 hover:text-white"
            @click="showWechat = true"
          />
        </div>
      </div>

      <!-- 向下滚动引导（鼠标滚轮指示器） -->
      <a
        class="absolute bottom-8 left-1/2 z-10 flex h-10 w-6 -translate-x-1/2 items-start justify-center rounded-full border-2 border-gray-800/70 p-1.5 transition-colors hover:border-gray-800 dark:border-white/70 dark:hover:border-white"
        aria-label="向下滚动"
        @click.prevent="scrollToPosts"
      >
        <span class="scroll-dot size-1.5 rounded-full bg-gray-800 dark:bg-white" />
      </a>
    </section>

    <!-- 文章列表 -->
    <div id="posts" class="mx-auto max-w-3xl px-4 py-8 lg:py-12">
      <UBlogPosts orientation="vertical">
        <UBlogPost
          v-for="post in posts"
          :key="post.slug"
          orientation="horizontal"
          variant="outline"
          :title="post.title"
          :description="post.description"
          :image="post.image"
          :date="post.date"
          :to="`/posts/${post.slug}`"
          :authors="authors"
        />
      </UBlogPosts>

      <!-- 分页 -->
      <div class="mt-10 flex justify-center">
        <UPagination v-model:page="page" :total="total" :items-per-page="pageSize" />
      </div>
    </div>
  </div>

  <!-- 微信二维码弹窗 -->
  <div
    v-if="showWechat"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    @click="showWechat = false"
  >
    <div class="w-full max-w-xs rounded-xl bg-default p-6 text-center shadow-lg" @click.stop>
      <p class="text-sm font-medium text-default">微信扫一扫</p>
      <img
        src="/images/Wechat.png"
        alt="微信二维码"
        class="mx-auto mt-4 h-48 w-48 rounded-lg object-cover"
      />
      <p class="mt-4 text-xs text-muted">微信号：Neisun_HU</p>
    </div>
  </div>
</template>
