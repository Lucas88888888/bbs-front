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
import Utils from "@/utils/Utils.js";
import Confirm from "@/utils/Confirm.js";
//全局组件
import Dialog from "@/components/Dialog.vue";
import Avatar from "@/components/Avatar.vue";
import Cover from "@/components/Cover.vue";
import DataList from "@/components/DataList.vue";
import NoData from "@/components/NoData.vue";
import ImageViewer from "@/components/ImageViewer.vue";
import EditorHtml from "@/components/EditorHtml.vue";
import EditorMarkdown from "@/components/EditorMarkdown.vue";
import CoverUpload from "@/components/CoverUpload.vue";
import AttachmentSelector from "@/components/AttachmentSelector.vue";

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
app.config.globalProperties.Utils = Utils;
app.config.globalProperties.Confirm = Confirm;

app.component("Dialog", Dialog);
app.component("Avatar", Avatar);
app.component("Cover", Cover);
app.component("DataList", DataList);
app.component("NoData", NoData);
app.component("ImageViewer", ImageViewer);
app.component("EditorMarkdown", EditorMarkdown);
app.component("EditorHtml", EditorHtml);
app.component("CoverUpload", CoverUpload);
app.component("AttachmentSelector", AttachmentSelector);

app.mount("#app");
