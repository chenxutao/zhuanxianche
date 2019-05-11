<!--  订单记录 滑块 -->
<template>
  <div class="record-slider-row"
       @touchmove="touchmoveFn" @touchstart="touchstartFn"
       @touchend="touchendFn"
       :class="{'order-slider-row-options':optionsIndex===index}">
    <!--<div class="record-slider-row" :class="{'order-slider-row-options':optionsIndex===index}">-->
    <div class="order-slider-row-show" :style="{'margin-left':optionsIndex===index?'-'+optionsWith-10+'px':'0'}">
      <div class="goods-form-header-item" @click="goOrder(records.orderId)">
        {{records.customer?records.customer:""}}
      </div>
      <div class="goods-form-header-item" @click="goOrder(records.orderId)">
        {{records.receivables}}
      </div>
      <div class="goods-form-header-item">
        <div class="getMoney" v-if="records.isComplete==0" @click="getMoney(records.orderId,records.receivables)">收款
        </div>
        <div class="hasGetMoney" v-else>已收</div>
      </div>
    </div>
    <div class="order-slider-row-options">
      <div class="order-slider-row-options-row" @click="deleteFn(records.orderId)">
        <img src="../../static/img/del.png" alt="" class="delImg">
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from "vuex";

  export default {
    components: {},
    name: "record-slider-row",
    props: {
      records: { // 数据
      },
      optionsIndex: { // 是否打开操作
        default() {
          return null;
        }
      },
      index: { // 索引
        default() {
          return 0;
        }
      }
    },
    computed: {
      ...mapGetters({})
    },
    created() {
    },
    data() {
      return {
        optionsWith: "", // 操作宽度
        touchState: true, // 阻止滑动多次触发
        getMoneyId: "" //收款id
      };
    },
    watch: {},
    methods: {
      async getMoney(orderId, receivables) {//触发收款
        this.$emit("getMoneyBuyId", orderId, receivables);
      },
      deleteFn(orderId) { // 操作选择
        this.$emit("update:optionsIndex", null);
        this.$emit("deleteBuyId", orderId);
      },
      touchstartFn() { // 手指触摸
        this.touchState = true;
      },
      touchendFn() { // 手指抬起
        this.touchState = false;
      },
      async touchmoveFn(e) { // 滑动事件
        if (!this.touchState) {
          return;
        }
        let type = await this.touchMoveFn(e); // 方向
        switch (type) {
          case "left":
            this.$emit("update:optionsIndex", this.index);
            this.$emit("showOptions", this.index);
            break;
          case "right":
            if (this.index === this.optionsIndex) {
              this.$emit("update:optionsIndex", null);
              this.$emit("hideOptions", this.index);
            }
            break;
        }
      },
      async sliderRowFn() {
        let dom = await this.getDomStyleFn(".order-slider-row-options");
        this.optionsWith = dom[this.index].width;
      },
      goOrder(val) {  //去详情页
        this.$emit("goOrder", val);
      }
    },
    mounted() {
      setTimeout(() => {
        this.sliderRowFn();
      }, 200);
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .record-slider-row {
    margin-bottom: 6px;
    width: 100%;
    height: 56px;
    display: flex;
    overflow: hidden;
    .order-slider-row-show, .order-slider-row-options {
      height: 100%;
      display: flex;
      align-items: center;
      transition: 0.3s;
      flex-shrink: 0;
    }
    .order-slider-row-show {
      margin-right: 10px;
      border-radius: 5px;
      background: white;
      width: 100%;
      .goods-form-header-item {
        text-align: center;
        flex: 1;
        font-size: 19px;
        color: rgba(0, 0, 0, 1);
        .getMoney {
          margin: 9px auto;
          width: 61px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          /*background: rgba(99,205, 94, 1);*/
          color: rgba(99, 205, 94, 1);
          border-radius: 15px;
        }
        .hasGetMoney {
          margin: 9px auto;
          width: 61px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          color: lightgray;
        }
      }
    }
    .order-slider-row-options {
      border-radius: 5px;
      width: auto;
      background: white;
      font-size: 18px;
      color: #ff5151;
      .order-slider-row-options-row {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 19px;
        .delImg{
          width: 20px;
          height: 20px;
        }
      }
    }
  }

  .order-slider-row-options {
  }
</style>

