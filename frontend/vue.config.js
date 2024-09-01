const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 3001,
    proxy: {
      '/api': {
        target: process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080/api', // 환경 변수에서 API URL 가져오기
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      }
    }
  },
  outputDir: 'dist',
});