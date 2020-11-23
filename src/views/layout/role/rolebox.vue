<!--
    open: 打开对话框的事件 -》 获取顶级菜单的数据
    close: 关闭对话框的事件（info.isShow = false） ->重置对话框状态和表单信息 
    7.获取菜单权限列表
 -->

<template>
  <el-dialog
    @open="openFn()"
    @close="resetFn()"
    :title="info.isAdd?'新增菜单':'编辑菜单'"
    :visible.sync="info.isShow"
  >
    <el-form :model="form" ref="releForm" :rules="rules" label-width="100px">
      <el-form-item label="角色名称" prop="rolename">
        <el-input v-model="form.rolename"></el-input>
      </el-form-item>

      <el-form-item label="角色权限">
        <!-- 
                  data: 树形组件的数据
                  props: 设置项 
                        label: 数据文本字段名称
                        children: 子数据的字段名称
                  show-checkbox: 是否显示选择框
                  node-key:每一个节点对应 key值 的字段
                  check-strictly :父子是否不关联

                   :props="{
                    label: 'title',
                    children: 'children'
                }"
        -->
        <el-tree
          :data="menuList"
          :props="{
                label:'title',
                children:'children'
         }"
          show-checkbox
          node-key="id"
          check-strictly
          :default-checked-keys="defaultKeys"
          ref="tree"
        ></el-tree>
      </el-form-item>
      <el-form-item label="状态">
        <el-switch v-model="form.status"></el-switch>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel()">取 消</el-button>
      <el-button type="primary" @click="submitFn()">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import axios from "axios";
// 2.表单初始化数据
let defaultFrom = {
  menus: "",
  status: true,
  rolename: "",
};
export default {
  props: ["info"],
  data() {
    return {
      form: {
        ...defaultFrom,
      },
      defaultKeys: [],
      menuList: [],
      // 表单验证，设置必填项
      rules: {
        rolename: [
          {
            required: true, //必填项
            message: "请输入角色名称", // 提示信息
            trigger: "blur", // 触发条件
          },
        ],
      },
    };
  },
  methods: {
    // 取消按钮
    cancel() {
      this.info.isShow = false;
      this.info.isAdd = true;
    },
    // 获取菜单权限列表
    async getMenus() {
      let res = await this.$http.get("/api/menulist", { istree: true });
      this.menuList = res.list ? res.list : [];
    },
    // 打开对话框，获取顶级菜单数据
    openFn() {
      this.getMenus();
    },
    // 关闭对话框
    resetFn() {
      this.form = {
        ...defaultFrom,
      };
      // 重置对话框状态
      this.info.isAdd = true;
    },
    submitFn() {
      // 表单验证
      this.$refs.releForm.validate(async (value) => {
        if (value) {
          let url = this.info.isAdd ? "api/roleadd" : "/api/roleedit";
          // console.log(url);
          // 转换数组为字符串
          this.form.menus = this.$refs.tree.getCheckedKeys().join(",");
          // 根据true，false转换为数字1.2
          this.form.status = this.form.status ? 1 : 2;
          // console.log(this.form);
          let res = await this.$http.post(url, this.form);
          if (res.code == 200) {
            // 通知父组件更新table信息
            this.$emit("getTableDate");
          } else {
            // 请求失败提示
            this.$message.error(res.msg);
          }
          this.$message.success("添加成功");
          this.info.isShow = false;
        }
      });
    },
  },
};
</script>