<template>
  <div>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      margin-bottom:20px
      row-key="id"
      :tree-props="{children:'children',hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="specsname" label="属性名称" width="180"></el-table-column>
      <el-table-column prop="attrs" label="属性值" width="180">
        <template slot-scope="scope">
            <el-tag type="primary" style="margin-right:5px" v-for="(item,index) in scope.row.attrs" :key="index">{{item}}</el-tag>
        </template>
        
      </el-table-column>
      <el-table-column prop="status" label="状态" width="200px">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.status==1">启用</el-tag>
          <el-tag type="danger" v-else>禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="editFn(scope.row.id)">编辑</el-button>
          <el-button type="danger" @click="deleFn(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>

export default {
  data() {
    return {
      tableData: [],
     
    };
  },
  methods: {
    // 获取表单页面数据
    async getTableDate() {
      let res = await this.$http.get("/api/specslist");
      if (res.code == 200) {
        this.tableData = res.list;
      }
    },
    // 编辑事件
   editFn(id){
      this.$emit("edit",id)
    },
     // 删除事件
       deleFn(id){
         this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          let res = await this.$http.post("/api/specsdelete",{id})
          console.log(res);
          if(res.code == 200){
            this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.$emit("dele",res.list)
          }
          this.getTableDate();
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
  },
  created() {
    this.getTableDate();
  },
};
</script>