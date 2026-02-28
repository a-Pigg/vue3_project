<template>
  <div>
    <h1>{{ $t('directive.directive') }}</h1>
    <el-input
      v-model="inputValue"
      v-auto-focus
      :placeholder="$t('directive.autoFocusInput')"
      class="margintop"
    />
    <div class="margintop">
      <el-button type="primary" @click="dialogVisible = true">打开子组件对话框</el-button>
    </div>

    <!-- 父子组件对话框：v-model 控制显示，@submit 接收子组件提交 -->
    <DirectiveDialog
      v-model="dialogVisible"
      @submit="onDialogSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DirectiveDialog from './DirectiveDialog.vue'

const inputValue = ref('')
// 控制子组件对话框的显示（与子组件 v-model 双向绑定）
const dialogVisible = ref(false)

function onDialogSubmit(payload: { name: string; remark: string }) {
  console.log('子组件提交:', payload)
  // 这里可以调接口、刷新列表等
}
</script>

<style scoped>
.margintop {
  margin-top: 12px;
}
</style>
