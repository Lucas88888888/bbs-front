<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import md5 from "js-md5";
import { useStore } from "vuex";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const store = useStore();

// const api = {
//   checkCode: "/api/checkCode",
//   sendEmailCode: "/sendEmailCode",
//   register: "/register",
//   login: "/login",
//   resetPwd: "/resetPwd",
// };

//0:注册；1：登录；2：重置密码
//用作判定显示哪一个页面，选择性的选择输入文本框进行显示
const opType = ref();

//当用户点击登录，注册时 判断显示登录还是注册页面
const showPanel = (type) => {
  opType.value = type;
  resetForm();
};

defineExpose({ showPanel });

//验证码
const checkCodeUrl = ref(proxy.globalInfo.api.checkCode);
const checkCodeUrl4SendMailCode = ref(proxy.globalInfo.api.checkCode);

const changeCheckCode = (type) => {
  if (type == 0) {
    checkCodeUrl.value =
      proxy.globalInfo.api.checkCode +
      "?type=" +
      type +
      "&time=" +
      new Date().getTime();
  } else {
    checkCodeUrl4SendMailCode.value =
      proxy.globalInfo.api.checkCode +
      "?type=" +
      type +
      "&time=" +
      new Date().getTime();
  }
};

//密码显示隐藏操作
//也可以使用el-input中的show-password属性，但是该属性图标不太好看
const passwordEyeType = reactive({
  passwordEyeOpen: false,
  registerPasswordEyeOpen: false,
  reRegisterPasswordEyeOpen: false,
});
const eyeChange = (type) => {
  passwordEyeType[type] = !passwordEyeType[type];
};

//发送邮箱验证码弹窗
//邮箱验证码的表单对象
const formData4SendMailCode = ref({});
const formData4SendMailCodeRef = ref();
const dialogConfig4SendMailCode = reactive({
  show: false,
  title: "发送邮箱验证码",
  buttons: [
    {
      type: "primary",
      text: "发送验证码",
      click: () => {
        sendEmailCode();
      },
    },
  ],
});

//显示邮箱验证码的页面--获取邮箱验证码
const getEmailCode = () => {
  formDataRef.value.validateField("email", (valid) => {
    if (!valid) {
      return;
    }
    dialogConfig4SendMailCode.show = true;

    //立即更新
    nextTick(() => {
      changeCheckCode(1);
      formData4SendMailCodeRef.value.resetFields();
      formData4SendMailCode.value = {
        email: formData.value.email,
      };
    });
  });
};

//发送邮件，获取邮箱验证码
const sendEmailCode = () => {
  formData4SendMailCodeRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    const params = Object.assign({}, formData4SendMailCode.value);
    params.type = opType.value == 0 ? 0 : 1;
    let result = await proxy.Request({
      url: proxy.globalInfo.api.sendEmailCode,
      params: params,
      errorCallback: () => {
        changeCheckCode(1);
      },
    });
    if (!result) {
      return;
    }
    //前面错误分析都没有进行，即没有错误，成功获取。
    proxy.Message.success("验证码发送成功，请登录邮箱查看");
    dialogConfig4SendMailCode.show = false;
  });
};

//登录框信息配置
const dialogConfig = reactive({
  show: false,
  title: "标题",
});

//登陆框的关闭操作
const closeDialog = () => {
  dialogConfig.show = false;
  store.commit("updateShowLogin", false);
};

//注册时重复密码的检测--是否与第一次密码相同
const checkRePassword = (rule, value, callback) => {
  if (value !== formData.value.registerPassword) {
    callback(new Error(rule.message));
  } else {
    callback();
  }
};

const formData = ref({});
const formDataRef = ref();

//校验规则
const rules = {
  email: [
    { required: true, message: "请输入邮箱" },
    { validator: proxy.Verify.email, message: "请输入正确的邮箱" },
  ],
  password: [{ required: true, message: "请输入密码" }],
  eamilCode: [{ required: true, message: "请输入邮箱验证码" }],
  nickName: [{ required: true, message: "请输入昵称" }],
  registerPassword: [
    { requird: true, message: "请输入密码" },
    {
      validator: proxy.Verify.password,
      message: "密码只能是数字，字母，特殊字符，长度为8-18位",
    },
  ],
  reRegisterPassword: [
    { required: true, message: "请再次输入密码" },
    {
      validator: checkRePassword,
      message: "两次输入的密码不一致",
    },
  ],
  checkCode: [{ required: true, message: "请输入图片验证码" }],
};

//重置表单
const resetForm = () => {
  dialogConfig.show = true;
  if (opType.value == 0) {
    dialogConfig.title = "注册";
  } else if (opType.value == 1) {
    dialogConfig.title = "登录";
  } else if (opType.value == 2) {
    dialogConfig.title = "重置密码";
  }

  nextTick(() => {
    changeCheckCode(0);
    formDataRef.value.resetFields();
    formData.value = {};

    //登录时记住密码
    if (opType.value == 1) {
      const cookieLoginInfo = proxy.VueCookies.get("loginInfo");
      if (cookieLoginInfo) {
        formData.value = cookieLoginInfo;
      }
    }
  });
};

//登录、注册、重置密码 提交表单
const doSubmit = () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    let params = {};
    Object.assign(params, formData.value);

    //注册
    if (opType.value == 0 || opType.value == 2) {
      params.password = params.registerPassword;
      delete params.registerPassword;
      delete params.reRegisterPassword;
    }

    //登录
    if (opType.value == 1) {
      let cookieLoginInfo = proxy.VueCookies.get("loginInfo");
      let cookiePassword =
        cookieLoginInfo == null ? null : cookieLoginInfo.password;
      if (params.password !== cookiePassword) {
        params.password = md5(params.password);
      }
    }

    let url = null;
    if (opType.value == 0) {
      url = proxy.globalInfo.api.register;
    } else if (opType.value == 1) {
      url = proxy.globalInfo.api.login;
    } else if (opType.value == 2) {
      url = proxy.globalInfo.api.resetPwd;
    }

    let result = await proxy.Request({
      url: url,
      params: params,
      errorCallback: () => {
        changeCheckCode(0);
      },
    });

    if (!result) {
      return;
    }

    //注册返回
    if (opType.value == 0) {
      proxy.Message.success("注册成功，请登录");
      showPanel(1);
    } else if (opType.value == 1) {
      //登录返回
      if (params.rememberMe) {
        const loginInfo = {
          email: params.email,
          password: params.password,
          rememberMe: params.rememberMe,
        };
        proxy.VueCookies.set("loginInfo", loginInfo, "7d");
      } else {
        proxy.VueCookies.remove("loginInfo");
      }
      dialogConfig.show = false;
      proxy.Message.success("登录成功");
      store.commit("updateLoginUserInfo", result.data);
    } else if (opType.value == 2) {
      //重置密码
      proxy.Message.success("重置密码成功，请登录");
      showPanel(1);
    }
  });
};
</script>

<template>
  <div>
    <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      width="40rem"
      :showCancel="false"
      @close="closeDialog"
    >
      <el-form
        class="login-register"
        :model="formData"
        :rules="rules"
        ref="formDataRef"
      >
        <!--input输入-->
        <el-form-item prop="email">
          <el-input
            size="large"
            clearable
            placeholder="请输入邮箱"
            maxLength="150"
            v-model.trim="formData.email"
          >
            <!-- 自定义头部组件 -->
            <template #prefix>
              <span class="iconfont icon-account"> </span>
            </template>
          </el-input>
        </el-form-item>

        <!-- 登陆密码 -->
        <el-form-item prop="password" v-if="opType == 1">
          <el-input
            :type="passwordEyeType.passwordEyeOpen ? 'text' : 'password'"
            size="large"
            placeholder="请输入密码"
            v-model.trim="formData.password"
          >
            <!-- 自定义头部组件 -->
            <template #prefix>
              <span class="iconfont icon-password"> </span>
            </template>
            <template #suffix>
              <span
                @click="eyeChange('passwordEyeOpen')"
                :class="[
                  'iconfont',
                  passwordEyeType.passwordEyeOpen
                    ? 'icon-eye'
                    : 'icon-close-eye',
                ]"
              >
              </span>
            </template>
          </el-input>
        </el-form-item>

        <!-- 注册 -->
        <div v-if="opType == 0 || opType == 2">
          <el-form-item prop="emailCode">
            <div class="send-email-panel">
              <el-input
                size="large"
                placeholder="请输入邮箱验证码"
                v-model.trim="formData.emailCode"
              >
                <!-- 自定义头部组件 -->
                <template #prefix>
                  <span class="iconfont icon-checkCode"> </span>
                </template>
              </el-input>
              <el-button
                class="send-email-btn"
                type="primary"
                size="large"
                @click="getEmailCode"
                >获取验证码</el-button
              >
            </div>
            <el-popover placement="left" :width="500" trigger="click">
              <div>
                <p>1、在垃圾箱中查找邮箱验证码</p>
                <p>
                  2、在邮箱中 头像->设置->反垃圾->白名单->设置邮件地址白名单
                </p>
                <p>3、将邮箱【2972836400@qq.com】添加到白名单</p>
                <a href="">不知道怎么设置？</a>
              </div>
              <template #reference>
                <span :style="{ fontSize: '1.4rem', color: 'var(--link)' }"
                  >未收到邮箱验证码？</span
                >
              </template>
            </el-popover>
          </el-form-item>

          <el-form-item prop="nickName" v-if="opType == 0">
            <el-input
              size="large"
              clearable
              placeholder="请输入昵称"
              maxLength="20"
              v-model.trim="formData.nickName"
            >
              <!-- 自定义头部组件 -->
              <template #prefix>
                <span class="iconfont icon-account"> </span>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="registerPassword">
            <el-input
              :type="
                passwordEyeType.registerPasswordEyeOpen ? 'text' : 'password'
              "
              size="large"
              placeholder="请输入密码"
              v-model.trim="formData.registerPassword"
            >
              <!-- 自定义头部组件 -->
              <template #prefix>
                <span class="iconfont icon-password"> </span>
              </template>
              <template #suffix>
                <span
                  @click="eyeChange('registerPasswordEyeOpen')"
                  :class="[
                    'iconfont',
                    passwordEyeType.registerPasswordEyeOpen
                      ? 'icon-eye'
                      : 'icon-close-eye',
                  ]"
                >
                </span>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="reRegisterPassword">
            <el-input
              :type="
                passwordEyeType.reRegisterPasswordEyeOpen ? 'text' : 'password'
              "
              size="large"
              placeholder="请再次输入密码"
              v-model.trim="formData.reRegisterPassword"
            >
              <!-- 自定义头部组件 -->
              <template #prefix>
                <span class="iconfont icon-password"> </span>
              </template>
              <template #suffix>
                <span
                  @click="eyeChange('reRegisterPasswordEyeOpen')"
                  :class="[
                    'iconfont',
                    passwordEyeType.reRegisterPasswordEyeOpen
                      ? 'icon-eye'
                      : 'icon-close-eye',
                  ]"
                >
                </span>
              </template>
            </el-input>
          </el-form-item>
        </div>
        <el-form-item prop="checkCode">
          <div class="check-code-panel">
            <el-input
              size="large"
              clearable
              placeholder="请输入验证码"
              v-model.trim="formData.checkCode"
              @keyup.enter="doSubmit"
            >
              <!-- 自定义头部组件 -->
              <template #prefix>
                <span class="iconfont icon-checkCode"> </span>
              </template>
            </el-input>
            <img
              :src="checkCodeUrl"
              class="check-code"
              @click="changeCheckCode(0)"
            />
          </div>
        </el-form-item>
        <el-form-item v-if="opType == 1">
          <div class="rememberme-panel">
            <el-checkbox v-model="formData.rememberMe">记住我</el-checkbox>
          </div>
          <div class="no-account">
            <a href="javascript:void(0)" @click="showPanel(2)">忘记密码？</a>
            <a href="javascript:void(0)" @click="showPanel(0)">没有账号？</a>
          </div>
        </el-form-item>

        <el-form-item v-if="opType == 0">
          <a href="javascript:void(0)" @click="showPanel(1)">已有账号？</a>
        </el-form-item>

        <el-form-item v-if="opType == 2">
          <a href="javascript:void(0)" @click="showPanel(1)">去登录？</a>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="op-btn" @click="doSubmit">
            <span v-if="opType == 0">注册</span>
            <span v-if="opType == 1">登录</span>
            <span v-if="opType == 2">重置密码</span>
          </el-button>
        </el-form-item>
      </el-form>
    </Dialog>
    <!-- 发送邮箱验证码 -->
    <Dialog
      :show="dialogConfig4SendMailCode.show"
      :title="dialogConfig4SendMailCode.title"
      :buttons="dialogConfig4SendMailCode.buttons"
      width="400px"
      :showCancel="false"
      @close="dialogConfig4SendMailCode.show = false"
    >
      <el-form
        :model="formData4SendMailCode"
        :rules="rules"
        ref="formData4SendMailCodeRef"
        label-width="80px"
        @submit.prevent
      >
        <el-form-item label="邮箱">
          {{ formData.email }}
        </el-form-item>
        <!--input输入-->
        <el-form-item label="验证码" prop="checkCode">
          <div class="check-code-panel">
            <el-input
              size="large"
              clearable
              placeholder="请输入验证码"
              v-model.trim="formData4SendMailCode.checkCode"
            >
              <!-- 自定义头部组件 -->
              <template #prefix>
                <span class="iconfont icon-checkCode"> </span>
              </template>
            </el-input>
            <img
              :src="checkCodeUrl4SendMailCode"
              class="check-code"
              @click="changeCheckCode(1)"
            />
          </div>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<style lang="scss" scoped>
.login-register {
  .send-email-panel {
    width: 100%;
    display: flex;
    justify-content: space-between;

    .send-email-btn {
      margin-left: 5px;
    }
  }

  .rememberme-panel {
    width: 100%;
  }

  .no-account {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .op-btn {
    width: 100%;
  }
}

.check-code-panel {
  width: 100%;
  display: flex;
  .check-code {
    margin-left: 5px;
    cursor: pointer;
  }
}
</style>
