const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 3001,
    proxy: {
      '/api': {
        target: process.env.VUE_APP_API_BASE_URL;
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      }
    }
  },
  outputDir: 'dist',
});