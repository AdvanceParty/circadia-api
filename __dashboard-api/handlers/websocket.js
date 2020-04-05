const withMiddleware = require('./middleware')
const {
  addConnection,
  removeConnection,
} = require('../functions/db/websocket.js')

const ROUTE_KEYS = {
  CONNECT: '$connect',
  DISCONNECT: '$disconnect',
}

const connectionHandler = async (event, context, callback) => {
  const response = { statusCode: 200 }
  try {
    const { connectionId, routeKey } = event.requestContext
    switch (routeKey) {
      case ROUTE_KEYS.CONNECT:
        await addConnection(connectionId)
        response.body = 'Connected to WebSocket'
        break
      case ROUTE_KEYS.DISCONNECT:
        await removeConnection(connectionId)
        break
      default:
        response.statusCode = 500
        response.body = `Unrecognized routeKey ${routeKey}.`
    }
  } catch (e) {
    console.error(e)
    response.body = e.message
  }

  callback(null, response)
}

const defaultHandler = async (event, context, callback) => {
  // console.log(callback)
  // var connectionId = event.requestContext.connectionId
  return JSON.stringify({
    statusCode: 200,
    body: `default handler`,
  })
}

const fooHandler = async (event, context) => {
  console.log('FOO')
  return {
    statusCode: 200,
    body: 'pong',
  }
}

module.exports.connectionHandler = connectionHandler
module.exports.defaultHandler = defaultHandler
module.exports.fooHandler = fooHandler

// module.exports.connectionHandler = withMiddleware(connectionHandler)
// module.exports.defaultHandler = withMiddleware(defaultHandler)
// module.exports.fooHandler = withMiddleware(fooHandler)
