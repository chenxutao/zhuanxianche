<template>
  <div id="sign">
    <canvas class='firstCanvas'
            canvas-id="firstCanvas"
            @touchmove='move'
            @touchend='end'
            @error="error"
            disable-scroll='true'>
    </canvas>

    <div class="sign-footer">
      <div class="footBtn grenBtn" @click="goback()">返回</div>
      <div class="footBtn grenBtn" @click='clearClick()'>重签</div>
      <div class="footBtn blueBtn" @click='saveClick()'>保存签名</div>
    </div>

  </div>
</template>

<script>
  let content = null;
  let touchs = [];
  export default {
    name: "sign-board",
    props: {},
    data() {
      return {
        mycanvas: {
          canvaswidth: 0,
          canvasheight: 0
        },
        signImage: ""
      };
    },
    methods: {
      createdFn() {
        // this.createCanvasFn();
      },
      error(e) {
        wx.showModal({
          title: "签名出错"
        });
      },
      move(e) {
        let point = { x: e.touches[0].x, y: e.touches[0].y };
        touchs.push(point);
        if (touchs.length >= 2) {
          this.draw(touchs);
        }
      },
      end(e) {
        for (let i = 0; i < touchs.length; i++) {
          touchs.pop();
        }
      },
      clearClick() {
        content.clearRect(0, 0, this.mycanvas.canvaswidth, this.mycanvas.canvasheight);
        content.draw(true);
      },
      draw(touchs) {
        let point1 = touchs[0];
        let point2 = touchs[1];
        touchs.shift();
        content.moveTo(point1.x, point1.y);
        content.lineTo(point2.x, point2.y);
        content.stroke();
        content.draw(true);
      },
      saveClick() {   //保存
        let that = this;
        wx.canvasToTempFilePath({
          canvasId: "firstCanvas",
          success: async function(res) {
            let token = null;
            let data = await that.$fly.get("xcx/qiniuyun");
            if (data && data.code === "success") {
              token = data.data;
              wx.uploadFile({
                url: "https://www.rvaka.com/upImg", //仅为示例，非真实的接口地址
                filePath: res.tempFilePath,
                header: {"Content-Type": "multipart/form-data"},
                name: "file",
                formData: {
                  "token": token
                },
                success(res) {
                  if (res.statusCode === 200) {
                    that.$emit("success", JSON.parse(res.data));
                  }
                  //do something
                }
              });
            }
          }
        }, this);
      },
      goback(){
        this.$emit("back",'true');
      },
      createCanvasFn() {   //清除 canvas
        let that = this;
        wx.getSystemInfo({
          success: function(res) {
            that.mycanvas.canvaswidth = res.windowWidth;
            that.mycanvas.canvasheight = res.windowHeight;
          }
        });
        content = wx.createCanvasContext("firstCanvas", this);   //创建caveas
        content.setStrokeStyle("#000000");   //字体颜色
        content.setLineWidth(3);   //字体宽度
        content.setLineCap("round");
        content.setLineJoin("round");
      }
    },
    mounted() {
      this.createCanvasFn();
    }
  };
</script>

<style lang="less">
  #sign {
    position: fixed;
    background-color: #fff;
    width: 100vw;
    height: 100vh;
    left: 0;
    top: 0;
    z-index: 100;
    .firstCanvas {
      position: fixed;
      background-color: #fff;
      width: 100vw;
      height: calc((100vh - 50px));
    }
    .sign-footer {
      background-color: #ffffff;
      position: fixed;
      width: 100vw;
      height: 48px;
      line-height: 48px;
      bottom: 0;
      display: flex;
      .footBtn {
        display: inline-block;
        height: 40px;
        line-height: 40px;
        color: #ffffff;
        flex: 0 0 30%;
        font-size: 19px;
        text-align: center;
        border-radius: 5px;
        margin: 5px auto 0;
      }
      .blueBtn {
        background-color: #06C2CC;
      }
      .grenBtn {
        background-color: #63CD5E;
      }
    }
  }

</style>
