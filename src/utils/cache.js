class CacheManager {
  constructor(storage = localStorage) {
    this.storage = storage
    this.prefix = 'app_'
    this.defaultTTL = 3600 // 默认缓存时间1小时
  }

  // 设置缓存
  set(key, value, ttl = this.defaultTTL) {
    const item = {
      value,
      timestamp: Date.now(),
      ttl
    }
    this.storage.setItem(this.prefix + key, JSON.stringify(item))
  }

  // 获取缓存
  get(key) {
    try {
      const item = JSON.parse(this.storage.getItem(this.prefix + key))
      if (!item) return null

      const now = Date.now()
      const expired = item.timestamp + item.ttl * 1000 < now

      if (expired) {
        this.remove(key)
        return null
      }

      return item.value
    } catch {
      return null
    }
  }

  // 删除缓存
  remove(key) {
    this.storage.removeItem(this.prefix + key)
  }

  // 清除所有缓存
  clear() {
    Object.keys(this.storage).forEach(key => {
      if (key.startsWith(this.prefix)) {
        this.storage.removeItem(key)
      }
    })
  }

  // 获取缓存剩余时间
  getTTL(key) {
    try {
      const item = JSON.parse(this.storage.getItem(this.prefix + key))
      if (!item) return 0

      const now = Date.now()
      const expiry = item.timestamp + item.ttl * 1000
      return Math.max(0, Math.floor((expiry - now) / 1000))
    } catch {
      return 0
    }
  }
}

export const cacheManager = new CacheManager() 