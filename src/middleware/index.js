const middy = require('middy')

const {
  httpHeaderNormalizer,
  httpErrorHandler,
  jsonBodyParser,
  cors,
} = require('middy/middlewares')

const stringifyResponse = require('./stringifyResponse')

const withMiddleware = handler =>
  middy(handler)
    .use(cors())
    .use(jsonBodyParser())
    .use(httpHeaderNormalizer())
    .use(stringifyResponse())
    .use(httpErrorHandler()) // must be last middleware

module.exports = withMiddleware
