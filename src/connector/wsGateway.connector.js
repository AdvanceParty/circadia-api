'use strict'

const aws = require('aws-sdk')
const dynamodbConnector = require('./wsdb.connector')
const CONSTANTS = require('../constants')
const ENDPOINT = CONSTANTS.OFFLINE ? CONSTANTS.OFFLINE_WEBSOCKET_API_ENDPOINT : CONSTANTS.WEBSOCKET_API_ENDPOINT

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
      console.error('Unable to generate socket message', error)
      if (error.statusCode === 410) {
        console.log(`Removing stale connector ${connectionId}`)
        await dynamodbConnector.removeSocket(connectionId)
      }
    }
  }
}

const APIGW_CONNECTOR = new WSGatewayConnector()
module.exports = APIGW_CONNECTOR
