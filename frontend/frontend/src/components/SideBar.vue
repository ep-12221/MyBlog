<template>
  <el-aside width="250px" class="bg-gray-800 text-white">
    <div class="flex items-center justify-center h-16 mb-6">
      <h1 class="text-2xl font-bold">My Blog</h1>
    </div>
    <el-menu
      :default-active="activeMenu"
      class="el-menu-vertical-demo"
      background-color="#2d3a4b"
      text-color="#ffffff"
      active-text-color="#ffd04b"
      router
    >
      <el-menu-item index="/">
        <i class="el-icon-house"></i>
        <span>首页</span>
      </el-menu-item>
      <el-sub-menu index="sub1">
        <template #title>
          <i class="el-icon-document"></i>
          <span>主题</span>
        </template>
        <el-menu-item index="/topicA">主题 A</el-menu-item>
        <el-menu-item index="/topicB">主题 B</el-menu-item>
        <!-- ...更多主题 -->
      </el-sub-menu>
      <el-menu-item index="/about">
        <i class="el-icon-info"></i>
        <span>关于</span>
      </el-menu-item>
      <!-- ...其他导航项 -->
    </el-menu>
  </el-aside>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref, watch } from 'vue'

const route = useRoute()
const activeMenu = ref(route.path)

watch(
  () => route.path,
  (newPath) => {
    activeMenu.value = newPath
  }
)
</script>

<style scoped>
.el-menu-vertical-demo {
  height: 100%;
}
.el-menu-item, .el-sub-menu__title {
  display: flex;
  align-items: center;
}
.el-icon-house, .el-icon-document, .el-icon-info {
  margin-right: 10px;
}
</style>