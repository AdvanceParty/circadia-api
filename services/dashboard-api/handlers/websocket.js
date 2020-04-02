const createError = require('http-errors')
const withMiddleware = require('./middleware')

const connectHandler = async (event, context) => {
  const body = JSON.parse(event.body)
  return {
    statusCode: 200,
    body: `Welcome to WS API`,
  }
}

const defaultHandler = async (event, context) => {
  const body = JSON.parse(event.body)
  return {
    statusCode: 200,
    body: `FOO: ${body.name}`,
  }
}

module.exports.connectHandler = withMiddleware(connectHandler)
module.exports.defaultHandler = withMiddleware(defaultHandler)
