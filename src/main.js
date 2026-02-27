import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './style.css'

// 引入i18n
import i18n from './i18n'

// 设置Element Plus全局配置
import { ElMessage } from 'element-plus'

// 添加全局样式，使消息提示显示在顶部
// const style = document.createElement('style')
// style.textContent = `
//   .el-message {
//     top: 20px !important;
//     transform: translateX(-50%) !important;
//     bottom: auto !important;
//     margin-bottom: 0 !important;
//   }
// `
// document.head.appendChild(style)

const app = createApp(App)
app.use(router)
app.use(ElementPlus)
app.use(i18n)
app.mount('#app')


// 自动聚焦指令：v-auto-focus 或 v-autoFocus（Vue 会自动转换命名）
app.directive('autoFocus', {
  mounted(el) {
    // 尝试查找内部的 input 元素
    const input = el.querySelector?.('input');
    if (input && typeof input.focus === 'function') {
      input.focus();
    }
  }
})