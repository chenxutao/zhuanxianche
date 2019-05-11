<!--分享-->
<template>
    <div class="shareLayer">
      <div class="shareConent">
        <img src="/static/img/share.png" alt="" class="shareImg">
        <div class="shareText">分享至三个微信群，获取免费使用权</div>
        <div class="shareFoot">
          <div class="closeShare"  @click="close">取消</div>
          <button open-type="share" class="share">立即分享</button>
        </div>
      </div>
    </div>
</template>

<script>
  export default {
    name: "share-layer",
    components: {},
    computed: {
      // ...mapGetters({})
    },
    props: {
    },
    data () {
      return {

      };
    },
    methods:{
      close(){
        // console.log(this.userId)
        this.$emit('closeLayer',true)
      },
    },

  };
</script>

<style lang="less" scoped>
  .shareLayer{
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, .5);
    z-index: 50;
    text-align: center;
  .shareImg{
    display: block;
    margin: 0 auto;
    width: 125px;
    height: 123px;
  }
  .shareConent{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    padding: 20px 0;
    width: 90vw;
    background-color: #ffffff;
    border-radius: 5px;
  }
  .shareText{
    font-size: 20px;
    text-align: center;
    margin-bottom:36px ;
    margin-top: 25px;
  }
  .closeShare{
    margin: 0 auto;
    border: 1px solid #06C2CC;
    color: #06C2CC;
    width: 150px;
    height: 44px;
    line-height: 44px;
    text-align: center;
    border-radius: 5px;
    box-sizing: border-box;
  }
  .shareFoot{
    display: flex;
  }
  .share{
    margin: 0 auto;
    width: 150px;
    display: inline-block;
    background: rgba(6, 194, 204, 1) !important;
    font-size: 20px;
    color: #ffffff;
    text-align: center;
    height: 44px;
    line-height: 44px;
    border-radius: 5px;
    box-sizing: border-box;
  }
  }
</style>
