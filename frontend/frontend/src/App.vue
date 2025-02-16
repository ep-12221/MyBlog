<template>
  <div class="min-h-screen">
    <!-- 导航栏 -->
    <NavBar />

    <!-- 主要内容区域 -->
    <router-view v-slot="{ Component }">
      <keep-alive :include="['HomePage', 'ArticlesView', 'AboutView']">
        <component 
          :is="Component" 
          :key="$route.fullPath"
        />
      </keep-alive>
    </router-view>
  </div>
</template>

<script setup>
import NavBar from './components/layout/nav-bar.vue'
</script>

<style>
:root {
  --primary-color: #6366f1;
}

body {
  @apply bg-gray-50 dark:bg-gray-900;
}

.btn-primary {
  background-color: var(--primary-color);
}

.text-primary {
  color: var(--primary-color);
}

.bg-primary {
  background-color: var(--primary-color);
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: var(--primary-color) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: var(--primary-color);
  border-radius: 3px;
}
</style>