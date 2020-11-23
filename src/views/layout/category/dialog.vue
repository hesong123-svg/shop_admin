<template>
  <div>
    <el-dialog
      @open="openFn"
      @close="resetFn"
      :title="info.isAdd?'分类添加':'编辑分类'"
      :visible.sync="info.isShow"
    >
      <el-form label-width="100px" :model="form" :rules="rules" ref="releForm">
        <el-form-item label="上级分类" prop="catename">
          <el-select v-model="form.pid">
            <el-option label="请选择上级分类" :value="0"></el-option>
            <!-- 动态生成option
                label:选项文本
                value: v-model 关联的数据
            -->
            <el-option
              v-for="(item,index) in topMenus"
              :key="index"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类名称" prop="catename">
          <el-input v-model="form.catename"></el-input>
        </el-form-item>

        <el-form-item label="分类图片">
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
        <el-button @click="info.isShow=false">取 消</el-button>
        <el-button type="primary" @click="subFn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
let defaultFrom = {
  pid: 0,
  catename: "",
  status: true,
  img: "",
};
export default {
  props: ["info"],
  data() {
    return {
      form: {
        ...defaultFrom,
      },
      dialogVisible: false, //预览图显示状态
      dialogImageUrl: "", //预览图地址
      fileList: [], //上传文件列表
      rules: {
        catename: [
          {
            required: true, //必填
            message: "请输入菜单名称", //提示信息
            trigger: "blur", //触发条件
          },
        ],
      },
      topCate: [],
      topMenus: [],
    };
  },
  methods: {
    // 添加上传图片触发的钩子
    // file:被上传的文件信息
    // fileList:被上传的文件信息列表
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
    },
    // 获取顶级菜单列表
    async getTableDate() {
      let res = await this.$http.get("/api/catelist");
      if (res.code == 200) {
        this.topMenus = res.list;
      }
    },
    // 获取顶级分类
    async getTopCate() {
      let res = await this.$http.get("/api/catelist", { pid: 0 });

      if (res.code == 200) {
        this.topCate = res.list;
      }
    },
    openFn() {
      this.getTopCate();
    },
    resetFn() {
      this.form = {
        ...defaultFrom,
      };
      this.$refs.file.clearFiles();
      this.info.isAdd = true;
      this.dialogVisible = false;
      this.dialogImageUrl = "";
    },
    // 提交
    subFn() {
      this.$refs.releForm.validate(async (value) => {
        if (value) {
          let url = this.info.isAdd ? "/api/cateadd" : "/api/cateedit";
          // this.form.pid = 0
          this.form.status = this.form.status === true ? 1 : 2;
          let res = await this.$http.upload(url, this.form);
          if (res.code == 200) {
            this.$emit("getTableDate");
            this.$message.success(res.msg);
          }
          this.info.isShow = false;
        }
      });
    },
  },
  created() {
    this.getTableDate();
  },
};
</script>