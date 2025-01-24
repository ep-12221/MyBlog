<template>
  <!-- 修正过渡名称和模式 -->
  <transition name="nav-slide" mode="out-in">
    <nav
      v-show="!hideNav"
      :class="[
        'navbar fixed top-0 w-full z-50 transition-all duration-400',
        'backdrop-blur-md supports-backdrop-blur:bg-opacity-90',
        isTransparent 
          ? 'bg-transparent shadow-none' 
          : 'bg-white/90 dark:bg-neutral-800/90 shadow-sm',
        isHome ? 'h-20' : 'h-16'
      ]"
    >
      <div class="container mx-auto px-4 h-full">
        <div class="flex justify-between items-center h-full">
          <!-- 确保路由链接正确 -->
          <router-link 
            to="/" 
            class="flex items-center gap-2 hover:opacity-80 transition-opacity"
            exact
          >
            <!-- 添加默认logo示例 -->
            <div 
              v-if="!isTransparent"
              class="w-8 h-8 bg-blue-500 rounded-full"
            />
            <span 
              class="text-xl font-bold"
              :class="isTransparent ? 'text-white' : 'text-gray-800 dark:text-white'"
            >
              MyBlog
            </span>
          </router-link>

          <!-- 桌面导航菜单 -->
          <ul class="hidden md:flex items-center gap-4">
            <li v-for="item in navItems" :key="item.path">
              <router-link
                :to="item.path"
                class="px-3 py-2 rounded-lg transition-colors text-sm"
                :class="[
                  isTransparent 
                    ? 'text-white/90 hover:bg-white/10' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10',
                  { 'bg-white/20! font-medium': $route.path === item.path }
                ]"
              >
                {{ item.name }}
              </router-link>
            </li>
          </ul>

          <!-- 移动端菜单按钮 -->
          <div class="md:hidden">
            <button 
              @click.stop="toggleMobileMenu"
              class="p-2 rounded-lg transition-colors"
              :class="isTransparent 
                ? 'text-white hover:bg-white/10' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100'"
            >
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24">
                <path 
                  stroke="currentColor" 
                  stroke-linecap="round" 
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- 移动端菜单 -->
      <transition
        enter-active-class="transition-all duration-300 ease-out"
        leave-active-class="transition-all duration-200 ease-in"
        enter-from-class="opacity-0 -translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-4"
      >
        <div
          v-if="isMobileMenuOpen"
          class="md:hidden absolute top-full w-full bg-white dark:bg-neutral-800 shadow-lg"
        >
          <ul class="py-2">
            <li 
              v-for="item in navItems" 
              :key="item.path"
              class="border-b border-gray-100 dark:border-neutral-700"
            >
              <router-link
                :to="item.path"
                class="block px-6 py-3 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
                @click="closeMobileMenu"
              >
                <span class="text-gray-800 dark:text-gray-200">{{ item.name }}</span>
              </router-link>
            </li>
          </ul>
        </div>
      </transition>
    </nav>
  </transition>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 状态管理
const hideNav = ref(false)
const isMobileMenuOpen = ref(false)
const isTransparent = ref(true)
const lastScrollY = ref(0)
const SCROLL_THRESHOLD = 100 // 滚动阈值调整为100px

// 导航配置
const navItems = ref([
  { name: '首页', path: '/' },
  { name: '文章', path: '/posts' },
  { name: '项目', path: '/projects' },
  { name: '关于', path: '/about' }
])

// 响应式计算属性
const isHome = computed(() => route.path === '/')

// 滚动处理（添加节流）
let isThrottling = false
const handleScroll = () => {
  if (isThrottling) return
  isThrottling = true
  
  setTimeout(() => {
    const currentScrollY = window.scrollY
    const scrollingDown = currentScrollY > lastScrollY.value
    
    // 向下滚动超过阈值时隐藏导航
    hideNav.value = scrollingDown && currentScrollY > SCROLL_THRESHOLD
    
    // 根据滚动位置更新透明状态
    isTransparent.value = currentScrollY < 50
    
    lastScrollY.value = currentScrollY
    isThrottling = false
  }, 100)
}

// 移动菜单控制
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// 路由变化监听
watch(() => route.path, () => {
  closeMobileMenu()
})

// 事件监听
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar')) {
      closeMobileMenu()
    }
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', closeMobileMenu)
})
</script>

<style>
/* 修正过渡动画 */
.nav-slide-enter-active,
.nav-slide-leave-active {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
}

.nav-slide-enter-from,
.nav-slide-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

/* 暗黑模式适配 */
.dark .navbar {
  --tw-bg-opacity: 0.9;
  --tw-text-opacity: 1;
}

.dark .router-link-active {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>