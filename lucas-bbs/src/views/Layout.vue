<script setup>
import LoginAndRegister from "./LoginAndRegister.vue";
import {
  ref,
  reactive,
  getCurrentInstance,
  onMounted,
  watch,
  onUnmounted,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const store = useStore();

//dialog对话框的按钮数量

// 这是header导航栏的固定行为
const showHeader = ref(true);

const initScroll = () => {
  let initScrollTop = document.documentElement.scrollTop;
  let scrollType = 0;
  window.addEventListener("scroll", () => {
    let currentScrollTop = document.documentElement.scrollTop;
    if (currentScrollTop > initScrollTop) {
      //往下滚动
      scrollType = 1;
    } else {
      // 往上滚动
      scrollType = 0;
    }
    initScrollTop = currentScrollTop;
    if (scrollType === 1 && currentScrollTop > 150) {
      showHeader.value = false;
    } else {
      showHeader.value = true;
    }
  });
};

//登录注册
//用来判断选择登录页面还是注册页面进行显示
const loginRegisterRef = ref(null);
const loginAndRegister = (type) => {
  loginRegisterRef.value.showPanel(type);
};

onMounted(() => {
  initScroll();
  getUserInfo();
});

//获取用户信息
const getUserInfo = async () => {
  let result = await proxy.Request({
    // url: api.getUserInfo,
    url: proxy.globalInfo.api.getUserInfo,
  });
  if (!result) {
    return;
  }

  store.commit("updateLoginUserInfo", result.data);
};

//获取板块信息
const boardList = ref([]);
const loadBoard = async () => {
  let result = await proxy.Request({
    url: proxy.globalInfo.api.loadBoard,
  });
  if (!result) {
    return;
  }
  boardList.value = result.data;
  store.commit("saveBoardList", result.data);
};
loadBoard();

//一级板块点击
const boardClickHandler = (board) => {
  // router.push(`/forum/${board.boardId}`);
  router.push({ name: "topBoard", params: { pBoardId: board.boardId } });
};

//二级板块
const subBoardClickHandler = (subBoard) => {
  // router.push(`/forum/${subBoard.pBoardId}/${subBoard.boardId}/`);
  router.push({
    name: "secBoard",
    params: { pBoardId: subBoard.pBoardId, boardId: subBoard.boardId },
  });
};
//监听 登录用户信息
const userInfo = ref({});
watch(
  () => store.state.loginUserInfo,
  (newVal) => {
    // if (newVal !== undefined && newVal !== null) {
    //   userInfo.value = newVal;
    // } else {
    //   userInfo.value = {};
    // }
    userInfo.value = newVal || {};
  },
  { immediate: true, deep: true }
);

//监听是否展示登录框 用于长时间未操作情况下的登录超时
watch(
  () => store.state.showLogin,
  (newVal, oldVal) => {
    if (newVal) {
      loginAndRegister(1);
    }
  },
  { immediate: true, deep: true }
);

//当前选中的板块
const activePBoardId = ref(0);
watch(
  () => store.state.activePBoardId,
  (newVal, oldVal) => {
    activePBoardId.value = newVal;
  },
  { immediate: true, deep: true }
);

const activeBoardId = ref(0);
watch(
  () => store.state.activeBoardId,
  (newVal, oldVal) => {
    activeBoardId.value = newVal;
  },
  { immediate: true, deep: true }
);

//发帖
const newPost = () => {
  if (!store.getters.getLoginUserInfo) {
    loginAndRegister(1);
  } else {
    router.push({
      name: "postArticle",
    });
  }
};

const gotoUcenter = (userId) => {
  router.push({
    name: "userInfo",
    params: {
      userId: userId,
    },
  });
};

//消息相关
const gotoMessage = (type1) => {
  router.push({
    name: "message",
    params: {
      type: type1,
    },
  });
};

const messageCountInfo = ref({});
const loadMessageCount = async () => {
  let result = await proxy.Request({
    url: proxy.globalInfo.api.getMessageCount,
  });
  if (!result) {
    return;
  }
  messageCountInfo.value = result.data;
  store.commit("updateMessageCountInfo", result.data);
};
loadMessageCount();

watch(
  () => store.state.loginUserInfo,
  (newVal, oldVal) => {
    if (newVal) {
      loadMessageCount();
    }
  },
  { immediate: true, deep: true }
);

watch(
  () => store.state.messageCountInfo,
  (newVal, oldVal) => {
    messageCountInfo.value = newVal || {};
  },
  { immediate: true, deep: true }
);

//用户退出
const logout = () => {
  proxy.Confirm("确定要退出吗？", async () => {
    let result = await proxy.Request({
      url: proxy.globalInfo.api.logout,
    });
    if (!result) {
      return;
    }
    store.commit("updateLoginUserInfo", null);
  });
};
</script>

<template>
  <div>
    <div class="header" v-if="showHeader">
      <div class="header-content">
        <!-- logo -->
        <router-link to="/" class="header-logo">Easybbs</router-link>
        <!-- header-头部导航,板块信息 -->
        <div class="header-menu">
          <router-link
            :class="[
              'header-menu-board',
              activePBoardId == undefined ? 'active' : '',
            ]"
            to="/"
            >首页</router-link
          >

          <template v-for="board in boardList">
            <el-popover
              placement="bottom-start"
              :width="300"
              trigger="hover"
              v-if="board.children.length > 0"
            >
              <template #reference>
                <span
                  :class="[
                    'header-menu-board',
                    board.boardId == activePBoardId ? 'active' : '',
                  ]"
                  @click="boardClickHandler(board)"
                  >{{ board.boardName }}</span
                >
              </template>
              <div class="sub-board-list">
                <span
                  :class="[
                    'sub-board',
                    subBoard.boardId == activeBoardId ? 'active' : '',
                  ]"
                  v-for="subBoard in board.children"
                  @click="subBoardClickHandler(subBoard)"
                >
                  {{ subBoard.boardName }}
                </span>
              </div>
            </el-popover>
            <span
              :class="[
                'header-menu-board',
                board.boardId == activePBoardId ? 'active' : '',
              ]"
              @click="boardClickHandler(board)"
              v-else
              >{{ board.boardName }}</span
            >
          </template>
        </div>
        <!-- header-头部用户信息 -->
        <div class="header-operate">
          <el-button type="primary" @click="newPost">
            发帖<span class="iconfont icon-add"></span>
          </el-button>
          <el-button type="primary">
            搜索<span class="iconfont icon-search"></span>
          </el-button>
          <!-- 显示用户信息 -->
          <div v-if="userInfo.userId" class="user-box">
            <div class="message-info">
              <el-dropdown>
                <el-badge
                  :value="messageCountInfo.total"
                  class="item"
                  :hidden="
                    messageCountInfo.total == null ||
                    messageCountInfo.total == 0
                  "
                  ><span class="iconfont icon-message"></span>
                </el-badge>

                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      @click="gotoMessage('reply')"
                      class="message-item"
                    >
                      <span class="text">回复我的</span>
                      <span
                        class="count-tag"
                        v-if="messageCountInfo.reply > 0"
                        >{{
                          messageCountInfo.reply > 99
                            ? "99+"
                            : messageCountInfo.reply
                        }}</span
                      >
                    </el-dropdown-item>
                    <el-dropdown-item
                      @click="gotoMessage('likePost')"
                      class="message-item"
                      ><span class="text">赞了我的文章</span>
                      <span
                        class="count-tag"
                        v-if="messageCountInfo.likePost > 0"
                        >{{
                          messageCountInfo.likePost > 99
                            ? "99+"
                            : messageCountInfo.likePost
                        }}</span
                      ></el-dropdown-item
                    >
                    <el-dropdown-item
                      @click="gotoMessage('downloadAttachment')"
                      class="message-item"
                    >
                      <span class="text">下载了我的附件</span>
                      <span
                        class="count-tag"
                        v-if="messageCountInfo.downloadAttachment > 0"
                        >{{
                          messageCountInfo.downloadAttachment > 99
                            ? "99+"
                            : messageCountInfo.downloadAttachment
                        }}</span
                      ></el-dropdown-item
                    >
                    <el-dropdown-item
                      @click="gotoMessage('likeComment')"
                      class="message-item"
                    >
                      <span class="text">赞了我的评论</span>
                      <span
                        class="count-tag"
                        v-if="messageCountInfo.likeComment > 0"
                        >{{
                          messageCountInfo.likeComment > 99
                            ? "99+"
                            : messageCountInfo.likeComment
                        }}</span
                      ></el-dropdown-item
                    >
                    <el-dropdown-item
                      @click="gotoMessage('sys')"
                      class="message-item"
                    >
                      <span class="text">系统消息</span>
                      <span class="count-tag" v-if="messageCountInfo.sys > 0">{{
                        messageCountInfo.sys > 99 ? "99+" : messageCountInfo.sys
                      }}</span></el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>

            <div class="user-info">
              <el-dropdown>
                <Avatar
                  :userId="userInfo.userId"
                  :width="5"
                  :addLink="false"
                ></Avatar>

                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="gotoUcenter(userInfo.userId)"
                      >我的主页</el-dropdown-item
                    >
                    <el-dropdown-item @click="logout">退出</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>

          <el-button-group :style="{ marginLeft: '1.5rem' }" v-else>
            <el-button type="primary" plain @click="loginAndRegister(1)">
              登录
            </el-button>
            <el-button type="primary" plain @click="loginAndRegister(0)">
              注册
            </el-button>
          </el-button-group>
        </div>
      </div>
    </div>

    <div class="body-content">
      <router-view></router-view>
    </div>
  </div>
  <div>
    <LoginAndRegister ref="loginRegisterRef"></LoginAndRegister>
  </div>
</template>

<style lang="scss" scoped>
.header {
  position: fixed;
  top: 0;
  width: 100%;
  box-shadow: 0 2px 6px #ddd;
  z-index: 10;
  background: rgb(243, 243, 243);

  &-content {
    width: 130rem;
    margin: 0 auto;
    height: 6rem;

    display: flex;
    align-items: center;
  }
  &-logo {
    text-decoration: none;
    display: block;
    margin-right: 0.5rem;
    color: transparent;
    font-size: 3rem;
    background-image: linear-gradient(to right, #40e0d0, #ff8c00, #ff0080);
    background-clip: text;

    transition: all 0.1s ease-in;
    &:hover {
      opacity: 0.8;
      transform: translateY(-3px);
    }
  }

  &-menu {
    flex: 1;

    &-board {
      font-size: 1.6rem;
      color: #333;
      margin-left: 2rem;
      cursor: pointer;
    }

    .active {
      color: var(--link);
    }
  }

  &-operate {
    width: 30rem;
    display: flex;
    align-items: center;
    .item {
      outline: none;
    }

    .user-box {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: space-around;
      .message-info {
        margin-right: 10px;
        cursor: pointer;

        .icon-message {
          font-size: 25px;
          color: rgb(147, 147, 147);
          margin-left: 5px;
        }
      }

      .user-info {
        .avatar {
          outline: none;
        }
      }
    }
  }
  button {
    cursor: pointer;
  }
}

.sub-board-list {
  display: flex;
  flex-wrap: wrap;

  .sub-board {
    border: 1px solid #ddd;
    background-color: #ddd;
    color: rgb(135, 135, 135);
    padding: 0px 10px;
    border-radius: 20px;
    margin-top: 10px;
    margin-right: 10px;

    &:hover {
      cursor: pointer;
    }
  }

  .active {
    background: var(--link);
    color: #fff;
  }
}

.body-content {
  margin-top: 6rem;
  position: relative;
}

.message-item {
  display: flex;
  justify-content: space-around;
  .text {
    flex: 1;
  }
  .count-tag {
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
</style>
