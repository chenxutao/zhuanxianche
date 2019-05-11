<!-- 收单详情-->
<template>
  <div id="recipientOrder">
    <div class="information">
      <span class="tit">基本信息</span>
      <div class="msgRow"><span class="msgLeft">客户</span><span>{{orderData.customer?orderData.customer:''}}</span></div>
      <div class="msgRow"><span class="msgLeft">收货人</span><span>{{orderData.receiver?orderData.receiver:''}}</span></div>
      <div class="msgRow"><span class="msgLeft">司机</span><span>{{orderData.driver?orderData.driver:''}}</span></div>
      <div class="msgRow"><span class="msgLeft">单号</span><span>{{orderData.orderId?orderData.orderId:''}}</span></div>
      <div class="msgRow"><span class="msgLeft">开单时间</span><span>{{orderData.created?orderData.created:''}}</span></div>

      <div class="msgRow rowTop" v-if="showMoney"><span class="msgLeft">已收金额</span><span class="rowMoneya">{{orderData.received ===''?'':orderData.received}}</span></div>
      <div class="msgRow" v-if="showMoney"><span class="msgLeft">未收金额</span><span class="rowMoneyb">{{orderData.receivables ===''?'':orderData.receivables}}</span></div>
    </div>

    <div class="goodsList">
      <div class="tableTit">
        <span class="spec">货品规格</span>
        <span class="ohter">单位</span>
        <span class="ohter">数量</span>
        <span class="ohter" v-if="showMoney">单价</span>
        <span class="ohter" v-if="showMoney">金额</span>
      </div>
      <div class="tableRow" v-for="(item, index) in orderData.goodsList" :key="index">
        <span class="spec">{{item.goodsName ===''?'':item.goodsName}}</span>
        <span class="ohter">{{item.unit ===''?'':item.unit}}</span>
        <span class="ohter">{{item.num  ===''?'':item.num}}</span>
        <span class="ohter" v-if="showMoney">{{item.amount ===''?'':item.amount}}</span>
        <span class="ohter" v-if="showMoney">{{item.totalAmount  ===''?'':item.totalAmount}}</span>
      </div>
    </div>

    <div class="footer" v-if="!orderData.sign">
      <div class="footBtn grenBtn" @click="signBoardSate=true">签名</div>
    </div>

    <div class="footer" v-if="saveVal">
      <div class="footBtn grenBtn" @click="save">保存</div>
    </div>

    <!--<div class="footer" v-if="saveVal">-->
      <!--<div class="footBtn grenBtn" @click="save">返回主页</div>-->
    <!--</div>-->

    <div class="autograph" v-if="orderData.sign">
      <div class="autographTit">签名</div>
      <img class="autographImg"
           :src="signUrl">
    </div>

    <sign-board @success="signSuccessFn" v-if="signBoardSate" @back="backFn"></sign-board>

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
  </div>
</template>

<script>
  import utils from "../../utils/index";
  import SignBoard from "../../components/canvasSgin";
  // 组件引用
  export default {
    components: { SignBoard },
    computed: {},
    data() {
      return {
        saveVal:false,
        orderId: "",
        showMoney: true,
        signBoardSate: false,
        signUrl: "",
        orderData: {
          "orderId": "",
          "created": "",
          "comment": "",
          "customer": "",
          "driver": "",
          "driverId": "",
          "receiver": "",
          "receiverId": "",
          "senderId": "",
          "sign": "",
          "title": "",
          "isPay": "",
          "showMoney": "",
          "receivables": "",
          "received": "",
          "isComplete": "",
          "goodsList": [{
            "orderId": "",
            "goodsId": "",
            "goodsName": "",
            "unit": "",
            "num": "",
            "amount": "",
            "totalAmount": "",
            "created": "",
            "updated": ""
          }]
        }
      };
    },
    methods: {
      async createdFn() { // 加载
        await this.getLoginStateFn();
        this.findOrder();
      },
      async findOrder() {   //回显页面数据
        let params = {
          orderId: this.orderId
        };
        let data = await this.$fly.get("/xcx/order/findOrderById", params);
        if (data && data.code === "success") {
          this.orderData = data.data;
          if(this.orderData.sign){
            this.signUrl=this.qiniuImgUrlFn(this.orderData.sign)
          }
          this.orderData.created = utils.timeFn(data.data.created);
        }
      },
      async authorizeButFn(res) { // 授权
        if (res.target.errMsg === "getUserInfo:ok") {
          await this.loginFn(res.target);
        } else {
          this.authorizeState = false;
        }
      },
      signSuccessFn(data) { // 签名完成
        this.signBoardSate = false;
        this.saveVal = true
        this.orderData.sign = data.hash;
        this.signUrl=this.qiniuImgUrlFn(data.hash)
      },
      backFn(){
        this.signBoardSate = false;
      },
      async save(){  //保存
        let params = {'orderId': this.orderId,'sign':this.orderData.sign};
        let data = await this.$fly.post("/xcx/order/sign", params);
        if(data && data.code === 'success'){
          this.findOrder();  //刷新页面数据
          this.saveVal = false
        }
      }
    },
    onLoad: function(res) {
      if (res) {
        if (res.isHide === "show") {
          this.showMoney = true;
        } else if (res.isHide === "hide") {
          this.showMoney = false;
        }
        if (res.orderId) {
          this.orderId = res.orderId;
        }
      }
    }
  };
</script>

<style lang="less">
  #recipientOrder {
    position: relative;
    padding-bottom: 80px;
    width: 100vw;
    min-height: 100vh;
    background-color: #F0F0F0;
    .information {
      margin-top: 8px;
      padding: 20px 23px;
      background-color: #ffffff;
      .tit {
        display: block;
        margin-bottom: 20px;
        font-size: 21px;
        font-weight: bold;
      }
      .rowTop {
        margin-top: 25px;
      }
      .msgRow {
        margin-bottom: 12px;
        font-size: 19px;
        .msgLeft {
          display: inline-block;
          width: 90px;
          color: #999999;
        }
        .rowMoneya {
          font-weight: bold;
        }
        .rowMoneyb {
          font-weight: bold;
          color: #FF5151;
        }
      }
    }
    .goodsList {
      background-color: #ffffff;
      margin-top: 8px;
      padding: 16px 12px;
      .tableTit {
        font-size: 18px;
        color: #999999;
        display: flex;
        flex-direction: row;
        .spec {
          flex: 0 0 33.3333%;
        }
        .ohter {
          flex: 0 0 16.6666%;
          text-align: center;
        }
      }
      .tableRow {
        margin-top: 24px;
        display: flex;
        flex-direction: row;
        font-size: 18px;
        .spec {
          flex: 0 0 33.3333%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .ohter {
          flex: 0 0 16.6666%;
          text-align: center;
        }
      }
    }
    .footer {
      background-color: #ffffff;
      position: fixed;
      width: 100%;
      height: 48px;
      line-height: 48px;
      bottom: 0;
      display: flex;
      .footBtn {
        display: inline-block;
        height: 41px;
        line-height: 41px;
        color: #ffffff;
        flex: 0 0 80%;
        font-size: 19px;
        text-align: center;
        border-radius: 5px;
        margin: 5px auto 0;
      }
      .grenBtn {
        background-color: #63CD5E;
      }
      .bigBtn {
        flex: 0 0 28%;
      }
    }
    .autograph {
      margin-top: 10px;
      padding: 20px 23px;
      background-color: #ffffff;
      display: flex;
      height: 160px;
      line-height: 160px;
      .autographTit {
        flex: 0 0 50px;
        color: #999999;
        font-size: 19px;
      }
      .autographImg {
        flex: 0 0 1;
        height: 160px;
        width: 160px;
        vertical-align: middle;
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
          font-size: 21px;
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

