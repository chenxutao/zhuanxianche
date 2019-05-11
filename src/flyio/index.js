import Vue from "vue";

let Fly;
let fly;
let setCookie = null;
if (process.env.terminal === "xcx") { // 判断环境
  Fly = require("flyio/dist/npm/wx");
  fly = new Fly;
  fly.config.baseURL = "https://www.rvaka.com/" || process.env.baseURL;
} else {
  Fly = require("flyio/dist/npm/fly");
  fly = new Fly;
}

Vue.prototype.$fly = fly;

//添加请求拦截器
fly.interceptors.request.use((request) => {
  if (request.method === "POST" || request.method === "PUT") {
    // request.body = QS.stringify(request.body)
  }
  //给所有请求添加自定义header
  if (setCookie) {
    request.headers["xkXcxAuthorization"] = setCookie[0].replace("xkXcxAuthorization=", "").split("; ")[0];
  }
  //打印出请求体
  // console.log(request)
  //终止请求
  //var err=new Error("xxx")
  //err.request=request
  //return Promise.reject(new Error(""))

  //可以显式返回request, 也可以不返回，没有返回值时拦截器中默认返回request
  return request;
});

//添加响应拦截器，响应拦截器会在then/catch处理之前执行
fly.interceptors.response.use((response) => {
    if (response.headers["set-cookie"]) {
      setCookie = response.headers["set-cookie"];
      console.log(setCookie);
    }
    if (response.request.url.includes("/amap/") || response.request.url.includes("restapi.amap.com")) {
      if (response.data.info !== "OK") {
        Vue.prototype.messageBoxFn(response.data.info, "warning");
      }
    } else if (response.data.code !== 0) {
      Vue.prototype.messageBoxFn(response.data.msg, "warning");
    }
    //只将请求结果的data字段返回
    return response.data;
  }, (err) => {
    //发生网络错误后会走到这里
    return Promise.resolve(err);
  }
);

export default fly;

