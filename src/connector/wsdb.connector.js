'use strict'

const aws = require('aws-sdk')

const CONSTANTS = require('../constants')

class WsDbConnector {
  constructor() {
    this._connector = new aws.DynamoDB.DocumentClient(CONSTANTS.DYNAMODB_OPTIONS)
  }

  get connector() {
    return this._connector
  }

  async registerSocket(connectionId) {
    const socketParams = {
      TableName: CONSTANTS.DYNAMODB_SOCKETS_TABLE,
      Item: {
        connectionId,
        type: connectionType,
      },
    }

    return await this._connector.put(socketParams).promise()
  }

  async removeSocket(connectionId) {
    const socketParams = {
      TableName: CONSTANTS.DYNAMODB_SOCKETS_TABLE,
      Key: {
        connectionId,
      },
    }

    return await this._connector.delete(socketParams).promise()
  }
}

const WSDB_CONNECTOR = new WsDbConnector()
module.exports = WSDB_CONNECTOR
