const AWS = require('aws-sdk')
AWS.config.update({ region: process.env.REGION })
const dynamodb = new AWS.DynamoDB.DocumentClient({})

const putRecord = ({ TableName, Item }) => {
  return new Promise((resolve, reject) => {
    dynamodb.put({ TableName, Item }, (err, data) => {
      err ? reject(err) : resolve(true)
    })
  })
}

const updateRecord = ({
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

const queryTable = () => {
  // todo
}

const scanTable = ({ TableName }) => {
  return new Promise((resolve, reject) => {
    dynamodb.scan({ TableName }, (err, data) => {
      err ? reject(err) : resolve(data)
    })
  })
}

module.exports.putRecord = putRecord
module.exports.updateRecord = updateRecord
module.exports.scanTable = scanTable
