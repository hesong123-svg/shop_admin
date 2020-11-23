<!--
    open: 打开对话框的事件 -》 获取顶级菜单的数据
    close: 关闭对话框的事件（info.isShow = false） ->重置对话框状态和表单信息 
    7.获取菜单权限列表
 -->

<template>
  <el-dialog
    @open="openFn()"
    @close="resetFn()"
    :title="info.isAdd?'轮播图添加':'编辑轮播图'"
    :visible.sync="info.isShow"
  >
    <el-form :model="form" ref="releForm" :rules="rules" label-width="100px">
      <el-form-item label="轮播图标题" prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>

      <el-form-item label="轮播图图片">
        <el-upload
          ref="file"
          action="#"
          list-type="picture-card"
          :auto-upload="false"
          :on-preview="handlePreview"
          :on-change="picChange"
          :file-list="info.fileList"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <!--显示上传图片预览的对话框 
            append-to-body 嵌套内部对话框设置该属性才能正常显示
        -->
        <el-dialog :visible.sync="dialogVisible" append-to-body>
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
        <!--  -->
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
  img: "",
  status: true,
  title: "",
};
export default {
  props: ["info"],
  data() {
    return {
      // 图片上传
      dialogVisible: false, //预览图显示状态
      dialogImageUrl: "", //预览图地址
      fileList: [], //上传文件列表
      form: {
        ...defaultFrom,
      },
      defaultKeys: [],
      menuList: [],
      // 表单验证，设置必填项
      rules: {
        title: [
          {
            required: true, //必填项
            message: "请输入轮播图名称", // 提示信息
            trigger: "blur", // 触发条件
          },
        ],
      },
    };
  },
  methods: {
    picChange(file, fileList) {
      // console.log(file,fileList)
      // 设置表单的上传文件 img
      this.form.img = file.raw;
      // 设置预览图的图片地址
      this.dialogImageUrl = file.url;
    },
    // 预览钩子
    handlePreview() {
      this.dialogVisible = true;
      // console.log(this.info.dialogVisible);
    },
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
      // 重置图片
      this.$refs.file.clearFiles();
      this.info.isAdd = true;
      this.dialogVisible = false;
      this.dialogImageUrl = "";
      // 重置对话框状态
      this.info.isAdd = true;
    },
    // 提交
    submitFn() {
      // 表单验证
      this.$refs.releForm.validate(async (value) => {
        if (value) {
          let url = this.info.isAdd ? "/api/banneradd" : "/api/banneredit";
          // 根据true，false转换为数字1.2
          this.form.status = this.form.status ? 1 : 2;
          let res = await this.$http.upload(url, this.form);
          if (res.code == 200) {
            // 通知父组件更新table信息
            this.$emit("getTableDate");
            this.$message.success(res.msg);
          } else {
            // 请求失败提示
            this.$message.error(res.msg);
          }
          this.info.isShow = false;
        }
      });
    },
  },
};
</script>