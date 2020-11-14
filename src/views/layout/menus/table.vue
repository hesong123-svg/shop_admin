<template>
  <div>
    <!-- 
            data 表格数据
            row-key  每一行唯一标识（指定数据对象的id 作为标识）
            :tree-props:树形数据的配置
             children: 子数据的字段名称
            hasChildren：是否包含子数据
            
    -->
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      margin-bottom:20px
      row-key="id"
      :tree-props="{children:'children',hasChildren: 'hasChildren'}"
    >
      <!-- 每一列 
        prop:这一列数据关联的字段名称
        label:这一列 标题
      -->
      <el-table-column prop="title" label="名称" width="180"></el-table-column>
      <el-table-column label="图标" width="180">
        <!-- scope.row ：当前行的数据对象  -->
        <!-- 使用作用域插槽 来 展示这一列的内容 -->
        <template slot-scope="scope">
          <i :class="scope.row.icon"></i>
        </template>
      </el-table-column>
      <el-table-column label="类型" width="180">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type==1">目录</el-tag>
          <el-tag v-else type="success">菜单</el-tag>
        </template>
      </el-table-column>
      <!-- prop 每一列数据关联的字段名称
            label 每一列的标题
      -->
      <el-table-column prop="url" label="菜单URL" width="180"></el-table-column>
      <el-table-column label="操作">
        <el-button @click="editFn(scope.row.id)">编辑</el-button>
        <el-button type="danger">删除</el-button>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import axios from "axios"
export default {
  props: {
    tableData: Array,
  },
  methods: {
    //   编辑事件
      editFn(id){
          this.$emit("edit",id)
      }
  },
};
</script>
