<template>
  <div>
    <el-table ref="table" :data="tableData" style="width: 100%" border>
      <el-table-column prop="nickname" label="昵称" width="200"></el-table-column>
      <el-table-column prop="phone" label="手机号" width="200"></el-table-column>
      <el-table-column prop="addtime" label="注册日期" width="200"></el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-button @click="editFn(scope.row.uid)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :page-size="size"
      @current-change="pagechange"
      background
      layout="prev, pager, next"
      :total="total"
    ></el-pagination>
  </div>
</template>
<script>
let defaultForm = {
  uid: 0,
  nickname: "",
  phone: 0,
  password: "",
  status: true,
};
export default {
  data() {
    return {
      tableData: [],
      // 分页器
      total: 0,
      page: 1,
      size: 4,
      form: {
        ...defaultForm,
      },
    };
  },
  methods: {
    // 编辑事件
    editFn(uid) {
      this.$emit("edit", uid);
    },
    // 用于管理员分页
    async getTotal() {
      let res = await this.$http.get("/api/usercount");
      if (res.code == 200) {
        // 如果获取成功就得到res.list下标的第一项 失败为0
        this.total = res.list ? res.list[0].total : 0;
      }
    },
    // 页码发生变化触发事件
    pagechange(current) {
      this.page = current;
      this.getList();
    },
    // 获取表单信息
    async getTableDate() {
      let res = await this.$http.get("/api/memberlist", {
        page: this.page, // 获取分页的内容
        size: this.size, // 分页的个数
      });
      if (res.code == 200) {
        this.tableData = res.list;
        for (var i = 0; i < this.tableData.length; i++) {
          let a = new Date(
            parseInt(this.tableData[i].addtime)
          ).toLocaleDateString();
          let b = new Date(
            parseInt(this.tableData[i].addtime)
          ).toLocaleTimeString();
          this.tableData[i].addtime = a + b;
        }
      }
    },
  },
  created() {
    this.getTableDate();
  },
};
</script>