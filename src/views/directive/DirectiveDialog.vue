<template>
  <el-dialog
    :model-value="modelValue"
    destroy-on-close
    title="子组件对话框"
    width="400px"
    @update:model-value="handleClose"
  >
    <div class="dialog-body">
      <el-input v-model="formData.name" placeholder="请输入名称" />
      <el-input v-model="formData.remark" placeholder="备注" class="margintop" type="textarea" />
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

// 父组件通过 v-model 控制显示/隐藏（对应 modelValue + update:modelValue）
defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', payload: { name: string; remark: string }): void
}>()

const formData = reactive({ name: '', remark: '' })

function handleClose() {
  emit('update:modelValue', false)
}

function handleSubmit() {
  emit('submit', { ...formData })
  emit('update:modelValue', false)
}
</script>

<style scoped>
.margintop {
  margin-top: 12px;
}
.dialog-body {
  padding: 8px 0;
}
</style>
