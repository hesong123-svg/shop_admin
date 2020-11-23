<!-- 
  思路: 1.首先创建模板，从接口中获取数据，并在生命周期创建完成后调用getTableDate，否则数据不会渲染出来
 2.获取到数据后，写出表单初始化数据，方便后面进行重置
 3.创建一个空数组用来接收从后台获取到的数据并且绑定到页面上
 4.scope 为element ui 的内置方法（作用域插槽），可以直接获取到里面的值
 5.写添加的点击事件
 6. 在role的父组件身上传递info的事件过去，控制表单的显示隐藏及其他
 -->

<template>
  <div>
    <el-table border style="width: 100%" :data="tableData">
      <el-table-column fixed prop="title" label="轮播图名称" width="150"></el-table-column>
      <el-table-column label="状态" width="180">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.status==1">启用</el-tag>
          <el-tag type="danger" v-else>禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="500px">
        <template slot-scope="scope">
          <el-button @click="editFn(scope.row.id)">编辑</el-button>
          <el-button type="danger" @click="deleFn(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import axios from "axios";
export default {
  props: {
    tableData: Array,
    info: Object,
  },
  data() {
    return {};
  },
  methods: {
    // 编辑事件
    editFn(id) {
      this.$emit("edit", id);
    },
    // 删除事件
    deleFn(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = await this.$http.post("/api/bannerdelete", { id });
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.$emit("dele", res.list);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>