<template>
  <div
    class="card bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl border border-white/20 dark:border-gray-800/30 shadow-lg hover:shadow-xl transition-all cursor-pointer group overflow-hidden"
    @click="$emit('click')"
  >
    <!-- 网格视图 -->
    <template v-if="viewMode === 'grid'">
      <div class="relative h-48 overflow-hidden">
        <img 
          :src="article.coverImage" 
          :alt="article.title"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <!-- 状态标记 -->
        <div 
          v-if="getArticleStatus(article)"
          class="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium text-white"
          :class="getArticleStatus(article).class"
        >
          {{ getArticleStatus(article).label }}
        </div>
        <div class="absolute bottom-0 left-0 right-0 p-4">
          <h2 class="text-xl font-bold text-white">{{ article.title }}</h2>
          <div class="flex items-center gap-2 mt-2">
            <CategoryBadge :category="getCategoryInfo(article.category)" size="sm" />
            <TypeBadge :type="article.type" size="sm" />
          </div>
        </div>
      </div>
      <div class="p-4">
        <p class="text-sm text-gray-200 dark:text-gray-300 line-clamp-2 mb-4">
          {{ article.description }}
        </p>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <span class="text-sm text-gray-200">
              <icon-eye class="w-4 h-4 inline-block mr-1" />
              {{ article.views }}
            </span>
            <span class="text-sm text-gray-200">
              <icon-clock class="w-4 h-4 inline-block mr-1" />
              {{ getReadingTime(article.content || article.description) }} 分钟
            </span>
          </div>
          <span class="text-sm text-gray-200">{{ article.publishDate }}</span>
        </div>
      </div>
    </template>

    <!-- 列表视图 -->
    <template v-else>
      <div class="p-4 flex gap-4">
        <div class="w-48 h-32 rounded-lg overflow-hidden shrink-0 relative">
          <img 
            :src="article.coverImage" 
            :alt="article.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <!-- 状态标记 -->
          <div 
            v-if="getArticleStatus(article)"
            class="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium text-white"
            :class="getArticleStatus(article).class"
          >
            {{ getArticleStatus(article).label }}
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-2">
            <h2 class="text-xl font-bold text-white group-hover:text-primary transition-colors">
              {{ article.title }}
            </h2>
            <div class="flex items-center gap-2">
              <CategoryBadge :category="getCategoryInfo(article.category)" />
              <TypeBadge :type="article.type" />
            </div>
          </div>
          <p class="text-sm text-gray-200 dark:text-gray-300 line-clamp-2 mb-4">
            {{ article.description }}
          </p>
          <div class="flex items-center gap-4">
            <span class="text-sm text-gray-200">{{ article.publishDate }}</span>
            <span class="text-sm text-gray-200">
              <icon-eye class="w-4 h-4 inline-block mr-1" />
              {{ article.views }}
            </span>
            <span class="text-sm text-gray-200">
              <icon-clock class="w-4 h-4 inline-block mr-1" />
              {{ getReadingTime(article.content || article.description) }} 分钟
            </span>
            <span v-if="article.type === 'long'" class="text-sm text-gray-200">
              <icon-book class="w-4 h-4 inline-block mr-1" />
              {{ article.sections.length }} 章节
            </span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { getCategoryInfo } from '../../data/articles'
import CategoryBadge from './CategoryBadge.vue'
import TypeBadge from './TypeBadge.vue'

// 计算阅读时长（假设平均阅读速度为300字/分钟）
const getReadingTime = (content) => {
  const wordsPerMinute = 300
  const wordCount = content.length
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  return minutes
}

// 获取文章状态标记
const getArticleStatus = (article) => {
  const now = new Date()
  const publishDate = new Date(article.publishDate)
  const daysDiff = Math.floor((now - publishDate) / (1000 * 60 * 60 * 24))

  if (daysDiff <= 7) {
    return { label: '新文章', class: 'bg-green-500' }
  }
  if (article.views >= 1000) {
    return { label: '热门', class: 'bg-red-500' }
  }
  if (article.type === 'long') {
    return { label: '长文', class: 'bg-purple-500' }
  }
  return null
}

defineProps({
  article: {
    type: Object,
    required: true
  },
  viewMode: {
    type: String,
    default: 'list',
    validator: value => ['list', 'grid'].includes(value)
  }
})

defineEmits(['click'])
</script>

<style scoped>
.card {
  @apply rounded-xl transition-all duration-300;
}

.card:hover {
  backdrop-filter: blur-2xl;
  transform: translateY(-2px);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 暗黑模式适配 */
.dark .card {
  @apply border-gray-700/50;
}
</style> 