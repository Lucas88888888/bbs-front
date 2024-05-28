<script setup>
import ArticleListItem from "@/views/forum/ArticleListItem.vue";
import { ref, getCurrentInstance, watch } from "vue";
import { useStore } from "vuex";
const { proxy } = getCurrentInstance();
const store = useStore();

const searchPanelHeight = (window.innerHeight - 60 - 140) / 4;

const formData = ref({});
const formDataRef = ref();
const rules = {
  keyword: [
    { required: true, message: "请输入关键字" },
    {
      min: 3,
      message: "关键字太少，至少三个字",
    },
  ],
};

//开始搜索
const startSearch = ref(false);
const startSearchHandler = () => {
  startSearch.value = true;
};
const loading = ref(false);
const articleListInfo = ref({});
const search = async () => {
  loading.value = true;
  let params = {
    pageNo: articleListInfo.value.pageNo,
    keyword: formData.value.keyword,
  };
  let result = await proxy.Request({
    url: proxy.globalInfo.api.search,
    params: params,
    showLoading: false,
  });
  loading.value = false;

  if (!result) {
    return;
  }
  let list = result.data.list;
  list.forEach((element) => {
    element.title = element.title.replace(
      params.keyword,
      "<span style='color:red'>" + params.keyword + "</span>"
    );
  });

  articleListInfo.value = result.data;
};

const changeInput = () => {
  if (formData.value.keyword == "") {
    articleListInfo.value = {};
  }
};

const showComment = ref(false);
watch(
  () => store.state.sysSetting,
  (newVal, oldVal) => {
    if (newVal) {
      showComment.value = newVal.commentOpen;
    }
  },
  { immediate: true, deep: true }
);
</script>

<template>
  <div
    class="body-container search-body"
    :style="{ width: proxy.globalInfo.bodyWidth + 'rem' }"
  >
    <div
      class="search-panel"
      :style="{ paddingTop: startSearch ? '0px' : searchPanelHeight + 'px' }"
    >
      <el-form
        :model="formData"
        :rules="rules"
        ref="formDataRef"
        @submit.prevent
      >
        <!--input输入-->
        <el-form-item prop="keyword">
          <el-input
            size="large"
            clearable
            placeholder="请输入想要查找的关键词"
            v-model="formData.keyword"
            @keyup.enter="search"
            @focus="startSearchHandler"
            @change="changeInput"
          >
            <template #suffix>
              <span
                class="iconfont icon-search"
                @click="search"
                @blur="formData.keyword = $event.target.value.tirm()"
              ></span>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </div>

    <div class="article-list">
      <DataList
        :loading="loading"
        :dataSource="articleListInfo"
        noDataMsg="没有发现帖子"
        @loadData="search"
      >
        <template #dataList="{ data }">
          <ArticleListItem
            :data="data"
            :showComment="showComment"
            :htmlTitle="true"
          ></ArticleListItem>
        </template>
      </DataList>
      <!-- {{ articleListInfo }} -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-body {
  background: #fff;
  padding: 10px;
  min-height: calc(100vh - 210px);
  .search-panel {
    transition: all 0.2s ease-in;
    display: flex;
    justify-content: center;
    .el-input {
      width: 700px;
    }
  }
}
</style>
