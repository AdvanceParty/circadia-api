const { WebClient } = require('@slack/web-api')
const withMiddleware = require('./middleware')

// DB Functions
const { updateUser, getActiveUsers } = require('../functions/db/slackUsers')

// Models
const User = require('../model/User')
const UserProfile = require('../model/UserProfile')
const UserPresence = require('../model/UserPresence')

// Slack API object
const token = process.env.SLACK_BOT_TOKEN
const web = new WebClient(token)

const fetchAllMembers = async (event, context, callback) => {
  const slackData = await web.users.list()
  const { members } = slackData

  try {
    const updateUserPromises = members.map(member => {
      const record = new User()
      record.accountType = member.is_bot
        ? 'bot'
        : member.deleted
        ? 'deleted'
        : 'active'
      record.profile = new UserProfile().setData(member.profile)
      return updateUser(member.id, record)
    })
    Promise.all(updateUserPromises)
  } catch (e) {
    console.error(`error updating slack users: ${e.message}`)
  }

  callback(null, { body: { recordCount: activeMembers.length } })
}

const fetchAllMemberPresence = async (event, context, callback) => {
  let result
  let error

  try {
    users = await getActiveUsers()

    const promises = users.map(userData => {
      // get member's presence from slack API
      return web.users.getPresence({ user: userData.id }).then(slackData => {
        if (slackData.ok) {
          // update member's db record with latest presence
          const record = new User()
          record.presence = new UserPresence().setData(slackData)
          updateUser(userData.id, record)
        }
      })
    })
    result = `Updated ${promises.length} presence objects.`
    Promise.all(promises)
  } catch (e) {
    console.error(`Error getting member presence info: ${e.message}`)
    error = e
  }
  // callback to request originator
  callback(null, { body: { result, error } })
}

module.exports.fetchAllMembers = withMiddleware(fetchAllMembers)
module.exports.fetchAllPresence = withMiddleware(fetchAllMemberPresence)
