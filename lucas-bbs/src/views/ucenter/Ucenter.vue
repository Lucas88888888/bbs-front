<script setup>
import UserIntegralRecord from "./UserIntegralRecord.vue";
import UcenterEditUserInfo from "./UcenterEditUserInfo.vue";
import ArticleListItem from "../forum/ArticleListItem.vue";

import { ref, reactive, getCurrentInstance, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const store = useStore();

const userId = ref(null);
const userInfo = ref({});
const loadUserInfo = async () => {
  let result = await proxy.Request({
    url: proxy.globalInfo.api.ucenterGetUserInfo,
    params: {
      userId: userId.value,
    },
    errorCallback: () => {
      setTimeout(() => {
        router.push("/");
      }, 1500);
    },
  });
  if (!result) {
    return;
  }
  userInfo.value = result.data;
};

//右侧文章
const activeTabName = ref(0);
const changeTab = (type) => {
  activeTabName.value = type;
  loadArticle();
};

const loading = ref(false);
const articleListInfo = ref({});

const loadArticle = async () => {
  loading.value = true;
  let params = {
    pageNo: articleListInfo.value.pageNo,
    type: activeTabName.value,
    userId: userId.value,
  };
  let result = await proxy.Request({
    url: proxy.globalInfo.api.loadUserArticle,
    params: params,
    showLoading: false,
  });
  loading.value = false;

  if (!result) {
    return;
  }
  articleListInfo.value = result.data;
};

const isCurrentUser = ref(false);
//重新设置当前用户
const resetCurrentUser = () => {
  const loginUserInfo = store.getters.getLoginUserInfo;
  if (loginUserInfo && loginUserInfo.userId == userId.value) {
    isCurrentUser.value = true;
  } else {
    isCurrentUser.value = false;
  }
};

//通过状态中的当前登录的用户信息来触发
watch(
  () => store.state.loginUserInfo,
  (newVal, oldVal) => {
    resetCurrentUser();
  },
  { immediate: true, deep: true }
);

//通过路径中的用户id来触发
watch(
  () => route.params.userId,
  (newVal, oldVal) => {
    if (newVal) {
      userId.value = newVal;
      resetCurrentUser();
      loadUserInfo();
      loadArticle();
    }
  },
  { immediate: true, deep: true }
);

//修改用户信息
const ucenterEditUserInfoRef = ref(null);
const updateUserInfo = () => {
  ucenterEditUserInfoRef.value.showEditUserInfoDialog(userInfo.value);
};

const resetUserInfoHandler = (data) => {
  userInfo.value = data;
};

//获取用户积分记录
const ucenterIntegralRecordRef = ref(null);
const showIntegralRecord = () => {
  ucenterIntegralRecordRef.value.showRecord();
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
    class="body-container ucenter"
    :style="{ width: proxy.globalInfo.bodyWidth + 'rem' }"
  >
    <div class="user-banner">
      <router-link to="/" class="">首页</router-link>
      <span class="iconfont icon-right"></span>
      <span>个人中心</span>
    </div>
    <div class="ucenter-panel">
      <div class="user-side">
        <!-- 头像信息 -->
        <div class="avatar-panel">
          <div class="edit-btn" v-if="isCurrentUser" @click="updateUserInfo">
            修改资料
          </div>

          <div class="avatar-inner">
            <Avatar :userId="userInfo.userId" :width="12"></Avatar>
          </div>
          <div class="nick-name">
            <span>{{ userInfo.nickName }}</span>
            <span v-if="userInfo.sex == 0" class="iconfont icon-woman"></span>
            <span v-if="userInfo.sex == 1" class="iconfont icon-man"></span>
          </div>

          <div class="desc">
            {{ userInfo.personDescription }}
          </div>
        </div>
        <!-- 扩展信息 -->
        <div class="user-extend-panel">
          <div class="info-item">
            <div class="label iconfont icon-integral">积分</div>
            <div
              class="value a-link"
              v-if="isCurrentUser"
              @click="showIntegralRecord"
            >
              {{ userInfo.currentIntegral }}
            </div>
            <div class="value" v-else>
              {{ userInfo.currentIntegral }}
            </div>
          </div>
          <div class="info-item">
            <div class="label iconfont icon-like">获赞</div>
            <div class="value">{{ userInfo.likeCount }}</div>
          </div>
          <div class="info-item">
            <div class="label iconfont icon-post">发帖</div>
            <div class="value">{{ userInfo.postCount }}</div>
          </div>
          <div class="info-item">
            <div class="label iconfont icon-register">加入</div>
            <div class="value">{{ userInfo.joinTime }}</div>
          </div>
          <div class="info-item">
            <div class="label iconfont icon-login">最后登录</div>
            <div class="value">{{ userInfo.lastLoginTime }}</div>
          </div>
        </div>
      </div>
      <div class="article-panel">
        <el-tabs :model-value="activeTabName" @tab-change="changeTab">
          <el-tab-pane label="发帖" :name="0"></el-tab-pane>
          <el-tab-pane label="评论" :name="1"></el-tab-pane>
          <el-tab-pane label="点赞" :name="2"></el-tab-pane>
        </el-tabs>
        <div class="article-list">
          <DataList
            :dataSource="articleListInfo"
            :loading="loading"
            @loadData="loadArticle"
            noDataMsg="暂无相关文章"
          >
            <template #dataList="{ data }">
              <ArticleListItem
                :data="data"
                :showEdit="activeTabName == 0 && isCurrentUser"
                :showComment="showComment"
              ></ArticleListItem>
            </template>
          </DataList>
        </div>
      </div>
    </div>
    <!-- 修改用户信息 -->
    <UcenterEditUserInfo
      ref="ucenterEditUserInfoRef"
      @resetUserInfo="resetUserInfoHandler"
    ></UcenterEditUserInfo>
    <!-- 用户积分记录 -->
    <UserIntegralRecord ref="ucenterIntegralRecordRef"></UserIntegralRecord>
  </div>
</template>

<style lang="scss" scoped>
.ucenter {
  .user-banner {
    line-height: 35px;
    font-size: 16px;
    color: #616161;

    .icon-right {
      padding: 0 5px;
    }
  }
  .ucenter-panel {
    display: flex;
    .user-side {
      width: 300px;
      margin-right: 10px;
      .avatar-panel {
        background: #fff;
        text-align: center;
        padding: 10px;
        .avatar-inner {
          display: flex;
          justify-content: center;
        }

        .edit-btn {
          text-align: right;
          font-size: 14px;
          color: var(--link);
          cursor: pointer;
        }
        .nick-name {
          font-size: 14px;
          .iconfont {
            margin-left: 5px;
            // color: var(--link);
          }
          .icon-woman {
            color: rgb(251, 173, 186);
          }
          .icon-man {
            color: rgb(9, 136, 195);
          }
        }
        .desc {
          margin-top: 5px;
          text-align: left;
          font-size: 14px;
          color: #939393;
        }
      }
      .user-extend-panel {
        margin-top: 10px;
        background: #fff;
        padding: 10px;
        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          line-height: 30px;
          .a-link {
            color: var(--link);
            cursor: pointer;
          }

          .label {
            font-size: 13px;
            display: flex;
            align-items: center;
          }
          .label::before {
            font-size: 22px;
            color: #888888;
            padding-right: 5px;
          }
        }
      }
    }
    .article-panel {
      flex: 1;
      background: #fff;
      padding: 0 10px 10px 10px;
    }
  }
}
</style>
