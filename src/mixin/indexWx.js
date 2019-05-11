import Vue from "vue";

Vue.mixin({
  onLaunch () { // 小程序 初始化
    this.initFn();
  },
  onShow () { // 小程序的页面加载  页面加载生命周期
    if (process.env.terminal === "xcx" && this.createdFn) {
      if (!this.initData) {
        this.initData = this.cloneObjectFn(this.$data);
      }
      this.createdFn(); // 如同 Vue 实例 create 生命周期
    }
  },
  data () {
    return {};
  },
  methods: {
    getRouteFn () { // 获取 $route
      return this.$root.$mp;
    },
    setRouterPushFn (url, query) { // 跳转页面并且会记录到历史
      if (url) {
        let queryString = "";
        if (query) {
          for (let key in query) {
            queryString += key + "=" + query[key] + "&";
          }
        }
        url = `/pages${url}/main?` + queryString;
        wx.navigateTo({url: url});
      }
    },
    setRouterReplaceFn (url) {  // 跳转页面  不会记录到历史
      wx.reLaunch({url: url});
    },
    setRouterBackFn (options) { // 路由返回
      wx.navigateBack(options);
    },
    setStorageFn (name, data) {  // 设置本地存储数据
      wx.setStorageSync(name, data);
    },
    getStorageFn (name) { // 获取本地存储数据
      return wx.getStorageSync(name);
    },
    removeStorageFn (name) { // 获取本地存储数据
      wx.removeStorageSync(name);
    },
    getDomStyleFn (classNme) { // 获取元素样式
      return new Promise(resolve => {
        wx.createSelectorQuery().selectAll(classNme).boundingClientRect(function(rect) {
          resolve(rect);
        }).exec();
      });
    }
  },
  onUnload () { // 页面卸载
    if (this.beforeDestroyFn) {
      this.beforeDestroyFn();
    }
  }
});
