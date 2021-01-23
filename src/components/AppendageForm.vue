<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    class="fsw-dialog"
    @open="handleDialogOpen"
    @closed="handleDialogClosed"
    :appendToBody="appendToBody"
  >
    <el-form
      ref="appendageFormRef"
      :model="appendageForm"
      :rules="appendageFormRules"
      size="mini"
      label-width="50px"
    >
      <el-form-item label="流水号" prop="aprecode">
        <el-input
          v-model="appendageForm.aprecode"
          placeholder="附属物流水号"
        ></el-input>
      </el-form-item>
      <el-form-item label="名称" prop="aname">
        <el-input
          v-model="appendageForm.aname"
          placeholder="附属物名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="小类名称" prop="asubclassname">
        <el-input
          v-model="appendageForm.asubclassname"
          placeholder="附属物小类名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="宗地号" prop="parcelcode">
        <el-input
          v-model="appendageForm.parcelcode"
          placeholder="所属宗地号"
        ></el-input>
      </el-form-item>
      <el-form-item label="栋流水号" prop="bprecode">
        <el-input
          v-model="appendageForm.bprecode"
          placeholder="所属栋流水号"
        ></el-input>
      </el-form-item>
      <el-form-item label="权利人" prop="owner">
        <el-input
          v-model="appendageForm.owner"
          placeholder="所属权利人"
        ></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="atype">
        <el-radio-group v-model="appendageForm.atype">
          <el-radio label=1>平面</el-radio>
          <el-radio label=2>立面</el-radio>
          <el-radio label=3>点状</el-radio>         
          <el-radio label=4>不规则</el-radio>  
          <el-radio label=5>其他</el-radio>                 
        </el-radio-group>
      </el-form-item>
      <el-form-item label="结构" prop="structure">
        <el-radio-group v-model="appendageForm.structure">
          <el-radio label="框架结构">框架结构</el-radio>
          <el-radio label="混合结构">混合结构</el-radio>
          <el-radio label="砖木结构">砖木结构</el-radio>       
          <el-radio label="钢混结构">钢混结构</el-radio> 
          <el-radio label="钢结构">钢结构</el-radio>                          
        </el-radio-group>
      </el-form-item>
      <el-form-item label="位置" prop="location">
        <el-radio-group v-model="appendageForm.location">
          <el-radio label=1>室内</el-radio>
          <el-radio label=2>室外</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="appendageForm.remark" placeholder=""></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button
        type="primary"
        @click="submitappendageForm"
        size="mini"
        :loading="submitLoading"
        >{{ submitLoading ? "提交中..." : "确 定" }}</el-button
      >
      <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { formMixin } from "@/utils/mixin";
import { Op } from "sequelize";

export default {
  name: "appendageForm",
  mixins: [formMixin],
  data() {
    return {
      appendageForm: {
        // appendage表单数据
        aprecode: null,
        aname: null,
        asubclassname: null,
        parcelcode: null,
        bprecode: null,
        owner: null,
        atype: null,
        structure: null,
        location: null,
        remark: null,
      },
      appendageFormRules: {
        // appendage表单规则
        aname: [
          { required: true, message: "请输入附属物名称", trigger: "blur" },
          { max: 20, message: "最多20个字符", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    // 对话框标题
    title() {
      if (this.create) {
        return "添加附属物";
      }
      return "编辑附属物";
    },

  },
  methods: {
  
    // 提交appendage表单数据
    async submitappendageForm() {
      let val;
      this.$refs.appendageFormRef.validate(async (valid) => {
        val = valid;
      });
      if (!val) return;
      const isContinue = await this.checkSameData(this.appendageForm.name);
      if (!isContinue) return;
      this.submitLoading = true;
      // 如果有附属物ID，则说明是编辑数据
      let appendage;
      if (!this.create) {
        appendage = await this.$models.appendage.findByPk(this.data.id);
        if (appendage === null) return this.$message.error("未找到数据");
        appendage.aprecode = this.appendageForm.aprecode;
        appendage.aname = this.appendageForm.aname;
        appendage.asubclassname = this.appendageForm.asubclassname;
        appendage.parcelcode = this.appendageForm.parcelcode;
        appendage.bprecode = this.appendageForm.bprecode;
        appendage.owner = this.appendageForm.owner;
        appendage.atype = this.appendageForm.atype;
        appendage.structure = this.appendageForm.structure;
        appendage.location = this.appendageForm.location;
        appendage.remark = this.appendageForm.remark;
        appendage.save();
        this.$message.success("修改成功");
      } else {
        // 没有ID，则是添加数据
        appendage = await this.$models.appendage.create(this.appendageForm);
        this.$message.success("添加成功");
      }
      // await this.$store.dispatch('updateappendageList')
      this.$emit("submitted", appendage);
      this.submitLoading = false;
      this.dialogVisible = false;
    },
    // 检查是否有相同类似的数据
    async checkSameData(name) {
      const appendages = await this.$models.appendage.findAll({
        where: {
          aname: { [Op.like]: `%${name}%` },
        },
      });
      let result = true;
      if (this.create && appendages.length) {
        const appendageNames = appendages.map((item) => item.aname).join("，");
        await this.$confirm(
          `已存在相似appendage（${appendageNames}），是否继续添加?`,
          "提示",
          {
            type: "warning",
          }
        )
          .then(() => {
            result = true;
          })
          .catch(() => {
            result = false;
          });
      } else if (
        !this.create &&
        appendages.length &&
        name !== this.data.aname
      ) {
        const appendageNames = appendages.map((item) => item.aname).join("，");
        await this.$confirm(
          `已存在相似附属物（${appendageNames}），是否继续修改?`,
          "提示",
          {
            type: "warning",
          }
        )
          .then(() => {
            result = true;
          })
          .catch(() => {
            result = false;
          });
      }
      return result;
    },
    // 监听对话框打开
    handleDialogOpen() {
      this.appendageForm.aprecode = this.data ? this.data.aprecode : null;
      this.appendageForm.aname = this.data ? this.data.aname : null;
      this.appendageForm.asubclassname = this.data
        ? this.data.asubclassname
        : null;
      this.appendageForm.parcelcode = this.data ? this.data.parcelcode : null;
      this.appendageForm.bprecode = this.data ? this.data.bprecode : null;
      this.appendageForm.owner = this.data ? this.data.owner : null;
      this.appendageForm.atype = this.data ? this.data.atype : null;
      this.appendageForm.structure = this.data ? this.data.structure : null;
      this.appendageForm.location = this.data ? this.data.location : null;
      this.appendageForm.remark = this.data ? this.data.remark : null;
      this.$nextTick(() => {
        this.$refs.appendageFormRef.clearValidate();
      });
    },
  },
};
</script>

<style lang="scss">
.fsw-dialog {
  width: 100%;

  .el-form-item__label {
    width: 80px !important;
    font-size: 12px;
  }
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    display: flex;
    font-size: 12px;
    // margin-bottom: 10px;
  }
  .el-input--mini .el-input__inner {
    height: 30px;
  }
  .el-textarea__inner {
    line-height: inherit;
    min-height: 30px !important;
    height: 30px !important;
  }
}
</style>
