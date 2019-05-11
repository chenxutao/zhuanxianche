var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  terminal: '"h5"',
  baseURL: '"http://localhost:8080"', // 请求域名 (小程序用)
  amapUrl: '"/amap"' // 高德 webApi 请求域名
})
