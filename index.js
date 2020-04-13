import patrun from 'patrun'

class Subpub {
  constructor () {
    this.all = []
    this.topics = {}
    this.patterns = patrun()
  }

  sub (key, callback) {
    const isAll = typeof key === 'function'
    const isObj = typeof key === 'object'
    if (isAll) {
      this.all.push(key)
    } else if (isObj) {
      this.patterns.add(key, callback)
    } else if (this.topics[key]) {
      this.topics[key].push(callback)
    } else {
      this.topics[key] = [callback]
    }

    return () => {
      if (isObj) {
        this.patterns.remove(key)
      } else {
        const collection = isAll ? this.all : this.topics[key]
        collection.splice(collection.indexOf(callback), 1)
        if (!isAll && collection.length === 0) {
          this.del(key)
        }
      }
    }
  }

  getSubs (key) {
    let callbacks = this.all
    if (this.topics[key]) {
      callbacks = callbacks.concat(this.topics[key])
    } else if (typeof key === 'object') {
      const match = this.patterns.find(key)
      if (match) {
        callbacks = callbacks.concat(Array.isArray(match) ? match : [match])
      }
    }
    return callbacks
  }

  pub (key, data) {
    const callbacks = this.getSubs(key)
    if (callbacks && callbacks.length) {
      return callbacks.map(callback => callback(data))
    } else {
      throw new Error(`Topic ${key} not found`)
    }
  }

  del (key) {
    if (key === undefined) {
      this.all = []
    } else if (typeof key === 'object') {
      this.patterns.remove(key)
    } else {
      delete this.topics[key]
    }
  }
}

const subpub = new Subpub()

export { Subpub, subpub }
