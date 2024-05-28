import { ElMessageBox } from "element-plus";

const confirm = (message, okfunc) => {
  ElMessageBox.confirm(message, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "info",
  })
    .then(async () => {
      okfunc();
    })
    .catch(() => {});
};

export default confirm;
