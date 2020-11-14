<template>
  <div class="header_bg">
    <el-dropdown @command="commFn()">
      <span class="el-dropdown-link">
        {{username}}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>注销</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
import {mapGetters,mapMutations} from "vuex"
export default {
  computed: {
    ...mapGetters(["username"])
  },
  methods:{
    ...mapMutations(["loginOut"]),
    commFn(){
      this.loginOut()
    }
  }
}
</script>
<style lang="stylus">
.header_bg{
    line-height 60px
    text-align right 
}
</style>