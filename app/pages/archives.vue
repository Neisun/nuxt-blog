<script setup lang="ts">
const { data: posts } = await useAsyncData('posts-archives', () =>
  queryCollection('posts').order('date', 'DESC').all(),
)

type PostItem = NonNullable<typeof posts.value>[number]

const grouped = computed(() => {
  const map = new Map<string, PostItem[]>()
  for (const p of posts.value ?? []) {
    const year = p.date?.slice(0, 4) || '未知'
    if (!map.has(year)) map.set(year, [])
    map.get(year)!.push(p)
  }
  return [...map.entries()].map(([year, list]) => ({
    year,
    count: list.length,
    list,
  }))
})
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-8 lg:py-12">
    <h1 class="text-3xl font-bold">归档</h1>
    <p class="mt-2 text-sm text-muted">共 {{ posts?.length ?? 0 }} 篇文章</p>

    <div class="mt-8 space-y-8">
      <section v-for="group in grouped" :key="group.year">
        <h2 class="text-xl font-semibold text-default">
          {{ group.year }}
          <span class="ml-2 text-sm font-normal text-muted"> {{ group.count }} 篇 </span>
        </h2>
        <div class="mt-3 space-y-1">
          <ULink
            v-for="p in group.list"
            :key="p.slug"
            :to="`/posts/${p.slug}`"
            class="flex items-baseline gap-4 rounded-lg px-3 py-2 transition-colors hover:bg-elevated/50"
          >
            <time class="shrink-0 text-xs text-muted">
              {{ p.date?.slice(5, 10) }}
            </time>
            <span class="text-default">{{ p.title }}</span>
          </ULink>
        </div>
      </section>
    </div>
  </div>
</template>
