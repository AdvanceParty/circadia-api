const { WebClient } = require('@slack/web-api')
const middy = require('middy')
const {
  httpHeaderNormalizer,
  httpErrorHandler,
  jsonBodyParser,
  cors,
  stringifyResponse,
} = require('../../../middleware')

const { updateUserList, updateUserProperty } = require('../../db/slackUsers')
const UserProfile = require('../../model/UserProfile')

const memberIsActive = member => !member.is_bot && !member.deleted

const fetchActiveMembers = async (event, context, callback) => {
  const token = process.env.SLACK_BOT_TOKEN
  const web = new WebClient(token)

  const slackData = await web.users.list()
  const { members } = slackData
  const activeMembers = []
  const updateUserPromises = []

  try {
    members.map(member => {
      if (memberIsActive(member)) {
        const record = new UserProfile().setData(member.profile)
        activeMembers.push(member.id)
        updateUserPromises.push(
          updateUserProperty(member.id, 'profile', record),
        )
      }
    })
    Promise.all([updateUserList(activeMembers), ...updateUserPromises])
  } catch (e) {
    console.error(`error updating slack users: ${e.message}`)
  }

  callback(null, { body: { recordCount: activeMembers.length } })
}

module.exports.fetch = middy(fetchActiveMembers)
  .use(cors())
  .use(jsonBodyParser())
  .use(httpHeaderNormalizer())
  .use(stringifyResponse())
  .use(httpErrorHandler()) // must be last middleware
