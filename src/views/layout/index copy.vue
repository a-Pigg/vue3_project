<template>
  <div class="common-layout">
    <el-container class="full-page-container">
      <el-aside width="200px" style="height: 100%;background-color: aqua;">Aside</el-aside>
      <el-container>
        <el-header>Header</el-header>
        <el-main>Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.common-layout {
  height: 100%;
}

/* 撑满外面的 common-layout 
}
*/
/* .full-page-container {
  height: 100%;      
*/
</style>