<script setup lang="ts"></script>

<template>
  <UApp>
    <NuxtLoadingIndicator :throttle="0" />
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage></NuxtPage>
    </NuxtLayout>
  </UApp>
</template>
