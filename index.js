import patrun from 'patrun'

export default class Subpub {
  constructor () {
    this.topics = {}
    this.patterns = patrun()
  }

  sub (key, callback) {
    if (typeof key === 'object') {
      this.patterns.add(key, callback)
    } else if (this.topics[key]) {
      this.topics[key].push(callback)
    } else {
      this.topics[key] = [callback]
    }
    return () => {
      this.topics[key].splice(this.topics[key].indexOf(callback), 1)
      if (this.topics[key].length === 0) {
        this.del(key)
      }
    }
  }

  getSubs (key) {
    if (this.topics[key]) {
      return this.topics[key]
    } else if (typeof key === 'object') {
      const matches = this.patterns.find(key)
      if (matches) {
        return Array.isArray(matches) ? matches : [matches]
      }
    }
  }

  pub (key, data) {
    const callbacks = this.getSubs(key)
    if (callbacks) {
      return callbacks.map(callback => callback(data))
    } else {
      throw new Error(`Topic ${key} not found`)
    }
  }

  del (key) {
    delete this.topics[key]
  }
}
