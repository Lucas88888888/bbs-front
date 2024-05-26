import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "layout",
      component: () => import("@/views/Layout.vue"),
      children: [
        {
          path: "/",
          name: "allArticles",
          component: () => import("@/views/forum/ArticleList.vue"),
        },

        {
          path: "/forum/:pBoardId",
          name: "topBoard",
          component: () => import("@/views/forum/ArticleList.vue"),
        },

        {
          path: "/forum/:pBoardId/:boardId/",
          name: "secBoard",
          component: () => import("@/views/forum/ArticleList.vue"),
        },

        {
          path: "/post/:articleId/",
          name: "articleDetail",
          component: () => import("@/views/forum/ArticleDetail.vue"),
        },

        {
          path: "/newPost",
          name: "postArticle",
          component: () => import("@/views/forum/EditPost.vue"),
        },

        {
          path: "/editPost/:articleId",
          name: "editArticle",
          component: () => import("@/views/forum/EditPost.vue"),
        },

        {
          path: "/user/:userId",
          name: "userInfo",
          component: () => import("@/views/ucenter/Ucenter.vue"),
        },
        {
          path: "/user/message/:type",
          name: "message",
          component: () => import("@/views/ucenter/MessageList.vue"),
        },
      ],
    },
  ],
});

export default router;
