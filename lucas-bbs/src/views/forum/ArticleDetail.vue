<script setup>
import { ref, reactive, getCurrentInstance, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();

//文章详情
const articleInfo = ref({});
//附件
const attachment = ref({});

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
};

onMounted(() => {
  getArticleDetail(route.params.articleId);
});
</script>

<template>
  <div
    class="body-container body-article-detail"
    :style="{ width: proxy.globalInfo.bodyWidth + 'rem' }"
    v-if="Object.keys(articleInfo).length > 0"
  >
    <div class="board-info">
      <router-link :to="`/forum/${articleInfo.pBoardId}`">{{
        articleInfo.pBoardName
      }}</router-link>
      <span class="iconfont icon-right"></span>

      <template v-if="articleInfo.boardId">
        <router-link
          :to="`/forum/${articleInfo.pBoardName}/${articleInfo.boardId}`"
          >{{ articleInfo.boardName }}</router-link
        >
        <span class="iconfont icon-right"></span>
      </template>

      <span>{{ articleInfo.title }}</span>
    </div>

    <div class="detail-container" :style="{ width: 100 + 'rem' }">
      <div class="article-detail">
        <div class="title">{{ articleInfo.title }}</div>
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
            <el-button type="primary" size="small">下载</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.body-article-detail {
  font-size: 14px;

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
        line-height: 22px;
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
        * {
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
