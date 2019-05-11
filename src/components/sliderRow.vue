<!-- 滑块 -->
<template>
  <div class="slider-row" @touchmove.stop="touchmoveFn" @touchstart="touchstartFn"
       @touchend="touchendFn"
       :class="{'slider-row-options':optionsIndex===index}">
    <div class="slider-row-show" :style="{'margin-left':optionsIndex===index?'-'+optionsWith+'px':'0'}">
      <div class="goods-form-header-item name">
        <input class="input" v-model="goods.name" placeholder="货物规格">
      </div>
      <div class="goods-form-header-item">
        <input class="input" placeholder="箱">
      </div>
      <div class="goods-form-header-item">
        <input class="input" placeholder="0">
      </div>
      <div class="goods-form-header-item">
        <input class="input" placeholder="0">
      </div>
      <div class="goods-form-header-item">
        <input class="input" placeholder="0">
      </div>
    </div>
    <div class="slider-row-options">
      <div class="slider-row-options-row" @click="optionsClickFn">
        删除
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from "vuex";

  export default {
    components: {},
    name: "slider-row",
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
      }
    },
    computed: {
      ...mapGetters({})
    },
    created () {
    },
    data () {
      return {
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
              this.$emit("update:optionsIndex", false);
              this.$emit("hideOptions", this.index);
            }
            break;
        }
      },
      optionsClickFn () { // 操作选择
        this.optionsIndex = false;
      },
      async sliderRowFn () {
        let dom = await this.getDomStyleFn(".slider-row-options");
        this.optionsWith = dom[this.index].width;
      }
    },
    mounted () {
      setTimeout(() => {
        this.sliderRowFn();
      }, 200);
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  .slider-row {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: right;
    overflow: hidden;
    .slider-row-show, .slider-row-options {
      height: 100%;
      display: flex;
      align-items: center;
      transition: 0.3s;
      flex-shrink: 0;
    }
    .slider-row-show {
      width: 100%;
    }
    .slider-row-options {
      width: auto;
      background: red;
      color: #fff;
      font-size: 13px;
      .slider-row-options-row {
        box-sizing: border-box;
        padding: 0 20px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  .slider-row-options {
  }
</style>

