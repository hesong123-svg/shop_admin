<template>
  <div>
    <el-dialog @close="resetFn" :title="info.isAdd?'会员修改':'会员修改'" :visible.sync="info.isShow">
      <!-- prop 绑定数据库里的内容 -->
      <el-form :model="form" label-width="100px">
        <el-form-item class="item" label="昵称" prop="nickname">
          <el-input v-model="form.nickname"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.status"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="info.isShow=false">取 消</el-button>
        <el-button type="primary" @click="subFn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
let defaultForm = {
  uid: 0,
  nickname: "",
  phone: "",
  password: "",
  status: true,
};
export default {
  props: ["info"],
  data() {
    return {
      form: {
        ...defaultForm,
      },
    };
  },
  methods: {
    resetFn() {
      this.form = {
        ...defaultForm,
      };
    },
    async subFn() {
      // 转换stasus状态类型，由布尔值转换为number类型
      this.form.status = this.form.status ? 1 : 2;
      // 获取修改数据的接口
      let res = await this.$http.post("/api/memberedit", this.form);
      if (res.code == 200) {
        // 通过自定义事件通知父组件及时更新内容
        this.$emit("getTableDate");
        this.$message.success("修改成功");
      } else {
        this.$message.error("修改失败");
      }
      // 关闭对话框
      this.info.isShow = false;
    },
  },
};
</script>