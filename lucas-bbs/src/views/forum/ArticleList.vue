<script setup>
import ArticleListItem from "./ArticleListItem.vue";
import { ref, getCurrentInstance, watch } from "vue";
import {
  onBeforeRouteLeave,
  onBeforeRouteUpdate,
  useRoute,
  useRouter,
} from "vue-router";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();

//loading--用来标识正在加载的变量，在加载过程中，显示骨架效果
const loading = ref(false);

//文章显示排序方式
const orderType = ref(0);

const articleListInfo = ref({});

//一级板块与二级板块
const pBoardId = ref(0);
const boardId = ref(0);

//初始化时的页面上现实的文章，只执行一次，即默认情况下的文章列表
(async () => {
  loading.value = true;
  let params = {
    pageNo: articleListInfo.value.pageNo,
    // pBoardId: pBoardId.value,
    // boardId: boardId.value,
    orderType: orderType.value,
  };
  let result = await proxy.Request({
    url: proxy.globalInfo.api.loadArticle,
    params: params,
    showLoading: false,
  });
  loading.value = false;

  if (!result) {
    return;
  }
  articleListInfo.value = result.data;
})();
//对应文章列表加载
const loadArticle = async () => {
  loading.value = true;
  let params = {
    pageNo: articleListInfo.value.pageNo,
    pBoardId: pBoardId.value,
    boardId: boardId.value,
    orderType: orderType.value,
  };
  let result = await proxy.Request({
    url: proxy.globalInfo.api.loadArticle,
    params: params,
    showLoading: false,
  });
  loading.value = false;

  if (!result) {
    return;
  }
  articleListInfo.value = result.data;
};
// loadArticle();

const changeOrderType = (type) => {
  orderType.value = type;
  loadArticle();
};

// 监听路由变化
onBeforeRouteUpdate((to, from) => {
  console.log(to.params);
  console.log(from.params);
  console.log("----------------");
  pBoardId.value = to.params.pBoardId ? to.params.pBoardId : 0;
  boardId.value = to.params.boardId ? to.params.boardId : 0;
  if (to.params !== from.params) {
    loadArticle();
  }
});

onBeforeRouteLeave((to, from) => {
  pBoardId.value = to.params.pBoardId ? to.params.pBoardId : 0;
  boardId.value = to.params.boardId ? to.params.boardId : 0;
  loadArticle();
});
</script>

<template>
  <div
    class="body-container body-article-list"
    :style="{ width: proxy.globalInfo.bodyWidth + 'rem' }"
  >
    <div class="article-panel">
      <div class="top-tab">
        <div
          :class="['tab', orderType === 0 ? 'active' : '']"
          @click="changeOrderType(0)"
        >
          热榜
        </div>
        <el-divider direction="vertical"></el-divider>
        <div
          :class="['tab', orderType === 1 ? 'active' : '']"
          @click="changeOrderType(1)"
        >
          发布时间
        </div>
        <el-divider direction="vertical"></el-divider>
        <div
          :class="['tab', orderType === 2 ? 'active' : '']"
          @click="changeOrderType(2)"
        >
          最新
        </div>
      </div>
      <div class="article-list">
        <DataList
          :loading="loading"
          :dataSource="articleListInfo"
          noDataMsg="暂无数据"
          @loadData="loadArticle"
        >
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

      .tab {
        cursor: pointer;
      }
      .active {
        color: var(--link);
      }
    }
  }
}
</style>
