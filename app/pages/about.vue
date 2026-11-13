<script setup lang="ts">
const { data: posts } = await useAsyncData('posts-about', () => queryCollection('posts').all())

// 定位标签（柔和多色彩）
const roles = [
  { label: '前端开发者', color: 'primary' },
  { label: '全栈开发者', color: 'secondary' },
  { label: 'AI 开发者', color: 'info' },
  { label: '开源爱好者', color: 'success' },
] as const

// 本站统计
const stats = computed(() => {
  const list = posts.value ?? []
  const tags = new Set<string>()
  const categories = new Set<string>()
  for (const p of list) {
    for (const t of p.tags ?? []) tags.add(t)
    for (const c of p.categories ?? []) categories.add(c)
  }
  return { posts: list.length, tags: tags.size, categories: categories.size }
})
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-8 lg:py-12">
    <!-- 头部卡片 -->
    <section class="rounded-2xl border border-default/10 bg-elevated/50 p-8">
      <div class="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
        <UAvatar src="/images/avatar.jpg" alt="胡乃嵩" size="2xl" />
        <div class="text-center sm:text-left">
          <h1 class="text-3xl font-bold">胡乃嵩</h1>
          <div class="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
            <UBadge v-for="role in roles" :key="role.label" :color="role.color" variant="subtle">
              {{ role.label }}
            </UBadge>
          </div>
        </div>
      </div>

      <p class="mt-6 leading-relaxed text-muted">
        我是胡乃嵩，一名前端与全栈开发者，兼修 AI
        应用，热爱开源。这个博客记录我在现代前端、服务端开发与 AI 应用方向的实践与思考。
      </p>
    </section>

    <!-- 联系我 -->
    <section class="mt-10">
      <h2 class="flex items-center gap-2 text-lg font-semibold text-default">
        <UIcon name="i-lucide-at-sign" />
        <span>联系我</span>
      </h2>
      <div class="mt-4 grid gap-3 sm:grid-cols-3">
        <ULink
          to="https://github.com/Neisun"
          target="_blank"
          class="flex items-center gap-3 rounded-lg border border-default/10 bg-elevated/50 p-4 transition-colors hover:border-primary/40"
        >
          <UIcon name="i-simple-icons-github" class="size-5 text-muted" />
          <div>
            <p class="text-xs text-muted">GitHub</p>
            <p class="mt-0.5 text-sm font-medium text-default">Neisun</p>
          </div>
        </ULink>

        <ULink
          to="mailto:hunaisong@163.com"
          class="flex items-center gap-3 rounded-lg border border-default/10 bg-elevated/50 p-4 transition-colors hover:border-primary/40"
        >
          <UIcon name="i-lucide-mail" class="size-5 text-muted" />
          <div>
            <p class="text-xs text-muted">邮箱</p>
            <p class="mt-0.5 break-all text-sm font-medium text-default">hunaisong@163.com</p>
          </div>
        </ULink>

        <div class="flex items-center gap-3 rounded-lg border border-default/10 bg-elevated/50 p-4">
          <UIcon name="i-lucide-message-circle" class="size-5 text-muted" />
          <div>
            <p class="text-xs text-muted">微信号</p>
            <p class="mt-0.5 text-sm font-medium text-default">Neisun_HU</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 本站数据 -->
    <section class="mt-10">
      <h2 class="flex items-center gap-2 text-lg font-semibold text-default">
        <UIcon name="i-lucide-chart-column" />
        <span>本站数据</span>
      </h2>
      <div class="mt-4 grid grid-cols-3 gap-4">
        <div class="rounded-lg border border-default/10 bg-elevated/50 p-4 text-center">
          <p class="text-2xl font-bold text-default">{{ stats.posts }}</p>
          <p class="mt-1 text-xs text-muted">文章</p>
        </div>
        <div class="rounded-lg border border-default/10 bg-elevated/50 p-4 text-center">
          <p class="text-2xl font-bold text-default">{{ stats.tags }}</p>
          <p class="mt-1 text-xs text-muted">标签</p>
        </div>
        <div class="rounded-lg border border-default/10 bg-elevated/50 p-4 text-center">
          <p class="text-2xl font-bold text-default">{{ stats.categories }}</p>
          <p class="mt-1 text-xs text-muted">分类</p>
        </div>
      </div>
    </section>
  </div>
</template>
