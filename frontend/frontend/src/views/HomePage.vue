<template>
    <section class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <router-link
        v-for="topic in topics"
        :key="topic.id"
        :to="topic.path"
        class="p-6 bg-yellow-100 shadow rounded-md text-center hover:shadow-lg transition"
      >
        {{ topic.name }}
      </router-link>
    </section>
  </template>
  
  <script setup>
  const topics = [
    { id: 1, name: '主题 A', path: '/topicA' },
    { id: 2, name: '主题 B', path: '/topicB' },
    // ...更多主题
  ];
  </script>
  
  <style scoped>
  /* ...existing style... */
  </style>