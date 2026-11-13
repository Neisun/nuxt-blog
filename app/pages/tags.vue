<script setup lang="ts">
const { data: posts } = await useAsyncData('posts-tags', () =>
  queryCollection('posts').order('date', 'DESC').all(),
)

const selected = ref<{ type: 'tag' | 'category'; value: string } | null>(null)

const tags = computed(() => {
  const map = new Map<string, number>()
  for (const p of posts.value ?? []) {
    for (const t of p.tags ?? []) map.set(t, (map.get(t) ?? 0) + 1)
  }
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
})

const categories = computed(() => {
  const map = new Map<string, number>()
  for (const p of posts.value ?? []) {
    for (const c of p.categories ?? []) map.set(c, (map.get(c) ?? 0) + 1)
  }
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
})

const filteredPosts = computed(() => {
  if (!selected.value) return posts.value ?? []
  const { type, value } = selected.value
  return (posts.value ?? []).filter((p) =>
    type === 'tag' ? p.tags?.includes(value) : p.categories?.includes(value),
  )
})

const toggle = (type: 'tag' | 'category', value: string) => {
  selected.value =
    selected.value?.type === type && selected.value?.value === value ? null : { type, value }
}
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-8 lg:py-12">
    <h1 class="text-3xl font-bold">标签</h1>
    <p class="mt-2 text-sm text-muted">
      共 {{ tags.length }} 个标签 · {{ categories.length }} 个分类
    </p>

    <section class="mt-8">
      <h2 class="text-sm font-medium text-muted">分类</h2>
      <div class="mt-3 flex flex-wrap gap-2">
        <UBadge
          v-for="c in categories"
          :key="c.name"
          :color="
            selected?.type === 'category' && selected.value === c.name ? 'primary' : 'neutral'
          "
          :variant="selected?.type === 'category' && selected.value === c.name ? 'solid' : 'subtle'"
          class="cursor-pointer"
          @click="toggle('category', c.name)"
        >
          {{ c.name }}（{{ c.count }}）
        </UBadge>
      </div>
    </section>

    <section class="mt-8">
      <h2 class="text-sm font-medium text-muted">标签</h2>
      <div class="mt-3 flex flex-wrap gap-2">
        <UBadge
          v-for="t in tags"
          :key="t.name"
          :color="selected?.type === 'tag' && selected.value === t.name ? 'primary' : 'neutral'"
          :variant="selected?.type === 'tag' && selected.value === t.name ? 'solid' : 'subtle'"
          class="cursor-pointer"
          @click="toggle('tag', t.name)"
        >
          {{ t.name }}（{{ t.count }}）
        </UBadge>
      </div>
    </section>

    <section class="mt-10">
      <h2 class="text-sm font-medium text-muted">共 {{ filteredPosts.length }} 篇文章</h2>
      <div class="mt-3 space-y-3">
        <ULink
          v-for="p in filteredPosts"
          :key="p.slug"
          :to="`/posts/${p.slug}`"
          class="block rounded-lg border border-default/10 bg-elevated/50 p-4 transition-colors hover:border-primary/40"
        >
          <p class="font-medium text-default">{{ p.title }}</p>
          <p class="mt-1 text-xs text-muted">{{ p.date?.slice(0, 10) }}</p>
        </ULink>
      </div>
    </section>
  </div>
</template>
