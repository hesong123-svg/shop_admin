import Vue from 'vue'
import Vuex from 'vuex'
import http from '@/utils/http.js'
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
            http.post("/api/userlogin",fromdata).then((res)=>{
                console.log(res.code); //msg: "登录成功", code: 200
                if(res.code == 200){
                    // 储存登录信息
                    localStorage.setItem("userinfo",JSON.stringify(res.list))
                    context.commit("setinfo",res.list)
                    router.replace("/")
                }else{
                    Message({  
                        message:res.msg,
                        type:"error"
                    })
                }
            })
        }
    }
})
export default store