const AWS = require('aws-sdk')
AWS.config.update({ region: process.env.REGION })
const dynamodb = new AWS.DynamoDB.DocumentClient({})

const { RTMClient } = require('@slack/web-api')
// const createError = require('http-errors')
// const middy = require('middy')
// const { stringifyResponse } = require('../../../middleware')
// const {
//   httpHeaderNormalizer,
//   httpErrorHandler,
//   jsonBodyParser,
//   cors,
// } = require('middy/middlewares')

const token = process.env.SLACK_BOT_TOKEN
const web = new WebClient(token)

const getRtmURL = async () => {}

const connect = async (event, context, callback) => {
  callback(null, { body: { recordCount: count, duration } })
}

module.exports.connect = middy(connect)
  .use(cors())
  .use(jsonBodyParser())
  .use(httpHeaderNormalizer())
  .use(stringifyResponse())
  .use(httpErrorHandler()) // must be last middleware
