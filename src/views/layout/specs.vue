<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <a href="/">商品规格</a>
    </el-breadcrumb>
    <el-button type="primary" style="margin-top:20px" @click="addFn()">添加</el-button>

    <v-dialog ref="dialog" :info="info" @getTableDate="getTableDate"></v-dialog>
    <v-table ref="specsT" @edit="edit" @dele="dele"></v-table>
  </div>
</template>
<script>
import axios from "axios";
import VDialog from "./specs/dialog";
import VTable from "./specs/table";
export default {
  data() {
    return {
      info: {
        isShow: false,
        isAdd: true,
      },
    };
  },
  components: {
    VDialog,
    VTable,
  },
  methods: {
    // 添加事件
    addFn() {
      this.info.isShow = true;
    },
    getTableDate() {
      this.$refs.specsT.getTableDate();
    },
    // 编辑事件
    async edit(id) {
      this.info = {
        isShow: true,
        isAdd: false,
      };
      // 请求修改文件的接口，传入唯一标识id
      let res = await axios.get("/api/specsinfo", { params: { id } });
      if (res.list) {
        // console.log(res.list);
        this.$refs.dialog.form = {
          ...res.list[0],
          status: res.list[0].status === 1 ? true : false,
        };
        this.$refs.dialog.attrsList = res.list[0].attrs.map((item) => ({
          value: item,
        }));
      }
    },
    dele(data) {
      this.tableData = data;
    },
  },
};
</script>