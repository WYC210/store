export default defineConfig({
  assetsInclude: ['**/*.ico'],
  // ...其他配置
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8088',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy, options) => {
          // 支持代理转发 cookie
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.setHeader('origin', 'http://localhost:8088')
          })
        }
      }
    }
  }
}) 