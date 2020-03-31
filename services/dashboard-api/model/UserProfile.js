class UserProfile {
  constructor() {
    return this
  }

  setData(obj) {
    this.title = obj.title || null
    this.phone = obj.phone || null
    this.realName = obj.real_name || null
    this.displayName = obj.display_name || null
    this.status = {
      text: obj.status_text || null,
      emoji: obj.status_emoji || null,
    }

    this.images = []

    obj.image_24 ? this.images.push({ size: 24, src: obj.image_24 }) : null
    obj.image_32 ? this.images.push({ size: 32, src: obj.image_32 }) : null
    obj.image_48 ? this.images.push({ size: 48, src: obj.image_48 }) : null
    obj.image_72 ? this.images.push({ size: 72, src: obj.image_72 }) : null
    obj.image_192 ? this.images.push({ size: 192, src: obj.image_192 }) : null
    obj.image_512 ? this.images.push({ size: 512, src: obj.image_512 }) : null

    return this
  }
}

module.exports = UserProfile

const squareAndRoot = num => Math.sqrt(num * num)
