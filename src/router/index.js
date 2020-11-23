import Vue from 'vue'
import Router from 'vue-router'
import {
  Message
} from "element-ui"
const layout = () => import("@/views/layout/layout.vue")
const login = () => import("@/views/login")
import index from '../views/layout/index.vue'
const menu = () => import("@/views/layout/menus")
const user = () => import("@/views/layout/user")
const role = () => import("@/views/layout/role")
const category = () => import("@/views/layout/category")
const specs = () => import("@/views/layout/specs")
const goods = () => import("@/views/layout/goods")
const member = () => import("@/views/layout/member")
const banner = () => import("@/views/layout/banner")
const seckill = () => import("@/views/layout/seckill")
Vue.use(Router)

const router = new Router({
  routes: [{
      path: '/login',
      component: login
    },
    {
      path: '/',
      component: layout,
      children: [{
          path: "index",
          component: index
        },
        {
          path: "menu",
          component: menu
        },
        {
          path: "role",
          component: role
        }, ,
        {
          path: "user",
          component: user
        },
        {
          path: "specs",
          component: specs
        },
        {
          path: "category",
          component: category
        },
        {
          path: "goods",
          component: goods
        },
        {
          path: "member",
          component: member
        },
        {
          path: "banner",
          component: banner
        },
        {
          path: "seckill",
          component: seckill
        },
        {
          path: "*",
          redirect: "index"
        }
      ]
    },

  ]
})
// 判断是否有登录的标志 
router.beforeEach((to, from, next) => {
  // 已登录
  if (localStorage.getItem("userinfo")) {
    // 已登录访问登录页进行组止
    if (to.path == "/login") {
      next(false)
    } else {
      // 设置登录拦截
      let urls = JSON.parse(localStorage.getItem("userinfo")).menus_url.concat(["/", "/index"])
      let flag = urls.find(item => item == to.path);
      if (flag) {
        next()
      } else {
        Message.error("权限不足")

        next(false)
      }
      // 没登录放行
      next()
    }
  } else {
    // 如果没有登录要去login放行
    if (to.path == "/login") {
      next()
    } else {
      // 反之直接去登录页
      next("/login")
    }
  }
})

export default router
