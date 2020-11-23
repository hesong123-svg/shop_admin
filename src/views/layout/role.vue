<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <a href="/">角色列表</a>
    </el-breadcrumb>
    <el-button type="primary" style="margin-top:20px" @click="addFn()">添加</el-button>
    <v-rolelist :tableData="tableData" :info="info" @edit="edit" @dele="dele"></v-rolelist>
    <v-rolebox ref="rolebox" :info="info" @getTableDate="getTableDate"></v-rolebox>
  </div>
</template>
<script>
import axios from "axios";
import VRolelist from "../layout/role/rolelist";
import VRolebox from "../layout/role/rolebox";
export default {
  components: {
    VRolelist,
    VRolebox,
  },
  data() {
    return {
      tableData: [],
      info: {
        isShow: false,
        isAdd: true,
      },
    };
  },
  methods: {
    // 删除
    dele(data) {
      this.tableData = data;
    },
    // 编辑
    async edit(id) {
      this.info.isShow = true;
      this.info.isAdd = false;
      let res = await this.$http.get("/api/roleinfo", { id });
      // console.log(res); // menus:"12"rolename:"dd"status: 1
      // 选中的值赋值给表单
      if (res.code == 200) {
        // 如果请求成功的话，就将获取到的数据传递给dialog表单
        this.$refs.rolebox.form = {
          id,
          ...res.list,
          // 将状态的数字转换为布尔
          status: res.list.status === 1 ? true : false,
        };
        this.$refs.rolebox.defaultKeys = res.list.menus.split(",");
      }
    },
    //  1.获取数据
    async getTableDate() {
      let res = await this.$http.get("/api/rolelist");
      console.log(res)
      if (res.code == 200) {
        // 获取成功后给table赋值
        this.tableData = res.list;
      }
    },
    // 添加事件
    async addFn() {
      this.info.isShow = true;
    },
  },
  created() {
    this.getTableDate();
  },
};
</script>