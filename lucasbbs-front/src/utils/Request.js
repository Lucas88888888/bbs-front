import axios from "axios";

//引入加载组件
import { ElLoading } from "element-plus";
import store from "@/store/index.js";

import Message from "@/utils/Message.js";

const contentTypeForm = "application/x-www-form-urlencoded;charset=UTF-8";
const contentTypeJson = "application/json";

//新建一个实例
const instance = axios.create({
  baseURL: "/api",
  timeout: 10 * 1000,
});

//以服务的方式调用loading加载组件
let loading = null;

//请求前过滤器--实现loading效果
instance.interceptors.request.use(
  (config) => {
    if (config.showLoading) {
      loading = ElLoading.service({
        lock: true,
        text: "加载中......",
        background: "rgba(0,0,0,0.7)",
      });
    }
    return config;
  },
  (error) => {
    if (error.config.showLoading && loading) {
      loading.close();
    }
    Message.error("请求发送失败");
    return Promise.reject("请求发送失败");
  }
);

//请求后过滤器
//response.data包含信息，以及自定义的状态码
instance.interceptors.response.use(
  (response) => {
    const { showLoading, errorCallback, showError } = response.config;
    if (showLoading && loading) {
      loading.close();
    }
    const responseData = response.data;
    if (responseData.code === 200) {
      return responseData;
    } else if (responseData.code === 901) {
      //登录超时，长时间没操作
      store.commit("updateShowLogin", true);
      store.commit("updateLoginUserInfo", null);
      return Promise.reject({ showError: false, msg: "登录超时" });
    } else {
      if (errorCallback) {
        errorCallback(responseData);
      }
      return Promise.reject({ showError: showError, msg: responseData.info });
    }
  },
  (error) => {
    if (error.config.showLoading && loading) {
      loading.close();
    }
    return Promise.reject({ showError: true, msg: "网络异常" });
  }
);

//config，自定义的设置创建请求
const request = (config) => {
  const {
    url,
    params,
    dataType,
    showLoading = false,
    errorCallback,
    showError = true,
  } = config;
  let contentType = contentTypeForm;
  let formData = new FormData();
  for (let key in params) {
    formData.append(key, params[key] === undefined ? "" : params[key]);
  }

  //如果表单数据不是以表单格式，而是以json格式
  if (dataType !== null && dataType === "json") {
    contentType = contentTypeJson;
  }
  let headers = {
    "Content-Type": contentType,
    "X-Requested-With": "XMLHttpRequest",
  };

  return instance
    .post(url, formData, {
      headers: headers,
      showLoading: showLoading,
      errorCallback: errorCallback,
      showError: showError,
    })
    .catch((error) => {
      if (error.showError) {
        //请求后拦截器返回给catch的拒绝promise
        Message.error(error.msg);
      }
      return null;
    });
};

export default request;
