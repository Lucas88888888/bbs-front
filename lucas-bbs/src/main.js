import "./assets/base.scss";

import VueCookies from "vue-cookies";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "@/assets/icon/iconfont.css";
import store from "./store/index.js";

//全局方法
import Verify from "@/utils/Verify.js";
import Message from "@/utils/Message.js";
import Request from "@/utils/Request.js";
import API from "@/utils/API.js";
//全局组件
import Dialog from "@/components/Dialog.vue";
import Avatar from "@/components/Avatar.vue";

const app = createApp(App);

app.use(router);
app.use(store);
app.use(ElementPlus);
app.config.globalProperties.VueCookies = VueCookies;
app.config.globalProperties.globalInfo = {
  bodyWidth: 130,
  // avatarUrl: "/api/file/getAvatar/",
  api: API,
};

app.config.globalProperties.Verify = Verify;
app.config.globalProperties.Message = Message;
app.config.globalProperties.Request = Request;

app.component("Dialog", Dialog);
app.component("Avatar", Avatar);

app.mount("#app");
