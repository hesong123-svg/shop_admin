<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <a href="/">角色列表</a>
    </el-breadcrumb>
    <el-button type="primary" style="margin-top:20px" @click="addFn()">添加</el-button>
    <v-dialog ref="dialog" :info="info" @getTableDate="getTableDate" @dele="dele"></v-dialog>
    <v-table
      @edit="edit"
      :tableData="tableData"
      ref="rolebox"
      :info="info"
      @getTableDate="getTableDate"
    ></v-table>
  </div>
</template>
<script>
import axios from "axios";
import VDialog from "./banner/dialog";
import VTable from "./banner/table";
export default {
  components: {
    VDialog,
    VTable,
  },
  data() {
    return {
      // 渲染页面数据
      tableData: [],
      info: {
        isShow: false,
        isAdd: true,
      },
    };
  },
  methods: {
    // 删除事件
    dele(data) {
      // console.log(data);
      // data获取删除之后的数据赋值给tableData
      this.tableData = data;
    },
    // 编辑事件
    async edit(id) {
      this.info.isShow = true;
      this.info.isAdd = false;
      let res = await this.$http.get("/api/bannerinfo", { id });
      console.log(res); // menus:"12"rolename:"dd"status: 1
      // 选中的值赋值给表单
      if (res.code == 200) {
        // 如果请求成功的话，就将获取到的数据传递给dialog表单
        this.$refs.dialog.form = {
          id,
          ...res.list,
          // 将状态的数字转换为布尔
          status: res.list.status === 1 ? true : false,
        };
        this.$refs.dialog.form.img = res.list.img;
        this.info.fileList = [{ name: "", url: this.$dom + res.list.img }];
        this.$refs.dialog.dialogImageUrl = this.$dom + res.list.img;
      }
    },
    //  1.获取数据
    async getTableDate() {
      let res = await this.$http.get("/api/bannerlist");
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