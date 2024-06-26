<script setup>
import { ref, reactive, getCurrentInstance, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const store = useStore();

const activeTabName = ref("reply");

const tabChange = (type) => {
  router.push({
    name: "message",
    params: {
      type: type,
    },
  });
};

//消息数量
const messageCountInfo = ref({});
watch(
  () => store.state.messageCountInfo,
  (newVal, oldVal) => {
    messageCountInfo.value = newVal || {};
  },
  { immediate: true, deep: true }
);

const loading = ref(false);
const messageListInfo = ref({});
const loadMessage = async () => {
  loading.value = true;
  let params = {
    pageNo: messageListInfo.value.pageNo,
    code: activeTabName.value,
  };
  let result = await proxy.Request({
    url: proxy.globalInfo.api.loadMessageList,
    params: params,
    showLoading: false,
  });
  loading.value = false;

  if (!result) {
    return;
  }
  messageListInfo.value = result.data;
  store.commit("readMessage", activeTabName.value);
};

watch(
  () => route.params.type,
  (newVal, oldVal) => {
    activeTabName.value = newVal;
    loadMessage();
  },
  { immediate: true, deep: true }
);

//监听用户信息
const userId = ref(null);
watch(
  () => store.state.loginUserInfo,
  (newVal, oldVal) => {
    if (newVal) {
      userId.value = newVal.userId;
    }
  },
  { immediate: true, deep: true }
);
</script>

<template>
  <div
    class="body-container message-center"
    :style="{ width: proxy.globalInfo.bodyWidth + 'rem' }"
  >
    <div class="user-banner">
      <router-link to="/" class="">首页</router-link>
      <span class="iconfont icon-right"></span>
      <span>消息中心</span>
    </div>
    <div class="message-panel">
      <div class="tab-list">
        <el-tabs :model-value="activeTabName" @tab-change="tabChange">
          <el-tab-pane name="reply">
            <template #label>
              <div class="tab-item">
                <span>回复我的</span>
                <span class="count-tag" v-if="messageCountInfo.reply > 0">{{
                  messageCountInfo.reply > 99 ? "99+" : messageCountInfo.reply
                }}</span>
              </div>
            </template>
          </el-tab-pane>
          <el-tab-pane name="likePost">
            <template #label>
              <div class="tab-item">
                <span>赞了我的文章</span>
                <span class="count-tag" v-if="messageCountInfo.likePost > 0">{{
                  messageCountInfo.likePost > 99
                    ? "99+"
                    : messageCountInfo.likePost
                }}</span>
              </div>
            </template>
          </el-tab-pane>
          <el-tab-pane name="downloadAttachment">
            <template #label>
              <div class="tab-item">
                <span>下载了我的附件</span>
                <span
                  class="count-tag"
                  v-if="messageCountInfo.downloadAttachment > 0"
                  >{{
                    messageCountInfo.downloadAttachment > 99
                      ? "99+"
                      : messageCountInfo.downloadAttachment
                  }}</span
                >
              </div>
            </template>
          </el-tab-pane>
          <el-tab-pane name="likeComment">
            <template #label>
              <div class="tab-item">
                <span>赞了我的评论</span>
                <span
                  class="count-tag"
                  v-if="messageCountInfo.likeComment > 0"
                  >{{
                    messageCountInfo.likeComment > 99
                      ? "99+"
                      : messageCountInfo.likeComment
                  }}</span
                >
              </div>
            </template>
          </el-tab-pane>
          <el-tab-pane name="sys">
            <template #label>
              <div class="tab-item">
                <span>系统消息</span>
                <span class="count-tag" v-if="messageCountInfo.sys > 0">{{
                  messageCountInfo.sys > 99 ? "99+" : messageCountInfo.sys
                }}</span>
              </div>
            </template>
          </el-tab-pane>
        </el-tabs>
        <router-link :to="`/user/${userId}`" class="go-ucenter"
          >&lt;&lt;个人中心</router-link
        >
      </div>

      <div class="message-list">
        <DataList
          :loading="loading"
          :dataSource="messageListInfo"
          noDataMsg="暂无消息"
          @loadData="loadMessage"
        >
          <template #dataList="{ data }">
            <!-- 系统消息 -->
            <div class="message-item" v-if="data.messageType == 0">
              <div class="message-content">
                <span v-html="data.messageContent"></span>
                <span class="create-time">{{ data.createTime }}</span>
              </div>
            </div>

            <!-- 回复我的 -->
            <div class="message-item" v-if="data.messageType == 1">
              <Avatar :userId="data.sendUserId" :width="5"></Avatar>
              <div class="message-content">
                <div>
                  <router-link :to="`/user/${data.sendUserId}`"
                    >@{{ data.sendNickName }}</router-link
                  >对我的文章【<router-link :to="`/post/${data.articleId}`">{{
                    data.articleTitle
                  }}</router-link
                  >】发表了评论
                  <span class="create-time">{{ data.createTime }}</span>
                </div>
                <div class="reply-content" v-html="data.messageContent"></div>
              </div>
            </div>

            <!-- 赞了我的评论 -->
            <div class="message-item" v-if="data.messageType == 3">
              <Avatar :userId="data.sendUserId" :width="5"></Avatar>
              <div class="message-content">
                <div>
                  <router-link :to="`/user/${data.sendUserId}`"
                    >@{{ data.sendNickName }}</router-link
                  >在文章【<router-link :to="`/post/${data.articleId}`">{{
                    data.articleTitle
                  }}</router-link
                  >】中赞了我的评论
                  <span class="create-time">{{ data.createTime }}</span>
                </div>
                <div class="reply-content" v-html="data.messageContent"></div>
              </div>
            </div>

            <!-- 赞了我的文章 -->
            <div class="message-item" v-if="data.messageType == 2">
              <Avatar :userId="data.sendUserId" :width="5"></Avatar>
              <div class="message-content">
                <div>
                  <router-link :to="`/user/${data.sendUserId}`"
                    >@{{ data.sendNickName }}</router-link
                  >赞了我的文章【<router-link :to="`/post/${data.articleId}`">{{
                    data.articleTitle
                  }}</router-link
                  >】
                  <span class="create-time">{{ data.createTime }}</span>
                </div>
              </div>
            </div>

            <!-- 下载了我的附件 -->
            <div class="message-item" v-if="data.messageType == 4">
              <Avatar :userId="data.sendUserId" :width="5"></Avatar>
              <div class="message-content">
                <div>
                  <router-link :to="`/user/${data.sendUserId}`"
                    >@{{ data.sendNickName }}</router-link
                  >在文章【<router-link :to="`/post/${data.articleId}`">{{
                    data.articleTitle
                  }}</router-link
                  >】中下载了我的附件
                  <span class="create-time">{{ data.createTime }}</span>
                </div>
              </div>
            </div>
          </template>
        </DataList>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.message-center {
  .user-banner {
    line-height: 35px;
    font-size: 16px;
    color: #616161;

    .icon-right {
      padding: 0 5px;
    }
  }
  .message-panel {
    background: #fff;
    padding: 10px;
    margin-top: 5px;
    .tab-list {
      position: relative;
      .tab-item {
        position: relative;
        padding: 0 10px;
        .count-tag {
          position: absolute;
          top: -10px;
          right: -10px;
          height: 15px;
          min-width: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          background: #f56c6c;
          border-radius: 50%;
          font-size: 13px;
          text-align: center;
          margin-left: 10px;
        }
      }
      .go-ucenter {
        position: absolute;
        top: 10px;
        right: 10px;
        font-size: 14px;
      }
    }
    .message-list {
      .message-item {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: 14px;
        border-bottom: 1px solid #ddd;
        padding: 10px;
        .message-content {
          // display: flex;
          // flex-direction: column;
          // justify-content: center;
          margin-left: 5px;
          .create-time {
            color: #9ba7b9;
            margin-left: 10px;
          }
          .reply-content {
            border-left: 2px solid #11a8f4;
            padding-left: 5px;
            margin-top: 5px;
          }
        }
      }
    }
  }
}
</style>
