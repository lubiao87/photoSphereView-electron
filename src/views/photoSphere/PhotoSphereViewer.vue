<template>
  <div class="cd-image-container" tabindex="-1">
    <headers :pageName="'photoSphere'" :closeWindowShow="true" />
    <div id="photosphere"></div>
    <!-- <iframe class="testFrame" ref="vrframe" :src="SRC" scrolling="no"></iframe> -->
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
      Control: false,
      NowShow: {
        DiskName: "",
        count: 0,
        objUrl: "",
        mtl: "",
      },
      SRC: "",
    };
  },
  created() {
    this.range = 0;
    //接收打开图片文件的数据
    this.$nextTick(() => {
      //   window.materialsData = {};
      //   this.$Message.info("开始加载，这可能需要一点时间");
      var PSV = new window.PhotoSphereViewer.ViewerCompat({
        container: "photosphere",
        panorama: "D:\\image\\24全景图切割\\temp\\myimage0.jpg",
        // caption: "",
        loading_img: "./img/photosphere-logo.gif",
        time_anim: false,
        anim_speed: "-2rpm",
        default_fov: 50,
      });
      console.log(PSV);
    });
  },
};
</script>

<style scoped>
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
</style>
