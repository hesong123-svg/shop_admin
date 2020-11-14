<template>
    <div style="height:100%">
        <el-container>
            <el-aside width="250px">
                <v-aside></v-aside>
            </el-aside>
            <el-container>
                <el-header style="background:#b3c0d1">
                    <v-header></v-header>
                </el-header>
                <el-main class="main_bg">
                   <!-- <v-aside></v-aside> -->
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>    
    </div>
</template>
<script>
import VAside from "../../components/aside"
// import VHeader from "@/components/header"
import VHeader  from '../../components/header'
export default {
    components:{
        VAside,
        VHeader
    },
    data() {
        return {
            
        }
    },
}
</script>
<style lang="stylus">
.el-container{
    height 100%
    .main_bg{
        background #e5e5e5
    }
}

</style>