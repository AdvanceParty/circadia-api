ACCOUNT_TYPES = ['active', 'bot', 'deleted', 'other']

class User {
  constructor() {
    return this
  }

  set profile(userProfile) {
    this._profile = userProfile
  }

  set dndStatus(dndStatus) {
    this._dndStatus = dndStatus
  }

  set presence(presence) {
    this._presence = presence
  }

  set accountType(val) {
    if (ACCOUNT_TYPES.includes(val)) {
      this._accountType = val
    } else {
      throw new Error(
        `Invalid account type '${val}. Must be one of ${ACCOUNT_TYPES.join(
          ', ',
        )}.'`,
      )
    }
  }

  get accountType() {
    return this._accountType || null
  }

  get profile() {
    return this._profile || null
  }
  get dndStatus() {
    return this._dndStatus || null
  }
  get presence() {
    return this._presence || null
  }
}

module.exports = User
