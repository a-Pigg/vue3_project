import { createI18n } from 'vue-i18n'
import zhCN from './zh-CN.json'
import enUS from './en-US.json'

// 自动检测浏览器语言（可选）
const browserLang = navigator.language || 'zh-CN'
const defaultLocale = ['zh-CN', 'en-US'].includes(browserLang) ? browserLang : 'zh-CN'

const i18n = createI18n({
  legacy: false,          // 关闭 legacy 模式，使用 Composition API
  globalInjection: true,  // 全局注册 $t 方法
  locale: localStorage.getItem('lang') || defaultLocale,
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS
  }
})

export default i18n