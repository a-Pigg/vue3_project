<template>
  <div class="page">

    <el-card class="card1">
      <div style="display: flex;flex-direction: column;height: 100%;">
        <div style="display: flex;gap: 10px; margin-bottom: 10px;flex-shrink: 0;">
          <el-button type="primary">添加</el-button>
          <el-button type="primary">确认</el-button>
        </div>

        <div style="flex: 2;border: 1px solid black;margin-bottom: 10px;">
          <el-tree :data="templateTrees" default-expand-all highlight-current node-key="id"
            :props="{ label: 'label', children: 'children' }" style="width: 100%; height: 100%; overflow-y: auto;" />
        </div>

        <div style="flex: 1.5;border: 1px solid black;">
          123
        </div>
      </div>

    </el-card>

    <el-card class="card2">
      <el-tabs v-model="editableTabsValue" type="card" class="demo-tabs" closable @tab-remove="removeTab">
        <el-tab-pane v-for="item in editableTabs" :key="item.name" :label="item.title" :name="item.name">
          <template #default>
            {{ item.content }} 11233131
          </template>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const templateTrees = ref(
  [
    {
      id: 't-1',
      label: '发热病历（测试模板，非正式）',
      children: [
        { id: 't-1-1', label: '咳嗽病历' },
        { id: 't-1-2', label: '门诊病历' },
        { id: 't-1-3', label: '发热病历' },
      ],
    },
    {
      id: 't-2',
      label: '门诊病历',
      children: [{ id: 't-2-1', label: '门诊病历成人模板' }],
    },
  ]
)

let tabIndex = 2
const editableTabsValue = ref('2')
const editableTabs = ref([
  {
    title: 'Tab 1',
    name: '1',
    content: 'Tab 1 content',
  },
  {
    title: 'Tab 2',
    name: '2',
    content: 'Tab 2 content',
  },
])

const clickNode = (v1) => {
  console.log(v1)
  addTab(v1.label)
}

const addTab = (targetName: string) => {
  const newTabName = `${++tabIndex}`
  editableTabs.value.push({
    title: targetName,
    name: newTabName,
    content: 'New Tab content',
  })
  editableTabsValue.value = newTabName
}
const removeTab = (targetName: TabPaneName) => {
  const tabs = editableTabs.value
  let activeName = editableTabsValue.value
  if (activeName === targetName) {
    tabs.forEach((tab, index) => {
      if (tab.name === targetName) {
        const nextTab = tabs[index + 1] || tabs[index - 1]
        if (nextTab) {
          activeName = nextTab.name
        }
      }
    })
  }

  editableTabsValue.value = activeName
  editableTabs.value = tabs.filter((tab) => tab.name !== targetName)
}
</script>

<style scoped>
.page {
  width: 100%;
  height: 100%;
  background-color: aqua;
  display: flex;
  gap: 10px;
}

.card1 {
  flex: 1;
}

.card2 {
  flex: 2
}

:deep(.el-card__body) {
  height: 100%;
  /* 让 body 占满 card 的高度 */

}
</style>