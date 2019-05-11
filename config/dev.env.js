var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  terminal: '"xcx"', // 终端
  baseURL: '"http://localhost:8080"', // 请求域名 (小程序用)
  amapUrl: '"https://restapi.amap.com"', // 高德 webApi 请求域名
  upImgSrc :'"https://test.rvaka.com"'  //上传图片地址
})
