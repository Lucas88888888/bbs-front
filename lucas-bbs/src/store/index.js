import { createStore } from "vuex";

export default createStore({
  state: {
    //用户信息
    loginUserInfo: null,
    //是否展示登录，用于长时间未操作的超时情况下的登录页面的跳转
    showLogin: false,
    //板块信息
    boardList: [],
    activePBoardId: 0,
    activeBoardId: 0,
  },

  getters: {
    getLoginUserInfo: (state) => {
      return state.loginUserInfo;
    },
    getBoardList: (state) => {
      return state.boardList;
    },
    getSubBoardList: (state) => (boardId) => {
      let board = state.boardList.find((item) => {
        return item.boardId == boardId;
      });
      return board ? board.children : [];
      // return board;
    },
    getActivePBoardId: (state) => {
      return state.activePBoardId;
    },
    getActiveBoardId: (state) => {
      return state.activeBoardId;
    },
  },
  mutations: {
    updateLoginUserInfo(state, value) {
      state.loginUserInfo = value;
    },

    updateShowLogin(state, value) {
      state.showLogin = value;
    },
    saveBoardList(state, value) {
      state.boardList = value;
    },

    setActivePBoardId: (state, value) => {
      state.activePBoardId = value;
    },

    setActiveBoardId: (state, value) => {
      state.activeBoardId = value;
    },
  },
  actions: {},
  modules: {},
});
