<script setup>
const props = defineProps({
  msg: {
    tpye: String,
  },
});
</script>

<template>
  <div class="no-data">
    <div class="iconfont icon-empty"></div>
    <div class="msg">{{ msg }}</div>
  </div>
</template>

<style lang="scss" scoped>
.no-data {
  text-align: center;
  padding: 10px 0;
  .icon-empty {
    font-size: 50px;
    color: #bbb;
  }

  .msg {
    margin-top: 10px;
    color: #909399;
    font-size: 14px;
  }
}
</style>
