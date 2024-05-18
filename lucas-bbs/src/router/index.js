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
          path: "/user/:userId",
          name: "userInfo",
          component: () => import("@/views/ucenter/Ucenter.vue"),
        },
      ],
    },
  ],
});

export default router;
