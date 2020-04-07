const createError = require('http-errors')
const userdbConnector = require('../connector/userdb.connector')
const wsGatewayConnector = require('../connector/wsGateway.connector')
const CONSTANTS = require('../constants')

const listUsers = async (event, context, callback) => {
  let users = []
  let error = null

  try {
    users = await userdbConnector.getActiveUsers()
  } catch (e) {
    console.error(e)
    error = createError.InternalServerError('Error retrieving user list')
  }

  return { body: { error, users } }
  // callback({
  //   status: 200,
  //   headers: {
  //     'Access-Control-Allow-Methods': 'PUT,PATCH,DELETE,GET,POST',
  //     'Access-Control-Allow-Headers':
  //       'API-Key,Content-Type,If-Modified-Since,Cache-Control',
  //     'Access-Control-Allow-Origin': '*',
  //     'Access-Control-Allow-Credentials': true,
  //   },
  //   body: JSON.stringify({ error, users }),
  // })
}

const ping = (event, context, callback) => {
  return { body: { name: 'foo' } }
}

const sendMessage = async (event, context, callback) => {
  // create a payload in the form {event:str, message:str/obj}
  // wsGatewayConnector.emitToAll({ event, message })
  return {
    status: 200,
    headers: CONSTANTS.RESPONSE_HEADERS,
    body: 'METHOD NOT IMPLEMENTED',
  }
}

module.exports.listUsers = listUsers
module.exports.sendMessage = sendMessage
module.exports.ping = ping
