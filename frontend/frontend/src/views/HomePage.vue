<template>
  <div class="relative min-h-screen w-full">
    <!-- 背景层 -->
    <div class="absolute inset-0 bg-cover bg-center brightness-75"
      :style="{ backgroundImage: `url(https://picdm.sunbangyan.cn/2023/11/08/8fee6a232a4487fe90862a28ae5b3c13.png)` }" />

    <!-- 全局遮罩层 -->
    <div class="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />

    <!-- 内容层 -->
    <div class="relative z-10 flex min-h-screen w-full">
      <!-- 亮度切换按钮 -->
      <button class="btn btn-circle fixed top-4 right-4 shadow-lg text-white hover:bg-white/20"
        @click="isBright = !isBright">
        <icon-sun v-if="isBright" class="w-6 h-6" />
        <icon-moon v-else class="w-6 h-6" />
      </button>

      <!-- 主内容区 -->
      <div class="w-full flex">
        <!-- 中间Hero区域 (宽度调整为5/12) -->
        <div class="w-5/12 flex items-center justify-center p-8">
          <div class="text-center space-y-6">
            <h1 class="text-6xl font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              Hello World
            </h1>
            <div
              class="text-2xl font-medium bg-gradient-to-r from-red-400 via-purplr-500 to-indigo-600 bg-clip-text text-transparent">
              Welcome to My Space
            </div>
          </div>
        </div>

        <!-- 右侧卡片区 (宽度调整为7/12) -->
        <div class="w-7/12 p-8 flex items-center">
          <div class="card w-full max-w-2xl bg-white/90 rounded-2xl shadow-2xl backdrop-blur-xl">
            <div class="card-body space-y-6">
              <h2 class="card-title text-3xl text-gray-800 mb-4">最新文章</h2>
              <div class="space-y-4">
                <div v-for="item in 3" :key="item"
                  class="group flex items-center gap-4 p-4 hover:bg-gray-100/50 rounded-xl transition-all cursor-pointer">
                  <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <div class="text-primary text-xl font-bold">0{{ item }}</div>
                  </div>
                  <div class="flex-1">
                    <h3 class="text-lg font-semibold text-gray-800 group-hover:text-primary transition-colors">
                      文章标题 {{ item }}
                    </h3>
                    <p class="text-sm text-gray-500 mt-1">2023-10-0{{ item }} · 阅读量 {{ item * 356 }}</p>
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
import { ref } from 'vue'

const isBright = ref(true)
</script>

<style>
/* 自定义渐变遮罩 */
.bg-gradient-to-r.from-black\/20.via-transparent.to-black\/20 {
  background: linear-gradient(90deg,
      rgba(0, 0, 0, 0.2) 0%,
      rgba(0, 0, 0, 0) 50%,
      rgba(0, 0, 0, 0.2) 100%);
}

/* 优化文字渲染 */
.drop-shadow-\[0_2px_8px_rgba\(0,
0,
0,
0\.8\)\] {
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.8));
}

@keyframes gradient-x {
  0% {
    background-position: 0% 50%
  }

  50% {
    background-position: 100% 50%
  }

  100% {
    background-position: 0% 50%
  }
}

.animate-gradient-x {
  background-size: 200% auto;
  animation: gradient-x 5s ease infinite;
}
</style>