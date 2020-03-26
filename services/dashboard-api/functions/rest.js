'use strict'
const AWS = require('aws-sdk')
const USERS_TABLE = dbtable // process.env.USERS_TABLE
const dynamoDb = new AWS.DynamoDB.DocumentClient()
console.log(`tablename: ${USERS_TABLE}`)
module.exports.addUser = async (event, context, callback) => {
  const params = {
    TableName: USERS_TABLE,
    Item: {
      fullName: 'Bob',
      updatedAt: Date.now(),
    },
  }

  dynamoDb.put(params, (error, result) => {
    if (error) {
      console.error(error)
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: "Couldn't create the user item.",
      })
      return
    }

    console.log(result)

    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
      },
      body: JSON.stringify({
        ok: true,
        item: params.Item,
      }),
    }
    callback(null, response)
  })
}

module.exports.loadUser = async (event, context, callback) => {
  const params = {
    TableName: process.env.USERS_TABLE,
    ProjectionExpression: 'id, fullName, updatedAt',
  }

  console.log(`Scanning ${USERS_TABLE}`)

  const onScan = (error, data) => {
    if (error) {
      console.log(JSON.stringify(error, null, 2))
      callback(error)
    } else {
      console.log(`SUCCESS!`)
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          items: data.Items,
        }),
      })
    }
  }

  dynamoDb.scan(params, onScan)
}
