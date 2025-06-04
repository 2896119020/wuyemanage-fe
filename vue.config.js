const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})
module.exports = {
  devServer: {
    proxy: {
      '/api': {                          // 拦截/api开头的请求
        target: 'http://localhost:8085', // 后端地址
        changeOrigin: true,              // 启用跨域
        pathRewrite: {
          '^/api': ''                    // 重写路径
        }
      }
    }
  }
}