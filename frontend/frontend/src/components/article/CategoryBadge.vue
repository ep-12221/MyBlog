<template>
  <span 
    class="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium"
    :class="[
      size === 'sm' ? 'text-xs' : 'text-sm',
      category ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
    ]"
  >
    <component 
      v-if="category?.icon" 
      :is="category.icon" 
      :class="size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'" 
    />
    {{ category?.name || '未分类' }}
  </span>
</template>

<script setup>
defineProps({
  category: {
    type: Object,
    default: null
  },
  size: {
    type: String,
    default: 'default',
    validator: value => ['sm', 'default'].includes(value)
  }
})
</script> 