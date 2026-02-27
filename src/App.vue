<template>
  <div class="app-container">
    <NavBar />
    <main class="main-content">
      <!-- 用 el-config-provider 包裹 router-view，实现 Element Plus 国际化联动 -->
      <el-config-provider :locale="elementLocale">
        <router-view v-slot="{ Component }">
          <keep-alive include="Config,DeviceInformation">
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </el-config-provider>
    </main>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n' // 👈 新增：引入 useI18n
import NavBar from './components/layout/NavBar.vue'

// 👇 新增：引入 Element Plus 语言包
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'

export default {
  name: 'App',
  components: {
    NavBar
  },
  setup() {
    // 获取 vue-i18n 的 locale 响应式引用
    const { locale } = useI18n()

    // 根据当前语言，动态返回对应的 Element Plus 语言包
    const elementLocale = computed(() => {
      return locale.value === 'zh-CN' ? zhCn : en
    })

    // 把 elementLocale 暴露给模板
    return {
      elementLocale
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
}

.main-content {
  flex: 1;
  margin-left: 200px;
  padding: 2rem;
  min-height: 100vh;
  background-color: #ffffff;
}
</style>