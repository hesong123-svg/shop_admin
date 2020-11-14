<!--
  @ 本页思路
  首先使用父传子的props事件控制dialog页面的显示隐藏
 -->
<template>
  <!-- 
    open: 打开对话框的事件 -》 获取顶级菜单的数据
    close: 关闭对话框的事件（info.isShow = false） ->重置对话框状态和表单信息 
  -->
  <el-dialog @open="openFn" :close="resetFn" :title="info.isAdd?'新增菜单':'编辑菜单'" :visible.sync="info.isShow">
    <el-form label-width="100px" :model="form" :rules="rules" ref="ruleForm">
      <el-form-item label="菜单名称">
        <el-select v-model="form.pid" @change="changeMenu">
          <el-option label="顶级菜单" :value="0"></el-option>
          <!-- 动态生成option
                label:选项文本
                value: v-model 关联的数据
          -->
          <el-option
            v-for="(item,index) in topMenus"
            :key="index"
            :label="item.title"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="菜单名称" prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item v-if="form.type==1" label="目录图标" >
        <el-input v-model="form.icon"></el-input>
      </el-form-item>
      <el-form-item v-else label="菜单地址" >
        <el-input v-model="form.url"></el-input>
      </el-form-item>
      <el-form-item label="类型">
        <el-radio v-model="form.type" :disabled="form.type==2" :label="1">目录</el-radio>
        <el-radio v-model="form.type" :disabled="form.type==1" :label="2">菜单</el-radio>
      </el-form-item>
      <el-form-item label="状态">
        <el-switch v-model="form.status"></el-switch>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button>取 消</el-button>
      <el-button type="primary" @click="subFn">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import axios from "axios";
// 表单的初始化数据
let defaultFrom = {
  pid: 0,
  title: "",
  type: 1,
  icon: "",
  url: "",
  status: true,
};
export default {
  props: ["info"],
  data() {
    return {
      topMenus: [],
      form: {
        ...defaultFrom,
      },
      rules: {
        title: [
          {
            required: true, //必填
            message: "请输入菜单名称", //提示信息
            trigger: "blur", //触发条件
          },
        ],
      },
    };
  },
  methods: {
    //   确认按钮
     subFn(){
        // 表单验证，如果通过为true，反之fasle
        this.$refs.ruleForm.validate(async(value)=>{
            if(value){
                // console.log(value);
                let url = "/api/menuadd";
                this.form.status = this.form.status?1:2;
                let res = await axios.post(url,this.form)
                // 如果请求成功的状态码为200
                if(res.code == 200){
                    // 通知父组件更新table信息
                    this.$emit("getTableDate")
                }else{
                    // 请求失败提示
                    this.$message.error(res.msg)
                }
                // 控制弹窗隐藏
                this.info.isShow = false;
                this.info.isAdd = true;
                // 重置表单
                this.form = {...defaultFrom}
            }
        })
    },
    // 重置表单
    resetFn(){
        this.form = {
            ...defaultFrom
        }
        // 重置对话框状态
        this.info.isAdd = true;
        console.log("resetFn");
    },
    async getTop() {
      let res = await axios.get("/api/menulist", {
        params: {
          pid: 0,
        },
      });
      console.log(res);
      if (res.code == 200) {
        this.topMenus = res.list ? res.list : [];
      } else {
        this.$message.error(res.msg);
      }
    },
    openFn() {
      this.getTop();
    },
    changeMenu(value) {
      console.log(value);
      this.form.type = value === 0?1:2;
    },
   async  editFn(id){
        this.info = {
            isShow : true,
            isAdd : false
        }
        console.log(id);
       let res = await axios.get("/api/menuinfo",{id})
       console.log(res);
    }
  },
  //   获取顶级菜单列表
};
</script>