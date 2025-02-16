<template>
  <div class="relative min-h-screen w-full">
    <!-- 加载状态 -->
    <div v-if="loading" class="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl">
        <div class="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p class="mt-4 text-gray-600 dark:text-gray-300">加载中...</p>
      </div>
    </div>

    <!-- 错误提示 -->
    <div 
      v-if="error" 
      class="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50 flex items-center gap-2"
    >
      <icon-alert-circle class="w-5 h-5" />
      <p class="font-medium">{{ error }}</p>
      <button 
        class="ml-2 text-red-700 hover:text-red-900"
        @click="error = null"
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
    <div class="relative z-10">


      <!-- 主要内容区 -->
      <div class="container mx-auto px-4 py-8">
        <div class="flex gap-8">
          <!-- 左侧边栏 -->
          <div class="w-80 shrink-0 space-y-6">
            <!-- 作者信息卡片 -->
            <div class="card bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl border border-white/20 dark:border-gray-800/30 rounded-xl shadow-lg p-6">
              <div class="flex flex-col items-center">
                <img 
                  src="https://picsum.photos/100/100" 
                  alt="作者头像"
                  class="w-24 h-24 rounded-full border-4 border-white/20"
                />
                <h2 class="mt-4 text-xl font-bold text-white">博主昵称</h2>
                <p class="mt-2 text-sm text-gray-200 text-center">热爱技术，热爱生活。分享编程、设计和日常所思。</p>
                <div class="mt-4 flex gap-4">
                  <a href="#" class="text-white/80 hover:text-white">
                    <icon-github class="w-6 h-6" />
                  </a>
                  <a href="#" class="text-white/80 hover:text-white">
                    <icon-twitter class="w-6 h-6" />
                  </a>
                  <a href="#" class="text-white/80 hover:text-white">
                    <icon-mail class="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>

            <!-- 筛选器 -->
            <ArticleFilters
              :categories="categories"
              :types="articleTypes"
              :view-options="viewOptions"
              v-model:category="currentCategory"
              v-model:type="currentType"
              v-model:view="currentView"
              @reset="resetFilters"
            />

            <!-- 热门文章 -->
            <div class="card bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl border border-white/20 dark:border-gray-800/30 rounded-xl shadow-lg p-6">
              <h3 class="text-lg font-bold text-white mb-4">热门文章</h3>
              <div class="space-y-4">
                <div 
                  v-for="article in hotArticles" 
                  :key="article.id"
                  class="group cursor-pointer"
                  @click="router.push({ name: 'article-detail', params: { id: article.id }})"
                >
                  <div class="flex gap-3">
                    <div class="w-20 h-20 rounded-lg overflow-hidden shrink-0">
                      <img 
                        :src="article.coverImage" 
                        :alt="article.title"
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div class="flex-1 min-w-0">
                      <h4 class="text-sm font-medium text-white group-hover:text-primary line-clamp-2">
                        {{ article.title }}
                      </h4>
                      <p class="mt-1 text-xs text-gray-200">
                        <icon-eye class="w-3 h-3 inline-block mr-1" />
                        {{ article.views }} 阅读
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧文章列表 -->
          <div class="flex-1 min-w-0">
            <div class="card bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl border border-white/20 dark:border-gray-800/30 rounded-xl shadow-lg p-6">
              <div class="flex justify-between items-center mb-6">
                <div>
                  <h1 class="text-2xl font-bold text-white">
                    {{ currentCategoryInfo?.name || '全部文章' }}
                    <span class="text-sm text-gray-200 dark:text-gray-400 ml-2">
                      ({{ filteredArticles.length }} 篇)
                    </span>
                  </h1>
                  <p class="mt-2 text-sm text-gray-200">在这里，记录我的所思所想，分享技术与生活。</p>
                </div>
                <!-- 排序选项 -->
                <div class="flex items-center gap-4">
                  <select 
                    v-model="sortBy"
                    class="select select-sm bg-white/10 border-white/20 text-white"
                  >
                    <option value="latest">最新发布</option>
                    <option value="popular">最多阅读</option>
                  </select>
                </div>
              </div>

              <!-- 文章列表 -->
              <div 
                class="grid gap-6" 
                :class="currentView === 'grid' ? 'grid-cols-2' : 'grid-cols-1'"
              >
                <ArticleCard
                  v-for="article in sortedArticles"
                  :key="article.id"
                  :article="article"
                  :view-mode="currentView"
                  @click="router.push({ name: 'article-detail', params: { id: article.id }})"
                />
              </div>

              <!-- 空状态 -->
              <div 
                v-if="filteredArticles.length === 0" 
                class="text-center py-12"
              >
                <icon-inbox class="w-12 h-12 mx-auto text-white/50" />
                <p class="mt-4 text-white/70">暂无文章</p>
              </div>

              <!-- 加载更多按钮 -->
              <div v-if="hasMore" class="mt-8 text-center">
                <button 
                  class="btn btn-outline text-white border-white/20 hover:bg-white/20"
                  :disabled="loading"
                  @click="loadMore"
                >
                  <template v-if="loading">
                    <icon-loader class="w-4 h-4 animate-spin mr-2" />
                    加载中...
                  </template>
                  <template v-else>
                    加载更多
                  </template>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 返回顶部按钮 -->
    <button
      v-show="showBackToTop"
      class="fixed right-8 bottom-8 btn btn-circle btn-primary"
      @click="scrollToTop"
    >
      <icon-arrow-up class="w-6 h-6" />
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  getArticles, 
  getArticlesByCategory, 
  getArticlesByType,
  articleCategories,
  articleTypes as types,
  getCategoryInfo
} from '../data/articles'

import ArticleCard from '../components/article/ArticleCard.vue'
import ArticleFilters from '../components/article/ArticleFilters.vue'

const router = useRouter()
const loading = ref(false)
const error = ref(null)
const showBackToTop = ref(false)
const sortBy = ref('latest')
const pageSize = 10
const currentPage = ref(1)
const hasMore = ref(true)

const currentView = ref('list')
const currentCategory = ref('all')
const currentType = ref('all')

// 视图切换选项
const viewOptions = [
  { label: '列表视图', value: 'list', icon: 'icon-list' },
  { label: '网格视图', value: 'grid', icon: 'icon-grid' }
]

// 添加"全部"分类
const categories = [
  { name: '全部', value: 'all', icon: 'icon-grid' },
  ...articleCategories
]

// 文章类型
const articleTypes = types

// 文章列表数据
const articles = ref([])

// 热门文章（取阅读量最高的5篇）
const hotArticles = computed(() => {
  return [...articles.value]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)
})

// 当前分类信息
const currentCategoryInfo = computed(() => {
  if (currentCategory.value === 'all') return null
  return getCategoryInfo(currentCategory.value)
})

// 根据分类和类型筛选文章
const filteredArticles = computed(() => {
  let result = [...articles.value]

  if (currentCategory.value !== 'all') {
    result = result.filter(article => article.category === currentCategory.value)
  }

  if (currentType.value !== 'all') {
    result = result.filter(article => article.type === currentType.value)
  }

  return result
})

// 排序后的文章列表
const sortedArticles = computed(() => {
  const sorted = [...filteredArticles.value]
  if (sortBy.value === 'latest') {
    return sorted.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
  } else {
    return sorted.sort((a, b) => b.views - a.views)
  }
})

// 重置筛选条件
const resetFilters = () => {
  currentCategory.value = 'all'
  currentType.value = 'all'
  currentView.value = 'list'
  sortBy.value = 'latest'
}

// 获取文章列表
const fetchArticles = async () => {
  loading.value = true
  error.value = null
  
  try {
    // TODO: 替换为实际的API调用
    // const response = await fetch('/api/articles')
    // const data = await response.json()
    
    // 使用模拟数据
    await new Promise(resolve => setTimeout(resolve, 1000))
    articles.value = getArticles()
    
  } catch (err) {
    console.error('获取文章列表失败:', err)
    error.value = '获取文章列表失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 加载更多文章
const loadMore = async () => {
  if (loading.value || !hasMore.value) return
  
  currentPage.value++
  // TODO: 实现分页加载逻辑
}

// 滚动到顶部
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 监听滚动事件
const handleScroll = () => {
  showBackToTop.value = window.scrollY > 500
}

onMounted(() => {
  fetchArticles()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.card {
  @apply rounded-xl transition-all duration-300;
}

.card:hover {
  backdrop-filter: blur-2xl;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tab {
  @apply text-gray-600 dark:text-gray-300 hover:text-primary transition-colors;
}

.tab-active {
  @apply bg-primary text-white hover:text-white !important;
}

/* 暗黑模式适配 */
.dark .card {
  @apply border-gray-700/50;
}

.dark .text-gray-900 {
  @apply text-white;
}

.dark .text-gray-600 {
  @apply text-gray-300;
}

.select {
  @apply rounded-lg;
}

.select option {
  @apply bg-gray-800 text-white;
}
</style> 