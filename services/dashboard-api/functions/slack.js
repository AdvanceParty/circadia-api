const { WebClient } = require('@slack/web-api')
const createError = require('http-errors')
const middy = require('middy')
const { stringifyResponse } = require('../middleware')
const {
  httpHeaderNormalizer,
  httpErrorHandler,
  jsonBodyParser,
  cors,
} = require('middy/middlewares')

const token = process.env.SLACK_BOT_TOKEN
const web = new WebClient(token)

const filterActiveMembers = members =>
  members.filter(member => !member.is_bot && !member.deleted)

const getSlackUsers = async (event, context, callback) => {
  const response = { body: {} }
  try {
    const slackData = await web.users.list()
    response.body.users = filterActiveMembers(slackData.members)
  } catch (e) {
    const error = new createError.BadRequest('Error getting users from Slack')
    error.details = e
    throw error
  }

  callback(null, response)
}

module.exports.userList = middy(getSlackUsers)
  .use(cors())
  .use(jsonBodyParser())
  .use(httpHeaderNormalizer())
  .use(stringifyResponse())
  .use(httpErrorHandler()) // must be last middleware
