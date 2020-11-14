import Vue from 'vue'
import Router from 'vue-router'

const layout = () => import("@/views/layout/layout.vue")
// import layout from '../views/layout';
const login = () => import("@/views/login")
import index from '../views/layout/index.vue'
// import menus from '../views/layout/menus.vue'
const menu = () => import("@/views/layout/menus")
Vue.use(Router)

const router =  new Router({
  routes: [
    {
      path: '/login',
      component: login
    },
    {
      path: '/',
      component: layout,
      children:[
        {
          path:"index",
          component:index
        },
        {
          path:"menu",
          component:menu
        },
        {
          path:"*",
          redirect:"index"
        }
      ]
    },
    
  ]
})
// 判断是否有登录的标志 
router.beforeEach((to,from,next)=>{
  // 已登录
  if(localStorage.getItem("userinfo")){
    // 已登录访问登录页进行组止
    if(to.path == "/login"){
      next(false)
    }else{
      // 没登录放行
      next()
    }
  }else{
    // 如果没有登录要去login放行
    if(to.path == "/login"){
      next()
    }else{
      // 反之直接去登录页
      next("/login")
    }
  }
})

export default router