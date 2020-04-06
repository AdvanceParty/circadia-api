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
}

const sendMessage = async (event, context, callback) => {
  // create a payload in the form {event:str, message:str/obj}
  // wsGatewayConnector.emitToAll({ event, message })
  return { status: 200, headers: CONSTANTS.RESPONSE_HEADERS, body: 'METHOD NOT IMPLEMENTED' }
}

module.exports.listUsers = listUsers
module.exports.sendMessage = sendMessage
