import Vue from "vue";

Vue.mixin({
  created () { // Vue 的生命周期
    if (process.env.terminal === "h5" && this.createdFn) {
      if (!this.initData) { // clone 初始化数据
        this.$set(this, "initData", this.cloneObjectFn(this.$data));
      }
      this.createdFn();  // 如同 Vue 实例 create 生命周期
    }
  },
  data () {
    return {};
  },
  methods: {
    getRouteFn () { // 获取 $route
      return this.$route;
    },
    setRouterPushFn (url, query = null) { // 跳转页面并且会记录到历史
      if (url) {
        url = `/pages${url}/main`;
        this.$router.push({ path: url, query });
      }
    },
    setRouterReplaceFn (url) { // 跳转页面  不会记录到历史
      this.$router.replace(url);
    },
    setRouterBackFn (options) { // 路由返回 options.delta 返回几次
      if (options && options.delta) { // 返回多次
        for (let i = 0; i < options.delta; i++) {
          this.$router.go(-1);
        }
      } else { // 返回一次
        this.$router.go(-1);
      }
    },
    setStorageFn (name, data) { // 设置本地存储数据
      localStorage.setItem(name, JSON.stringify(data));
    },
    getStorageFn (name) { // 获取本地存储数据
      return JSON.parse(localStorage.getItem(name));
    },
    removeStorageFn (name) { // 删除本地存储数据
      localStorage.removeItem(name);
    }
  },
  beforeDestroy () { // 卸载
    if (this.beforeDestroyFn) {
      this.beforeDestroyFn();
    }
  }
});
