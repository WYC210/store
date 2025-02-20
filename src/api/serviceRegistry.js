class ServiceRegistry {
  constructor() {
    this.services = new Map()
  }

  register(name, service) {
    this.services.set(name, service)
  }

  get(name) {
    if (!this.services.has(name)) {
      throw new Error(`Service ${name} not found`)
    }
    return this.services.get(name)
  }
} 