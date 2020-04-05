const AWS = require('aws-sdk')
AWS.config.update({ region: process.env.REGION })
const dynamodb = new AWS.DynamoDB.DocumentClient({})

const queryTable = params => {
  return new Promise((resolve, reject) => {
    dynamodb.query(params, (err, data) => {
      err ? reject(err) : resolve(data)
    })
  })
}

const getItem = ({ TableName, Key }) => {
  return new Promise((resolve, reject) => {
    dynamodb.get({ TableName, Key }, (err, data) => {
      err ? reject(err) : resolve(data)
    })
  })
}

const putItem = ({ TableName, Item }) => {
  return new Promise((resolve, reject) => {
    dynamodb.put({ TableName, Item }, (err, data) => {
      err ? reject(err) : resolve(true)
    })
  })
}

const deleteItem = ({ TableName, Key }) => {
  return new Promise((resolve, reject) => {
    dynamodb.delete({ TableName, Key }, (err, data) => {
      err ? reject(err) : resolve(true)
    })
  })
}

const updateItem = ({
  TableName,
  Key,
  UpdateExpression,
  ExpressionAttributeValues,
}) => {
  return new Promise((resolve, reject) => {
    dynamodb.update(
      { TableName, Key, UpdateExpression, ExpressionAttributeValues },
      (err, data) => {
        err ? reject(err) : resolve(true)
      },
    )
  })
}

const scanTable = params => {
  return new Promise((resolve, reject) => {
    dynamodb.scan(params, (err, data) => {
      err ? reject(err) : resolve(data)
    })
  })
}

module.exports.getItem = getItem
module.exports.putItem = putItem
module.exports.deleteItem = deleteItem
module.exports.updateItem = updateItem
module.exports.scanTable = scanTable
module.exports.queryTable = queryTable
