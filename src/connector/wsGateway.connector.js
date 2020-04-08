'use strict'

const aws = require('aws-sdk')
const dynamodbConnector = require('./wsdb.connector')
const CONSTANTS = require('../constants')
// const ENDPOINT = CONSTANTS.OFFLINE ? CONSTANTS.OFFLINE_WEBSOCKET_API_ENDPOINT : CONSTANTS.WEBSOCKET_API_ENDPOINT
const ENDPOINT = CONSTANTS.WEBSOCKET_API_ENDPOINT

class WSGatewayConnector {
  constructor() {
    const CONNECTOR_OPTS = {
      endpoint: ENDPOINT,
    }
    this._connector = new aws.ApiGatewayManagementApi(CONNECTOR_OPTS)
  }

  get connector() {
    return this._connector
  }

  async generateSocketMessage(connectionId, data) {
    console.log(`API ENDPOINT: ${ENDPOINT}`)
    try {
      return await this._connector
        .postToConnection({
          ConnectionId: connectionId,
          Data: data,
        })
        .promise()
    } catch (error) {
      if (error.statusCode === 410) {
        console.log(`Removing stale connector ${connectionId}`)
        await dynamodbConnector.removeSocket(connectionId)
      } else {
        console.error('Unable to generate socket message', error)
      }
    }
  }

  async emitToAll(message = defaultMessage) {
    const sockets = await dynamodbConnector.getConnectedSockets()
    console.info(`Broadcasting to all socket connections:`, message)
    const promises = sockets.Items.map((socket) => {
      this.generateSocketMessage(socket.connectionId, JSON.stringify(message))
    })
    return Promise.all(promises)
  }
}

const APIGW_CONNECTOR = new WSGatewayConnector()
module.exports = APIGW_CONNECTOR
