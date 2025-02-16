<template>
  <div class="card w-full max-w-4xl mx-auto rounded-2xl shadow-2xl 
      bg-white/20 backdrop-blur-xl
      border border-white/20
      hover:backdrop-blur-2xl transition-all
      dark:bg-gray-800/20 dark:border-gray-800/30">
    
    <div class="card-body p-8 space-y-6">
      <!-- 文章标题 -->
      <div class="space-y-2">
        <h1 class="text-4xl font-bold text-gray-800 dark:text-white">
          {{ article.title }}
        </h1>
        <h2 v-if="currentChapter" class="text-2xl text-gray-600 dark:text-gray-300">
          {{ currentChapter.title }}
        </h2>
      </div>

      <!-- 文章元信息 -->
      <div class="flex items-center gap-4 text-gray-600 dark:text-gray-300">
        <div class="flex items-center gap-2">
          <icon-calendar class="w-4 h-4" />
          <span>{{ article.publishDate }}</span>
        </div>
        <div class="flex items-center gap-2">
          <icon-eye class="w-4 h-4" />
          <span>{{ article.views }} 阅读</span>
        </div>
        <div class="flex items-center gap-2">
          <icon-book class="w-4 h-4" />
          <span>{{ article.sections.length }} 章节</span>
        </div>
        <div class="flex items-center gap-2">
          <icon-tag class="w-4 h-4" />
          <span class="px-2 py-0.5 rounded-full text-sm bg-purple-100 text-purple-800">
            长文
          </span>
        </div>
      </div>

      <!-- 文章内容 -->
      <div class="prose prose-lg dark:prose-invert max-w-none">
        <div v-html="renderedContent"></div>
      </div>

      <!-- 章节导航按钮 -->
      <div class="flex justify-between pt-8">
        <button
          v-if="currentChapterId > 1"
          class="btn btn-outline gap-2"
          @click="changeChapter(currentChapterId - 1)"
        >
          <icon-arrow-left class="w-4 h-4" />
          上一章
        </button>
        <div v-else class="flex-1" />
        
        <button
          v-if="currentChapterId < article.sections.length"
          class="btn btn-outline gap-2"
          @click="changeChapter(currentChapterId + 1)"
        >
          下一章
          <icon-arrow-right class="w-4 h-4" />
        </button>
      </div>

      <!-- 标签列表 -->
      <div class="flex flex-wrap gap-2 pt-4">
        <span 
          v-for="tag in article.tags" 
          :key="tag"
          class="px-3 py-1 rounded-full text-sm bg-primary/10 text-primary dark:bg-primary/20"
        >
          {{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { marked } from 'marked'

const props = defineProps({
  article: {
    type: Object,
    required: true
  }
})

const currentChapterId = ref(1)

// 当前章节
const currentChapter = computed(() => {
  return props.article.sections.find(c => c.id === currentChapterId.value)
})

// 渲染Markdown内容
const renderedContent = computed(() => {
  if (!currentChapter.value) return ''
  
  const renderer = new marked.Renderer()
  renderer.heading = (text, level) => {
    const slug = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    return `<h${level} id="${slug}">${text}</h${level}>`
  }
  
  marked.setOptions({
    renderer,
    headerIds: true,
    gfm: true
  })
  
  return marked(currentChapter.value.content)
})

// 切换章节
const changeChapter = (chapterId) => {
  currentChapterId.value = chapterId
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 导出方法供父组件使用
defineExpose({
  changeChapter
})
</script>

<style scoped>
.prose {
  @apply text-gray-800 dark:text-gray-200;
}

.prose :deep(h1) {
  @apply text-4xl font-bold mb-8 mt-12 text-gray-900 dark:text-white;
}

.prose :deep(h2) {
  @apply text-3xl font-semibold mb-6 mt-10 text-gray-800 dark:text-gray-100;
}

.prose :deep(h3) {
  @apply text-2xl font-medium mb-4 mt-8 text-gray-700 dark:text-gray-200;
}

.prose :deep(p) {
  @apply text-lg leading-relaxed mb-6 text-gray-700 dark:text-gray-300;
}

.prose :deep(ul),
.prose :deep(ol) {
  @apply my-6 ml-6;
}

.prose :deep(li) {
  @apply mb-2 text-gray-700 dark:text-gray-300;
}

.prose :deep(pre) {
  @apply bg-gray-900 text-gray-200 p-6 rounded-xl my-6 overflow-x-auto;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.prose :deep(code) {
  @apply bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded font-mono text-sm;
}

.prose :deep(pre code) {
  @apply bg-transparent p-0 text-base;
}

.prose :deep(blockquote) {
  @apply border-l-4 border-primary pl-4 italic my-6 text-gray-700 dark:text-gray-300;
}

.prose :deep(a) {
  @apply text-primary hover:text-primary/80 underline transition-colors;
}

.prose :deep(table) {
  @apply w-full my-6 border-collapse;
}

.prose :deep(th),
.prose :deep(td) {
  @apply border border-gray-300 dark:border-gray-700 px-4 py-2;
}

.prose :deep(th) {
  @apply bg-gray-100 dark:bg-gray-800;
}

.prose :deep(img) {
  @apply rounded-lg my-6 max-w-full mx-auto;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.prose :deep(hr) {
  @apply my-8 border-gray-300 dark:border-gray-700;
}
</style> 