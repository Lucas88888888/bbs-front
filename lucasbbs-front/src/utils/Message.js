//这是基于element的消息反馈组件的信息内容

import { ElMessage } from "element-plus";

const showMessage = (msg, callback, type) => {
  ElMessage({
    type: type,
    message: msg,
    duration: 2000,
    onClose: () => {
      if (callback) {
        callback();
      }
    },
  });
};

const message = {
  error: (msg, callback) => {
    showMessage(msg, callback, "error");
  },
  success: (msg, callback) => {
    showMessage(msg, callback, "success");
  },
  warning: (msg, callback) => {
    showMessage(msg, callback, "warning");
  },
};

export default message;
