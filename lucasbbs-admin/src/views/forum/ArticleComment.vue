<script setup>
import CommentImage from "./CommentImage.vue";
import { ref, reactive, getCurrentInstance } from "vue";
import { useRoute, useRouter } from "vue-router";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const dialogConfig = reactive({
  show: false,
  title: "查看评论",
  buttons: [
    {
      text: "关闭",
      click: (e) => {
        dialogConfig.show = false;
      },
    },
  ],
});

const commentList = ref([]);
const show = async (articleId) => {
  dialogConfig.show = true;
  let result = await proxy.Request({
    url: proxy.globalInfo.api.loadComment4Article,
    params: {
      articleId: articleId,
    },
  });
  if (!result) {
    return;
  }
  commentList.value = result.data;
};

defineExpose({ show });
</script>

<template>
  <div>
    <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      width="700px"
      :showCancel="false"
      @close="dialogConfig.show = false"
    >
      <div class="comment-list">
        <div class="comment-item" v-for="item in commentList">
          <div class="p-comment-item">
            <avatar :userId="item.userId" :width="40"></avatar>
            <div class="content-info">
              <a
                target="_blank"
                :href="proxy.globalInfo.webDomain + 'user/' + item.userId"
                class="a-link"
                >{{ item.nickName }}</a
              >
              <div class="comment-content" v-html="item.content"></div>
              <div v-if="item.imgPath">
                <CommentImage
                  :src="
                    proxy.globalInfo.api.getImage +
                    item.imgPath.replace('.', '_.')
                  "
                  :imgList="[proxy.globalInfo.api.getImage + item.imgPath]"
                ></CommentImage>
              </div>
              <div class="post-info">
                发布：{{ item.postTime }}&nbsp;·&nbsp;{{
                  item.userIpAddress
                }}&nbsp;&nbsp;赞：{{ item.goodCount }}
              </div>
              <div v-if="item.children">
                <div class="s-comment-item" v-for="sub in item.children">
                  <avatar :userId="sub.userId" :width="40"></avatar>
                  <div class="content-info">
                    <a
                      target="_blank"
                      :href="proxy.globalInfo.webDomain + 'user/' + sub.userId"
                      class="a-link"
                      >{{ sub.nickName }}</a
                    >
                    <span v-if="sub.replyUserId"
                      >回复
                      <a
                        target="_blank"
                        :href="
                          proxy.globalInfo.webDomain + 'user/' + sub.replyUserId
                        "
                        class="a-link"
                        >{{ sub.replyNickName }}</a
                      >
                    </span>
                    <div class="comment-content" v-html="sub.content"></div>
                    <div class="post-info">
                      发布：{{ sub.postTime }}&nbsp;·&nbsp;{{
                        sub.userIpAddress
                      }}
                      赞：{{ sub.goodCount }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="commentList.length == 0">暂无评论</div>
    </Dialog>
  </div>
</template>

<style lang="scss" scoped>
.comment-list {
  .comment-item {
    margin-top: 10px;
    border-bottom: 1px solid #ddd;
    padding: 10px 0;
    .p-comment-item {
      display: flex;
    }
    .content-info {
      margin-left: 5px;
    }
    .comment-content {
      margin: 5px 0;
    }
    .post-info {
      font-size: 12px;
      color: rgb(135, 130, 130);
    }
    .s-comment-item {
      display: flex;
      margin-top: 10px;
    }
  }
}
</style>
