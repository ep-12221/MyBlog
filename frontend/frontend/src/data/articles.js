// 文章分类数据
export const articleCategories = [
  { 
    id: 1,
    name: '技术教程',
    value: 'tutorial',
    icon: 'icon-book',
    description: '深入浅出的技术教程'
  },
  {
    id: 2,
    name: '前端开发',
    value: 'frontend',
    icon: 'icon-code',
    description: '前端开发相关文章'
  },
  {
    id: 3,
    name: '后端开发',
    value: 'backend',
    icon: 'icon-server',
    description: '后端开发相关文章'
  },
  {
    id: 4,
    name: '开发工具',
    value: 'tools',
    icon: 'icon-tool',
    description: '提高效率的开发工具'
  }
]

// 文章类型
export const articleTypes = [
  { label: '全部', value: 'all', icon: 'icon-grid' },
  { label: '长文', value: 'long', icon: 'icon-book' },
  { label: '短文', value: 'short', icon: 'icon-file' }
]

// 模拟文章数据
const articles = [
  {
    id: 1,
    title: 'Vue3 完全指南',
    type: 'long',
    category: 'frontend',
    description: '从入门到精通的 Vue3 教程，包含组合式 API、响应式系统等核心概念',
    publishDate: '2024-03-20',
    views: 1234,
    tags: ['Vue.js', '前端开发', '教程'],
    coverImage: 'https://example.com/images/vue3.jpg',
    sections: [
      {
        id: 1,
        title: '第一章：Vue3 简介',
        content: `# Vue3 简介

## 为什么选择 Vue3？

Vue3 带来了许多重要的改进：
- 更好的性能
- 组合式 API
- TypeScript 支持
- 更小的包体积

## 开始使用

首先，让我们创建一个 Vue3 项目：

\`\`\`bash
npm create vue@latest
\`\`\`
`
      },
      {
        id: 2,
        title: '第二章：组合式 API',
        content: `# 组合式 API

## 核心概念

组合式 API 是 Vue3 最重要的特性之一：

\`\`\`js
import { ref, computed } from 'vue'

const count = ref(0)
const double = computed(() => count.value * 2)
\`\`\`
`
      }
    ]
  },
  {
    id: 2,
    title: 'Git 常用命令速查',
    type: 'short',
    category: 'tools',
    description: '日常开发中最常用的 Git 命令整理',
    publishDate: '2024-03-21',
    views: 567,
    tags: ['Git', '开发工具', '效率'],
    coverImage: 'https://example.com/images/git.jpg',
    content: `# Git 常用命令速查

## 基础命令

\`\`\`bash
# 初始化仓库
git init

# 添加文件
git add .

# 提交更改
git commit -m "message"

# 查看状态
git status
\`\`\`

## 分支操作

\`\`\`bash
# 创建分支
git branch feature

# 切换分支
git checkout feature

# 合并分支
git merge feature
\`\`\`
`
  },
  {
    id: 3,
    title: 'Node.js 性能优化实践',
    type: 'long',
    category: 'backend',
    description: '深入探讨 Node.js 应用的性能优化策略',
    publishDate: '2024-03-22',
    views: 892,
    tags: ['Node.js', '性能优化', '后端开发'],
    coverImage: 'https://example.com/images/nodejs.jpg',
    sections: [
      {
        id: 1,
        title: '内存管理',
        content: `# Node.js 内存管理

## V8 垃圾回收机制

Node.js 使用 V8 引擎进行内存管理：
- 新生代对象
- 老生代对象
- 垃圾回收策略
`
      },
      {
        id: 2,
        title: '性能监控',
        content: `# 性能监控

## 使用 Node.js 内置工具

\`\`\`js
const performance = require('perf_hooks').performance;

const start = performance.now();
// 执行代码
const end = performance.now();
console.log(\`执行时间: \${end - start}ms\`);
\`\`\`
`
      }
    ]
  }
]

// 获取所有文章
export const getArticles = () => {
  return articles
}

// 根据ID获取文章
export const getArticleById = (id) => {
  const numId = typeof id === 'string' ? parseInt(id) : id
  return articles.find(article => article.id === numId)
}

// 根据分类获取文章
export const getArticlesByCategory = (category) => {
  if (category === 'all') {
    return articles
  }
  return articles.filter(article => article.category === category)
}

// 根据类型获取文章
export const getArticlesByType = (type) => {
  if (type === 'all') {
    return articles
  }
  return articles.filter(article => article.type === type)
}

// 获取分类信息
export const getCategoryInfo = (categoryValue) => {
  return articleCategories.find(cat => cat.value === categoryValue)
} 