class WebSocketClient {
  constructor(url) {
    this.url = url
    this.ws = null
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectDelay = 1000
    this.handlers = new Map()
  }

  connect() {
    try {
      this.ws = new WebSocket(this.url)
      
      this.ws.onopen = () => {
        console.log('WebSocket 连接已建立')
        this.reconnectAttempts = 0
        this.handlers.get('open')?.forEach(handler => handler())
      }
      
      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        this.handlers.get(data.type)?.forEach(handler => handler(data.payload))
      }
      
      this.ws.onerror = (error) => {
        console.error('WebSocket 错误:', error)
        this.handlers.get('error')?.forEach(handler => handler(error))
      }
      
      this.ws.onclose = () => {
        console.log('WebSocket 连接已关闭')
        this.handlers.get('close')?.forEach(handler => handler())
        this.reconnect()
      }
    } catch (error) {
      console.error('WebSocket 连接失败:', error)
      this.reconnect()
    }
  }

  reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      console.log(`尝试重新连接 (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
      setTimeout(() => this.connect(), this.reconnectDelay * this.reconnectAttempts)
    }
  }

  on(event, handler) {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set())
    }
    this.handlers.get(event).add(handler)
  }

  off(event, handler) {
    this.handlers.get(event)?.delete(handler)
  }

  send(type, payload) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }))
    }
  }

  close() {
    this.ws?.close()
    this.handlers.clear()
  }
}

export const wsClient = new WebSocketClient('ws://localhost:8088/ws') 