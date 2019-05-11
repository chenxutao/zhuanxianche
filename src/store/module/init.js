/**
 * 公共
 * */

const state = {
  userInfo: {} // 用户信息
}
const mutations = {
  setUserInfo (state, user) {
    state.userInfo = user;
  }
}

const getters = {
  getUserInfo: state => state.userInfo // 导出用户信息
}
const actions = {
  setUserInfo ({ commit }, user) { // 设置用户
    commit("setUserInfo", user);
  }
}
export default {
  name: 'init',
  state,
  mutations,
  getters,
  actions
}
