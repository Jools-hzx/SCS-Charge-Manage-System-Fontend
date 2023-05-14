const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})

module.exports = {
  devServer: {
    port: 10000, //启动端口
    proxy: {    //设置代理，解决跨域问题
      '/api': {
        target: 'http://localhost:9090/', //代理的目标地址
        changeOrigin: true, //是否设置同源，输入是的
        pathRewrite: {
          //路径重写
          '/api': ''  //选择忽略拦截器里的单词
        }
      }
    }
  }
}