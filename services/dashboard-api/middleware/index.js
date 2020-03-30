const {
  httpHeaderNormalizer,
  httpErrorHandler,
  jsonBodyParser,
  cors,
} = require('middy/middlewares')

module.exports = {
  stringifyResponse: require('./stringifyResponse'),
  httpErrorHandler: httpErrorHandler,
  httpHeaderNormalizer: httpHeaderNormalizer,
  jsonBodyParser: jsonBodyParser,
  cors: cors,
}
