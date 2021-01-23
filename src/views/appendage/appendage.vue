<template>
  <div class="appendage-page">
    <headers :pageName="'appendage'" />

    <p class="progres-text" v-show="uploadProgress">{{ progresText }}</p>
    <el-progress
      class="myprogress"
      :percentage="percentage"
      v-show="uploadProgress"
    ></el-progress>
    <el-progress
      class="myprogress"
      :percentage="percentage1"
      v-show="uploadProgress1"
    ></el-progress>

    <!--附属物数据表格-->
    <h2 style="margin-top: 20px">附属物列表</h2>
    <el-table
      v-loading="tableLoading"
      :data="appendageList"
      size="medium"
      stripe
      :key="tableKey"
      :max-height="maxHeight"
    >
      <el-table-column
        prop="aprecode"
        label="附属物流水号"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="aname"
        label="附属物名称"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="asubclassname"
        label="附属物小类名称"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="parcelcode"
        label="所属宗地号"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="bprecode"
        label="所属栋流水号"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="owner"
        label="所属权利人"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="atype"
        label="类型"
        align="center"
      >
      <template slot-scope="scope">
          <div v-if="scope.row.atype === 1">框架结构</div>
          <div v-if="scope.row.atype === 2">混合结构</div>
          <div v-if="scope.row.atype === 3">砖木结构</div>
          <div v-if="scope.row.atype === 4">刚结构</div>
          <div v-if="scope.row.atype === 5">混刚结构</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="structure"
        label="结构"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="location"
        label="位置"
        align="center"
      >
      <template slot-scope="scope">
          <div>{{ scope.row.location === 1 ? "室内" : "室外" }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="upload" label="状态" align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.upload === 1 ? "已上传" : "未上传" }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
        align="center"
      ></el-table-column>
      <el-table-column
        label="操作"
        align="center"
        min-width="300px"
        fixed="right"
      >
        <!-- <template slot="header">
          <el-button
            type="primary"
            size="mini"
            @click="openAppendageFormDialog(null)"
            >添加</el-button
          >
        </template> -->
        <template slot="header">
          <el-button type="primary" size="mini" @click="Set_DialogVisible(true)" :disabled="disabledBtn"
            >坐标转换</el-button
          >
          <el-button type="primary" size="mini" @click="upload" :disabled="disabledBtn"
            >上传</el-button
          >
        </template>
        <template slot-scope="scope">
          <div>
            <el-button
              slot="reference"
              @click.stop="rowClick(scope.row)"
              size="mini"
              >定位</el-button
            >
            <el-button
              type="warning"
              size="mini"
              @click.stop="openAppendageFormDialog(scope.row)"
              >编辑</el-button
            >

            <el-button
              slot="reference"
              @click.stop="deleteRow(scope.row)"
              type="danger"
              size="mini"
              >删除</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <el-pagination
      ref="paginationRef"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="searchForm.page"
      :page-sizes="[5, 10, 20, 30, 50]"
      :page-size="searchForm.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      background
    >
    </el-pagination>
    <!--附属物表单对话框-->
    <AppendageForm
      :create="!currentRow"
      :visible.sync="visible"
      :data="currentRow"
      @submitted="handleDialogSubmitted"
      @closed="handleDialogClosed"
    />
    <div
      style="
        z-index: 22;
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
      "
      v-if="dialogVisible"
    >
      <dialogp
        :id="'fsf22u63ik'"
        @queryDialog="queryDialog"
        :title="'坐标转换'"
        :closeBtn="'关闭'"
        :queryBtn="'转换'"
      >
        <div class="list">
          <el-row>
            <span class="inputName">X平移量：</span>
            <el-input v-model="dx" placeholder="请输入平移量"></el-input>
          </el-row>
        </div>
        <div class="list">
          <el-row>
            <span class="inputName">Y平移量：</span>
            <el-input v-model="dy" placeholder="请输入平移量"></el-input>
          </el-row>
        </div>
        <div class="list">
          <el-row>
            <span class="inputName">Z平移量：</span>
            <el-input v-model="dz" placeholder="请输入平移量"></el-input>
          </el-row>
        </div>
        <div class="list">
          <el-row>
            <span class="inputName">X旋转量：</span>
            <el-input v-model="Ox0" placeholder="请输入旋转量"></el-input>
          </el-row>
        </div>
        <div class="list">
          <el-row>
            <span class="inputName">Y旋转量：</span>
            <el-input v-model="Oy0" placeholder="请输入旋转量"></el-input>
          </el-row>
        </div>
        <div class="list">
          <el-row>
            <span class="inputName">Z旋转量：</span>
            <el-input v-model="Oz0" placeholder="请输入旋转量"></el-input>
          </el-row>
        </div>
        <div class="list">
          <el-row>
            <span class="inputName">尺度因子：</span>
            <el-input v-model="k0" placeholder="请输入尺度因子"></el-input>
          </el-row>
        </div>
      </dialogp>
    </div>
  </div>
</template>

<script>
import headers from "@/components/header";
import AppendageForm from "@/components/AppendageForm";
// import { Op } from 'sequelize'
import { maxHeightReset } from "@/utils/mixin";
import fs from "fs";
import { ipcRenderer } from "electron";
import { listSearchMixin } from "../../mixin"; //混淆请求

import {
  Rest_api_service,
  okayDiskLogin,
  // SyncuploadFiles,
} from "../../api/api"; //api配置请求的路径
import dialogp from "@/components/dialog";

export default {
  name: "Appendage",
  mixins: [maxHeightReset, listSearchMixin],
  components: {
    AppendageForm,
    headers,
    dialogp,
  },
  data() {
    return {
      tableKey: 0,
      tableLoading: false, // 表格加载
      isShowPrice: false, // 是否显示价格
      visible: false, // 附属物表单对话框开关
      appendageList: [], // 附属物列表
      total: 0, // 总数量
      currentRow: null, // 当前的行
      searchForm: {
        // 搜索表单数据
        page: 1,
        limit: 10,
        name: null,
      },
      uploadProgress: false,
      percentage: 0,
      progresText: "",
      progressStatus: "success",
      uploadObj: {
        id: "",
        imgArr: [],
      },
      dx: "",
      dy: "",
      dz: "",
      Ox0: "",
      Oy0: "",
      Oz0: "",
      k0: "",
      uploadProgress1: false,
      percentage1: 0,
      disabledBtn: false
    };
  },

  async created() {
    this.request = require("request");
    await this.getappendageList();
    ipcRenderer.on("uploadMessage", this.uploadMessage);
  },
  methods: {
    async uploadMessage(event, res) {
      const upload_data = this.upload_dataList;
      if (res.uploadImg) {
        console.log("上传进度", res);
        this.progresText = "上传图片: " + res.imageUrl;
        if (res.then && upload_data[res.i].id === res.id) {
          let prav = upload_data[res.i].dataValues.imgweburl || "";
          upload_data[res.i].dataValues.imgweburl =
            prav  + 'http://' + res.then.serviceUrl + "/" + res.then.data.DiskMain + ",";
          console.log(upload_data[res.i].dataValues.imgweburl);
          if(!upload_data[res.i].dataValues.currentimgurl) {
            upload_data[res.i].dataValues.currentimgurl = 'http://' + res.then.serviceUrl + "/" + res.then.data.DiskMain;
          }
          
        }
      }
      if (res.err) {
        this.progresText = "上传失败: " + res.err;
        this.progressStatus = "exception";
        return;
      }
      if (res.source) {
        let obj = upload_data[res.index];

        console.log("本地数据obj", obj);
        this.progresText = "上传到服务器";
        await Rest_api_service(obj);
        this.progresText = "跟新本地字段";
        let appendage = await this.$models.appendage.findByPk(res.id);
        if (appendage === null) return console.log("未找到数据");
        appendage.upload = 1;
        await appendage.save();
      }
      this.progresText = "上传数据";
      if (res.index != undefined) {
        this.percentage = parseInt(((res.index + 1) / res.indexLength) * 100);
        if (res.index === res.indexLength - 1 && res.source) {
          this.getappendageList();
          
          this.$message.success("上传成功");
          setTimeout(() => {
            this.disabledBtn = false;
            this.tableKey++;
            this.uploadProgress = false;
          }, 1000);
        }
      }
    },
    // 上传数据
    async upload() {
      // const that = this;
      // let appendage;
      this.disabledBtn = true;
      this.tableKey++;
      const upload_data = this.upload_dataList;
      this.uploadProgress = true;
      this.progresText = "正在上传数据...";
      if (upload_data.length === 0) {
        this.$message.success("已经上传");
        this.disabledBtn = false;
        this.tableKey++;
        this.uploadProgress = false;
      } else {
        const { resolve } = require("path");
        let config = fs.readFileSync(resolve("./") + "\\config.json", "utf-8");
        config = JSON.parse(config);
        let data = {
          username: config.okayDiskUser,
          password: config.okaydiskPassword,
        };
        await okayDiskLogin(data).then((res) => {
          console.log("登录全媒体", res);
          this.okayDiskToken = res.data.token;
        });
        let uploadData = [];
        //查询待上传的数据
        for (let i = 0; i < upload_data.length; i++) {
          let obj = upload_data[i];
          let item = {
            id: obj.id,
            imgurl: obj.imgurl,
            bprecode: obj.bprecode,
            name: obj.aname,
            appendageid: obj.appendageid,
          };
          uploadData.push(item);
        }
        let arg = {
          parentID: config.okayDiskParentID,
          projectID: config.okayDiskProjectId,
          token: this.okayDiskToken,
          upload_data: uploadData,
        };
        ipcRenderer.send("uploadFiles", arg);
        // console.log("上传成功");
        // this.$message.success("上传成功");
      }
    },
    searchFormChange() {
      this.searchForm.page = 1;
      this.getappendageList();
    },
    // 显示价格
    showPrice() {
      this.tableKey++;
      this.isShowPrice = !this.isShowPrice;
    },
    // 获取附属物数据列表
    async getappendageList() {
      this.tableLoading = true;
      console.log(1, this.appendageList);
      const offset = (this.searchForm.page - 1) * this.searchForm.limit;
      const where = { Upload: false };
      const where1 = { isDelete: false };
      // const data = await this.$models.appendage.findAll(); //
      const upload_data = await this.$models.appendage.findAll({
        where: where,
      });
      const { count, rows } = await this.$models.appendage.findAndCountAll({
        where1,
        offset,
        limit: this.searchForm.limit,
      });
      this.total = count;
      console.log(rows);
      //this.total = 0;
      //this.appendageList = this.$toJson(rows)
      this.appendageList = rows;
      this.upload_dataList = upload_data;
      console.log(2, this.upload_dataList);
      this.tableLoading = false;
    },
    // 删除数据
    async deleteRow(row) {
      const appendage = await this.$models.appendage.findByPk(row.id);
      if (appendage === null) return this.$message.error("未找到数据");
      await appendage.destroy();
      appendage.isDelete = true;
      await appendage.save();
      this.$message.success("删除成功");
      this.getappendageList();
    },
    // 显示附属物表单对话框
    openAppendageFormDialog(row) {
      this.currentRow = row;
      this.visible = true;
    },
    // 修改是否显示
    async changeShow(row) {
      const appendage = await this.$models.appendage.findByPk(row.id);
      if (appendage === null) return this.$message.error("未找到数据");
      appendage.isShow = row.isShow;
      await appendage.save();
    },
    // 表单提交成功后
    handleDialogSubmitted() {
      this.getappendageList();
    },
    // 监听对话框关闭
    handleDialogClosed() {
      this.currentRow = null;
    },
    // 监听limit改变
    handleSizeChange(limit) {
      this.searchForm.limit = limit;
      this.getappendageList();
    },
    // 监听页数改变
    handleCurrentChange(page) {
      this.searchForm.page = page;
      this.getappendageList();
    },
    rowClick(row) {
      console.log(row);
      // this.$router.push({
      //   path: "home",
      //   query: {
      //     row: row,
      //   },
      // });
      row.name = "home";
      window.ipcRenderer.send("routeData", row);
    },
    routerPush() {
      console.log(window.ipcRenderer);
      window.ipcRenderer.send("close-app", "appendage");
    },
    format(percentage) {
      return percentage === 100 ? "完成" : `${percentage}%`;
    },
    async queryDialog(flag) {
      this.Set_DialogVisible(false);
      if (flag) {
        if (!this.dx) return this.$message.info("请输入X平移量");
        if (!this.dy) return this.$message.info("请输入Y平移量");
        if (!this.dz) return this.$message.info("请输入Z平移量");
        if (!this.Ox0) return this.$message.info("请输入X旋转量");
        if (!this.Oy0) return this.$message.info("请输入Y旋转量");
        if (!this.Oz0) return this.$message.info("请输入Z旋转量");
        if (!this.k0) return this.$message.info("请输入尺度因子");
        this.dx = JSON.parse(this.dx);
        this.dy = JSON.parse(this.dy);
        this.dz = JSON.parse(this.dz);
        this.Ox0 = JSON.parse(this.Ox0);
        this.Oy0 = JSON.parse(this.Oy0);
        this.Oz0 = JSON.parse(this.Oz0);
        this.k0 = JSON.parse(this.k0);

        let Ox = (this.Ox0 / 3600 / 180.0) * Math.PI;
        let Oy = (this.Oy0 / 3600 / 180.0) * Math.PI;
        let Oz = (this.Oz0 / 3600 / 180.0) * Math.PI;

        var k = this.k0 / 1000000;
        const upload_data = this.upload_dataList;
        this.uploadProgress1 = true;
        for (let index = 0; index < upload_data.length; index++) {
          let appendage = await this.$models.appendage.findByPk(
            upload_data[index].id
          );
          let point = [appendage.x, appendage.y, appendage.z];
          appendage.pointResultx =
            this.dx + point[0] * (1 + k) + Oz * point[1] - Oy * point[2];
          appendage.pointResulty =
            this.dy + point[1] * (1 + k) - Oz * point[0] + Ox * point[2];
          appendage.pointResultz =
            this.dz + point[2] * (1 + k) + Oy * point[0] - Ox * point[1];
          await appendage.save();
          console.log(appendage);
          this.percentage1 = parseInt(((index + 1) / upload_data.length) * 100);
          if (index === upload_data.length - 1) {
            this.$message.success("转换成功!");
            setTimeout(() => {
              this.uploadProgress1 = false;
            }, 1000);
          }
        }
      }
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss">
.appendage-page {
  .el-button--mini,
  .el-button--mini.is-round {
    padding: 5px 10px;
  }
  padding: 10px;
  height: 100%;
  .progres-text {
    font-size: 10px;
    color: #000;
    padding-left: 20px;
  }
  .el-table {
    margin: 10px;
    width: calc(100% - 20px);
    max-height: 420px !important;
    font-size: 10px;
    .el-table__body {
      max-height: 400px !important;
      height: 100%;
      display: block;
    }
    .el-table--medium td,
    .el-table--medium th {
      padding: 0;
    }
    .cell {
      line-height: inherit;
    }
    .el-button--mini,
    .el-button--small {
      font-size: 10px;
    }
  }
  .myprogress {
    margin: 0px 10px;
  }
  .el-container {
    position: inherit;
    height: calc(100% - 80px);
    width: 500px;
    min-width: inherit;
    top: 0;
    left: 0;
    margin: 40px auto;
  }
  .el-container::after {
    display: block;
    width: 1000%;
    margin-left: -1000px;
    height: 100%;
  }
  .el-pagination__jump {
    color: #fff;
  }
  .list {
    margin-top: 10px;
    overflow: hidden;
    position: relative;
    .inputName {
      position: absolute;
      left: 5px;
      top: 10px;
      width: 60px;
      text-align: right;
      z-index: 1;
      font-size: 12px;
    }
    .el-input__inner {
      padding-left: 70px;
      font-size: 12px;
    }
  }
}
</style>
