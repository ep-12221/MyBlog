import { defineStore } from 'pinia'
import axios from '../utils/axios'

// 模拟文章数据
const mockArticles = [
  {
    id: 1,
    title: 'Vue3 完全指南',
    type: 'long',
    category: 'frontend',
    description: '从入门到精通的 Vue3 教程，包含组合式 API、响应式系统等核心概念',
    publishDate: '2024-03-20',
    views: 1234,
    tags: ['Vue.js', '前端开发', '教程'],
    coverImage: 'https://picsum.photos/800/600?random=1',
    sections: [
      {
        id: 1,
        title: '第一章：Vue3 简介',
        content: `# Vue3 简介\n\nVue3 带来了许多重要的改进：\n- 更好的性能\n- 组合式 API\n- TypeScript 支持\n- 更小的包体积`
      },
      {
        id: 2,
        title: '第二章：组合式 API',
        content: `# 组合式 API\n\n组合式 API 是 Vue3 最重要的特性之一：\n\n\`\`\`js\nimport { ref, computed } from 'vue'\n\nconst count = ref(0)\nconst double = computed(() => count.value * 2)\n\`\`\``
      }
    ]
  },
  {
    id: 2,
    title: 'Git 常用命令速查',
    type: 'short',
    category: 'tools',
    description: '日常开发中最常用的 Git 命令整理，包含基础操作和进阶技巧',
    publishDate: '2024-03-21',
    views: 567,
    tags: ['Git', '开发工具', '效率'],
    coverImage: 'https://picsum.photos/800/600?random=2',
    content: `# Git 常用命令速查\n\n## 基础命令\n\n\`\`\`bash\n# 初始化仓库\ngit init\n\n# 添加文件\ngit add .\n\n# 提交更改\ngit commit -m "message"\n\`\`\``
  },
  {
    id: 3,
    title: 'Node.js 性能优化实践',
    type: 'long',
    category: 'backend',
    description: '深入探讨 Node.js 应用的性能优化策略，从内存管理到性能监控',
    publishDate: '2024-03-22',
    views: 892,
    tags: ['Node.js', '性能优化', '后端开发'],
    coverImage: 'https://picsum.photos/800/600?random=3',
    sections: [
      {
        id: 1,
        title: '内存管理',
        content: `# Node.js 内存管理\n\n## V8 垃圾回收机制\n\nNode.js 使用 V8 引擎进行内存管理：\n- 新生代对象\n- 老生代对象\n- 垃圾回收策略`
      },
      {
        id: 2,
        title: '性能监控',
        content: `# 性能监控\n\n## 使用内置工具\n\n\`\`\`js\nconst performance = require('perf_hooks').performance;\n\nconst start = performance.now();\n// 执行代码\nconst end = performance.now();\nconsole.log(\`执行时间: \${end - start}ms\`);\n\`\`\``
      }
    ]
  },
  {
    id: 4,
    title: 'React Hooks 最佳实践',
    type: 'long',
    category: 'frontend',
    description: '探索 React Hooks 的高级用法和最佳实践，提升组件开发效率',
    publishDate: '2024-03-23',
    views: 723,
    tags: ['React', '前端开发', 'Hooks'],
    coverImage: 'https://picsum.photos/800/600?random=4',
    sections: [
      {
        id: 1,
        title: '为什么使用 Hooks',
        content: `# 为什么使用 Hooks\n\nHooks 解决了类组件的诸多问题：\n- 更好的代码复用\n- 更清晰的生命周期\n- 更简洁的状态管理`
      },
      {
        id: 2,
        title: '常用 Hooks 详解',
        content: `# 常用 Hooks 详解\n\n## useState\n\n\`\`\`jsx\nimport { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(count + 1)}>{count}</button>;\n}\n\`\`\``
      }
    ]
  },
  {
    id: 5,
    title: 'Docker 容器化部署',
    type: 'short',
    category: 'tools',
    description: '快速入门 Docker 容器化部署，轻松实现开发环境标准化',
    publishDate: '2024-03-24',
    views: 445,
    tags: ['Docker', '部署', '运维'],
    coverImage: 'https://picsum.photos/800/600?random=5',
    content: `# Docker 容器化部署\n\n## 基础概念\n\n- 镜像（Image）\n- 容器（Container）\n- Dockerfile\n\n## 常用命令\n\n\`\`\`bash\n# 构建镜像\ndocker build -t myapp .\n\n# 运行容器\ndocker run -p 3000:3000 myapp\n\`\`\``
  }
]

// 模拟分类数据
const mockCategories = [
  { 
    id: 1,
    name: '前端开发',
    value: 'frontend',
    icon: 'icon-code',
    description: '前端开发相关文章'
  },
  {
    id: 2,
    name: '后端开发',
    value: 'backend',
    icon: 'icon-server',
    description: '后端开发相关文章'
  },
  {
    id: 3,
    name: '开发工具',
    value: 'tools',
    icon: 'icon-tool',
    description: '提高效率的开发工具'
  }
]

export const useArticleStore = defineStore('article', {
  state: () => ({
    articles: [],
    categories: [],
    types: [
      { label: '全部', value: 'all', icon: 'icon-grid' },
      { label: '长文', value: 'long', icon: 'icon-book' },
      { label: '短文', value: 'short', icon: 'icon-file' }
    ],
    loading: false,
    error: null
  }),

  getters: {
    // 获取所有文章
    getArticles: (state) => state.articles,
    
    // 获取所有分类
    getCategories: (state) => state.categories,
    
    // 获取所有类型
    getTypes: (state) => state.types,
    
    // 根据分类获取文章
    getArticlesByCategory: (state) => (category) => {
      if (category === 'all') return state.articles
      return state.articles.filter(article => article.category === category)
    },
    
    // 根据类型获取文章
    getArticlesByType: (state) => (type) => {
      if (type === 'all') return state.articles
      return state.articles.filter(article => article.type === type)
    },
    
    // 获取分类信息
    getCategoryInfo: (state) => (categoryValue) => {
      return state.categories.find(cat => cat.value === categoryValue)
    },
    
    // 根据ID获取文章
    getArticleById: (state) => (id) => {
      const numId = typeof id === 'string' ? parseInt(id) : id
      return state.articles.find(article => article.id === numId)
    }
  },

  actions: {
    // 获取所有文章
    async fetchArticles() {
      this.loading = true
      this.error = null
      try {
        // 模拟 API 延迟
        await new Promise(resolve => setTimeout(resolve, 500))
        this.articles = mockArticles
      } catch (error) {
        this.error = error.message || '获取文章失败'
        console.error('获取文章失败:', error)
      } finally {
        this.loading = false
      }
    },

    // 获取所有分类
    async fetchCategories() {
      this.loading = true
      this.error = null
      try {
        // 模拟 API 延迟
        await new Promise(resolve => setTimeout(resolve, 500))
        this.categories = mockCategories
      } catch (error) {
        this.error = error.message || '获取分类失败'
        console.error('获取分类失败:', error)
      } finally {
        this.loading = false
      }
    },

    // 获取单篇文章详情
    async fetchArticleById(id) {
      this.loading = true
      this.error = null
      try {
        // 模拟 API 延迟
        await new Promise(resolve => setTimeout(resolve, 500))
        const article = mockArticles.find(a => a.id === (typeof id === 'string' ? parseInt(id) : id))
        if (!article) {
          throw new Error('文章不存在')
        }
        // 更新或添加文章到列表中
        const index = this.articles.findIndex(a => a.id === article.id)
        if (index > -1) {
          this.articles[index] = article
        } else {
          this.articles.push(article)
        }
        return article
      } catch (error) {
        this.error = error.message || '获取文章详情失败'
        console.error('获取文章详情失败:', error)
        return null
      } finally {
        this.loading = false
      }
    },

    // 根据分类获取文章
    async fetchArticlesByCategory(category) {
      this.loading = true
      this.error = null
      try {
        // 模拟 API 延迟
        await new Promise(resolve => setTimeout(resolve, 500))
        const articles = mockArticles.filter(article => article.category === category)
        // 更新文章列表中对应分类的文章
        this.articles = this.articles.filter(article => article.category !== category)
        this.articles.push(...articles)
        return articles
      } catch (error) {
        this.error = error.message || '获取分类文章失败'
        console.error('获取分类文章失败:', error)
        return []
      } finally {
        this.loading = false
      }
    }
  }
}) 