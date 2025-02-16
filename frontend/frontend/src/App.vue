<template>
  <div :class="backgroundClass">
    <nav-bar />
    <router-view />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const backgroundClass = computed(() => {
  const routesWithCustomBg = ['/custom-page1', '/custom-page2']
  return routesWithCustomBg.includes(route.path)
    ? ''
    : 'bg-general'
})
</script>

<style>
.bg-general {
  background-size: cover;
  background-position: center;
  min-height: 100vh;
}
</style>