const ACTIVE_VALUES = ['active']

class UserPresence {
  constructor() {
    return this
  }

  setData(obj) {
    this.presence = obj.presence
    this.active = ACTIVE_VALUES.includes(obj.presence)
    return this
  }
}

module.exports = UserPresence
