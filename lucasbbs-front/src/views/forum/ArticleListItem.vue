<script setup>
import Avatar from "@/components/Avatar.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  data: {
    type: Object,
  },
  showComment: {
    type: Boolean,
  },
  showEdit: {
    type: Boolean,
  },
  htmlTitle: {
    type: Boolean,
    default: false,
  },
});

const editArticle = (articleId) => {
  router.push(`/editPost/${articleId}`);
};
</script>

<template>
  <div class="article-item">
    <div class="article-item-inner">
      <div class="article-body">
        <div class="user-info">
          <Avatar :userId="data.userId" :width="3"></Avatar>
          <router-link :to="'/user/' + data.userId" class="link-info">{{
            data.nickName
          }}</router-link>
          <el-divider direction="vertical"></el-divider>
          <div class="post-time">{{ data.postTime }}</div>
          <div class="address">&nbsp;·&nbsp;{{ data.userIpAddress }}</div>
          <el-divider direction="vertical"></el-divider>
          <router-link :to="`/forum/${data.pBoardId}`" class="link-info">{{
            data.pBoardName
          }}</router-link>
          <template v-if="data.boardName">
            <span>&nbsp;&nbsp;/&nbsp;&nbsp;</span>
            <router-link
              :to="`/forum/${data.pBoardId}/${data.boardId}`"
              class="link-info"
              >{{ data.boardName }}</router-link
            >
          </template>
        </div>
        <router-link :to="`/post/${data.articleId}`" class="title">
          <span v-if="data.topType == 1" class="top">置顶</span>
          <span v-if="data.status == 0" class="tag tag-no-audit">待审核</span>
          <span v-if="htmlTitle" v-html="data.title"></span>
          <span v-else>{{ data.title }}</span>
        </router-link>
        <div class="summary">{{ data.summary }}</div>
        <div class="article-info">
          <span class="iconfont icon-eye-solid">{{
            data.readCount === 0 ? "阅读" : data.readCount
          }}</span>
          <span class="iconfont icon-good">{{
            data.goodCount === 0 ? "点赞" : data.likeCount
          }}</span>
          <span class="iconfont icon-comment" v-if="showComment">{{
            data.commentCount === 0 ? "评论" : data.commentCount
          }}</span>
          <span
            class="iconfont icon-edit"
            v-if="showEdit"
            @click="editArticle(data.articleId)"
          >
            编辑</span
          >
        </div>
      </div>
      <router-link :to="`/post/${data.articleId}`">
        <Cover :cover="data.cover" :width="10"></Cover>
      </router-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.article-item {
  padding: 5px 10px 0 10px;
  &:hover {
    background: #fffbfb;
  }
  &-inner {
    display: flex;
    border-bottom: 1px solid #ddd;
    padding: 10px;
    .article-body {
      flex: 1;
      .user-info {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #4e5969;
        .link-info {
          margin-left: 5px;
          color: #494949;
          &:hover {
            color: var(--link);
          }
        }

        .post-time {
          color: #9a9a9a;
          font-size: 13px;
        }
      }
      .title {
        display: block;
        font-weight: bold;
        color: #4a4a4a;
        font-size: 16px;
        margin: 10px 0;

        .top {
          font-size: 12px;
          border-radius: 5px;
          border: 1px solid var(--pink);
          color: var(--pink);
          padding: 0 4px;
        }
      }

      .summary {
        font-size: 14px;
        color: #86909c;
      }

      .article-info {
        margin-top: 10px;
        display: flex;
        align-items: center;
        font-size: 13px;

        .iconfont {
          color: #86909c;
          margin-right: 25px;
          font-size: 14px;

          &::before {
            padding-right: 3px;
          }
        }
        .icon-edit {
          cursor: pointer;
          color: var(--link);
        }
      }
    }
  }
}
</style>
