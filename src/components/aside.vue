<template>
  <div class="aside-bg">
    <el-menu unique-opened background-color="#20222a" text-color="#fff" active-text-color="#ffd04b">
      <h3>后台管理系统</h3>
      <el-menu-item>
        <router-link to="/index" index="/index">
          <i class="el-icon-s-home"></i>
          <span>首页</span>
        </router-link>
      </el-menu-item>
      <el-submenu v-for="(submenu,index) in menus" :key="index" :index="(index+1).toString()">
        <template slot="title">
          <!-- 一级导航的标题 -->
          <i :class="submenu.icon"></i>
          <span>{{submenu.title}}</span>
        </template>
        <el-menu-item v-for="(item,index) in submenu.children" :key="index" :index="item.url">
          <router-link :to="item.url" >
            <i :class="item.icon"></i>
            <span>{{item.title}}</span>
          </router-link>
        </el-menu-item>
      </el-submenu>
      <!-- <el-submenu v-for="(item,index) in menus" :key="index" :index="(index+1).toString()">
        <template slot="title">
          <i :class="item.icon"></i>
          <span>{{item.title}}</span>
        </template>
        <el-menu-item v-for="(itemson,index) in item.children" :key="index" :index="itemson.url">
          <router-link :to="itemson.url" tag="p">
            <i :class="itemson.icon"></i>
            <span>{{itemson.title}}</span>
          </router-link>
        </el-menu-item>
      </el-submenu> -->
    </el-menu>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["menus"]),
  },
  data() {
    return {};
  },
};
</script>
<style lang="stylus">
.aside-bg {
  height: 100%;
  background: #20222a;
  
  h3 {
    color: #fff;
    height: 60px;
    text-align: center;
    line-height: 60px;
  }
  .el-menu-item {
  .router-link-active {
    color: #ffd04b;
    
    i {
      color: #ffd04b;
    }
  }
  a{
    color #fff
  }
  }
}
</style>