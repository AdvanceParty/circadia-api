'use strict'

const aws = require('aws-sdk')

const CONSTANTS = require('../constants')

class UserDbConnector {
  constructor() {
    this._connector = new aws.DynamoDB.DocumentClient(CONSTANTS.DYNAMODB_OPTIONS)
  }

  get connector() {
    return this._connector
  }

  updateUser = (userId, user) => {
    const TableName = CONSTANTS.USER_TABLE
    const Key = { id: userId }

    const expressions = []
    const ExpressionAttributeValues = {}

    if (user.profile) {
      expressions.push(`profile = :p`)
      ExpressionAttributeValues[':p'] = user.profile
    }

    if (user.accountType) {
      expressions.push(`accountType = :a`)
      ExpressionAttributeValues[':a'] = user.accountType
    }

    if (user.dndStatus) {
      expressions.push(`dndStatus = :d`)
      ExpressionAttributeValues[':d'] = user.dndStatus
    }

    if (user.presence) {
      expressions.push(`presence = :presence`)
      ExpressionAttributeValues[':presence'] = user.presence
    }

    const params = {
      TableName,
      Key,
      UpdateExpression: `set ${expressions.join(', ')}`,
      ExpressionAttributeValues,
    }

    return new Promise((resolve, reject) => {
      this._connector.update({ TableName, Key, UpdateExpression, ExpressionAttributeValues }, (err, data) => {
        err ? reject(err) : resolve(true)
      })
    })
  }

  getActiveUsers = () => {
    const socketParams = {
      TableName: CONSTANTS.USER_TABLE,
      FilterExpression: 'accountType = :a', // optional
      ExpressionAttributeValues: { ':a': 'active' }, // optional
    }

    return new Promise(async (resolve, reject) => {
      this._connector.scan(socketParams, (err, data) => {
        err ? reject(err) : resolve(data.Items)
      })
    })
  }
}

const USERDB_CONNECTOR = new UserDbConnector()
module.exports = USERDB_CONNECTOR
