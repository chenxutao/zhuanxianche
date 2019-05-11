// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import Vuex from "vuex";
import App from "./AppH5";
import router from "./router";
import store from "./store";
import "./mixin/index";
import "./mixin/indexH5";
import "./flyio";
import "./router/beforeEach";
import utils from "./utils";
import "./fiters";

Vue.prototype.$utils = utils;
Vue.config.productionTip = false;
Vue.use(Vuex);
/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  components: { App },
  template: "<App/>",
  store
});
