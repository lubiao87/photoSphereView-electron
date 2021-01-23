<template>
  <div class="headers">
    <i class="el-icon-close" @click="closeWindow" v-if="closeWindowShow"></i>
  </div>
</template>

<script>
export default {
  props: {
    pageName: String,
    closeWindowShow: Boolean
  },
  methods: {
    closeWindow() {
      window.ipcRenderer.send("close-app", this.pageName);
    },
  },
};
</script>

<style lang="scss">
.headers {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 2;
  width: 100%;
  -webkit-app-region: drag;
  height: 30px;
  i {
    float: right;
    font-size: 24px;
    margin: 10px;
    -webkit-app-region: no-drag;
  }
}
</style>