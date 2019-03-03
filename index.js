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

  pub (key, data) {
    let callbacks
    if (this.topics[key]) {
      callbacks = this.topics[key]
    } else if (typeof key === 'object') {
      const matches = this.patterns.find(key)
      callbacks = Array.isArray(matches) ? matches : [matches]
    }

    if (callbacks && callbacks.length) {
      return callbacks.map(callback => callback(data))
    } else {
      throw new Error(`Topic ${key} not found`)
    }
  }

  del (key) {
    delete this.topics[key]
  }
}
