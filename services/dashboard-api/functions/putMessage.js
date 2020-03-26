const AWS = require('aws-sdk')
const uuid = require('uuid')
const dynamodb = new AWS.DynamoDB()

module.exports.putMessage = (event, context, callback) => {
  let message = ''
  if (event.body) {
    message = JSON.parse(event.body).message
  } else {
    message = event.message
  }
  dynamodb.putItem(
    {
      TableName: process.env.USER_TABLE,
      Item: {
        id: {
          S: uuid.v4(),
        },
        message: {
          S: message,
        },
      },
    },
    (err, data) => {
      if (err) {
        callback(null, {
          statusCode: 400,
          body: JSON.stringify({ error: err }),
        })
      } else {
        callback(null, {
          statusCode: 200,
          body: JSON.stringify({ status: 'success' }),
        })
      }
    },
  )
}
