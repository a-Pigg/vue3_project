// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import Table from '../views/table/Table.vue'
import Language from '../views/language/Language.vue'
import Directive from '@/views/directive/Directive.vue'
// import Directive2 from '../views/directive/Directive2.vue'

const routes = [
  {
    path: '/',
    redirect: '/ota',
    meta: {
      isShow: false,
      title: 'nav.home' // 虽然不显示，但保持结构一致
    }
  },
  {
    path: '/table',
    name: 'Table',
    component: Table,
    meta: {
      isShow: true,
      title: 'nav.virtualTable'
    }
  },
  {
    path: '/language',
    name: 'Language',
    component: Language,
    meta: {
      isShow: true,
      title: 'nav.language'
    }
  },
  {
    path: '/directive',
    name: 'Directive',
    component: Directive,
    meta: {
      isShow: true,
      title: 'nav.directive'
    }
  },
  {
    path: '/layout',
    name: 'Layout',
    component: () => import('@/views/layout/index.vue'),
    meta: {
      isShow: true,
      title: 'nav.layout'
    }
  },
  {
    path: '/ota',
    name: 'Ota',
    component: () => import('@/views/ota/index.vue'),
    meta: {
      isShow: true,
      title: 'nav.ota'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router