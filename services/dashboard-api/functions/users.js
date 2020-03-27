const AWS = require('aws-sdk')
AWS.config.update({ region: process.env.REGION })
const dynamodb = new AWS.DynamoDB.DocumentClient({})

const createError = require('http-errors')
const middy = require('middy')
const { stringifyResponse } = require('../middleware')
const {
  httpHeaderNormalizer,
  httpErrorHandler,
  jsonBodyParser,
  cors,
} = require('middy/middlewares')

const listUsers = (event, context, callback) => {
  dynamodb.scan({ TableName: process.env.USER_TABLE }, (e, data) => {
    if (e) {
      const error = createError.InternalServerError(
        'Error retrieving user list',
      )
      error.details = e
      throw e
    } else {
      const result = data.Items.map(item => ({ id: item.id, item }))
      callback(null, { body: result })
    }
  })
}

module.exports.list = middy(listUsers)
  .use(cors())
  .use(jsonBodyParser())
  .use(httpHeaderNormalizer())
  .use(stringifyResponse())
  .use(httpErrorHandler()) // must be last middleware
