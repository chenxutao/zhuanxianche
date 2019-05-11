<template>
    <div id="proposal">

      <label>
        <textarea  class="proposalVal" v-model="proposalVal" placeholder="请输入您的建议" maxlength="256"></textarea>
      </label>

      <input type="button" value="提交您的建议" class="sumbit" @click="sumbitProposal">
    </div>
</template>

<script>
  export default {
    name: "proposal",
    components: {},
    computed: {},
    data () {
      return {
        userId:'',
        proposalVal:''   //内容
      }
    },
    methods: {
      createdFn () { // 加载
        if(this.getRouteFn().query.userId){   //地址 拿 userId
          this.userId = this.getRouteFn().query.userId
        }
      },
      async sumbitProposal(){   //提交建议
        if(this.proposalVal){
          if(this.proposalVal.length <=256){
            let form = {
              "content": this.proposalVal,
              "userId": this.userId
            }
            let data = await this.$fly.post("/xcx/advise/add", form);
            if(data && data.code === "success"){
              this.messageBoxFn("提交成功！");
              let that = this
              let time = setTimeout(function() {
                that.setRouterBackFn()
              },2000)
            }
          }else{
            this.messageBoxFn("您输入的字数太多，请精简");
          }

        }else{
          this.messageBoxFn("请输入您的建议");
        }


      }
    }
  };
</script>

<style scoped lang="less">
 #proposal{
   position: fixed;
   padding-bottom: 80px;
   width: 100vw;
   min-height: 100vh;
   background-color: #F0F0F0;
  .proposalVal{
    width: 90vw;
    height: 70vh;
    display: block;
    margin: 10px auto 0;
    background-color: #ffffff;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 5px;
  }
   .sumbit{
     width: 80vw;
     position: fixed;
     bottom: 20px;
     left: 0;
     right: 0;
     font-size: 20px;
     color: #fff;
     background: rgba(6, 194, 204, 1);
     border-radius: 5px;
   }

 }
</style>
