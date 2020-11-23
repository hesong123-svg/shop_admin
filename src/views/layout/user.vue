<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <a href="/">管理员列表</a>
    </el-breadcrumb>
    <el-button type="primary" style="margin-top:20px" @click="addFn()">添加</el-button>
    <el-table ref="table" :data="tableData" style="width: 100%">
      <el-table-column prop="uid" label="用户编号" width="200"></el-table-column>
      <el-table-column prop="rolename" label="角色" width="200"></el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.status==1">启用</el-tag>
          <el-tag type="danger" v-else>禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-button @click="editFn(scope.row.uid)">编辑</el-button>
          <el-button type="danger" @click="deleFn(scope.row.id)">删除</el-button>
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

    <el-dialog
      @open="openFn"
      @close="resetFn"
      :title="info.isAdd?'管理员添加':'编辑管理员'"
      :visible.sync="info.isShow"
    >
      <el-form :model="form" label-width="100px" :rules="rules" ref="userForm">
        <el-form-item class="item" label="角色" prop="username">
          <el-select v-model="form.roleid">
            <el-option
              v-for="(item,index) in userList"
              :key="index"
              :label="item.rolename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
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
let defaultFrom = {
  roleid: "",
  username: "",
  password: "",
  status: true,
};
import axios from "axios";
export default {
  data() {
    return {
      // 角色列表
      tableData: [],
      userList: [],
      length: 0,
      //   分页器
      total: 0,
      page: 1,
      size: 4,
      info: {
        isShow: false,
        isAdd: true,
      },
      form: {
        ...defaultFrom,
      },
      rules: {
        username: [
          {
            required: true,
            message: "请输入管理员名称",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 获取页面的数据
    async getList() {
      let res = await this.$http.get("/api/userlist", {
        page: this.page,
        size: this.size,
      });
      if (res.code == 200) {
        this.length = res.list.length;
        this.tableData = res.list;
      }
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
    // 添加事件
    async addFn() {
      this.info.isShow = true;
      //console.log(this.$refs.table);
    },
    // 获取角色列表
    async getUserList() {
      let res = await this.$http.get("/api/rolelist");
      if (res.code == 200) {
        this.userList = res.list;
      }
    },
    // 打开事件
    openFn() {
      this.getUserList();
    },
    // 关闭事件
    resetFn() {
      this.info.isAdd = true;
      this.form = {
        ...defaultFrom,
      };
    },
    // 确定按钮
    subFn() {
      // 表单验证
      this.$refs.userForm.validate(async (value) => {
        // 验证通过
        if (value) {
          // 如果isAdd为true就是添加接口，fasle就是编辑接口
          let url = this.info.isAdd ? "/api/useradd" : "/api/useredit";
          console.log(url);
          // 转换status的为数字类型
          this.form.status = this.form.status ? 1 : 2;
          let res = await this.$http.post(url, this.form);
          if (res.code == 200) {
            this.$message.success(res.msg);
            // 修改成功后，重新调用一次分页器和表单页面的函数
            this.getTotal();
            this.getList();
          } else {
            this.$message.error(res.msg);
          }
          // 弹窗关闭
          this.info.isShow = false;
        }
      });
    },
    // 编辑事件
    async editFn(uid) {
      // 控制弹窗显示隐藏
      this.info = {
        isShow: true,
        isAdd: false,
      };
      // 获取编辑事件的接口
      let res = await this.$http.get("/api/userinfo", { uid });
      if (res.code == 200) {
        // 获取成功将打印出来的res.list里面的值赋值给this.form
        this.form.uid = res.list.uid;
        this.form.username = res.list.username;
        this.form.status = res.list.status === 1 ? true : false;
        this.form.roleid = res.list.roleid;
      }
    },
    // 删除事件
    deleFn(id) {
      //  提示是否删除
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = await this.$http.post("/api/userdelete", { id });
          if (res.code == 200) {
            //   删除成功后回到第一页
            this.getTotal();
            if (this.leng <= 0) {
              this.page--;
              if (this.page == 1) {
                this.page = 1;
              }
            }
            //   成功后重新调用一次页面进行刷新
            this.getList();
          }
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
  // 生命周期挂载
  created() {
    this.getList();
    this.getTotal();
  },
};
</script>