<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- 加载状态 -->
    <div v-if="loading" class="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl">
        <div class="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p class="mt-4 text-gray-600 dark:text-gray-300">加载中...</p>
      </div>
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
      <p class="font-medium">{{ error }}</p>
    </div>

    <template v-if="article">
      <div class="container mx-auto px-4 py-8 mt-20">
        <!-- 返回按钮 -->
        <button 
          class="btn btn-circle mb-6 bg-white hover:bg-gray-100 shadow-lg text-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
          @click="router.push('/articles')"
        >
          <icon-arrow-left class="w-6 h-6" />
        </button>

        <!-- 文章内容卡片 -->
        <div class="card bg-white dark:bg-gray-800 shadow-xl">
          <div class="card-body p-8">
            <!-- 文章标题和元信息 -->
            <div class="mb-8">
              <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {{ article.title }}
              </h1>
              <div class="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400">
                <div class="flex items-center gap-2">
                  <icon-calendar class="w-4 h-4" />
                  <span>{{ article.publishDate }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <icon-eye class="w-4 h-4" />
                  <span>{{ article.views }} 阅读</span>
                </div>
                <div class="flex items-center gap-2">
                  <icon-tag class="w-4 h-4" />
                  <span class="px-2 py-0.5 rounded-full text-sm" 
                    :class="article.type === 'long' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'"
                  >
                    {{ article.type === 'long' ? '长文' : '短文' }}
                  </span>
                </div>
                <div v-if="article.type === 'long'" class="flex items-center gap-2">
                  <icon-book class="w-4 h-4" />
                  <span>{{ article.sections?.length || 0 }} 章节</span>
                </div>
              </div>
            </div>

            <!-- 文章内容区 -->
            <div class="flex gap-8">
              <!-- 左侧章节导航 -->
              <div v-if="article.type === 'long'" class="w-64 shrink-0">
                <div class="sticky top-24">
                  <h3 class="text-lg font-bold mb-4 text-gray-900 dark:text-white">目录</h3>
                  <div class="space-y-1">
                    <button
                      v-for="section in article.sections"
                      :key="section.id"
                      class="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors"
                      :class="[
                        currentSectionId === section.id 
                          ? 'bg-primary/10 text-primary font-medium' 
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      ]"
                      @click="currentSectionId = section.id"
                    >
                      {{ section.title }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- 右侧文章内容 -->
              <div class="flex-1 min-w-0">
                <!-- 章节标题 -->
                <h2 v-if="currentSection?.title" class="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
                  {{ currentSection.title }}
                </h2>

                <!-- 文章内容 -->
                <div class="prose prose-lg dark:prose-invert max-w-none">
                  <div v-html="renderedContent"></div>
                </div>

                <!-- 章节导航按钮 -->
                <div v-if="article.type === 'long'" class="flex justify-between mt-8">
                  <button
                    v-if="currentSectionId > 1"
                    class="btn btn-outline gap-2"
                    @click="currentSectionId--"
                  >
                    <icon-arrow-left class="w-4 h-4" />
                    上一章
                  </button>
                  <div v-else class="flex-1" />
                  
                  <button
                    v-if="currentSectionId < article.sections.length"
                    class="btn btn-outline gap-2"
                    @click="currentSectionId++"
                  >
                    下一章
                    <icon-arrow-right class="w-4 h-4" />
                  </button>
                </div>

                <!-- 标签列表 -->
                <div class="flex flex-wrap gap-2 mt-8">
                  <span 
                    v-for="tag in article.tags" 
                    :key="tag"
                    class="px-3 py-1 rounded-full text-sm bg-primary/10 text-primary"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { getArticleById } from '../data/articles'

const router = useRouter()
const route = useRoute()
const article = ref(null)
const currentSectionId = ref(1)
const loading = ref(true)
const error = ref(null)

// 当前章节内容
const currentSection = computed(() => {
  if (!article.value) return null
  
  if (article.value.type === 'long') {
    return article.value.sections.find(s => s.id === currentSectionId.value)
  }
  
  return {
    title: article.value.title,
    content: article.value.content
  }
})

// 渲染Markdown内容
const renderedContent = computed(() => {
  if (!currentSection.value?.content) return ''
  
  try {
    const renderer = new marked.Renderer()
    marked.setOptions({
      renderer,
      gfm: true,
      breaks: true,
      sanitize: false
    })
    
    const html = marked(currentSection.value.content)
    return DOMPurify.sanitize(html)
  } catch (err) {
    console.error('Markdown渲染错误:', err)
    error.value = '内容渲染失败'
    return ''
  }
})

// 加载文章数据
const loadArticle = async () => {
  loading.value = true
  error.value = null
  
  try {
    const id = parseInt(route.params.id)
    if (isNaN(id)) {
      throw new Error('无效的文章ID')
    }

    const data = getArticleById(id)
    if (!data) {
      throw new Error('文章不存在')
    }

    article.value = data
    currentSectionId.value = 1
  } catch (err) {
    console.error('加载文章失败:', err)
    error.value = err.message
    router.push('/articles')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadArticle()
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

.prose :deep(img) {
  @apply rounded-lg my-6 max-w-full mx-auto;
}
</style> 