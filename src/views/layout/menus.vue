<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <a href="/">菜单列表</a>
    </el-breadcrumb>
    <el-button type="primary" style="margin-top:20px" @click="addFn()">添加</el-button>
    <v-table :tableData="tableData"></v-table>
    <v-dialog ref="dialog" :info="info" @getTableDate="getTableDate"></v-dialog>
  </div>
</template>
<script>
import VTable from './menus/table'
import VDialog from './menus/dialog'
import axios from "axios"
export default {
    data() {
        return {
            tableData:[],
            info:{
                isShow:false, // 控制弹出框的显示隐藏
                isAdd:true
            }
        }
    },
    methods: {
        // 获取菜单列表的放法
       async getTableDate(){
           let res = await axios.get("/api/menulist",{params:{
               istree:true
           }})
           if(res.code == 200){
               this.tableData = res.list;
           }else{
               this.$message.error(res.msg)
           } 
        },
        addFn(){
            this.info.isShow = true;
        }
    },
    created(){
        this.getTableDate()
    },
    components:{
        VTable,
        VDialog
    }
}
</script>