<template>
  <div class="cd-image-container" tabindex="-1">
    <headers :pageName="'photoSphere'" :closeWindowShow="true" />
    <div id="photosphere"></div>
    <div class="img-block">
      <div class="block" v-for="(fit, index) in fits" :key="index">
        <el-image
          style="width: 100px; height: 100px"
          :src="fit.previewPath"
          fit="contain"
          @click="changeImage(fit, index)"
        ></el-image>
      </div>
    </div>
  </div>
</template>

<script>
// import 'three';
import headers from "@/components/header";

export default {
  name: "DiskVrShower",
  components: {
    headers,
  },
  data() {
    return {
      header: {
        title: "",
        background: "rgba(103, 103, 103, 0.5)",
        color: "#fff",
      },
      imgIndex: 0,
    };
  },
  created() {
    const that = this;
    this.fits = JSON.parse(localStorage.getItem("pointList"));
    this.range = 0;
    //接收打开图片文件的数据
    this.$nextTick(() => {
      //   window.materialsData = {};
      //   this.$Message.info("开始加载，这可能需要一点时间");
      // let roattion = this.fits[0].rotation;
      this.PSV = new window.PhotoSphereViewer.Viewer({
        container: "photosphere",
        panorama: this.fits[this.imgIndex].scenePath,
        // loadingImg: "./img/photosphere-logo.gif",
        navbar: false,
        plugins: [
          [
            window.PhotoSphereViewer.MarkersPlugin,
            {
              markers: that.setMarkers(),
            },
          ],
        ],
      });
      // this.PSV.getPlugin(window.PhotoSphereViewer.MarkersPlugin);
      console.log(Math.PI / 2 - this.fits[0].rotation.y);
      this.PSV.setPanorama(this.fits[0].scenePath, {
        longitude:  -this.fits[0].rotation.y,
        latitude: 0,
        zoom: 50,
      });
    });
  },
  methods: {
    changeImage(item, index) {
      this.imgIndex = index;
      this.PSV.setPanorama(item.scenePath, {
        longitude: Math.PI / 2 - item.rotation.y,
        latitude: 0,
        zoom: 50,
      }).then(
        function () {
          // this.PSV.navbar.setCaption(item.scenePath);
        },
        function (e) {
          console.log("22222", e);
        }
      );
      var markers = this.PSV.getPlugin(window.PhotoSphereViewer.MarkersPlugin);
      // console.log(markers);
      markers.setMarkers(this.setMarkers());
    },
    getAngle(VectorX1, VectorY1, VectorX2, VectorY2) {
      //获得人物中心和鼠标坐标连线，与y轴正半轴之间的夹角
      var x = Math.abs(VectorX1 - VectorX2);
      var y = Math.abs(VectorY1 - VectorY2);
      var z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        var cos = y / z;
      var radina = Math.acos(cos); //用反三角函数求弧度

      
      // if (VectorX2 > VectorX1 && VectorY2 > VectorY1) {
      //   //鼠标在第四象限
      //   radina = radina;
      // }

      if (VectorX2 == VectorX1 && VectorY2 < VectorY1) {
        //鼠标在y轴负方向上
        radina = Math.PI;
      }
      if (VectorX2 == VectorX1 && VectorY2 > VectorY1) {
        //鼠标在y轴负方向上
        radina = 0;
      }

      if (VectorX2 > VectorX1 && VectorY2 == VectorY1) {
        //鼠标在x轴正方向上
        radina = Math.PI / 2;
      }

      if (VectorX2 < VectorX1 && VectorY2 > VectorY1) {
        //鼠标在第三象限
        radina =  -radina;
      }

      if (VectorX2 < VectorX1 && VectorY2 == VectorY1) {
        //鼠标在x轴负方向
        radina = -Math.PI / 2;
      }

      if (VectorX2 < VectorX1 && VectorY2 < VectorY1) {
        //鼠标在第二象限
        radina = Math.PI + radina;
      }
      if (VectorX2 > VectorX1 && VectorY2 < VectorY1) {
        //鼠标在第一象限
        radina = Math.PI - radina;
      }

      return radina;
    },
    setMarkers() {
      var a = [];
      const that = this;
      for (var i = 0; i < that.fits.length; i++) {
      if (that.imgIndex === i) {
        continue;
      }
      let p1 = that.fits[that.imgIndex].position;
      let p2 = that.fits[i].position;
      // let p1 = {
      //   x: 2,
      //   z: 2,
      // };
      // let p2 = {
      //   x: 1,
      //   z: 3,
      // };
      var radina = that.getAngle(p1.x, p1.z, p2.x, p2.z);
      console.log(radina);
      a.push({
        id: "#" + a.length,
        tooltip: "#" + a.length,
        latitude: 0,
        longitude: -Math.PI / 2 - radina,
        image: "./img/pin-blue.png",
        width: 40,
        height: 40,
        anchor: "bottom center",
        data: {
          deletable: true,
        },
      });
      }

      return a;
    },
  },
};
</script>

<style scoped lang="scss">
@import url("../../assets/theme/photo-sphere-viewer.css");
#photosphere {
  width: 100%;
  height: 100%;
}
/*图片查看*/
.cd-image-container {
  float: left;
  width: 100%;
  height: 100%;
  background: #4f4f4f;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  -khtml-user-select: none;
  user-select: none;
}
.cd-image-container .ivu-spin-main {
  float: right;
  padding: 30px 10px;
}
.img-block {
  position: absolute;
  left: 50%;
  bottom: 20px;
  width: 500px;
  margin-left: -250px;
  overflow: auto;
  .block {
    float: left;
    padding-left: 10px;
  }
  z-index: 99;
}
</style>
