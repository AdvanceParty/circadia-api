'use strict'

const apigatewayConnector = require('../connector/wsGateway.connector')
const dynamodbConnector = require('../connector/wsdb.connector')
const CONSTANTS = require('./../constants')

const defaultSocketHandler = async (event, context) => {
  try {
    const data = JSON.parse(event.body)
    const action = data.action

    const connectionId = event.requestContext.connectionId
    switch (action) {
      case 'PING':
        const pingResponse = JSON.stringify({ action: 'PING', value: 'PONG' })
        await apigatewayConnector.generateSocketMessage(connectionId, pingResponse)
        break
      default:
        const invalidResponse = JSON.stringify({
          action: 'ERROR',
          error: 'Invalid request',
        })
        await apigatewayConnector.generateSocketMessage(connectionId, invalidResponse)
    }

    return {
      statusCode: 200,
      headers: CONSTANTS.RESPONSE_HEADERS,
      body: 'Default socket response.',
    }
  } catch (err) {
    console.error('Unable to generate default response', err)
    return {
      statusCode: 500,
      headers: CONSTANTS.RESPONSE_HEADERS,
      body: 'Default socket response error.',
    }
  }
}

const handleSocketConnect = async (event, context) => {
  try {
    const connectionId = event.requestContext.connectionId

    await dynamodbConnector.registerSocket(connectionId)

    return {
      statusCode: 200,
      headers: CONSTANTS.RESPONSE_HEADERS,
      body: 'Socket successfully registered.',
    }
  } catch (err) {
    console.error('Unable to initialize socket connection', err)
    return {
      statusCode: 500,
      headers: CONSTANTS.RESPONSE_HEADERS,
      body: 'Unable to register socket.',
    }
  }
}

const handleSocketDisconnect = async (event, context) => {
  try {
    const connectionId = event.requestContext.connectionId

    await dynamodbConnector.removeSocket(connectionId)

    return {
      statusCode: 200,
      headers: CONSTANTS.RESPONSE_HEADERS,
      body: 'Socket successfully terminated.',
    }
  } catch (err) {
    console.error('Unable to terminate socket connection', err)
    return {
      statusCode: 500,
      headers: CONSTANTS.RESPONSE_HEADERS,
      body: 'Unable to terminate socket.',
    }
  }
}

module.exports = {
  defaultSocketHandler,
  handleSocketConnect,
  handleSocketDisconnect,
}
