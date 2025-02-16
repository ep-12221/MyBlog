<template>
  <div class="relative min-h-screen w-full">
    <!-- 加载状态 -->
    <div v-if="store.loading" class="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl">
        <div class="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p class="mt-4 text-gray-600 dark:text-gray-300">加载中...</p>
      </div>
    </div>

    <!-- 错误提示 -->
    <div 
      v-if="store.error" 
      class="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50 flex items-center gap-2"
    >
      <icon-alert-circle class="w-5 h-5" />
      <p class="font-medium">{{ store.error }}</p>
      <button 
        class="ml-2 text-red-700 hover:text-red-900"
        @click="store.error = null"
      >
        <icon-x class="w-4 h-4" />
      </button>
    </div>

    <!-- 背景层 -->
    <div 
      class="fixed inset-0 bg-cover bg-center brightness-75"
      style="background-image: url('https://picdm.sunbangyan.cn/2023/11/08/8fee6a232a4487fe90862a28ae5b3c13.png')"
    />

    <!-- 全局遮罩层（调整为左浅右深） -->
    <div class="fixed inset-0 bg-gradient-to-l from-black/20 via-transparent to-black/20" />

    <!-- 内容层 -->
    <div class="relative z-10 flex min-h-screen w-full">
      <!-- 亮度切换按钮 -->
      <button 
        class="btn btn-circle fixed top-4 right-4 shadow-lg text-white hover:bg-white/20 z-50"
        @click="isBright = !isBright"
      >
        <icon-sun v-if="isBright" class="w-6 h-6" />
        <icon-moon v-else class="w-6 h-6" />
      </button>

      <!-- 主内容区（使用 flex-row-reverse 反转布局） -->
      <div class="w-full flex flex-row-reverse">
        <!-- 右侧Hero区域（原卡片区宽度调整为7/12） -->
        <div class="w-7/12 flex items-center justify-center p-8">
          <div class="text-center space-y-6">
            <h1 class="text-6xl font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              Hello World
            </h1>
            <div
              class="text-2xl font-medium bg-gradient-to-r from-red-400 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
              Welcome to My Space
            </div>
          </div>
        </div>

        <!-- 左侧卡片区（原Hero区域宽度调整为5/12） -->
        <div class="w-5/12 p-8 flex items-center">
          <div class="card w-full max-w-2xl rounded-2xl shadow-2xl 
              bg-white/20 backdrop-blur-xl
              border border-white/20
              hover:backdrop-blur-2xl transition-all
              dark:bg-gray-800/20 dark:border-gray-800/30">
            <div class="card-body space-y-6">
              <div class="flex justify-between items-center mb-4">
                <h2 class="card-title text-3xl text-gray-800 dark:text-white">最新文章</h2>
                <div class="tabs tabs-boxed bg-white/30">
                  <button 
                    v-for="category in articleCategories" 
                    :key="category.value"
                    class="tab" 
                    :class="{ 'tab-active': currentCategory === category.value }"
                    @click="currentCategory = category.value"
                  >
                    <div class="flex items-center gap-2">
                      <component :is="category.icon" class="w-4 h-4" />
                      {{ category.name }}
                    </div>
                  </button>
                </div>
              </div>
              <div class="space-y-4">
                <div 
                  v-for="article in filteredArticles"
                  :key="article.id"
                  class="group flex items-center gap-4 p-4 hover:bg-gray-100/50 rounded-xl transition-all cursor-pointer"
                  @click="router.push({ name: 'article-detail', params: { id: article.id }})"
                >
                  <div class="w-16 h-16 rounded-lg overflow-hidden">
                    <img 
                      :src="article.coverImage" 
                      :alt="article.title"
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center gap-2">
                      <h3 class="text-lg font-semibold text-gray-800 dark:text-white group-hover:text-primary transition-colors">
                        {{ article.title }}
                      </h3>
                      <span 
                        class="px-2 py-0.5 text-xs rounded-full"
                        :class="getCategoryStyle(article.type)"
                      >
                        {{ getCategoryLabel(article.type) }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {{ article.publishDate }} · {{ article.views }} 阅读
                      <template v-if="article.type === 'long'">
                        · {{ article.sections.length }} 章节
                      </template>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useArticleStore } from '../stores/article'

const router = useRouter()
const store = useArticleStore()

const isBright = ref(true)
const currentCategory = ref('all')

// 从 store 获取数据
const articles = computed(() => store.getArticles)
const articleCategories = computed(() => store.getCategories)

// 根据分类筛选文章
const filteredArticles = computed(() => {
  if (currentCategory.value === 'all') {
    return articles.value.slice(0, 5) // 只显示最新的5篇文章
  }
  return store.getArticlesByCategory(currentCategory.value).slice(0, 5)
})

// 获取分类样式
const getCategoryStyle = (type) => {
  switch (type) {
    case 'short':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'long':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
  }
}

// 获取分类标签
const getCategoryLabel = (type) => {
  switch (type) {
    case 'short':
      return '短文'
    case 'long':
      return '长文'
    default:
      return '未分类'
  }
}

// 页面加载时获取数据
onMounted(async () => {
  await Promise.all([
    store.fetchArticles(),
    store.fetchCategories()
  ])
})
</script>

<style>
/* 优化文字渲染 */
.drop-shadow-custom {
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.8));
}

/* 卡片悬停效果优化 */
.card {
  transition: 
    backdrop-filter 0.3s ease,
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

/* 暗黑模式适配 */
.dark .card {
  background: rgba(31, 41, 55, 0.3) !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
}

.dark .text-gray-800 {
  color: rgba(255, 255, 255, 0.9);
}

/* 分类标签样式 */
.tabs-boxed {
  backdrop-filter: blur(8px);
}

.tab {
  @apply text-gray-600 hover:text-primary transition-colors;
}

.tab-active {
  @apply bg-primary text-white hover:text-white !important;
}
</style>