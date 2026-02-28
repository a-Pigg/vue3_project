<template>
  <nav class="nav-container">
    <div>
      <div class="nav-title">设备管理</div>
      <el-button @click="toggleLang">切换语言-当前语言{{ locale.value }}</el-button>
    </div>
    <div class="nav-items">
      <!-- 
      <router-link to="/table" class="nav-item">虚拟化表格</router-link>
      <router-link to="/language" class="nav-item">语言</router-link> -->
      <router-link v-for="item in navItems" :key="item.name" :to="item.path" class="nav-item">
        {{ $t(item.meta?.title) }}
      </router-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
defineOptions({
  name: 'NavBar'
})
import { useI18n } from 'vue-i18n'
const { locale } = useI18n()
const toggleLang = () => {
  locale.value = locale.value === 'zh-CN' ? 'en-US' : 'zh-CN'
  localStorage.setItem('lang', locale.value)
  console.log(locale.value)
}

const router = useRouter()
const navItems = ref([])
onMounted(() => {
  navItems.value = router.getRoutes().filter(item => item.meta?.isShow) 
  console.log('router---', navItems.value)
})
</script>

<style scoped>
.nav-container {
  width: 200px;
  height: 100vh;
  background-color: #2c3e50;
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
}

.nav-title {
  padding: 1.5rem 1rem;
  font-size: 1.2rem;
  font-weight: bold;
  border-bottom: 1px solid #34495e;
  text-align: center;
}

.nav-items {
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
}

.nav-item {
  padding: 1rem;
  text-decoration: none;
  color: #ecf0f1;
  transition: background-color 0.3s;
  font-size: 1rem;
}

.nav-item:hover {
  background-color: #34495e;
}

.router-link-active {
  background-color: #34495e;
  border-left: 4px solid #42b983;
}
</style>