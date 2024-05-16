<script setup>
import ArticleListItem from "./ArticleListItem.vue";
import { ref, reactive, getCurrentInstance } from "vue";
import { useRoute, useRouter } from "vue-router";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();

//文章列表
const articleListInfo = ref({});
const loadArticle = async () => {
  let params = {
    pageNo: articleListInfo.value.pageNo,
    boardId: 0,
  };
  let result = await proxy.Request({
    url: proxy.globalInfo.api.loadArticle,
    params: params,
  });
  if (!result) {
    return;
  }
  articleListInfo.value = result.data;
};
loadArticle();
</script>

<template>
  <div
    class="body-container body-article-list"
    :style="{ width: proxy.globalInfo.bodyWidth + 'rem' }"
  >
    <div class="article-panel">
      <div class="top-tab">
        <div>热榜</div>
        <el-divider direction="vertical"></el-divider>
        <div>发布时间</div>
        <el-divider direction="vertical"></el-divider>
        <div>最新</div>
      </div>
      <div class="article-list">
        <DataList :dataSource="articleListInfo" @loadData="loadArticle">
          <template #dataList="{ data }">
            <ArticleListItem :data="data"></ArticleListItem>
          </template>
        </DataList>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.body-article-list {
  .article-panel {
    background: #fff;
    .top-tab {
      display: flex;
      align-items: center;
      padding: 10px;
      font-size: 15px;
      border-bottom: 1px solid #ddd;
    }
  }
}
</style>
