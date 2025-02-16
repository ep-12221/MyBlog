import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import ArticlesView from '../views/ArticlesView.vue'
import ArticleDetail from '../views/ArticleDetail.vue'
import AboutView from '../views/AboutView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
      meta: { keepAlive: true }
    },
    {
      path: '/articles',
      name: 'articles',
      component: ArticlesView,
      meta: { keepAlive: true }
    },
    {
      path: '/articles/:id',
      name: 'article-detail',
      component: ArticleDetail,
      props: true,
      meta: { keepAlive: false }
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
      meta: { keepAlive: true }
    }
  ]
})

// 全局导航守卫
router.beforeEach((to, from, next) => {
  // 正常导航
  next()
})

export default router
