<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <a href="/">限时秒杀列表</a>
    </el-breadcrumb>
    <el-button type="primary" style="margin-top:20px" @click="addFn()">添加</el-button>
    <v-dialog ref="dialog" @getTableDate="getTableDate" :info="info"></v-dialog>
    <v-table @edit="edit" :tableData="tableData" ref="rolebox" @getTableDate="getTableDate"></v-table>
  </div>
</template>
<script>
import axios from "axios";
import VDialog from "./seckill/dialog";
import VTable from "./seckill/table";
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
    getTableDate() {
      this.$refs.dialog.getTableDate();
    },
    getTableDate() {
      this.$refs.rolebox.getTableDate();
    },
    // 编辑事件
    async edit(id) {
      this.info.isShow = true;
      this.info.isAdd = false;
      let res = await this.$http.get("/api/seckinfo", { id });
      console.log(res); // menus:"12"rolename:"dd"status: 1
      // 选中的值赋值给表单
      if (res.code == 200) {
        // 如果请求成功的话，就将获取到的数据传递给dialog表单
        this.$refs.dialog.getCateList(res.list.first_cateid);
        this.$refs.dialog.goodsidFn(res.list.second_cateid);
        this.$refs.dialog.Time = [
          new Date(parseInt(res.list.begintime)).getTime(),
          new Date(parseInt(res.list.endtime)).getTime(),
        ];
        this.$refs.dialog.form = {
          id,
          ...res.list,
          // 将状态的数字转换为布尔
          status: res.list.status === 1 ? true : false,
        };
      }
    },
    //  1.获取数据
    async getTableDate() {
      let res = await this.$http.get("/api/secklist");
      if (res.code == 200) {
        // 获取成功后给table赋值
        this.tableData = res.list;
      }
    },
    // 添加事件
    addFn() {
      this.info.isShow = true;
    },
  },
  created() {
    this.getTableDate();
  },
};
</script>