<script setup></script>

<template>
  <div class="error">
    <div class="info">404</div>
    <div><router-link :to="'/'">返回首页</router-link></div>
  </div>
</template>

<style lang="scss" scoped>
.error {
  text-align: center;
  padding-top: 200px;
  .info {
    font-size: 100px;
    color: #949494;
  }
  a {
    font-size: 30px;
  }
}
</style>
