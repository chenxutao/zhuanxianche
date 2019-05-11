<!-- 订单记录 滚动 加载 组件 -->
<template>
  <div class="load-more">
    <!-- 小程序自带的滚动组件 -->
    <scroll-view class="load-more-scroll" scroll-y v-if="terminal==='xcx'"
                 @scrolltoupper="topScrollFn"
                 upper-threshold="10"
                 @touchstart="touchStartFn"
                 @touchmove="touchStartFn"
                 @touchend="touchEndFn"
                 @scrolltolower="bottomScrollFn">
      <div class="load-more-scroll-top" v-if="topStatus">
        <slot name="top">
        </slot>
        <div class="load-more-scroll-top-default" v-if="!slotTop">
          加载中...
        </div>
      </div>
      <div class="load-more-scroll-cont">
        <div class="record-items-row" v-for="(item,index) in records" :key="index">
          <record-slider-row @goOrder="goOrder" @deleteBuyId="deleteBuyGetId" @getMoneyBuyId="getMoneyBuyGetId"
                             :records="item" :index="index" :optionsIndex.sync="optionsIndex">
          </record-slider-row>
        </div>
      </div>
      <div class="load-more-scroll-bottom" v-if="bottomStatus">
        <slot name="bottom"></slot>
        <div class="load-more-scroll-bottom-default" v-if="!slotBottom">
          加载中...
        </div>
      </div>
    </scroll-view>
    <!-- H5的滚动组件 -->
    <div class="load-more-scroll" ref="scroll"
         @touchstart="touchStartFn"
         @touchmove="touchStartFn"
         @touchend="touchEndFn"
         v-else>
      <div class="load-more-scroll-top" v-if="topStatus">
        <slot name="top"></slot>
        <div class="load-more-scroll-top-default" v-if="!slotTop">
          加载中...
        </div>
      </div>
      <div class="load-more-scroll-cont">
        <div class="record-items-row" v-for="(item,index) in records" :key="index">
          <record-slider-row @goOrder="goOrder" @deleteBuyId="deleteBuyGetId" @getMoneyBuyId="getMoneyBuyGetId"
                             :records="item" :index="index" :optionsIndex.sync="optionsIndex">
          </record-slider-row>
        </div>
      </div>
      <div class="load-more-scroll-bottom" v-if="bottomStatus">
        <slot name="bottom"></slot>
        <div class="load-more-scroll-bottom-default" v-if="!slotBottom">
          加载中...
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import RecordSliderRow from "../components/recordSliderRow";

  export default {
    name: 'recordFlowLoadMore',
    components: {RecordSliderRow},
    props: {
      records: { // 订单列表
        default () {
          return []
        }
      }
    },
    data () {
      return {
        slotTop: Boolean(this.$slots.top), // 是否有自定义顶部加载
        slotBottom: Boolean(this.$slots.bottom), // 是否有自定义底部加载
        touchStatus: false, // 手指按下状态
        topStatus: false, // 顶部加载显示
        bottomStatus: false, // 底部加载显示
      }
    },
    methods: {
      getMoneyBuyGetId(orderId, receivables){ //收款
        this.$emit("getMoneyBuyId", orderId, receivables);
      },
      deleteBuyGetId(orderId){ // 删除订单
        console.info(orderId)
        this.$emit("deleteBuyId", orderId);
      },
      goOrder(val){ // 进入详情页
        this.$emit('goOrder',val)
      },
      topScrollFn (e) { // 滚动到顶部事件
        if (this.touchStatus && !this.bottomStatus) { // 确定是否是启动加载
          this.topStatus = true
        }
      },
      bottomScrollFn (e) { // 滚动到底部事件
        if (this.touchStatus && !this.topStatus) { // 确定是否是启动加载
          this.bottomStatus = true
        }
      },
      touchStartFn () { // 手指在滚动区域点击
        if (!this.touchStatus) {
          this.touchStatus = true
        }
      },
      touchEndFn () { // 抬起
        this.touchStatus = false
        if (this.topStatus) { // 当前加载类型是 下拉刷新
          this.topChangeFn()
        } else if (this.bottomStatus) { // 当前加载类型是 上啦加载
          this.bottomChangeFn()
        }
      },
      topChangeFn () { // 顶部加载触发
        this.$emit('top-scroll', () => {
          this.topStatus = false
        })
      },
      bottomChangeFn () { // 底部加载触发
        this.$emit('bottom-scroll', () => {
          this.bottomStatus = false
        })
      },
      addScrollFn () { // 不是小程序 绑定dom滚动
        let scroll = this.$refs.scroll
        let that = this
        scroll.addEventListener('scroll', function () {
          if (this.scrollTop === 0) { // 到达顶部
            that.topScrollFn()
          }
          if (this.scrollHeight - this.scrollTop === this.clientHeight) { // 到达底部
            that.bottomScrollFn()
          }
        })
      }
    },
    mounted () {
      if (process.env.terminal !== 'xcx') { // 不是小程序
        this.addScrollFn()
      }
    }
  }
</script>

<style lang="less" scoped>
  .load-more {
    height: 100%;
    overflow-y: hidden;
    .load-more-scroll {
      height: 100%;
      overflow-y: auto;
    }
    .load-more-scroll-top, .load-more-scroll-bottom {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 12px 6px;
    }
  }
</style>
