export default class Subpub {
  constructor () {
    this.topics = {}
  }

  sub (key, cb) {
    if (this.topics[key]) {
      this.topics[key].push(cb)
    } else {
      this.topics[key] = [cb]
    }
    return () => {
      this.topics[key].splice(this.topics[key].indexOf(cb), 1)
      if (this.topics[key].length === 0) {
        this.del(key)
      }
    }
  }

  pub (key, data) {
    if (this.topics[key]) {
      for (let cb of this.topics[key]) {
        cb(data)
      }
    } else {
      throw new Error(`Topic ${key} not found`)
    }
  }

  del (key) {
    delete this.topics[key]
  }
}
