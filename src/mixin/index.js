import Vue from "vue";
import { mapGetters } from "vuex";

const terminal = process.env.terminal; // 终端
Vue.prototype.messageBoxFn = async (message, type = "success") => { // 提示框
  return new Promise(resolve => {
    if (terminal === "xcx" && message) { // 小程序
      wx.showToast({
        title: message,
        icon: "none",
        duration: 1500
      });
      setTimeout(() => {
        resolve(true);
      }, 1500);
    } else if (terminal === "h5" && message) { // h5
      let divToast = document.createElement("div");
      divToast.setAttribute("class", "tool-message-box");
      divToast.innerHTML = message;
      document.body.appendChild(divToast);
      setTimeout(() => {
        document.body.removeChild(divToast);
        resolve(true);
      }, 1500);
    }
  });
};

Vue.mixin({
  computed: {
    ...mapGetters({
      getUserInfo: "getUserInfo" // 用户信息
    })
  },
  data() {
    return {
      terminal, // 终端
      authorizeState: false, // 是否显示  授权
      touchMoveData: { // 滑动数据
        lastX: 0, // 记录X
        lastY: 0 // 记录Y
      },
      loadingBoxStatus: false, // 加载动画状态
      mixinBaseURL: "http://10.10.2.132:10001/api" || process.env.baseURL // 请求域名
    };
  },
  methods: {
    async initFn() { // 初始化
    },
    async getLoginStateFn() { // 检查登陆
      let that = this;
      return new Promise(resolve => {
        if (that.terminal === "xcx") {
          wx.getSetting({
            success(res) {
              if (res.authSetting["scope.userInfo"]) {
                wx.getUserInfo({
                  async success(res) {
                    let user = await that.loginFn(res);
                    resolve(user);
                  }
                });
              } else {
                that.authorizeState = true;
                resolve(false);
              }
            }
          });
        }
      });
    },
    loginFn(res) { // 登陆
      let that = this;
      return new Promise(resolve => {
        that.authorizeState = false;
        let rawData = JSON.parse(res.rawData);
        wx.login({
          async success(res) {
            if (res.code) {
              console.log('login')
              let data = await that.$fly.post(`/xcx/auth/login?code=${res.code}&nickname=${rawData.nickName}&photo=${rawData.avatarUrl}`);
              if (data.code === "success") {
                let userInfo = { name: rawData.nickName, id: data.data, photo: rawData.avatarUrl};
                that.$store.dispatch("setUserInfo", userInfo);
                resolve(userInfo);
              }
            }
          }
        });
      });
    },
    async locationFn() { // 定位当前位置
      if (terminal === "xcx") { // 判断是不是微信
        return await this.$utils.locationXcxFn();
      } else { // web 定位
        return await this.$utils.locationWebFn();
      }
    },
    beforeDestroyFn() { // 页面卸载
    },
    cloneObjectFn(obj) { // 深复制 对象
      return JSON.parse(JSON.stringify(obj));
    },
    touchMoveFn(e) { // 滑动方向
      let currentX = e.pageX || event.touches[0].pageX;
      let currentY = e.pageY || event.touches[0].pageY;
      if (this.touchMoveData.lastX || this.touchMoveData.lastY) {
        let tx = currentX - this.touchMoveData.lastX;
        let ty = currentY - this.touchMoveData.lastY;

        return new Promise(resolve => {
          let fn = () => { // 重置
            this.touchMoveData.lastX = 0;
            this.touchMoveData.lastY = 0;
          };
          if (Math.abs(tx) > Math.abs(ty) && tx > 0) {
            fn();
            resolve("right");
            return;
          } else if (Math.abs(tx) > Math.abs(ty) && tx < 0) {
            fn();
            resolve("left");
            return;
          } else if (Math.abs(ty) > Math.abs(tx) && ty > 0) {
            fn();
            resolve("bottom");
            return;
          } else if (Math.abs(ty) > Math.abs(tx) && ty < 0) {
            fn();
            resolve("top");
            return;
          }
          this.touchMoveData.lastX = currentX;
          this.touchMoveData.lastY = currentY;
        });
      } else {
        this.touchMoveData.lastX = currentX;
        this.touchMoveData.lastY = currentY;
      }
    },
    qiniuImgUrlFn(hash) { // 回显七牛云图片
      return `http://assets.rvaka.com/${hash}`;
      // return `http://phz9s5zrv.bkt.clouddn.com/${hash}`;
    },
    validateFormFn(form, rules) { // form 检查
      return new Promise(resolve => {
        let state = true;
        if (rules) {
          for (let k in rules) {
            for (let i = 0; i < rules[k].length; i++) {
              let rule = rules[k][i];
              if (rule.required && !form[k] && state) {
                state = false;
                this.messageBoxFn(rule.message, "warning");
                resolve(false);
              } else if (rule.validator && state) {
                rule.validator(form[k], (message) => {
                  if (message) {
                    state = false;
                    this.messageBoxFn(message, "warning");
                    resolve(false);
                  }
                }, form);
              }
            }
          }
          if (state) {
            resolve(true);
          }
        } else {
          resolve(true);
        }
      });
    },
    callPhoneFn(phone) { // 拨打电话
      if (terminal === "xcx" && phone) { // 小程序
        wx.makePhoneCall({ phoneNumber: phone });
      }
    },
    showLoadingBoxFn() { // 开始加载动画
      this.loadingBoxStatus = true;
      if (this.terminal === "xcx") { // 小程序
        wx.showLoading();
      }
    },
    hideLoadingBoxFn() { // 结束加载动画
      this.loadingBoxStatus = false;
      if (this.terminal === "xcx") { // 小程序
        wx.hideLoading();
      }
    }
  }
});
