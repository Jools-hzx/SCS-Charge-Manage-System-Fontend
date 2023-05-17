import axios from 'axios' //通过 axios 创建对象

const request = axios.create({
    timeout: 5000,
    baseURL: 'http://localhost:10000' // 设置基础URL
})

//request 拦截器
//1. 可以对请求做一些统一的处理
//2. 比如统一加 token, Content-Type 之类的

request.interceptors.request.use(
    config => {
        config.headers['Context-Type'] = 'application/json,charset=utf-8';
        return config;
    },
    error => {
        return Promise.reject(error);
    }
)

//response 拦截器
//可以在调用接口响应后；统一处理返回结果
request.interceptors.response.use(
    response => {
        let res = response.data;
        //如果服务端拦截到未登录请求，跳转到登陆页面
        console.log("res.redirect:", res.redirect);
        if (res.redirect === '/') {
            // 重定向到"http://localhost:10000/"
            window.location.href = 'http://localhost:10000/';
        }
        //如果返回得是文件
        if (response.config.responseType === 'blob') {
            return res;
        }
        //如果返回得是 String, 转化成json字符串
        if (typeof res === 'string') {
            //如果 res 不为 null, 就转化成 json 对象
            res = res ? JSON.parse(res) : res;
        }
        return res;
    }, error => {
        console.log("err", error);
        return Promise.reject(error);
    }
)

//导出模块
export default request;