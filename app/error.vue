<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const isNotFound = computed(() => props.error?.statusCode === 404)

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div
    class="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center"
  >
    <p class="text-8xl font-bold text-primary">
      {{ error?.statusCode ?? 500 }}
    </p>
    <h1 class="mt-4 text-2xl font-semibold">
      {{ isNotFound ? '页面不存在' : '出错了' }}
    </h1>
    <p class="mt-2 max-w-md leading-relaxed text-muted">
      {{
        isNotFound
          ? '你访问的页面可能已被删除或移动，试试返回首页吧。'
          : '服务器开小差了，请稍后再试。'
      }}
    </p>
    <div class="mt-8 flex items-center gap-3">
      <UButton to="/" icon="i-lucide-home">返回首页</UButton>
      <UButton
        v-if="!isNotFound"
        color="neutral"
        variant="outline"
        icon="i-lucide-rotate-ccw"
        @click="handleError"
      >
        重新加载
      </UButton>
    </div>
  </div>
</template>
