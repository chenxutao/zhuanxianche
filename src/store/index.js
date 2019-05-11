import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

/** 自定义遍历vuex */
const requireAll = val => val.keys().map(val)
const req = require.context('./module', true, /\.js/)
let modules = {}
requireAll(req).map((curr, index) => {
  let name = curr.default.name
  modules[name] = curr.default
})

const store = new Vuex.Store({
  modules
})

export default store
