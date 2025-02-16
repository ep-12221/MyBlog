<template>
  <nav
    class="fixed top-0 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 w-full pointer-events-auto"
    :class="[
      scrolled ? 'bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xl shadow-lg py-0' : 'bg-transparent backdrop-blur-0 py-4',
      'border-b border-white/10 dark:border-gray-800/10',
      { 'translate-y-0 opacity-100': !hideNav, '-translate-y-full opacity-0': hideNav }
    ]"
  >
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex items-center justify-between h-14">
        <!-- Logo -->
        <a 
          href="javascript:void(0)" 
          class="flex items-center space-x-2 text-lg font-semibold relative z-10"
          :class="[
            shouldUseWhiteText ? 'text-white' : 'text-gray-900 dark:text-white'
          ]"
          @click="handleNavClick('/')"
        >
          <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
            <span class="text-white">L</span>
          </div>
          <span>Logo</span>
        </a>

        <!-- 桌面端导航 -->
        <div class="hidden md:flex items-center space-x-1 relative z-10">
          <a
            v-for="item in navItems"
            :key="item.path"
            href="javascript:void(0)"
            class="px-4 py-2 rounded-full text-sm font-medium transition-all relative z-10"
            :class="[
              shouldUseWhiteText 
                ? 'text-white hover:bg-white/10' 
                : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800',
              { 
                'bg-white/10': shouldUseWhiteText && route.path === item.path,
                'bg-gray-100 dark:bg-gray-800': !shouldUseWhiteText && route.path === item.path
              }
            ]"
            @click="handleNavClick(item.path)"
          >
            {{ item.name }}
          </a>
        </div>

        <!-- 右侧工具栏 -->
        <div class="flex items-center space-x-2 relative z-10">
          <!-- 主题切换 -->
          <button
            class="p-2 rounded-full transition-colors relative z-10"
            :class="shouldUseWhiteText ? 'hover:bg-white/10' : 'hover:bg-gray-100 dark:hover:bg-gray-800'"
            @click="toggleTheme"
          >
            <icon-sun
              v-if="isDark"
              class="w-5 h-5"
              :class="shouldUseWhiteText ? 'text-white' : 'text-gray-900 dark:text-white'"
            />
            <icon-moon
              v-else
              class="w-5 h-5"
              :class="shouldUseWhiteText ? 'text-white' : 'text-gray-900 dark:text-white'"
            />
          </button>

          <!-- 移动端菜单按钮 -->
          <button
            class="md:hidden p-2 rounded-full transition-colors relative z-10"
            :class="shouldUseWhiteText ? 'hover:bg-white/10' : 'hover:bg-gray-100 dark:hover:bg-gray-800'"
            @click.stop="toggleMobileMenu"
          >
            <svg
              class="w-5 h-5"
              :class="shouldUseWhiteText ? 'text-white' : 'text-gray-900 dark:text-white'"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
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
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div
        v-if="isMobileMenuOpen"
        class="md:hidden absolute top-full left-0 right-0 mt-2 mx-4 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg overflow-hidden"
        @click.stop
      >
        <div class="p-2">
          <a
            v-for="item in navItems"
            :key="item.path"
            href="javascript:void(0)"
            class="block px-4 py-2 text-sm font-medium rounded-xl transition-colors"
            :class="[
              'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800',
              { 'bg-gray-100 dark:bg-gray-800 font-semibold': route.path === item.path }
            ]"
            @click="handleNavClick(item.path)"
          >
            {{ item.name }}
          </a>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const scrolled = ref(false)
const hideNav = ref(false)
const isMobileMenuOpen = ref(false)
const isDark = ref(false)
const lastScrollY = ref(0)
const scrollTimeout = ref(null)

const navItems = [
  { name: '首页', path: '/' },
  { name: '文章', path: '/articles' },
  { name: '关于', path: '/about' }
]

// 处理导航点击
const handleNavClick = (path) => {
  if (route.path === path) return
  closeMobileMenu()
  router.push(path)
}

const shouldUseWhiteText = computed(() => {
  // 在首页且未滚动时使用白色文字
  return route.path === '/' && !scrolled.value
})

// 处理滚动
const handleScroll = () => {
  const currentScrollY = window.scrollY
  scrolled.value = currentScrollY > 0

  // 顶部区域始终显示导航栏
  if (currentScrollY < 100) {
    hideNav.value = false
    lastScrollY.value = currentScrollY
    return
  }

  // 计算滚动方向和距离
  const scrollDelta = currentScrollY - lastScrollY.value
  const isScrollingDown = scrollDelta > 0
  const isScrollingUp = scrollDelta < 0
  const isSignificantScroll = Math.abs(scrollDelta) > 10

  // 清除之前的定时器
  if (scrollTimeout.value) {
    clearTimeout(scrollTimeout.value)
  }

  // 向下滚动且滚动距离足够时，立即隐藏
  if (isScrollingDown && isSignificantScroll) {
    hideNav.value = true
  }
  // 向上滚动且滚动距离足够时，立即显示
  else if (isScrollingUp && isSignificantScroll) {
    hideNav.value = false
  }
  // 缓慢滚动时，等待一段时间后再决定是否隐藏
  else {
    scrollTimeout.value = setTimeout(() => {
      hideNav.value = isScrollingDown
    }, 150)
  }

  lastScrollY.value = currentScrollY
}

// 使用节流函数优化滚动处理
const throttledScroll = () => {
  let ticking = false
  return () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll()
        ticking = false
      })
      ticking = true
    }
  }
}

// 切换主题
const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

// 移动端菜单控制
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// 监听路由变化时显示导航栏
watch(route, () => {
  hideNav.value = false
  // 在非首页时，确保导航栏有背景色
  if (route.path !== '/') {
    scrolled.value = true
  } else {
    // 在首页时，根据滚动位置决定背景色
    scrolled.value = window.scrollY > 0
  }
})

// 初始化
onMounted(() => {
  // 初始化导航栏状态
  if (route.path !== '/') {
    scrolled.value = true
  } else {
    scrolled.value = window.scrollY > 0
  }

  // 初始化主题
  const savedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  isDark.value = savedTheme === 'dark' || (!savedTheme && prefersDark)
  document.documentElement.classList.toggle('dark', isDark.value)

  // 创建节流后的滚动处理函数
  const throttledScrollHandler = throttledScroll()
  
  // 添加滚动监听
  window.addEventListener('scroll', throttledScrollHandler)
  
  // 点击外部关闭移动端菜单
  const handleClickOutside = (e) => {
    if (isMobileMenuOpen.value && !e.target.closest('nav')) {
      closeMobileMenu()
    }
  }
  
  document.addEventListener('click', handleClickOutside)
  
  // 正确设置清理函数
  onUnmounted(() => {
    window.removeEventListener('scroll', throttledScrollHandler)
    document.removeEventListener('click', handleClickOutside)
    if (scrollTimeout.value) {
      clearTimeout(scrollTimeout.value)
    }
  })
})
</script>

<style scoped>
.router-link-active {
  font-weight: 500;
}

/* 确保过渡动画平滑 */
nav {
  transform-origin: top;
  backface-visibility: hidden;
  will-change: transform, opacity;
}

/* 优化移动端菜单动画 */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 滚动时的阴影效果 */
nav {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

nav.scrolled {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}
</style>