<!--订单记录 切换-->
<template>
  <div class="order-record-type">
    <div class="record-type" :class="{'type-checked':isChecked==='1'}" @click="checkFn('1')">待收</div>
    <div class="record-type" :class="{'type-checked':isChecked==='2'}" @click="checkFn('2')">已收</div>
  </div>
</template>

<script>
  export default {
    name: "recordType",
    components: {},
    props: {
      model: { // 数据
        default() {
          return [];
        }
      }
    },
    computed: {},
    data() {
      return {
        isChecked: "1", // 选中状态
        touchState: true, // 阻止滑动多次触发
        setTimeout: null // 自动轮播
      };
    },
    methods: {
      async checkFn(type) {
        this.isChecked = type;
        this.$emit('checkedFn',type)
      }
    },
    mounted() {
    }
  };
</script>
<style scoped lang="less">
  .order-record-type {
    background: white;
    width: 100%;
    height: 47px;
    display: flex;
    justify-content: space-between;
    .record-type {
      width: 50%;
      height: 100%;
      line-height: 44px;
      text-align: center;
      font-size: 19px;
      color: rgba(0, 0, 0, 1);
    }
    .type-checked {
      color: rgba(6, 194, 204, 1);
      border-bottom: 3px solid rgba(6, 194, 204, 1);
    }
  }
</style>
