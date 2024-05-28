<script setup>
import { reactive } from "vue";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
const locale = zhCn;
const config = reactive({
  max: 1,
});
</script>

<template>
  <router-view></router-view>
  <el-config-provider :locale="locale" :message="config"></el-config-provider>
</template>

<style scoped></style>
