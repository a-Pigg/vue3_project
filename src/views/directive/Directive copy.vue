<template>
    <div>
        <!-- 自定义指令 -->
        <h1>{{ $t('directive.directive') }}</h1>
        <!-- v-auto-focus -->
        <el-input v-model="inputValue" v-auto-focus :placeholder="$t('directive.autoFocusInput')"></el-input>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const inputValue = ref('')
</script>

<style scoped>

</style>