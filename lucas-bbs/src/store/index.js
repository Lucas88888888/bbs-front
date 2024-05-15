import { createStore } from "vuex";

export default createStore({
  state: {
    //用户信息
    loginUserInfo: null,
    //是否展示登录，用于长时间未操作的超时情况下的登录页面的跳转
    showLogin: false,
  },

  getters: {
    getLoginUserInfo: (state) => {
      return state.loginUserInfo;
    },
  },
  mutations: {
    updateLoginUserInfo(state, value) {
      state.loginUserInfo = value;
    },

    updateShowLogin(state, value) {
      state.showLogin = value;
    },
  },
  actions: {},
  modules: {},
});
