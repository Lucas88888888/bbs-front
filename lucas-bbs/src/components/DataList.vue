<script setup>
const props = defineProps({
  dataSource: {
    type: Object,
  },
  loading: {
    type: Boolean,
  },
  noDataMsg: {
    type: String,
    default: "空空如也",
  },
});

const emit = defineEmits(["loadData"]);
const handlePageNoChange = (pageNo) => {
  props.dataSource.pageNo = pageNo;
  emit("loadData");
};
</script>

<template>
  <div
    v-if="!loading && dataSource.list !== null && dataSource.list.length === 0"
  >
    <NoData :msg="noDataMsg"></NoData>
  </div>

  <!-- 骨架效果 -->
  <div class="skeleton">
    <el-skeleton :rows="3" animated v-if="loading" />
  </div>
  <div v-for="item in dataSource.list" v-if="!loading">
    <slot :data="item" name="dataList"></slot>
  </div>
  <div class="pagination">
    <el-pagination
      v-if="dataSource.pageTotal > 1"
      background
      :page-size="15"
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

.skeleton {
  padding: 15px;
}
</style>
