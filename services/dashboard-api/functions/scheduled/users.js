const AWS = require('aws-sdk')
AWS.config.update({ region: process.env.REGION })
const dynamodb = new AWS.DynamoDB.DocumentClient({})

const { WebClient } = require('@slack/web-api')
const createError = require('http-errors')
const middy = require('middy')
const { stringifyResponse } = require('../../middleware')
const {
  httpHeaderNormalizer,
  httpErrorHandler,
  jsonBodyParser,
  cors,
} = require('middy/middlewares')

const token = process.env.SLACK_BOT_TOKEN
const web = new WebClient(token)

const getUserItemFromData = userData => {
  return {
    id: userData.id,
    updated: userData.updated,
    title: userData.profile.title || null,
    phone: userData.profile.phone || null,
    displayName: userData.profile.display_name || null,
    statusText: userData.profile.status_text || null,
    statusEmoji: userData.profile.status_emoji || null,
    images: {
      s: userData.profile.image_32,
      m: userData.profile.image_72,
      l: userData.profile.image_192,
    },
  }
}

const memberIsActive = member => !member.is_bot && !member.deleted
const putRecord = record => {
  return new Promise((resolve, reject) => {
    dynamodb.put(record, (err, data) => {
      err ? reject(err) : resolve(true)
    })
  })
}

const updateActiveMembers = async (event, context, callback) => {
  try {
    const slackData = await web.users.list()
    let count = 0
    let startTime = Date.now()
    await Promise.all(
      slackData.members.map(async member => {
        if (memberIsActive(member)) {
          const record = getUserItemFromData(member)
          const result = await putRecord({
            TableName: process.env.USER_TABLE,
            Item: record,
          })
          count += 1
        }
      }),
    )

    const duration = (Date.now() - startTime) / 1000
    console.log(`Saved ${count} records in ${duration} seconds`)
  } catch (e) {
    const error = new createError.BadRequest('Error getting users from Slack')
    error.details = e
    throw error
  }

  callback(null, { body: { recordCount: count, duration } })
}

module.exports.updateTable = middy(updateActiveMembers)
  .use(cors())
  .use(jsonBodyParser())
  .use(httpHeaderNormalizer())
  .use(stringifyResponse())
  .use(httpErrorHandler()) // must be last middleware
