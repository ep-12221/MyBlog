<template>
  <div class="space-y-6 bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl border border-white/20 dark:border-gray-800/30 rounded-xl shadow-lg p-6">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-bold text-white">筛选</h2>
      <button 
        class="btn btn-ghost btn-sm gap-2 text-white hover:bg-white/20"
        @click="$emit('reset')"
      >
        <icon-refresh class="w-4 h-4" />
        重置
      </button>
    </div>

    <!-- 分类筛选 -->
    <div>
      <h3 class="text-sm font-medium text-gray-200 dark:text-gray-300 mb-3">文章分类</h3>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="category in categories"
          :key="category.value"
          class="btn btn-sm"
          :class="[
            currentCategory === category.value
              ? 'btn-primary'
              : 'btn-ghost text-white hover:bg-white/20'
          ]"
          @click="$emit('update:category', category.value)"
        >
          <div class="flex items-center gap-2">
            <component :is="category.icon" class="w-4 h-4" />
            {{ category.name }}
          </div>
        </button>
      </div>
    </div>

    <!-- 类型筛选 -->
    <div>
      <h3 class="text-sm font-medium text-gray-200 dark:text-gray-300 mb-3">文章类型</h3>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="type in types"
          :key="type.value"
          class="btn btn-sm"
          :class="[
            currentType === type.value
              ? 'btn-primary'
              : 'btn-ghost text-white hover:bg-white/20'
          ]"
          @click="$emit('update:type', type.value)"
        >
          <div class="flex items-center gap-2">
            <component :is="type.icon" class="w-4 h-4" />
            {{ type.label }}
          </div>
        </button>
      </div>
    </div>

    <!-- 视图切换 -->
    <div>
      <h3 class="text-sm font-medium text-gray-200 dark:text-gray-300 mb-3">显示方式</h3>
      <div class="btn-group">
        <button 
          v-for="view in viewOptions" 
          :key="view.value"
          class="btn btn-sm"
          :class="[
            currentView === view.value
              ? 'btn-primary'
              : 'btn-ghost text-white hover:bg-white/20'
          ]"
          @click="$emit('update:view', view.value)"
        >
          <div class="flex items-center gap-2">
            <component :is="view.icon" class="w-4 h-4" />
            {{ view.label }}
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  categories: {
    type: Array,
    required: true
  },
  types: {
    type: Array,
    required: true
  },
  viewOptions: {
    type: Array,
    required: true
  },
  currentCategory: {
    type: String,
    required: true
  },
  currentType: {
    type: String,
    required: true
  },
  currentView: {
    type: String,
    required: true
  }
})

defineEmits(['update:category', 'update:type', 'update:view', 'reset'])
</script>

<style scoped>
.btn-ghost {
  @apply border-white/20;
}

.btn-ghost:hover {
  @apply border-white/30;
}
</style> 