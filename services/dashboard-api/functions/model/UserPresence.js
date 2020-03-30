class UserPresence {
  constructor() {
    return this
  }

  setData(obj) {
    this.active = obj.active
    return this
  }
}

module.exports = UserPresence
