<!-- 发货单详情-->
<template>
  <div id="deliveryDetails">
    <div class="information">
      <span class="tit">基本信息</span>
      <div class="msgRow"><span class="msgLeft">客户</span><span>{{orderData.customer?orderData.customer:''}}</span></div>
      <div class="msgRow"><span class="msgLeft">收货人</span><span>{{orderData.receiver?orderData.receiver:''}}</span></div>
      <div class="msgRow"><span class="msgLeft">司机</span><span>{{orderData.driver?orderData.driver:''}}</span></div>
      <div class="msgRow"><span class="msgLeft">单号</span><span>{{orderData.orderId?orderData.orderId:''}}</span></div>
      <div class="msgRow"><span class="msgLeft">开单时间</span><span>{{orderData.created?orderData.created:''}}</span></div>

      <div class="msgRow rowTop" ><span class="msgLeft">已收金额</span><span class="rowMoneya">{{orderData.received ===''?'':orderData.received}}</span></div>
      <div class="msgRow" ><span class="msgLeft">未收金额</span><span class="rowMoneyb">{{orderData.receivables ===''?'':orderData.receivables}}</span></div>
    </div>

    <div class="goodsList">
      <div class="tableTit">
        <span class="spec">货品规格</span>
        <span class="ohter">单位</span>
        <span class="ohter">数量</span>
        <span class="ohter">单价</span>
        <span class="ohter">金额</span>
      </div>
      <div class="tableRow" v-for="(item, index) in orderData.goodsList" :key="index">
        <span class="spec">{{item.goodsName === null?'':item.goodsName}}</span>
        <span class="ohter">{{item.unit ===''?'':item.unit}}</span>
        <span class="ohter">{{item.num ===''?'':item.num}}</span>
        <span class="ohter">{{item.amount ===''?'':item.amount}}</span>
        <span class="ohter">{{item.totalAmount ===''?'':item.totalAmount}}</span>
      </div>
    </div>

    <div class="autograph" v-if="orderData.sign">
      <div class="autographTit">签名</div>
      <img class="autographImg"
           :src="signUrl">
    </div>

    <div class="footer">
      <button open-type="share" class="footBtn blueBtn bigBtn" id="hide">隐藏价格发送</button>
      <button open-type="share" class="footBtn blueBtn">转发</button>
      <div class="footBtn grenBtn" @click="copy">复制</div>
    </div>

  </div>
</template>

<script>
  import utils from '../../utils/index'
  // 组件引用
  export default {
    components: {},
    computed: {},
    data () {
      return {
        signUrl:'', //签名地址
        orderId:'',
        userId:'',
        orderData:{
          "orderId" : "",
          "created" :"",
          "comment": "",
          "customer": "",
          "driver": "",
          "driverId": '',
          "receiver": "",
          "receiverId": "",
          "senderId":"",
          "sign":"",
          "title": "",
          "isPay":"",
          "showMoney": "",
          "receivables":'',
          "received":'',
          "isComplete":"",
          "goodsList": [{
            "orderId": "",
            "goodsId": "",
            "goodsName": "",
            "unit": "",
            "num":"",
            "amount": "",
            "totalAmount":"",
            "created": "",
            "updated":""
          }]
        }
      }
    },
    methods: {
      createdFn () { // 加载
        if(this.getUserInfo.id){   //vuex 拿user id
         this.userId = this.getUserInfo.id
        }
        if(this.getRouteFn().query.orderId){   //地址 拿 orderId
          this.orderId = this.getRouteFn().query.orderId
        }
        this.findOrder()  //获取列表
      },
     async findOrder(){ //获取列表
       let params ={
         orderId: this.orderId,
         userId: this.userId
       }
       let data = await this.$fly.get('/xcx/order/findOrderById', params)
       if(data && data.code === "success"){
         this.orderData = data.data
         this.orderData.created = utils.timeFn(data.data.created)
         this.signUrl=this.qiniuImgUrlFn(this.orderData.sign)
       }
     },
      copy(){   //复制按钮
        this.setRouterBackFn()  //返回
      }
    },
    onShareAppMessage: function (res) {  //转发按钮
      let isHide;
      if (res.from === 'button') {
        if(res.target.id === "hide"){
          isHide = 'hide'
        }else{
          isHide = 'show'
        }
      }
      return {
        title: '软咖发货单',
        path: '/pages/recipientOrder/main?isHide='+isHide+'&orderId='+this.orderId,
        success: function(res) {   // 转发成功
          console.log('转发成功')
        },
        fail: function(res) { // 转发失败
          console.log('转发失败')
        }
      }
    }
  };
</script>

<style lang="less" scoped>
  #deliveryDetails{
    position: relative;
    padding-bottom: 80px;
    width: 100vw;
    min-height: 100vh;
    background-color: #F0F0F0;
   .information{
     margin-top: 8px;
     padding: 20px 23px;
     background-color: #ffffff;
     .tit{
       display: block;
       margin-bottom: 20px;
       font-size: 21px;
       font-weight:bold;
     }
     .rowTop{
        margin-top: 25px;
     }
     .msgRow{
       margin-bottom: 12px;
        font-size: 19px;
      .msgLeft{
        display: inline-block;
        width: 90px;
        color: #999999;
      }
       .rowMoneya{
         font-weight: bold;
       }
       .rowMoneyb{
         font-weight: bold;
         color: #FF5151;
       }
     }
   }
    .goodsList{
      background-color: #ffffff;
      margin-top: 8px;
      padding: 16px 12px;
      .tableTit{
        font-size: 18px;
        color: #999999;
        display: flex;
        flex-direction: row;
        .spec{
          flex: 0 0 33.3333%;
        }
        .ohter{
          flex: 0 0 16.6666%;
          text-align: center;
        }
      }
      .tableRow{
       margin-top: 24px;
        display: flex;
        flex-direction: row;
        font-size: 18px;
        .spec{
          flex: 0 0 33.3333%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .ohter{
          flex: 0 0 16.6666%;
          text-align: center;
        }
      }
    }
    .footer{
      background-color: #ffffff;
      position: fixed;
      width: 100%;
      height: 60px;
      line-height: 60px;
      bottom: 0;
      display: flex;
      .footBtn{
        display: inline-block;
        height: 40px;
        line-height: 40px;
        color: #ffffff;
        flex: 0 0 20%;
        font-size: 19px;
        text-align: center;
        border-radius: 5px;
        margin: 10px auto 0;
      }
      .blueBtn{
        background-color: #06C2CC;
      }
      .grenBtn{
        background-color: #63CD5E;
      }
      .bigBtn{
        flex: 0 0 40%;
      }
    }
    .autograph{
      margin-top: 10px;
      padding: 20px 23px;
      background-color: #ffffff;
      display: flex;
      height: 160px;
      line-height: 160px;
      .autographTit{
        flex:0 0 50px ;
        color: #999999;
        font-size: 19px;
      }
      .autographImg{
        flex:0 0 1;
        height: 160px;
        vertical-align: middle;
      }
    }
  }
</style>

