const CONSTANTS = require('../constants')
const { SLACK_MAX_REQUESTS_PER_MINUTE } = CONSTANTS || 45

class Throttler {
  constructor({
    items,
    requestFunction,
    requestsPerMinute = SLACK_MAX_REQUESTS_PER_MINUTE,
    onComplete = null,
  }) {
    this.items = [...items]
    this.requestFunction = requestFunction
    this.interval = Math.floor(60000 / requestsPerMinute)
    this.running = false
    this.onComplete = onComplete

    Object.defineProperty(this, '_next', {
      enumerable: false,
      get: () => {
        this.running = true
        this.requestFunction(this.items.shift())
        if (this.items.length > 0) {
          setTimeout(() => {
            this._next
          }, this.interval)
        } else {
          this.onComplete ? this.onComplete() : null
        }
      },
    })
    return this
  }

  start() {
    return new Promise((resolve, reject) => {
      if (!this.running) {
        this._next
      }
      resolve(true)
    })
  }

  get length() {
    return this.items.length
  }
}

module.exports = Throttler
