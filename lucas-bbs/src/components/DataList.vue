<script setup>
const props = defineProps({
  dataSource: {
    type: Object,
  },
});

const emit = defineEmits(["loadData"]);
const handlePageNoChange = (pageNo) => {
  props.dataSource.pageNo = pageNo;
  emit("loadData");
};
</script>

<template>
  <div v-for="item in dataSource.list">
    <slot :data="item" name="dataList"></slot>
  </div>
  <div class="pagination">
    <el-pagination
      v-if="dataSource.pageTotal > 1"
      background
      :total="dataSource.totalCount"
      v-model:current-page="dataSource.pageNo"
      layout="prev,pager,next"
      @current-change="handlePageNoChange"
      style="text-align: right"
    >
    </el-pagination>
  </div>
</template>

<style lang="scss" scoped>
.pagination {
  padding: 10px;
}
</style>
