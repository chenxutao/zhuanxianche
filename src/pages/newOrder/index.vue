<!-- 下单 首页 -->
<template>
  <div id="new-order">
    <div class="tool-nav">
      <!--<div class="left">新建订单</div>-->
      <div class="share" @click="shareOpen = true">分享</div>
      <div class="proposal" @click="goProposal">建议</div>
      <div class="right" @click="setRouterPushFn('/orderRecord')">记录</div>
    </div>
    <div class="content">
      <div class="goods-form">
        <div class="goods-form-header">
          <div class="goods-form-row">
            <div class="goods-form-header-item too-required name">货物规格</div>
            <div class="goods-form-header-item too-required">单位</div>
            <div class="goods-form-header-item too-required">数量</div>
            <div class="goods-form-header-item too-required">单价</div>
            <div class="goods-form-header-item too-required">金额</div>
          </div>
        </div>
        <div class="goods-form-body">
          <div class="goods-form-row" v-for="(item,index) in form.goodsList" :key="index">
            <order-slider-row :goods.sync="item" :index="index" :optionsIndex.sync="optionsIndex" @input="goodsListFn"
                              :disabled="index===0"
                              @remove="tableRemoveFn">
            </order-slider-row>
          </div>
        </div>
      </div>
      <div class="goods-form-add" @click="tableAddFn">添加行</div>
      <div class="goods-form-total">
        合计：{{form.goodsTotal}} 元
      </div>
      <div class="order-other">
        <!--<textarea class="order-other-title" v-model="form.title" placeholder="请填写发货单抬头或备注">-->
        <!--</textarea>-->
        <input type="text" class="order-other-title" v-model="form.title" placeholder="请填写发货单抬头或备注">
        <div class="order-other-row">
          <div class="label ">客户</div>
          <div class="value">
            <input class="input" placeholder-class="phcolor" v-model="form.customer" placeholder="请输入客户名称和手机号">
          </div>
        </div>
        <div class="order-other-row">
          <div class="label ">收货人</div>
          <div class="value">
            <input class="input" placeholder-class="phcolor" v-model="form.receiver" placeholder="请输入收货人名称和手机号">
          </div>
        </div>
        <div class="order-other-row">
          <div class="label ">司机</div>
          <div class="value">
            <input class="input" placeholder-class="phcolor" v-model="form.driver" placeholder="请输入司机名称和手机号">
          </div>
        </div>
      </div>
      <div class="order-bot">
        <!--<div class="order-bot-num">-->
          <!--No.{{form.orderId}}-->
        <!--</div>-->
        <div class="order-bot-time">
          {{time}}
        </div>
      </div>
      <div class="order-but" @click="newOrderFn">保存</div>

    </div>
    <div class="authorize-box" :class="{'authorize-box-show':authorizeState}">
      <div class="box-cont">
        <div class="title">
          微信授权
        </div>
        <div class="min">
          软咖电子发货单 申请获得您的授权
        </div>
        <div class="bottom">
          <div class="but" @click="authorizeState=false">拒绝</div>
          <div class="but">
            <button class="button" open-type="getUserInfo" @getuserinfo="authorizeButFn">允许</button>
          </div>
        </div>
      </div>
    </div>

    <share v-if="shareOpen" @closeLayer="shareOpen = false"></share>
  </div>
</template>

<script>
  // 组件引用

  import OrderSliderRow from "../../components/orderSliderRow";
  import share from "../../components/share"

  export default {
    components: { OrderSliderRow ,share },
    computed: {},
    data () {
      return {
        shareOpen:false,   //弹出分享
        optionsIndex: null, // 表格操作打开
        time: this.$utils.timeFn(new Date().valueOf(), "YYYY-MM-DD"), // 时间
        form: {
          // orderId: null, // 订单编号
          goodsTotal: 0, // 合计
          goodsList: [
            {
              amount: null, // 单价
              num: null, // 数量
              goodsName: null, // 名称
              unit: null, // 单位
              totalAmount: null // 金额
            }
          ]
        },
        tableRules: {
          goodsName: [{
            validator: (value, err, form) => {
              if (!value) {
                err(`请输入货物规格`);
              } else {
                err();
              }
            }
          }],
          unit: [{
            validator: (value, err, form) => {
              if (!value) {
                err(`【${form.goodsName || ""}】货物没有输入单位`);
              } else {
                err();
              }
            }
          }],
          num: [{
            validator: (value, err, form) => {
              if (!value) {
                err(`【${form.goodsName || ""}】货物没有输入数量`);
              } else if (value && !Number(value)) {
                err(`【${form.goodsName || ""}】货物没有输入正确的数量`);
              } else {
                err();
              }
            }
          }],
          amount: [{
            validator: (value, err, form) => {
              if (!value) {
                err(`【${form.goodsName || ""}】货物没有输入单价`);
              } else if (value && !Number(value)) {
                err(`【${form.goodsName || ""}】货物没有输入正确的单价`);
              } else {
                err();
              }
            }
          }]
        }
      };
    },
    methods: {
      async createdFn () { // 加载
        await this.getLoginStateFn();
        if (this.form.orderId) {
          this.getOrderFn();
        } else {
          this.getOrderIdFn();
        }
      },
      beforeDestroyFn () {
        Object.assign(this.$data, this.cloneObjectFn(this.initData));
      },
      async authorizeButFn (res) { // 授权
        if (res.target.errMsg === "getUserInfo:ok") {
          await this.loginFn(res.target);
          if (!this.form.orderId) {
            // this.getOrderIdFn();
          } else {
            this.getOrderFn();
          }
        } else {
          this.authorizeState = false;
        }
      },
      goodsListFn () { // 监听 数据
        let goodsList = this.form.goodsList;
        if (goodsList && goodsList.length > 0) {
          this.form.goodsTotal = 0;
          goodsList.map((item, index) => {
            item.totalAmount = ((Number(item.amount) || 0) * (Number(item.num) || 0)).toFixed(2);
            this.form.goodsTotal += Number(item.totalAmount);
          });
          this.form.goodsTotal = this.form.goodsTotal.toFixed(2);
        }
      },
      tableAddFn () { // 添加行
        this.form.goodsList.push({
          amount: null,
          num: null,
          goodsName: null,
          unit: null,
          totalAmount: null
        });
      },
      async getOrderIdFn () { // 获取 订单号
        // let data = await this.$fly.get("/xcx/order/getOrderId");
        // if (data && data.code === "success") {
        //   this.form.orderId = data.data;
        // }
      },
      async newOrderFn () { // 新建订单
        if (this.loadingBoxStatus) { // 正在请求
          return;
        }
        let form = this.cloneObjectFn(this.form);
        let state = true;
        for (let i = 0; i < form.goodsList.length; i++) {
          if (state) {
            state = await this.validateFormFn(form.goodsList[i], this.tableRules);
          }
        }
        if (state) {
          this.showLoadingBoxFn();
          let data = await this.$fly.post("/xcx/order", form);
          this.hideLoadingBoxFn();
          if (data && data.code === "success") {
            this.form.orderId = data.data
            this.messageBoxFn("订单创建成功！");
            this.setRouterPushFn("/deliveryDetails", { orderId: this.form.orderId });
          }
        }
      },
      tableRemoveFn ({ index }) { // 删除
        this.form.goodsList.splice(index, 1);
      },
      async getOrderFn () { // 获取orderInfo
        let data = await this.$fly.get(`/xcx/order/findOrderById?orderId=${this.form.orderId}&userId=${this.getUserInfo.id}`);
        if (data && data.code === "success") {
          if (data.data.goodsList.length <= 0) {
            data.data.goodsList.push({
              amount: null,
              num: null,
              goodsName: null,
              unit: null,
              totalAmount: null
            });
          }
          Object.assign(this.form, data.data);
          this.getOrderIdFn();
        }
      },
      goProposal(){   //跳转建议
        this.setRouterPushFn("/proposal", { userId: this.getUserInfo.id });
      },
      goShare(){   //请求转发接口
        console.log()
        let data = this.$fly.get(`/xcx/userHabit/updateShareNum?userId=${this.getUserInfo.id}`);
        if(data && data.code === "success"){
          this.shareOpen = false
        }
      }
    },
    onShareAppMessage: function (res) {  //转发按钮
      if (res.from === 'button') {
        // 来自页面内转发按钮
        console.log(res.target)
        this.goShare()   //调用分享+1
      }
      return {
        title: '软咖发货单',
        path: '/pages/newOrder/main',
        success: function(res) {   // 转发成功
          console.log(res)
          // console.log('转发成功')
        },
        fail: function(res) { // 转发失败
        }
      }
    },
    async mounted () {
    }
  };
</script>

<style lang="less">
  #new-order {
    background: rgba(240, 240, 240, 1);
    min-height: 100vh;
    padding-bottom: 20px;
    .tool-nav {
      .left {
        font-size: 20px;
      }
      .right {
        font-size: 20px;
      }
      .proposal,.share{
        font-size: 20px;
      }
    }
    .content {
      padding: 12px 0;
      margin: 0 12px;
      padding-bottom: 62px;
      .goods-form {
        box-sizing: border-box;
        font-size: 18px;
        background: #fff;
        border-radius: 5px;
        overflow: hidden;
        .goods-form-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .order-slider-row-options{
            .totalAmount {
              border-right: 1px solid #dddddd;
            }
          }
          .goods-form-header-item {
            width: calc((100% - 122px) / 4);
            color: #000000;
            font-size: 18px;
            border-left: 1px solid #dddddd;
            border-top: 1px solid #dddddd;
            .input {
              box-sizing: border-box;
              padding: 0 5px;
              color: #333;
              height: 55px;
              line-height: 55px;
            }
          }
          .name {
            flex: auto;
            width: 112px;
            border-left:none;
            text-align: left !important;
          }
        }
        .goods-form-header{
          .goods-form-header-item {
            background-color: #f0f9fa;
            border-top: none;
            height: 50px;
            line-height: 50px;
            text-align: center;
            color: #333333;
          }
        }
        .goods-form-body {
            .goods-form-header-item {
              height: 50px;
              line-height: 50px;
            }
            .name{
            border-left:none;
          }
        }
      }
      .goods-form-add {
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fff;
        border-radius: 5px;
        font-size: 19px;
        color: rgba(99, 205, 94, 1);
        margin-top: 6px;
      }
      .goods-form-total {
        padding: 15px 0;
        font-size: 19px;
        color: rgba(6, 194, 204, 1);
      }
      .order-other {
        box-sizing: border-box;
        padding: 12px;
        background: #fff;
        border-radius: 5px;
        font-size: 19px;
        .order-other-title {
          height: 60px;
          font-size: 21px;
        }
        .order-other-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 44px;
          .phcolor{
            color: #CCCCCC;
          }
          .input {
            text-align: right;
            color: #333;
          }
          .label {
            font-size: 19px;
            width: 25%;
            color: #333333;
          }
          & + .order-other-row {
            border-top: 1px solid rgba(235, 235, 235, 1);
          }
        }
      }
      .order-bot {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: rgba(153, 153, 153, 1);
        font-size: 15px;
        padding: 15px 11px;
      }
      .order-but {
        position: fixed;
        bottom: 18px;
        left: 0;
        right: 0;
        margin: 0 auto;
        width: 90vw;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        color: #fff;
        background: rgba(6, 194, 204, 1);
        border-radius: 5px;
        margin-top: 32px;
      }

      .proposal{
        font-size: 20px;
        color: #666;
        text-align: center;
        margin-top: 10px;
      }
    }

  }

  .authorize-box {
    display: none;
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, .5);
    z-index: 50;
    .box-cont {
      position: fixed;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      background: #fff;
      border-radius: 5px;
      width: 80%;
      overflow: hidden;
      .title {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 21px;
        color: #333;
        height: 40px;
        border-bottom: 1px solid #eee;
      }
      .min {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 30px 0;
        font-size: 19px;
        color: #666;
      }
      .bottom {
        height: 50px;
        display: flex;
        border-top: 1px solid #eee;
        .but {
          box-sizing: border-box;
          width: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size:21px;
          font-weight: normal;
          & + .but {
            border-left: 1px solid #eee;
          }
          .button {
            width: 100%;
            height: 100%;
            background: none;
            color: rgba(6, 194, 204, 1);
          }
        }
      }
    }

  }

  .authorize-box-show {
    display: block;
  }
</style>
