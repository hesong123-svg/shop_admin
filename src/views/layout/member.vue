<template>
  <div>
    <el-breadcrumb separator="/" style="margin-bottom:20px">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <a href="/">会员列表</a>
    </el-breadcrumb>
    <v-dialog @getTableDate="getTableDate" :info="info" ref="dialog"></v-dialog>
    <v-table ref="Table" @edit="edit"></v-table>
  </div>
</template>
<script>
import VTable from "../layout/member/table";
import VDialog from "../layout/member/dialog";
export default {
  components: {
    VTable,
    VDialog,
  },
  data() {
    return {
      info: {
        isShow: false,
        isAdd: true,
      },
    };
  },
  methods: {
    // 编辑
    async edit(uid) {
      this.info.isShow = true;
      let res = await this.$http.get("/api/memberinfo", { uid });
      if (res.code == 200) {
        this.$refs.dialog.form = {
          uid,
          ...res.list,
          nickname: res.list.nickname,
          status: res.list.status == 1 ? true : false,
        };
      }
    },
    getTableDate() {
      // 通过ref调用子组件里的方法
      this.$refs.Table.getTableDate();
    },
  },
};
</script>