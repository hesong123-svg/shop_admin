<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <a href="/">菜单列表</a>
    </el-breadcrumb>
    <el-button type="primary" style="margin-top:20px" @click="addFn()">添加</el-button>
    <v-table :tableData="tableData" @edit="edit" @dele="dele"></v-table>
    <v-dialog ref="dialog" :info="info" @getTableDate="getTableDate"></v-dialog>
  </div>
</template>
<script>
import VTable from "./menus/table";
import VDialog from "./menus/dialog";
import axios from "axios";
export default {
  data() {
    return {
      tableData: [],
      info: {
        isShow: false, // 控制弹出框的显示隐藏
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
      this.info = {
        isShow: true,
        isAdd: false,
      };
      // console.log(this.info.isAdd);
      let res = await axios.get("/api/menuinfo", { params: { id } });
      //    console.log(res);
      if (res.list) {
        // 如果请求成功的话，就将获取到的数据传递给dialog表单
        this.$refs.dialog.form = { id, ...res.list };
      }
    },
    // 获取菜单列表的放法
    async getTableDate() {
      let res = await axios.get("/api/menulist", {
        params: {
          istree: true,
        },
      });
      if (res.code == 200) {
        this.tableData = res.list;
      } else {
        this.$message.error(res.msg);
      }
    },
    addFn() {
      this.info.isShow = true;
    },
  },
  created() {
    this.getTableDate();
  },
  components: {
    VTable,
    VDialog,
  },
};
</script>