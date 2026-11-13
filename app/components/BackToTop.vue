<script setup lang="ts">
const show = ref(false)

const onScroll = () => {
  show.value = window.scrollY > window.innerHeight
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="translate-y-2 opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-2 opacity-0"
  >
    <button
      v-if="show"
      type="button"
      aria-label="返回顶部"
      class="fixed bottom-6 right-4 z-40 flex size-10 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:bottom-8 sm:right-6"
      @click="scrollToTop"
    >
      <UIcon name="i-lucide-arrow-up" class="size-5" />
    </button>
  </Transition>
</template>
