import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import router from '@/router/index.js'
import {Message} from "element-ui"
Vue.use(Vuex)

let store = new Vuex.Store({
    state:{
        // 保存在vuex中用户数据
        // 获取login登录信息 如果获取到了就转换为对象 没有获取到userinfo为{ }
        userinfo:localStorage.getItem("userinfo")?JSON.parse(localStorage.getItem("userinfo")):{}
    },
    getters:{
        // 用户名
        username(state){
            return state.userinfo.username 
        },
        // 用户可以访问的菜单
        menus(state){
            return state.userinfo.menus 
        }
    },
    mutations:{
        // 保存登录信息
        setinfo(state,info){
            state.userinfo = info;
        },
        // 点击注销按钮事件
        loginOut(state){
            // 情况localstorage中登录信息
            localStorage.clear();
            // 清除state中的数据
            this.userinfo = {};
            // 跳转到登录页
            router.replace("/login")
        }
    },
    actions:{
        login(context,fromdata){
            axios.post("/api/userlogin",fromdata).then((res)=>{
                console.log(res.data.code); //msg: "登录成功", code: 200
                if(res.data.code == 200){
                    // 储存登录信息
                    localStorage.setItem("userinfo",JSON.stringify(res.data.list))
                    context.commit("setinfo",res.data.list)
                    router.replace("/")
                }else{
                    Message({  
                        message:res.data.msg,
                        type:"error"
                    })
                }
            })
        }
    }
})
export default store