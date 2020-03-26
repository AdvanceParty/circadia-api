'use strict'

const uuid = require('uuid')
const AWS = require('aws-sdk') // eslint-disable-line import/no-extraneous-dependencies

AWS.config.update({ region: 'ap-southeast-2' })
// const dynamoDb = new AWS.DynamoDB.DocumentClient()
// dynamoDb.setSignerRegionOverride('ap-southeast-2')
const dynamoDb = new AWS.DynamoDB({ region: 'ap-southeast-2' })

module.exports.create = async (event, context, callback) => {
  // const timestamp = new Date().getTime()
  let error, params, data
  let statusCode = 200

  try {
    data = JSON.parse(event.body)
    const { userName, userId } = data
    params = {
      TableName: process.env.USER_TABLE,
      Item: {
        userId: {
          S: userId,
        },
        userName: {
          S: userName,
        },
      },
    }
  } catch (e) {
    console.error(`Could not parse requested JSON ${event.body}: ${e.stack}`)
    return {
      statusCode: 500,
      error: `Could not parse requested JSON ${event.body}: ${e.stack}`,
    }
  }

  return await new Promise((resolve, reject) => {
    dynamoDb.putItem(params, (error, data) => {
      if (error) {
        console.log(`Error: ${error.stack}`)
        resolve({
          statusCode: 400,
          error: `Error: ${error.stack}`,
        })
      } else {
        console.log(`Success: ${JSON.stringify(data)}`)
        resolve({ statusCode: 200, body: JSON.stringify(params.Item) })
      }
    })
  })

  // if (data) {
  // }

  // if (typeof data.text !== 'string') {
  //   console.error('Validation Failed')
  //   callback(null, {
  //     statusCode: 400,
  //     headers: { 'Content-Type': 'text/plain' },
  //     body: "Couldn't create the todo item.",
  //   })
  //   return
  // }

  // const params = {
  //   TableName: process.env.DYNAMODB_TABLE,
  //   Item: {
  //     id: uuid.v1(),
  //     text: data.text,
  //     checked: false,
  //     createdAt: timestamp,
  //     updatedAt: timestamp,
  //   },
  // }

  // // write the todo to the database
  // dynamoDb.put(params, error => {
  //   // handle potential errors
  //   if (error) {
  //     console.error(error)
  //     callback(null, {
  //       statusCode: error.statusCode || 501,
  //       headers: { 'Content-Type': 'text/plain' },
  //       body: "Couldn't create the todo item.",
  //     })
  //     return
  //   }

  // create a response
  // const response = {
  //   statusCode: 200,
  //   body: JSON.stringify(event),
  // }
  // callback(null, response)
  // })
}
