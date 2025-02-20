class EventBus {
  constructor() {
    this.events = new Map()
  }

  // 订阅事件
  on(event, callback) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set())
    }
    this.events.get(event).add(callback)

    // 返回取消订阅函数
    return () => this.off(event, callback)
  }

  // 取消订阅
  off(event, callback) {
    if (this.events.has(event)) {
      this.events.get(event).delete(callback)
    }
  }

  // 触发事件
  emit(event, data) {
    if (this.events.has(event)) {
      this.events.get(event).forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error(`Error in event handler for ${event}:`, error)
        }
      })
    }
  }

  // 只订阅一次
  once(event, callback) {
    const wrapper = (data) => {
      callback(data)
      this.off(event, wrapper)
    }
    return this.on(event, wrapper)
  }

  // 清除所有订阅
  clear() {
    this.events.clear()
  }
}

export const eventBus = new EventBus() 