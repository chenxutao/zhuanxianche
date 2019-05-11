<!-- 订单记录 -->
<template>
  <div id="order-type">
    <div class="cover" v-show="ifShowCover">
      <div class="delete-record-row" v-if="isDelete">
        <div class="record-tips">是否删除这条订单记录？</div>
        <div class="tool-btn-row">
          <div class="record-btn cancel" @click="cancelFn">取消</div>
          <div class="record-btn do-del" @click="doDelete">删除</div>
        </div>
      </div>
      <div class="get-money-row" v-if="isGetMoney">
        <div class="money-tips">收款</div>
        <input type="text" class="money-num" v-model="recordDetails.price" placeholder="请输入收款金额"/>
        <div class="tool-btn-row">
          <div class="record-btn cancel" @click="cancelFn">取消</div>
          <div class="record-btn do-get" @click="doGet">确定</div>
        </div>
      </div>
    </div>
    <record-type @checkedFn="getCheckedFn"></record-type>
    <div class="record-lists">
      <div class="no-items" v-if="recordItems==''">
        <img class="img" src="/static/img/no-items.png"/>
      </div>
      <div class="record-items" v-else>
        <div class="records-status-row">
          <div class="status-items">客户</div>
          <div class="status-items">应收金额</div>
          <div class="status-items">收款状态</div>
        </div>
        <div class="record-items-scroll-row">
          <recordFlowLoadMore @top-scroll="topScrollFn" @deleteBuyId="deleteBuyGetId" @getMoneyBuyId="getMoneyBuyGetId"
                              @goOrder="goOrder" @bottom-scroll="bottomScrollFn" :records="recordItems">

          </recordFlowLoadMore>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  // 组件引用

  import RecordType from "../../components/recordType";
  import RecordFlowLoadMore from "../../components/recordFlowLoadMore";

  export default {
    components: { RecordFlowLoadMore, RecordType },
    computed: {},
    data() {
      return {
        userId: "",
        optionsIndex: null,
        typeChecked: "1", //默认记录类型 1：待收 2：已收
        recordItems: [],
        page: 1,
        size: 10,
        isDelete: false,
        isGetMoney: false,
        ifShowCover: false,
        deleteId: "",
        getMoneyId: "",
        loadingBoxStatus: false,
        recordDetails: {
          price: null
        },
        receivedMoney: 0,
        priceRule: {
          price: [{
            validator: (value, err, recordDetails) => {
              if (!value) {
                err(`【${recordDetails.price || ""}】没有输入金额`);
              } else if (value && !Number(value)) {
                err(`【${recordDetails.price || ""}】没有输入正确的金额`);
              } else {
                err();
              }
            }
          }]
        }
      };
    },
    methods: {
      async doGet() {//确认收款
        let state = await this.validateFormFn(this.recordDetails, this.priceRule);
        if (state) {
          let params = { "orderId": this.getMoneyId, "received": this.recordDetails.price };
          if (this.loadingBoxStatus) {
            return;
          }
          if (this.recordDetails.price > this.receivedMoney) {
            this.messageBoxFn("超出收款额度！");
            return;
          }
          this.showLoadingBoxFn();
          let data = await this.$fly.post("/xcx/order/makeCollections", params);
          this.hideLoadingBoxFn();
          if (data && data.httpCode === 200) {
            this.messageBoxFn("收款成功！");
            this.recordItems = "";
            this.getRecordItemsFn();
            this.cancelFn();
          } else {
            this.messageBoxFn("修改失败，请稍后再试！");
          }
        }
      },
      async doDelete() {//确认删除
        if (this.loadingBoxStatus) {
          return;
        }
        this.showLoadingBoxFn();
        let data = await this.$fly.delete(`/xcx/order?orderId=${this.deleteId}`);
        this.hideLoadingBoxFn();
        if (data && data.httpCode === 200) {
          this.messageBoxFn("删除成功！");
          this.recordItems = "";
          this.getRecordItemsFn();
          this.cancelFn();
        } else {
          this.messageBoxFn("删除失败，请稍后再试！");
        }
      },
      getMoneyBuyGetId(orderId, receivables) {//获取订单id
        this.ifShowCover = true;
        this.isGetMoney = true;
        this.getMoneyId = orderId;
        this.recordDetails.price = receivables;
        this.receivedMoney = receivables;
      },
      deleteBuyGetId(orderId) {//根据传过来的参数删除订单
        this.ifShowCover = true;
        this.isDelete = true;
        this.deleteId = orderId;
      },
      cancelFn() {//取消删除
        this.isDelete = false;
        this.ifShowCover = false;
        this.isGetMoney = false;
        this.deleteId = "";
        this.getMoneyId = "";
        this.receivedMoney = 0;
      },
      async getRecordItemsFn() { // 获取记录列表
        if (this.loadingBoxStatus) {
          return;
        }
        this.showLoadingBoxFn();
        let params = {
          "isComplete": this.typeChecked - 1,
          "userId": this.userId,
          "page": this.page,
          "size": this.size
        };
        let data = await this.$fly.get("/xcx/order", params);
        this.hideLoadingBoxFn();
        console.info(this.page);
        if (data && data.code === "success") {
          this.recordItems = [...this.recordItems, ...data.data];
        }
      },
      getCheckedFn(res) { // 获取子组件传来的类型值,并请求数据
        this.typeChecked = res;
        this.recordItems = [];
        this.page=1;
        this.getRecordItemsFn();
      },
      goOrder(res) { //点击去详情页
        this.setRouterPushFn("/deliveryDetails", { orderId: res });
      },
      async topScrollFn(next) { // 下拉刷新
        this.page = 1;
        this.recordItems = [];
        await this.getRecordItemsFn();
        next();
      },
      async bottomScrollFn(next) { // 上拉刷新
        this.page += 1;
        await this.getRecordItemsFn();
        next();
      },
      createdFn() { // 加载
        this.recordItems = [];
        this.userId = this.getUserInfo.id;
        this.getRecordItemsFn();
      }
    }
  };
</script>

<style lang="less" scoped>
  #order-type {
    position: relative;
    height: 100vh;
    overflow: hidden;
    background: rgba(240, 240, 240, 1);
    .cover {
      z-index: 11;
      position: fixed;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3);
      .delete-record-row {
        border-radius: 8px;
        background: white;
        position: absolute;
        width: 90%;
        height: 152px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        .record-tips {
          font-size: 20px;
          font-family: PingFang SC;
          width: 100%;
          margin-top: 35px;
          text-align: center;
        }
        .tool-btn-row {
          width: 90%;
          margin: 36px auto 0px;
          display: flex;
          justify-content: space-between;
          .record-btn {
            line-height: 40px;
            border: 1px solid rgba(6, 194, 204, 1);
            width: 48%;
            text-align: center;
            font-size: 20px;
            border-radius: 5px;
          }
          .cancel {
            color: rgba(6, 194, 204, 1)
          }
          .do-del {
            color: rgba(255, 81, 81, 1);
            border: 1px solid rgba(255, 81, 81, 1);
            background: rgba(255, 81, 81, 1);
            color: white;
          }
        }
      }
      .get-money-row {
        border-radius: 8px;
        background: white;
        position: absolute;
        width: 90%;
        height: 235px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        .money-tips {
          font-size: 21px;
          margin-top: 28px;
          font-family: PingFang SC;
          text-align: center;
        }
        .money-num {
          font-size: 21px;
          text-align: center;
          margin: 36px auto 0px;
          display: block;
          border: 1px solid #dddddd;
          width: 90%;
          height: 44px;
        }
        .tool-btn-row {
          width: 90%;
          margin: 36px auto 0px;
          display: flex;
          justify-content: space-between;
          .record-btn {
            line-height: 40px;
            border: 1px solid rgba(6, 194, 204, 1);
            width: 48%;
            text-align: center;
            font-size: 20px;
            border-radius: 5px;
          }
          .cancel {
            color: rgba(6, 194, 204, 1)
          }
          .do-get {
            color: rgba(255, 81, 81, 1);
            border: 1px solid rgba(6, 194, 204, 1);
            background: rgba(6, 194, 204, 1);
            color: white;
          }
        }
      }
    }
    .record-lists {
      width: 100%;
      height: calc(100% - 53px);
      overflow: hidden;
      .no-items {
        width: 100%;
        text-align: center;
        .img {
          padding: 185px 0px;
          width: 90px;
          height: 125px;
          display: inline-block;
        }
      }
      .record-items {
        width: 100%;
        height: 100%;
        .records-status-row {
          width: 100%;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .status-items {
            width: 33.3%;
            text-align: center;
            color: rgba(153, 153, 153, 1);
            font-family: 'PingFang SC';
            font-size: 19px;
          }
        }
        .record-items-scroll-row {
          height: calc(100% - 38px);
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }
        .record-items-row {
          width: 95%;
          margin: 0 auto;
        }
      }
    }
  }
</style>
