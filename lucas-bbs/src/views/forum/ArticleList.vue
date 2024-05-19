<script setup>
import ArticleListItem from "./ArticleListItem.vue";
import { ref, getCurrentInstance, watch } from "vue";
import { useStore } from "vuex";
import {
  onBeforeRouteLeave,
  onBeforeRouteUpdate,
  useRoute,
  useRouter,
} from "vue-router";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const store = useStore();

//loading--用来标识正在加载的变量，在加载过程中，显示骨架效果
const loading = ref(false);

//文章显示排序方式
const orderType = ref(0);

const articleListInfo = ref({});

//一级板块与二级板块
const pBoardId = ref(0);
const boardId = ref(0);
const panel = {
  pBoardId,
  boardId,
};

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

//二级板块
const subBoardList = ref([]);
const setSubBoard = () => {
  subBoardList.value = store.getters.getSubBoardList(pBoardId.value);
};

// 监听路由变化
watch(
  () => route.params.pBoardId,
  (newVal, oldVal) => {
    pBoardId.value = newVal;
    panel.pBoardId.value = newVal;
    // console.log(pBoardId.value);
    store.commit("setActivePBoardId", newVal);
  },
  { immediate: true, deep: true }
);

watch(
  () => route.params.boardId,
  (newVal, oldVal) => {
    boardId.value = newVal;
    panel.boardId.value = newVal;

    // console.log(boardId.value);

    store.commit("setActiveBoardId", newVal);
  },
  { immediate: true, deep: true }
);

watch(
  () => panel,
  (newVal, oldVal) => {
    pBoardId.value = panel.pBoardId.value;
    boardId.value = panel.boardId.value;
    console.log(pBoardId.value, boardId.value);
    loadArticle();
    setSubBoard();
  },
  { immediate: true, deep: true }
);

//二级板块内容变化
watch(
  () => store.state.boardList,
  (newVal, oldVal) => {
    setSubBoard();
  },
  { immediate: true, deep: true }
);

//文章排序的方式
const changeOrderType = (type) => {
  orderType.value = type;
  loadArticle();
};
</script>

<template>
  <div
    class="body-container body-article-list"
    :style="{ width: proxy.globalInfo.bodyWidth + 'rem' }"
  >
    <!-- 二级板块信息 -->
    <div class="sub-board" v-if="pBoardId">
      <span :class="['subBoard-item', boardId == undefined ? 'active' : '']">
        <router-link :to="`/forum/${pBoardId}`">全部</router-link>
      </span>
      <span
        v-for="item in subBoardList"
        :class="['subBoard-item', item.boardId == boardId ? 'active' : '']"
      >
        <router-link :to="`/forum/${item.pBoardId}/${item.boardId}/`">{{
          item.boardName
        }}</router-link>
      </span>
    </div>
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
  .sub-board {
    padding: 10px 0;

    a {
      color: #909090;
    }
    .subBoard-item {
      background: #fff;
      border-radius: 15px;
      padding: 2px 10px;
      margin-right: 10px;
      // color: #909090;
      cursor: pointer;
      font-size: 14px;
    }

    .active {
      background: var(--link);
      a {
        color: #ffffff;
      }
    }
  }
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
valueOfvalueOfRouterLinkRouterLinkRouterLinkRouterLink
