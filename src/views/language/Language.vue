<template>
  <div>
    <!-- 1. 标题：使用 $t（因 globalInjection: true） -->
    <h2>{{ $t('pharmacy.outStorageTitle') }}</h2>

    <!-- 2. 表格列名国际化 -->
    <vxe-table :data="tableData">
      <vxe-column field="drugName" :title="$t('pharmacy.drugName')" width="150"></vxe-column>
      <vxe-column field="outputQty" :title="$t('pharmacy.outputQty')" width="120"></vxe-column>
      <vxe-column :title="$t('common.action')" width="120">
        <template #default>
          <!-- 3. 操作按钮文本国际化 -->
          <el-button size="small" type="primary" @click="handleLossOut">
            {{ $t('pharmacy.lossOut') }}
          </el-button>
        </template>
      </vxe-column>
    </vxe-table>

    <!-- 4. 日期选择器 placeholder 国际化 -->
    <el-date-picker
      v-model="dateRange"
      type="daterange"
      :range-separator="$t('common.to')"
      :start-placeholder="$t('common.startDate')"
      :end-placeholder="$t('common.endDate')"
    />

    <!-- 5. 切换语言按钮（可放在任意页面） -->
    <el-button @click="switchLang" style="margin-top: 20px;">
      {{ $t('common.switchLang') }}
    </el-button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n' // 👈 关键：引入 useI18n

// 1. 获取 t 函数和 locale
const { t, locale } = useI18n()

// 2. 模拟表格数据
const tableData = ref([
  { drugName: '荔枝核', outputQty: 2 }
])

// 3. 日期范围
const dateRange = ref([])

// 4. 操作方法：盘亏出库
const handleLossOut = () => {
  // ✅ 在 JS 中使用 t() 做提示
  ElMessage.success(t('pharmacy.lossOutSuccess'))
}

// 5. 切换语言（推荐：指定目标语言）
const switchLang = () => {
  const newLang = locale.value === 'zh-CN' ? 'en-US' : 'zh-CN'
  locale.value = newLang
  localStorage.setItem('lang', newLang)
}
</script>