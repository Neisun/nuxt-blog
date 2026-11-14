<script setup lang="ts">
const props = defineProps<{
  pageKey: string
  pageTitle?: string
}>()

const { artalk } = useRuntimeConfig().public
const el = ref<HTMLElement>()

type ArtalkInstance = { destroy?: () => void }
type ArtalkGlobal = {
  init: (options: Record<string, unknown>) => ArtalkInstance
}

let instance: ArtalkInstance | undefined

onMounted(() => {
  if (!artalk.server || !artalk.site || !el.value) return

  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = `${artalk.server}/dist/Artalk.css`
  document.head.appendChild(link)

  const script = document.createElement('script')
  script.src = `${artalk.server}/dist/Artalk.js`
  script.onload = () => {
    const Artalk = (window as Window & { Artalk?: ArtalkGlobal }).Artalk
    if (!Artalk) return
    instance = Artalk.init({
      el: el.value,
      server: artalk.server,
      site: artalk.site,
      pageKey: props.pageKey,
      pageTitle: props.pageTitle,
      darkMode: 'auto',
      emoticons: 'https://fastly.jsdelivr.net/gh/ArtalkJS/Emoticons/grps/default.json',
    })
  }
  document.body.appendChild(script)
})

onBeforeUnmount(() => {
  instance?.destroy?.()
})
</script>

<template>
  <div ref="el" />
</template>
