const wsClient = {
  connect() {
    try {
      // 使用正确的 WebSocket 服务器地址
      this.ws = new WebSocket('ws://localhost:8088/ws')
      
      this.ws.onopen = () => {
        console.log('WebSocket 连接已建立')
      }
      
      this.ws.onerror = (error) => {
        console.error('WebSocket 错误:', error)
      }
    } catch (error) {
      console.error('WebSocket 连接失败:', error)
    }
  }
} 