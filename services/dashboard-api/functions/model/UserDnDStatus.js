class UserDndStatus {
  constructor() {
    return this
  }

  setData(obj) {
    this.enabled = obj.dnd_enabled || null
    this.nextDndStart = obj.next_dnd_start_ts || null
    this.nextDndEnd = obj.next_dnd_end_ts || null
    return this
  }
}

module.exports = UserDndStatus
