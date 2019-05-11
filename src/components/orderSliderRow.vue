<!--  新建订单 滑块 -->
<template>
  <div class="order-slider-row" @touchmove.stop="touchmoveFn" @touchstart="touchstartFn"
       @touchend="touchendFn"
       :class="{'order-slider-row-options':optionsIndex===index}">
    <div class="order-slider-row-show" :style="{'margin-left':optionsIndex===index?'-'+optionsWith+'px':'0'}">
      <div class="goods-form-header-item name">
        <input class="input" v-model="goods.goodsName" @input="inputFn">
      </div>
      <div class="goods-form-header-item">
        <input class="input" v-model="goods.unit" @input="inputFn">
      </div>
      <div class="goods-form-header-item">
        <input class="input" v-model="goods.num" type="digit" @input="inputFn">
      </div>
      <div class="goods-form-header-item">
        <input class="input" v-model="goods.amount" type="digit" @input="inputFn">
      </div>
      <div class="goods-form-header-item totalAmount" style="color: #333">
        {{goods.totalAmount||0}}
      </div>
    </div>
    <div class="order-slider-row-options" :class="{optionsClass}">
      {{orderSliderRowOptionsFn}}
      <div class="order-slider-row-options-row" @click="optionsClickFn('remove')">
        <img src="../../static/img/del.png" alt="" class="delImg">
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from "vuex";

  export default {
    components: {},
    name: "order-slider-row",
    props: {
      goods: { // 数据
      },
      optionsIndex: { // 是否打开操作
        default () {
          return null;
        }
      },
      index: { // 索引
        default () {
          return 0;
        }
      },
      disabled: { // 禁用
        default () {
          return false;
        }
      }
    },
    computed: {
      ...mapGetters({}),
      orderSliderRowOptionsFn () {
        this.sliderRowFn();
        this.optionsClass = `order-slider-row-options-${this.index}`;
      }
    },
    created () {
    },
    data () {
      return {
        optionsClass: "", // class
        optionsWith: "", // 操作宽度
        touchState: true // 阻止滑动多次触发
      };
    },
    watch: {},
    methods: {
      touchstartFn () { // 手指触摸
        this.touchState = true;
      },
      touchendFn () { // 手指抬起
        this.touchState = false;
      },
      async touchmoveFn (e) { // 滑动事件
        if (this.disabled) { // 禁止
          return;
        }
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
      optionsClickFn (type) { // 操作选择
        this.$emit("update:optionsIndex", null);
        this.$emit(type, { index: this.index, goods: this.goods });
      },
      async sliderRowFn () { // 计算滑动宽度
        let dom = await this.getDomStyleFn(".order-slider-row-options");
        this.optionsWith = dom[this.index].width;
      },
      inputFn () { // input
        this.$emit("input", this.goods);
      }
    },
    mounted () {
      setTimeout(() => {
        this.sliderRowFn();
      }, 500);
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .order-slider-row {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: right;
    overflow: hidden;
    .order-slider-row-show, .order-slider-row-options {
      height: 100%;
      display: flex;
      align-items: center;
      transition: 0.3s;
      flex-shrink: 0;
    }
    .order-slider-row-show {
      width: 100%;
    }
    .order-slider-row-options {
      width: auto;
      font-size: 13px;
      .order-slider-row-options-row {
        box-sizing: border-box;
        padding: 0 19px;
        text-align: center;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .delImg{
        width: 20px;
        height: 20px;
      }
    }
  }
  .totalAmount{
    text-align: center;
  }
  .order-slider-row-options {
  }
</style>

