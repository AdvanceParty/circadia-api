module.exports = () => {
  return {
    onError: (handler, next) => next(),
    before: (handler, next) => next(),
    after: (handler, next) => {
      const { body } = handler.response
      if (typeof handler.response !== 'string') {
        try {
          stringifiedBody = JSON.stringify(body)
          handler.response.body = stringifiedBody
        } catch (e) {
          const error = new createError.UnprocessableEntity(
            `Error while attempting to stringify response object`,
          )
          error.details = e
          error.response = handler.response
          throw error
        }
      }
      return next()
    },
  }
}
