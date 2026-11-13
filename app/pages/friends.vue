<script setup lang="ts">
useSeoMeta({
  title: '友链',
  description: '友情链接，欢迎交换友链，一起记录与分享。',
})

const friends = [
  {
    name: '阮一峰的网络日志',
    url: 'https://www.ruanyifeng.com/blog/',
    description: '科技爱好者周刊，持续分享互联网与前端技术。',
    avatar: 'https://www.ruanyifeng.com/favicon.ico',
  },
  {
    name: '张鑫旭的博客',
    url: 'https://www.zhangxinxu.com/',
    description: '专注 CSS 与前端开发，十年如一日，干货满满。',
    avatar: 'https://www.zhangxinxu.com/favicon.ico',
  },
  {
    name: 'Vue.js 中文文档',
    url: 'https://cn.vuejs.org/',
    description: '渐进式 JavaScript 框架官方中文文档。',
    avatar: 'https://cn.vuejs.org/logo.svg',
  },
]
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-8 lg:py-12">
    <!-- 头部 -->
    <section>
      <h1 class="text-3xl font-bold">友链</h1>
      <p class="mt-3 leading-relaxed text-muted">
        这里是一些我常读的站点与朋友们的博客，欢迎交换友链。
      </p>
    </section>

    <!-- 友链列表 -->
    <section class="mt-10">
      <h2 class="flex items-center gap-2 text-lg font-semibold text-default">
        <UIcon name="i-lucide-link" />
        <span>友情链接</span>
      </h2>
      <div class="mt-4 grid gap-3 sm:grid-cols-2">
        <ULink
          v-for="friend in friends"
          :key="friend.url"
          :to="friend.url"
          target="_blank"
          class="flex items-start gap-4 rounded-lg border border-default/10 bg-elevated/50 p-4 transition-colors hover:border-primary/40"
        >
          <UAvatar :src="friend.avatar" :alt="friend.name" size="lg" />
          <div class="min-w-0">
            <p class="flex items-center gap-1 text-sm font-medium text-default">
              <span class="truncate">{{ friend.name }}</span>
              <UIcon name="i-lucide-arrow-up-right" class="size-3 shrink-0 text-muted" />
            </p>
            <p class="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">
              {{ friend.description }}
            </p>
          </div>
        </ULink>
      </div>
    </section>

    <!-- 申请友链 -->
    <section class="mt-10 rounded-2xl border border-default/10 bg-elevated/50 p-8">
      <h2 class="flex items-center gap-2 text-lg font-semibold text-default">
        <UIcon name="i-lucide-handshake" />
        <span>申请友链</span>
      </h2>
      <p class="mt-3 leading-relaxed text-muted">欢迎交换友链，申请前请确认满足以下条件：</p>
      <ul class="mt-3 space-y-2 text-sm leading-relaxed text-muted">
        <li class="flex items-center gap-2">
          <UIcon name="i-lucide-check" class="size-4 shrink-0 text-primary" />
          站点内容原创、稳定更新
        </li>
        <li class="flex items-center gap-2">
          <UIcon name="i-lucide-check" class="size-4 shrink-0 text-primary" />
          已添加本站链接
        </li>
        <li class="flex items-center gap-2">
          <UIcon name="i-lucide-check" class="size-4 shrink-0 text-primary" />
          无违法、违规内容
        </li>
      </ul>
      <p class="mt-4 leading-relaxed text-muted">
        满足条件后，请通过邮箱
        <ULink to="mailto:hunaisong@163.com" class="font-medium text-primary hover:underline">
          hunaisong@163.com
        </ULink>
        联系，注明「友链申请」。
      </p>
    </section>
  </div>
</template>
