<script setup lang="ts">
// 导航项目
const navigation = [
  { label: '首页', to: '/' },
  { label: '标签', to: '/tags' },
  { label: '归档', to: '/archives' },
  { label: '友链', to: '/friends' },
  { label: '关于', to: '/about' },
]

// 全站文章（用于搜索，只取必要字段）
const { data: posts } = await useAsyncData('search-posts', () =>
  queryCollection('posts').select('title', 'slug', 'tags', 'date').order('date', 'DESC').all(),
)

// 搜索项：文章列表，选中后通过 `to` 跳转详情页
const searchGroups = computed(() => [
  {
    id: 'posts',
    label: '文章',
    items: (posts.value ?? []).map((p) => ({
      id: p.slug,
      label: p.title,
      description: (p.tags ?? []).join(' · '),
      suffix: p.date?.slice(0, 10),
      icon: 'i-lucide-file-text',
      to: `/posts/${p.slug}`,
    })),
  },
])
</script>

<template>
  <UHeader title="胡乃嵩的博客">
    <template #right>
      <nav class="flex items-center gap-1">
        <ULink
          v-for="item in navigation"
          :key="item.to"
          :to="item.to"
          class="rounded-md px-2.5 py-1.5 text-sm transition-colors"
          active-class="bg-elevated/50 font-medium text-default"
          inactive-class="text-muted hover:text-default"
        >
          {{ item.label }}
        </ULink>

        <UContentSearchButton label="搜索" />

        <UColorModeButton />
      </nav>
    </template>
  </UHeader>

  <UContentSearch
    :groups="searchGroups"
    :fuse="{ matchAllWhenSearchEmpty: false, resultLimit: 20 }"
    :color-mode="false"
    title="搜索文章"
    placeholder="搜索文章..."
    :ui="{ root: 'h-full' }"
  >
    <template #empty="{ searchTerm }">
      {{ searchTerm ? `没有找到与「${searchTerm}」相关的文章` : '输入关键词开始搜索' }}
    </template>
  </UContentSearch>
  <UMain>
    <slot />
  </UMain>
  <UFooter>
    <template #default>
      <div class="flex flex-col items-center gap-2 text-center">
        <p class="text-sm text-muted">© 2026 胡乃嵩的博客 · Powered by Nuxt</p>
        <p class="text-sm text-muted flex items-center gap-1">
          <img src="/images/beian.png" class="w-5 h-5" alt="" />
          备案号:
          <ULink to="https://beian.miit.gov.cn/#/Integrated/index" external target="_blank"
            >辽ICP备2026023712号</ULink
          >
        </p>
      </div>
    </template>
  </UFooter>
</template>

<style scoped></style>
