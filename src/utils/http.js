import axios from "axios"
/* 
*所有axios的响应都会被该拦截器的拦截  
*定义响应拦截器
*res :响应正常接受的数据
*
*
*/

axios.interceptors.response.use(res=>{
    return res.data
    // return 用户使用的数据
    // Do something before request is sent
},error=>{
    return Promise.reject(error)
})


/**
 * get :发送get 请求的方法
 * @url：请求路径
 * @params:参数
 * : 返回axios promise 对象
 */

 function get(url,params={}){
     return new Promise((res,rej)=>{
         axios({
             method:"get",
             url,
             params
         }).then(data=>{
             res(data)
         }).catch(err=>{
             rej(err)
         })
     })
 }

 function post(url,params={}){
    return new Promise((res,rej)=>{
        axios({
            method:"post",
            url,
            params
        }).then(data=>{
            res(data)
        }).catch(err=>{
            rej(err)
        })
    })
}

export default{
    get,
    post
}