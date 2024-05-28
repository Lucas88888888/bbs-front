<script setup>
import md5 from "js-md5";
import { ref, reactive, getCurrentInstance } from "vue";
import { useRoute, useRouter } from "vue-router";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const formData = ref({});
const formDataRef = ref();
const rules = {
  account: [{ required: true, message: "请输入账号" }],
  password: [{ required: true, message: "请输入密码" }],
  checkCode: [{ required: true, message: "请输入验证码" }],
};

//图片验证码
const checkCodeUrl = ref(proxy.globalInfo.api.checkCode);
const changeCheckCode = () => {
  checkCodeUrl.value =
    proxy.globalInfo.api.checkCode + "?" + new Date().getTime();
};

const login = () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    let params = Object.assign({}, formData.value);
    params.password = md5(params.password);
    let result = await proxy.Request({
      url: proxy.globalInfo.api.login,
      params: params,
      errorCallBack: () => {
        changeCheckCode();
      },
    });
    if (!result) {
      return;
    }
    proxy.Message.success("登录成功", () => {
      router.push({ name: "layout" });
    });
    proxy.Vuecookies.set("userInfo", result.data, 0);
  });
};
</script>

<template>
  <div class="login-body">
    <div class="login-panel">
      <div class="login-title">管理员登录</div>
      <el-form
        :model="formData"
        :rules="rules"
        ref="formDataRef"
        @submit.prevent
      >
        <!--input输入-->
        <el-form-item prop="account">
          <el-input
            clearable
            placeholder="请输入账号"
            v-model.trim="formData.account"
            size="large"
          >
            <template #prefix>
              <span class="iconfont icon-account"></span>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            clearable
            placeholder="请输入密码"
            v-model.trim="formData.password"
            size="large"
            type="password"
          >
            <template #prefix>
              <span class="iconfont icon-password"></span>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="checkCode">
          <div class="check-code-panel">
            <el-input
              clearable
              placeholder="请输入验证码"
              v-model.trim="formData.checkCode"
              size="large"
              class="input-panel"
            >
              <template #prefix>
                <span class="iconfont icon-checkcode"></span>
              </template>
            </el-input>
            <img
              :src="checkCodeUrl"
              class="check-code"
              @click="changeCheckCode"
            />
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :style="{ width: '100%' }" @click="login"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-body {
  width: 100%;
  height: calc(100vh);
  background-size: cover;
  background-position: center;
  background-image: url(../assets/login-bg.jpg);
  .login-panel {
    margin-top: 150px;
    width: 350px;
    float: right;
    margin-right: 100px;
    padding: 20px;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 5px;
    box-shadow: 2px 2px 10px #ddd;
    .login-title {
      font-size: 25px;
      text-align: center;
      margin-bottom: 10px;
    }
    .check-code-panel {
      width: 100%;
      display: flex;
      align-items: center;
      .input-panel {
        flex: 1;
        margin-right: 5px;
      }
      .check-code {
        cursor: pointer;
      }
    }
  }
}
</style>
