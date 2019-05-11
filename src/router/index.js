import Vue from "vue";
import Router from "vue-router";

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: "/newOrder", // 新建订单
      name: "newOrder",
      component: r => require.ensure([], () => r(require("@/pages/newOrder/index.vue")), "newOrder"),
      alias: "/pages/newOrder/main"
    },
    {
      path: "/deliveryDetails", //发货单详情
      name: "deliveryDetails",
      component: r => require.ensure([], () => r(require("@/pages/deliveryDetails/index.vue")), "deliveryDetails"),
      alias: "/pages/deliveryDetails/main"
    },
    {
      path: "/recipientOrder", //收货单详情
      name: "recipientOrder",
      component: r => require.ensure([], () => r(require("@/pages/recipientOrder/index.vue")), "recipientOrder"),
      alias: "/pages/recipientOrder/main"
    },
    {
      path: "/sign", //签名
      name: "sign",
      component: r => require.ensure([], () => r(require("@/pages/sign/index.vue")), "sign"),
      alias: "/pages/sign/main"
    },
    {
      path: "/proposal", //建议
      name: "proposal",
      component: r => require.ensure([], () => r(require("@/pages/proposal/index.vue")), "proposal"),
      alias: "/pages/proposal/main"
    },
    { // 重定向
      path: '*',
      redirect: '/pages/deliveryDetails/main'
    }
  ]
})
