/*
 * @Author: 何松
 * @Date: 2020-11-21 19:39:25 
 * @Last Modified by:   mikey.zhaopeng 
 * @Last Modified time: 2020-11-21 19:39:25 
 */

<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <a href="/">商品列表</a>
    </el-breadcrumb>
    <el-button type="primary" style="margin-top:20px" @click="addFn()">添加</el-button>
    <el-table ref="table" :data="tableData" style="width: 100%">
      <el-table-column width="150px" prop="firstcatename" label="一级分类"></el-table-column>
      <el-table-column width="150px" prop="secondcatename" label="二级分类"></el-table-column>
      <el-table-column width="150px" prop="goodsname" label="商品名称"></el-table-column>
      <el-table-column width="150px" prop="price" label="销售价"></el-table-column>
      <el-table-column width="150px" prop="market_price" label="市场价"></el-table-column>
      <el-table-column width="150px" prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.status==1">启用</el-tag>
          <el-tag type="danger" v-else>禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-button @click="editFn(scope.row.id)">编辑</el-button>
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

    <!-- 弹窗列表 -->
    <el-dialog
      @opened="openedFn"
      @open="openFn"
      @close="resetFn"
      :title="info.isAdd?'添加列表':'编辑列表'"
      :visible.sync="info.isShow"
    >
      <el-form :model="form" label-width="100px" :rules="rules" ref="userForm">
        <el-form-item class="item" label="一级分类">
          <!-- changge 点击改变时触发的事件 -->
          <el-select v-model="form.first_cateid" @change="firstChange">
            <el-option
              v-for="(item,index) in firstCateList"
              :key="index"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select v-model="form.second_cateid">
            <el-option
              v-for="(item,index) in secondCateList"
              :label="item.catename"
              :value="item.id"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品名称" prop="goodsname">
          <el-input v-model="form.goodsname"></el-input>
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

        <el-form-item label="商品规格">
          <!-- @change="spescChange选中商品属性时 获得属性值列表 -->
          <el-select v-model="form.specsid" @change="spescChange">
            <el-option
              v-for="(item,index) in specsList"
              :key="index"
              :label="item.specsname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品规格值">
          <!-- multiple 多选设置 -->
          <el-select v-model="specsattr" multiple>
            <el-option v-for="(item,index) in specsAttr" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品价">
          <el-input v-model="form.price"></el-input>
        </el-form-item>

        <el-form-item label="市场价">
          <el-input v-model="form.market_price"></el-input>
        </el-form-item>

        <el-form-item label="是否热卖">
          <el-radio v-model="form.ishot" :label="1">是</el-radio>
          <el-radio v-model="form.ishot" :label="2">否</el-radio>
        </el-form-item>

        <el-form-item label="是否新品">
          <el-radio v-model="form.isnew" :label="1">是</el-radio>
          <el-radio v-model="form.isnew" :label="2">否</el-radio>
        </el-form-item>

        <el-form-item label="上架状态">
          <el-radio v-model="form.status" :label="1">上架</el-radio>
          <el-radio v-model="form.status" :label="2">下架</el-radio>
        </el-form-item>

        <el-form-item label="商品描述">
          <div id="editor"></div>
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
import axios from "axios";
import E from "wangeditor";
let defaultFrom = {
  first_cateid: "", //一级分类编号
  second_cateid: "", //二级分类编号
  goodsname: "", // 商品名称
  price: "", // 商品价格
  market_price: "", // 市场价格
  img: "", // 商品图片（文件
  description: "", //商品描述
  specsid: "", // 商品规格
  specsattr: "", // 商品规格属性
  isnew: 0, // 是否新品     1-是 2-否
  ishot: 0, // 是否热卖推荐 1-是 2-否
  status: 0, // 状态1正常2禁用
};

export default {
  data() {
    return {
      specsattr: [],
      // 一二级分类
      firstCateList: [],
      secondCateList: [],
      // 图片上传
      dialogVisible: false, //预览图显示状态
      dialogImageUrl: "", //预览图地址
      fileList: [], //上传文件列表
      // 属性值
      specsList: [],
      // 属性值列表
      specsAttr: [],
      // 角色列表
      tableData: [],
      userList: [],
      length: 0,
      //   分页器
      total: 0,
      page: 1,
      size: 3,
      info: {
        isShow: false,
        isAdd: true,
      },
      form: {
        ...defaultFrom,
      },
      rules: {
        goodsname: [
          {
            required: true,
            message: "请输入商品名称",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 属性规格
    async getSpecsList() {
      let res = await this.$http.get("/api/specslist");
      if (res.code == 200) {
        this.specsList = [...res.list];
      }
    },
    // 选中商品属性时 获得属性值列表
    spescChange(id) {
      // console.log(id);
      // let item;
      // // 遍历specsList 获取其中的数据
      // for(var i = 0; i < this.specsList.length; i++){
      //   if(this.specsList[i].id == id){
      //     item = this.specsList[i]
      //   }
      // }
      let item = this.specsList.find((item) => item.id == id);

      this.specsAttr = item.attrs;
    },
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
      // console.log(this.info.dialogVisible);
    },
    // 获取商品分类列表
    // 一级分类pid 默认0
    async getCateList(pid = 0) {
      let res = await this.$http.get("/api/catelist", { pid });
      if (pid == 0) {
        if (res.code == 200) {
          this.firstCateList = res.list;
        }
      } else {
        // 二级分类
        this.secondCateList = [];
        if (res.code == 200) {
          this.secondCateList = res.list;
        }
      }
    },
    // 获取页面的数据
    async getList() {
      let res = await this.$http.get("/api/goodslist", {
        page: this.page,
        size: this.size,
      });
      // console.log(res);
      if (res.code == 200) {
        this.length = res.list.length;
        this.tableData = res.list;
      }
    },
    // 用于管理员分页
    async getTotal() {
      let res = await this.$http.get("/api/goodscount");
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
      let res = await this.$http.get("/api/goodslist");
      if (res.code == 200) {
        this.userList = res.list;
      }
    },
    // 弹窗一级分类点击切换事件
    firstChange(id) {
      this.getCateList(id);
    },
    // 打开事件
    openFn() {
      this.getCateList();
      if (this.info.isAdd) {
        this.getSpecsList();
      }
    },
    openedFn() {
      // 重置富文本编辑框
      document.getElementById("editor").innerHTML = "";
      // console.log(document.getElementById("editor"));
      // 实例化 富文本编辑器实例
      this.editor = new E("#editor");
      // 创建dom 结构
      this.editor.create();
      // 防止数据在点击编辑时没有回来，创建时重新赋值
      this.editor.txt.html(this.form.description);
    },
    // 关闭事件
    resetFn() {
      // 重置所有输入框的内容
      this.info.fileList = [];
      this.specsattr = [];
      this.info.isAdd = true;
      this.form = {
        ...defaultFrom,
      };
    },
    // 确定按钮
    subFn() {
      // 获取富文本输入框的内容
      // console.log(this.editor.txt.html())
      // 表单验证
      this.$refs.userForm.validate(async (value) => {
        // 验证通过
        if (value) {
          // 获取富文本状态输入框的内容
          this.form.description = this.editor.txt.html();
          //  specsattr多选是数组需要转换为字符串
          this.form.specsattr = this.specsattr.join(",");
          // 如果isAdd为true就是添加接口，fasle就是编辑接口
          let url = this.info.isAdd ? "/api/goodsadd" : "/api/goodsedit";
          this.form.status = this.form.status ? 1 : 2;
          let res = await this.$http.upload(url, this.form);
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
    async editFn(id) {
      // 控制弹窗显示隐藏
      this.info = {
        isShow: true,
        isAdd: false,
      };
      // 获取编辑事件的接口
      let res = await this.$http.get("/api/goodsinfo", { id });
      if (res.code == 200) {
        this.form.id = id;
        this.form = {
          ...res.list,
          id,
        };
        this.specsattr = res.list.specsattr.split(",");
        this.form.img = res.list.img;
        this.info.fileList = [{ name: "", url: this.$dom + res.list.img }];
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
          let res = await this.$http.post("/api/goodsdelete", { id });
          if (res.code == 200) {
            //   删除成功后回到第一页
            this.page = 1;
            this.getList();
            this.getTotal();
            //   成功后重新调用一次页面进行刷新
            // this.getSpecsList();
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