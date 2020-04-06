'use strict'

const aws = require('aws-sdk')
const CONSTANTS = require('../constants')
const DB_OPTIONS = CONSTANTS.DYNAMODB_OPTIONS
const TableName = CONSTANTS.WS_CONNECTIONS_TABLE

class WsDbConnector {
  constructor() {
    this._connector = new aws.DynamoDB.DocumentClient(DB_OPTIONS)
  }

  get connector() {
    return this._connector
  }

  async registerSocket(connectionId) {
    const socketParams = {
      TableName,
      Item: {
        connectionId,
      },
    }

    console.log(socketParams)

    return await this._connector.put(socketParams).promise()
  }

  async removeSocket(connectionId) {
    const socketParams = {
      TableName,
      Key: {
        connectionId,
      },
    }

    return await this._connector.delete(socketParams).promise()
  }

  async getConnectedSockets() {
    return await this._connector.scan({ TableName }).promise()
  }
}

const WSDB_CONNECTOR = new WsDbConnector()
module.exports = WSDB_CONNECTOR
