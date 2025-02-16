<template>
  <div class="sticky top-24 w-64 shrink-0">
    <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-lg p-4 border border-gray-200/50 dark:border-gray-700/50">
      <h3 class="text-lg font-bold mb-4 text-gray-900 dark:text-white">目录</h3>
      <div class="space-y-1 max-h-[calc(100vh-12rem)] overflow-y-auto pr-2 custom-scrollbar">
        <button
          v-for="chapter in chapters"
          :key="chapter.id"
          class="w-full text-left rounded-lg transition-all duration-200"
          :class="[
            currentChapter === chapter.id 
              ? 'bg-primary/10 text-primary font-medium' 
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50',
            chapter.level === 1 ? 'text-sm px-3 py-2' : '',
            chapter.level === 2 ? 'text-sm pl-6 pr-2 py-1.5' : '',
            chapter.level === 3 ? 'text-sm pl-9 pr-2 py-1' : '',
            chapter.level > 3 ? 'text-sm pl-12 pr-2 py-1' : ''
          ]"
          @click="$emit('select-chapter', chapter.id)"
        >
          {{ chapter.title }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  chapters: {
    type: Array,
    required: true
  },
  currentChapter: {
    type: [String, Number],
    required: true
  }
})

defineEmits(['select-chapter'])
</script>

<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 2px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.7);
}

:deep(.dark) .custom-scrollbar {
  scrollbar-color: rgba(156, 163, 175, 0.3) transparent;
}

:deep(.dark) .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.3);
}

:deep(.dark) .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.5);
}
</style> 