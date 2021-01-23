<template>
  <div id="app">
    <router-view v-if="isRouterShow" />
  </div>
</template>

<style lang="scss">
@import "./assets/theme/base.css";
@import "./assets/theme/animate.min.css";
@import "./assets/common/iconfont/iconfont.css";
html,
body {
  width: 100%;
  height: 100%;
  color: #000;
}
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>

<script>
export default {
  name: "App",
  provide() {
    return {
      reload: this.reload,
    };
  },
  data() {
    return {
      isRouterShow: true,
    };
  },
  methods: {
    async reload() {
      this.isRouterShow = false;
      await this.$nextTick();
      this.isRouterShow = true;
    },
  },
};
</script>