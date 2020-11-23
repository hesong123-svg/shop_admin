<template>
  <div>
    <el-dialog
     @close="resetFn"
     :title="info.isAdd?'规格添加':'编辑规格'" :visible.sync="info.isShow">
      <el-form ref="specsForm" :model="form" label-width="100px" :rules="rules">
        <el-form-item label="属性名称" prop="specsname">
          <el-input v-model="form.specsname"></el-input>
        </el-form-item>
        <el-form-item label="属性值">
          <div v-for="(item,index) in attrsList" :key="index">
            <el-input style="width:45%" v-model="item.value"></el-input>
            <el-button type="success" v-if="index==0" @click="addAttr">添加属性</el-button>
            <el-button type="danger" v-else @click="deleteAttr">删除属性</el-button>
          </div>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.status"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="info.isShow = false">取 消</el-button>
        <el-button type="primary" @click="subFn()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
let defaultFrom = {
  specsname: "",
  attrs: "",
  status: true,
};
export default {
  data() {
    return {
      attrsList: [{ value: "" }],
      tableData:[],
      form: {
        ...defaultFrom,
      },
      // 表单验证
      rules: {
        specsname: [
          {
            required: true, //必填
            message: "请输入规格名称", //提示信息
            trigger: "blur", //触发条件
          },
        ],
      },
    };
  },
  methods: {
    resetFn(){
      this.form={
        ...defaultFrom
      }
      this.attrsList = [{ value: "" }]
    },
    // 添加一行属性输入框
    addAttr() {
      this.attrsList.push({
        value: "",
      });
    },
    // 删除一行属性输入框
    deleteAttr(index) {
      this.attrsList.splice(index, 1);
    },
    // 确定添加事件
    subFn(){
      console.log(1);
      this.$refs.specsForm.validate(async (value) => {
        if (value) {
          let url = this.info.isAdd ? "/api/specsadd" : "/api/specsedit";
          this.form.status = this.form.status === true ? 1 : 2;
          // 因后台需要传输字符串，而打印出来的是数组，所以需要将数组转换成字符串后提交
          this.form.attrs = this.attrsList.map((item)=>item.value).join(",")  
          console.log(this.form);
          let res = await this.$http.post(url, this.form);
          if (res.code == 200) {
            this.$emit("getTableDate");
            this.$message.success(res.msg);
          }
          this.info.isShow = false;
        }
      });
    }
  },
  props: ["info"],
};
/* 确定提交事件思路
   通过字传父自定义事件传递给父元素，子组件传递事件（this.$emit("getTableDate");）
   父组件页面绑定写入自定义事件接收  <v-dialog@getTableDate="getTableDate"></v-dialog>
   通过ref将事件传递给需要的子组件
   <v-table ref="specsT"></v-table>
    getTableDate(){
    this.$refs.specsT.getTableDate();
  }
*/
</script>