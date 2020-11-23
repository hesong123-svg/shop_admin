<template>
  <div class="login_bg">
    <div class="login_wearpp" >
        <h3>登录</h3>
        <!-- 通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名 -->
      <el-form :model="info" :rules="rules" ref="fromName">
          
        <el-form-item prop="username">
          <el-input v-model="info.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="info.password" prop="password" placeholder="请输入密码"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="loginFn()">登录</el-button>
    </div>
  </div>
</template>
<script>
import axios from "axios"
import {mapActions} from "vuex"
export default {
    data() {
        return {
            info:{
                // 用户名
                username:"",
                // 密码
                password:""
            },
            rules:{
                username:[
                    {
                    required:true, // 必填项
                     message: '请输入账户名', // 提示信息
                     trigger: 'blur' //触发条件
                    },
                    { min: 4, max: 6, 
                      message: '请输入4~6位数字或字母', 
                      trigger: 'blur' 
                    }
                ],
                password:[
                    {
                        required:true,
                        message:"请输入密码",
                        trigger:"blur"
                    },
                    {
                       pattern:/^\d{4,6}$/,
                       message:"请输入4~6为数字",
                       trigger:"blur"

                    }
                ]
            }
        }
    },
    methods:{
        ...mapActions(["login"]),
        loginFn(){
           // validate:对表单数据进行验证的方法
            // 验证结束后执行回调函数 ，该函数的参数就是验证结构
            this.$refs.fromName.validate((value)=>{
                if(value){
                    this.login(this.info)
                }
            })
        }
    }
};
</script>
<style lang="stylus">
.login_bg {
  height: 100%;
  background: -webkit-linear-gradient(left, #563443, #413a53, #2f3d60);
  .login_wearpp{
      position fixed
      top 0
      bottom 0
      left 0
      right 0
      margin auto
      width 300px
      height 300px
      h3{
        margin 20px auto 
        color #fff
        text-align center
    }   
      .el-button--primary{
          width 300px
      }
  }
}
</style>
