const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://localhost:8080/api',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      }
    }
  },
  outputDir: 'dist',
});