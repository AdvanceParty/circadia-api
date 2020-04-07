const middy = require('middy')

const {
  httpHeaderNormalizer,
  httpErrorHandler,
  jsonBodyParser,
  cors,
} = require('middy/middlewares')

const stringifyResponse = require('./stringifyResponse')

const withMiddleware = (handler) =>
  middy(handler)
    .use(
      cors({
        origin: '*',
        headers:
          'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent',
        credentials: true,
      }),
    )
    .use(jsonBodyParser())
    .use(httpHeaderNormalizer())
    .use(stringifyResponse())
    .use(httpErrorHandler()) // must be last middleware

module.exports = withMiddleware
