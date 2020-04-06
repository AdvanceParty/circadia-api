const { WebClient } = require('@slack/web-api')
const userdbConnector = require('../connector/userdb.connector')

// Models
const User = require('../model/User')
const UserProfile = require('../model/UserProfile')
const UserPresence = require('../model/UserPresence')

const CONSTANTS = require('../constants')

const web = new WebClient(CONSTANTS.SLACK_TOKEN)

const refreshSlackMembers = async (event, context, callback) => {
  const slackData = await web.users.list()
  const { members } = slackData

  console.log(slackData)

  try {
    const updateUserPromises = members.map((member) => {
      const record = new User()
      record.accountType = member.is_bot ? 'bot' : member.deleted ? 'deleted' : 'active'
      record.profile = new UserProfile().setData(member.profile)
      return userdbConnector.updateUser(member.id, record)
    })
    Promise.all(updateUserPromises)
  } catch (e) {
    console.error(`error updating slack users: ${e.message}`)
  }

  // callback(null, { body: { recordCount: activeMembers.length } })
  return { body: { recordCount: activeMembers.length } }
}

const refreshSlackMemberPresence = async (event, context, callback) => {
  let result
  let error

  try {
    users = await userdbConnector.getActiveUsers()

    const promises = users.map((userData) => {
      // get member's presence from slack API
      return web.users.getPresence({ user: userData.id }).then((slackData) => {
        if (slackData.ok) {
          // update member's db record with latest presence
          const record = new User()
          record.presence = new UserPresence().setData(slackData)
          userdbConnector.updateUser(userData.id, record)
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
  return { body: { result, error } }
}

module.exports.refreshSlackMembers = refreshSlackMembers
module.exports.refreshSlackMemberPresence = refreshSlackMemberPresence
