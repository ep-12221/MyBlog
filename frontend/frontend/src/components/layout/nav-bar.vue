<template>
  <transition name="nav-slide" mode="out-in">
    <nav
      v-show="!hideNav"
      :class="[
        'navbar fixed top-0 w-full z-50 transition-all duration-400',
        isTransparent 
          ? 'bg-transparent shadow-none' 
          : 'bg-white/90 dark:bg-neutral-800/90 shadow-sm backdrop-blur',
        isHome ? 'h-20' : 'h-16'
      ]"
    >
      <div class="container mx-auto px-4 h-full">
        <div class="flex items-center justify-between h-full">
          <!-- 左侧Logo -->
          <router-link 
            to="/" 
            class="flex items-center gap-2 hover:opacity-80 transition-opacity z-50"
            exact
          >
            <div 
              v-if="!isTransparent"
              class="w-8 h-8 bg-blue-500 rounded-full transition-colors"
            />
            <span 
              class="text-xl font-bold transition-colors"
              :class="isTransparent ? 'text-white' : 'text-gray-800 dark:text-white'"
            >
              Your Logo
            </span>
          </router-link>

          <!-- 居中导航菜单 -->
          <div class="absolute left-1/2 -translate-x-1/2">
            <ul class="hidden md:flex items-center gap-1 bg-white/10 dark:bg-neutral-700/10 rounded-full p-1.5 backdrop-blur shadow-sm">
              <li v-for="item in navItems" :key="item.path">
                <router-link
                  :to="item.path"
                  class="px-4 py-2 rounded-full transition-all relative flex items-center text-sm font-medium group"
                  :class="[
                    isTransparent 
                      ? 'text-white/90 hover:bg-white/10' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-white/10',
                    { '!text-blue-500': $route.path === item.path }
                  ]"
                >
                  <span class="relative z-10">{{ item.name }}</span>
                  <!-- 激活状态背景指示 -->
                  <span 
                    v-if="$route.path === item.path"
                    class="absolute inset-0 bg-white/80 dark:bg-neutral-700/80 rounded-full transition-all"
                  ></span>
                  <!-- 悬停背景动画 -->
                  <span 
                    class="absolute inset-0 bg-white/30 dark:bg-neutral-700/30 rounded-full scale-0 group-hover:scale-100 transition-transform"
                  ></span>
                </router-link>
              </li>
            </ul>
          </div>

          <!-- 右侧占位（可添加其他元素） -->
          <div class="flex items-center gap-4 invisible">
            <!-- 保持对称性的占位元素 -->
            <div class="w-8 h-8"></div>
          </div>

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
          class="md:hidden absolute top-full w-full bg-white/95 dark:bg-neutral-800/95 shadow-lg backdrop-blur"
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
                <span 
                  class="text-gray-800 dark:text-gray-200"
                  :class="{ 'text-blue-500 font-medium': $route.path === item.path }"
                >
                  {{ item.name }}
                </span>
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
import { useRoute } from 'vue-router'

const route = useRoute()

// 状态管理
const hideNav = ref(false)
const isMobileMenuOpen = ref(false)
const isTransparent = ref(true)
const lastScrollY = ref(0)
const SCROLL_THRESHOLD = 100

// 导航配置
const navItems = ref([
  { name: '首页', path: '/' },
  { name: '文章', path: '/posts' },
  { name: '项目', path: '/projects' },
  { name: '关于', path: '/about' }
])

// 响应式计算属性
const isHome = computed(() => route.path === '/')

// 优化后的滚动处理（添加节流）
let scrollTimeout = null
const handleScroll = () => {
  clearTimeout(scrollTimeout)
  scrollTimeout = setTimeout(() => {
    const currentScrollY = window.scrollY
    const scrollingDown = currentScrollY > lastScrollY.value
    
    hideNav.value = scrollingDown && currentScrollY > SCROLL_THRESHOLD
    isTransparent.value = currentScrollY < 50
    lastScrollY.value = currentScrollY
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
.nav-slide-enter-active,
.nav-slide-leave-active {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
}

.nav-slide-enter-from,
.nav-slide-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

/* 菜单项动画增强 */
.navbar li a {
  transition: 
    transform 0.2s cubic-bezier(0.4, 0, 0.2, 1),
    background-color 0.3s ease,
    color 0.3s ease;
}

.navbar li a:hover {
  transform: translateY(-1px);
}

/* 激活状态指示动画 */
.navbar li a span:first-of-type {
  transition: 
    opacity 0.3s ease,
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 暗黑模式优化 */
.dark .navbar li a.router-link-active {
  color: theme('colors.blue.400');
}

.dark .navbar li a span:first-of-type {
  background-color: theme('colors.blue.400/0.8');
}

.dark .navbar li a:hover span:last-of-type {
  background-color: theme('colors.white/0.1');
}

/* 移动端菜单优化 */
@media (max-width: 767px) {
  .navbar .router-link-active span {
    padding-left: 8px;
    border-left: 3px solid theme('colors.blue.500');
  }
  
  .dark .navbar .router-link-active span {
    border-left-color: theme('colors.blue.400');
  }
}
</style>