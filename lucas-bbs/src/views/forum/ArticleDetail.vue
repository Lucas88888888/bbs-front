<script setup>
import CommentList from "./CommentList.vue";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-light.css";
import {
  ref,
  reactive,
  getCurrentInstance,
  onMounted,
  nextTick,
  onUnmounted,
  watch,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const store = useStore();

const currentUserInfo = ref({});

//文章详情
const articleInfo = ref({});
//附件
const attachment = ref({});

//是否已经点赞
const haveLike = ref(false);

//获得文章内容
const getArticleDetail = async (articleId) => {
  let result = await proxy.Request({
    url: proxy.globalInfo.api.getArticleDetail,
    params: {
      articleId: articleId,
    },
  });
  if (!result) {
    return;
  }

  articleInfo.value = result.data.forumArticle;
  attachment.value = result.data.attachment;
  haveLike.value = result.data.haveLike;

  store.commit("setActivePBoardId", result.data.forumArticle.pBoardId);
  store.commit("setActiveBoardId", result.data.forumArticle.boardId);

  //图片预览
  imagePreview();
  //代码高亮
  highlightCode();
  //生成目录
  makeToc();
};

//监听登录用户
watch(
  () => store.state.loginUserInfo,
  (newVal, oldVal) => {
    currentUserInfo.value = newVal || {};
  },
  { immediate: true, deep: true }
);

onMounted(() => {
  getArticleDetail(route.params.articleId);
});

//左侧快捷操作部分
const quickPanelLeft =
  (window.innerWidth - proxy.globalInfo.bodyWidth * 10) / 2 - 100;

const goToPosition = (domId) => {
  document
    .querySelector("#" + domId)
    .scrollIntoView({ behavior: "smooth", block: "start" });
};

//点赞操作
const doLikeHandler = async () => {
  if (!store.getters.getLoginUserInfo) {
    store.commit("updateShowLogin", true);

    return;
  }
  let result = await proxy.Request({
    url: proxy.globalInfo.api.doLike,
    params: {
      articleId: articleInfo.value.articleId,
    },
  });
  if (!result) {
    return;
  }

  //这里存在bug
  haveLike.value = !haveLike.value;

  let goodCount = 1;
  if (!haveLike.value) {
    goodCount = -1;
  }

  articleInfo.value.goodCount = articleInfo.value.goodCount + goodCount;
};

//下载附件
const downloadAttachment = async (fileId) => {
  if (!currentUserInfo.value) {
    store.commit("updateShowLogin", true);

    return;
  }

  //不要积分，或者下载自己的附件
  if (
    attachment.value.integral == 0 ||
    currentUserInfo.value.userId == articleInfo.value.userId
  ) {
    downloadDom(fileId);
    return;
  }

  //获取用户下载信息
  let result = await proxy.Request({
    url: proxy.globalInfo.api.getUserDownloadInfo,
    params: {
      fileId: fileId,
    },
  });

  if (!result) {
    return;
  }
  //判断用户是否已经下载
  if (result.data.haveDownload) {
    downloadDom(fileId);
    return;
  }
  //判断用户积分
  if (result.data.userIntegral < attachment.value.integral) {
    proxy.Message.warning("你的积分不够，无法下载");
    return;
  }

  //这里附件下载次数更新有bug

  proxy.Confirm(
    `你还有${result.data.userIntegral}积分，当前下载会扣除${attachment.value.integral}积分，确定要下载吗？`,
    () => {
      downloadDom(fileId);
    }
  );
};

const downloadDom = (fileId) => {
  document.location.href =
    proxy.globalInfo.api.attachmentDownload + "?fileId=" + fileId;
  attachment.value.downloadCount = attachment.value.downloadCount + 1;
};

//文章图片预览
const imageViewerRef = ref(null);
const previewImgList = ref([]);
const imagePreview = () => {
  nextTick(() => {
    const imageNodeList = document
      .querySelector("#detail")
      .querySelectorAll("img");
    const imageList = [];
    imageNodeList.forEach((item, index) => {
      const src = item.getAttribute("src");
      imageList.push(src);
      item.addEventListener("click", () => {
        imageViewerRef.value.show(index);
      });
    });
    previewImgList.value = imageList;
  });
};

//代码高亮
const highlightCode = () => {
  nextTick(() => {
    let blocks = document.querySelectorAll("pre code");
    blocks.forEach((item) => {
      hljs.highlightElement(item);
    });
  });
};

//更新评论数量
const updateCommentCount = (commentCount) => {
  articleInfo.value.commentCount = commentCount;
};

//获取目录
const tocArray = ref([]);
const makeToc = () => {
  nextTick(() => {
    const tocTags = ["H1", "H2", "H3", "H4", "H5", "H6"];
    //获取所有H标签
    const contentDom = document.querySelector("#detail");
    const childNodes = contentDom.childNodes;

    let index = 0;
    childNodes.forEach((item) => {
      let tagName = item.tagName;
      if (tagName == undefined || !tocTags.includes(tagName.toUpperCase())) {
        return true;
      }
      index++;

      let id = "toc" + index;
      item.setAttribute("id", id);
      tocArray.value.push({
        id: id,
        title: item.innerText,
        level: Number.parseInt(tagName.substring(1)),
        offsetTop: item.offsetTop + 59,
      });
    });
  });
};

// 目录跳转到置顶内容
const anchorId = ref(null);
const gotoAnchor = (domId) => {
  const dom = document.querySelector("#" + domId);
  // anchorId.value = domId;
  dom.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

const listenerScroll = () => {
  let currentScrollTop = getScrollTop();
  tocArray.value.some((item, index) => {
    if (
      (index < tocArray.value.length - 1 &&
        currentScrollTop >= tocArray.value[index].offsetTop &&
        currentScrollTop < tocArray.value[index + 1].offsetTop) ||
      (index == tocArray.value.length - 1 &&
        currentScrollTop > tocArray.value[index].offsetTop)
    ) {
      anchorId.value = item.id;

      return true;
    }
  });
};

//获取滚动条的高度
const getScrollTop = () => {
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  return scrollTop;
};

onMounted(() => {
  window.addEventListener("scroll", listenerScroll, false);
});

onUnmounted(() => {
  window.removeEventListener("scroll", listenerScroll, false);
});

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
    class="body-container body-article-detail"
    :style="{ width: proxy.globalInfo.bodyWidth + 'rem' }"
    v-if="Object.keys(articleInfo).length > 0"
  >
    <!-- 板块导航 -->
    <div class="board-info">
      <router-link :to="`/forum/${articleInfo.pBoardId}`">{{
        articleInfo.pBoardName
      }}</router-link>
      <span class="iconfont icon-right"></span>

      <template v-if="articleInfo.boardId">
        <router-link
          :to="`/forum/${articleInfo.pBoardId}/${articleInfo.boardId}`"
          >{{ articleInfo.boardName }}</router-link
        >
        <span class="iconfont icon-right"></span>
      </template>

      <span>{{ articleInfo.title }}</span>
    </div>
    <!-- 文章详情 -->
    <div class="detail-container" :style="{ width: 100 + 'rem' }">
      <div class="article-detail">
        <div class="title">
          <span class="tag tag-no-audit" v-if="articleInfo.status == 0"
            >待审核</span
          >
          {{ articleInfo.title }}
        </div>
        <!-- 用户信息 -->
        <div class="user-info">
          <Avatar :userId="articleInfo.userId" :width="5"></Avatar>
          <div class="user-info-detail">
            <router-link
              class="nick-name"
              :to="`/user/${articleInfo.userId}`"
              >{{ articleInfo.nickName }}</router-link
            >
            <div class="time-info">
              <span>{{ articleInfo.postTime }}</span>
              <span class="address"
                >&nbsp;·&nbsp;{{ articleInfo.userIpAddress }}</span
              >
              <span class="iconfont icon-eye-solid">
                {{
                  articleInfo.readCount === 0 ? "阅读" : articleInfo.readCount
                }}
              </span>
              <router-link
                v-if="articleInfo.userId == currentUserInfo.userId"
                class="btn-edit"
                :to="`/editPost/${articleInfo.articleId}`"
              >
                <span class="iconfont icon-edit">编辑</span>
              </router-link>
            </div>
          </div>
        </div>
        <!-- 文章详情 -->
        <div class="detail" id="detail" v-html="articleInfo.content"></div>
      </div>

      <!-- 附件 -->
      <div class="attachment-panel" v-if="attachment" id="view-attachment">
        <div class="title">附件</div>
        <div class="attachment-info">
          <div class="iconfont icon-zip"></div>
          <div class="file-name">{{ attachment.fileName }}</div>
          <div class="size">
            {{ proxy.Utils.sizeToStr(attachment.fileSize) }}
          </div>
          <div>
            需要<span class="integral">{{ attachment.integral }}</span
            >积分
          </div>
          <div class="download-count">
            已下载{{ attachment.downloadCount }}次
          </div>
          <div class="download-btn">
            <el-button
              type="primary"
              size="small"
              @click="downloadAttachment(attachment.fileId)"
              >下载</el-button
            >
          </div>
        </div>
      </div>

      <!-- 评论 -->
      <div
        class="comment-panel"
        id="view-comment"
        v-if="showComment && articleInfo.status == 1"
      >
        <CommentList
          v-if="articleInfo.articleId"
          :articleId="articleInfo.articleId"
          :articleUserId="articleInfo.userId"
          @updateCommentCount="updateCommentCount"
        ></CommentList>
      </div>
    </div>

    <div class="toc-panel">
      <div class="top-container">
        <div class="toc-title">目录</div>
        <div class="toc-list">
          <template v-if="tocArray.length == 0">
            <div class="no-toc">未解析到目录</div>
          </template>
          <template v-else>
            <div v-for="toc in tocArray">
              <span
                @click="gotoAnchor(toc.id)"
                :class="['toc-item', toc.id == anchorId ? 'active' : '']"
                :style="{ paddingLeft: toc.level * 15 + 'px' }"
                >{{ toc.title }}</span
              >
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>

  <!-- 左侧快捷操作部分 -->
  <div class="quick-panel" :style="{ left: quickPanelLeft + 'px' }">
    <!-- 点赞 -->
    <el-badge
      :value="articleInfo.goodCount"
      type="info"
      :hidden="!articleInfo.goodCount > 0"
      :offset="[-10, 10]"
    >
      <div class="quick-item" @click="doLikeHandler">
        <span
          :class="['iconfont icon-good', haveLike ? 'have-like' : '']"
        ></span>
      </div>
    </el-badge>

    <!-- 评论 -->
    <el-badge
      :value="articleInfo.commentCount"
      type="info"
      :hidden="!articleInfo.commentCount > 0"
      :offset="[-10, 10]"
      v-if="showComment"
    >
      <div
        class="quick-item"
        v-if="showComment"
        @click="goToPosition('view-comment')"
      >
        <span class="iconfont icon-comment"></span>
      </div>
    </el-badge>

    <!-- 附件 -->
    <div class="quick-item" @click="goToPosition('view-attachment')">
      <span class="iconfont icon-attachment"></span>
    </div>
    <!-- 图片预览 -->
    <ImageViewer ref="imageViewerRef" :imageList="previewImgList"></ImageViewer>
  </div>
</template>

<style lang="scss" scoped>
.body-article-detail {
  font-size: 14px;
  position: relative;

  .board-info {
    padding: 10px 0;
    .icon-right {
      margin: 0 10px;
    }
  }

  .detail-container {
    // width: 100%;
    .article-detail {
      //   width: 100%;
      background: #fff;
      padding: 15px;

      .title {
        font-weight: bolder;
      }

      .user-info {
        margin: 15px 0;
        display: flex;
        color: #4e5969;
        padding-bottom: 10px;
        border-bottom: 1px solid #ddd;
        .user-info-detail {
          margin-left: 10px;
          .nick-name {
            font-size: 15px;
            color: #4e5969;

            &:hover {
              color: var(--link);
            }
          }
          .time-info {
            text-align: center;
            margin-top: 5px;
            font-size: 13px;
            .btn-edit {
              font-size: 14px !important;
            }

            .iconfont {
              margin-left: 10px;
            }
            .iconfont:before {
              padding-right: 3px;
            }
          }
        }
      }

      .detail {
        // width: 100%;
        font-size: 16px;
        letter-spacing: 1px;
        //line-height: 22px;
      }
    }

    .attachment-panel {
      margin-top: 20px;
      background: #fff;
      padding: 20px;
      .title {
        font-size: 18px;
      }
      .attachment-info {
        display: flex;
        align-items: center;
        color: #9f9f9f;
        margin-top: 10px;
        & > * {
          margin-right: 10px;
        }
        .icon-zip {
          font-size: 20px;
          color: #6ca1f7;
        }
        .file-name {
          color: #6ca1f7;
        }
        .integral {
          color: red;
          padding: 0 5px;
        }
      }
    }

    .comment-panel {
      margin-top: 20px;
      background: #fff;
      padding: 20px;
    }
  }
}

.quick-panel {
  position: fixed;
  width: 50px;
  top: 200px;
  text-align: center;

  .quick-item {
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background: #fff;
    margin-bottom: 30px;
    cursor: pointer;

    .iconfont {
      font-size: 22px;
      color: #61666d;
    }
    .have-like {
      color: rgb(228, 73, 73);
    }
  }
}

.toc-panel {
  position: absolute;
  top: 43px;
  right: 0px;
  width: 285px;
  height: 500px;
  .top-container {
    width: 285px;
    position: fixed;
    background: #fff;
    .toc-title {
      border-bottom: 1px solid #ddd;
      padding: 10px;
    }
    .toc-list {
      max-height: calc(100vh - 200px);
      overflow: auto;
      padding: 5px;
      .no-toc {
        text-align: center;
        color: #5f5d5d;
        line-height: 40px;
        font-size: 13px;
      }
    }
    .toc-item {
      cursor: pointer;
      display: block;
      line-height: 35px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: #555666;
      border-radius: 3px;
      font-size: 14px;
      border-left: 2px solid #fff;
      &:hover {
        background: #f1f1f1;
      }
    }
    .active {
      border-left: 2px solid #6ca1f7;
      border-radius: 0 3px 3px 0;
      background: #f1f1f1;
    }
  }
}
</style>

<style lang="scss">
#detail {
  img {
    margin-top: 10px;
    max-width: 90%;
    cursor: pointer;
  }

  a {
    text-decoration: none;
    color: var(--link);
  }
}
</style>
