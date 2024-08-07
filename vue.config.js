const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

  // npm run serve 개발 진행시에 포트가 다르기때문에 프록시 설정
  devServer: {
      // 프록시 설정
        proxy: {
        '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      }
    }
  }
})
