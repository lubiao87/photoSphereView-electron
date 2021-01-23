<template>
  <el-container v-bind:id="id">
    <el-header class="header">
      <div>
        <h2 v-html="title"></h2>
        <i class="el-icon-close" @click="closeDialog"></i>
      </div>
    </el-header>
    <el-main>
      <slot></slot>
    </el-main>
    <el-footer style="display: flex;justify-content: center;align-items: center;">
      <span class="dialog-footer">
        <el-button @click="closeDialog" size="small"> {{ closeBtn || '取 消'}}</el-button>
        <el-button type="primary" @click="queryDialog" size="small" style="margin-left: 20px;">{{ queryBtn || '确 定'}}</el-button>
      </span>
    </el-footer>
  </el-container>
</template>

<script>
import { listSearchMixin } from "../mixin"; //混淆请求
export default {
  name: "Window",
  mixins: [listSearchMixin],
  props: {
    title: String,
    id: [String, Number],
    closeBtn: String,
    queryBtn: String,
  },
  data() {
    return {
      selectElement: "",
    };
  },
  methods: {
    closeDialog() {
      this.Set_DialogVisible(false);
      this.$emit("queryDialog", false);
    },
    queryDialog() {
      // this.Set_DialogVisible(false);
      this.$emit("queryDialog", true);
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/theme/option.scss";
.header {
  background-color: $bodyBgColor !important;
  height: 30px !important;
}
h2 {
  height: 30px;
  line-height: 30px;
}
.el-icon-close {
  font-size: 20px;
  position: absolute;
  right: 10px;
  top: 5px;
}
.el-container {
  position: fixed;
  // min-height: 300px;
  height: 100%;
  width: 34%;
  min-width: 240px;
  border: 1px;
  top: 0;
  right: 10px;
  border-radius: 2px;
  z-index: 4;
  border: 1px solid;
      // padding-top: 10px;
    background-color: #fff;
}
.el-container.rightShow {
  right: -288px;
}
.dialog-footer {
  text-align: right;
}

.el-main {
  background-color: white;
  padding: 0 10px;
  height: calc(100vh - 30px);
}

.el-footer {
  background-color: white;
}

.el-header {
  background-color: white;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
</style>
