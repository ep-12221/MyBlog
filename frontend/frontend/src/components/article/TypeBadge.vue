<template>
  <span 
    class="inline-flex items-center gap-1 rounded-full px-2 py-1 font-medium"
    :class="[
      size === 'sm' ? 'text-xs' : 'text-sm',
      typeStyles[type] || typeStyles.default
    ]"
  >
    <component 
      :is="typeIcons[type] || 'icon-file'" 
      :class="size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'" 
    />
    {{ typeLabels[type] || '未知类型' }}
  </span>
</template>

<script setup>
const typeStyles = {
  short: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  long: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
}

const typeIcons = {
  short: 'icon-file-text',
  long: 'icon-book'
}

const typeLabels = {
  short: '短文',
  long: '长文'
}

defineProps({
  type: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: 'default',
    validator: value => ['sm', 'default'].includes(value)
  }
})
</script> 