<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <a href="/">商品分类</a>
    </el-breadcrumb>
    <el-button type="primary" style="margin-top:20px" @click="addFn()">添加</el-button>
    <!-- <v-dialog :info="info"></v-dialog> -->
    <bialog ref="dialog" :info="info" @getTableDate="getTableDate"></bialog>
    <v-table @dele="dele" ref="cateTable" :tableData="tableData" @edit="edit"></v-table>
  </div>
</template>
<script>
import axios from "axios";
import bialog from "./category/dialog";
import VTable from "./category/table";
export default {
  data() {
    return {
      tableData: [],
      info: {
        isShow: false,
        isAdd: true,
        // dialogVisible: false, //预览图显示状态
        // dialogImageUrl: "", //预览图地址
        // fileList: [], //上传文件列表
      },
    };
  },
  components: {
    bialog,
    VTable,
  },
  methods: {
    // 编辑
    async edit(id) {
      this.info = {
        isShow: true,
        isAdd: false,
      };
      // console.log(this.info.isAdd);
      let res = await axios.get("/api/cateinfo", { params: { id } });
      if (res.list) {
        // 如果请求成功的话，就将获取到的数据传递给dialog表单
        this.$refs.dialog.form = {
          id,
          ...res.list,
          status: res.list.status === 1 ? true : false,
        };
        this.$refs.dialog.form.img = res.list.img;
        this.info.fileList = [{ name: "", url: this.$dom + res.list.img }];
        //
        this.$refs.dialog.dialogImageUrl = this.$dom + res.list.img;
      }
    },
    // 删除
    dele(data) {
      this.tableData = data;
    },
    addFn() {
      this.info.isShow = true;
    },
    getTableDate() {
      this.$refs.cateTable.getTableDate();
    },
  },
};
</script>