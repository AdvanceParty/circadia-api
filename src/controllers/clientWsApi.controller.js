'use strict'

const apigatewayConnector = require('../connector/wsGateway.connector')
const dynamodbConnector = require('../connector/wsdb.connector')
const CONSTANTS = require('../constants')
const headers = {
  'Content-Type': 'text/plain',
  'Access-Control-Allow-Origin': CONSTANTS.CORS_ORIGIN,
}

const defaultMessage = {
  action: 'foo',
  message: 'bar',
}

const emitToAllSockets = async (message = defaultMessage) => {
  const sockets = await dynamodbConnector.getConnectedSockets()
  const promises = sockets.Items.map((socket) => {
    try {
      apigatewayConnector.generateSocketMessage(socket.connectionId, JSON.stringify(message))
    } catch (e) {
      console.error(`Unable to deliver message to ${socket.connectionId}`, e)
    }
  })
  Promise.all(promises)
}

const sendMessage = async (event, context) => {
  // try {
  //   const connectionId = event.requestContext.connectionId
  //   // Retrieve the message from the socket payload
  //   const data = JSON.parse(event.body)
  //   const greetingMessage = {
  //     action: data.action,
  //     value: data.message,
  //   }
  // } catch (e) {
  //   console.error(e)
  // }
  const { queryStringParameters } = event
  const message = queryStringParameters.message || null
  console.log(message)
  emitToAllSockets(message)
  return { status: 200, headers, body: message }
}

module.exports = {
  sendMessage,
}
