const { WebClient } = require('@slack/web-api')
const userdbConnector = require('../connector/userdb.connector')

// Models
const User = require('../model/User')
const UserProfile = require('../model/UserProfile')
const UserPresence = require('../model/UserPresence')

const CONSTANTS = require('../constants')

const web = new WebClient(CONSTANTS.SLACK_TOKEN)

const headers = {
  'Content-Type': 'text/plain',
  'Access-Control-Allow-Origin': CONSTANTS.CORS_ORIGIN,
}

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

// import verifyMessageOrigin from './_utils/verifyMessageOrigin';
// import User from './_classes/User'

// module.exports = async (req, res) => {
//   // ensure the message has originated from
//   // an authorised slack channel
//   // see https://api.slack.com/docs/verifying-requests-from-slack
//   // skipping during dev until I can figure out why my hash
//   // isn't matching the expected result.

//   const skipOriginVerification = true;

//   if (!skipOriginVerification && !verifyMessageOrigin(req)) {
//     console.log('Verification failed');
//     res.writeHead(403, { 'Content-Type': 'text/html' });
//     res.end('Forbidden. Message origin could not be verified.');
//     return;
//   } else {
//     if (req.body.event) {
//       onSlackEvent(req.body.event);
//     }
//     res.writeHead(200, { 'Content-Type': 'text/plain' });
//     res.end('');
//   }
// };

const onSlackEvent = async (event, context, callback) => {
  console.log(event.body)

  const body = {}
  const type = event.body.type

  switch (type) {
    case 'url_verification':
      body.challenge = event.body.challenge
      break
    case 'user_change':
      onUserChange(event)
      break
    case 'dnd_updated_user':
      onDndUpdatedUser(event)
      break
    case 'presence_change':
      onPresenceUpdatedUser(event)
      break
    default:
      console.log(`Igonoring ${event.type} event from Slack`)
      break
  }

  return { status: 200, headers, body }
}

const onUserChange = (event) => {
  const user = new User(event.user)
  console.log(`${user.displayName} | ${user.statusText} | ${user.statusEmoji}`)
}

const onDndUpdatedUser = (event) => {
  // EVENT OBJECT EXAMPLE:
  // {
  //   type: 'dnd_updated_user',
  //   user: 'U94DFU1FX',
  //   dnd_status: {
  //     dnd_enabled: true,
  //     next_dnd_start_ts: 1584586995,
  //     next_dnd_end_ts: 1584590595
  //   },
  //   event_ts: '1584586996.075000'
  // }

  console.log(event)
  console.log('DO NOT DISTURB UPDATED!')
}

const onPresenceUpdatedUser = (event) => {
  // EVENT OBJECT EXAMPLE:
  // {
  //   type: 'dnd_updated_user',
  //   user: 'U94DFU1FX',
  //   dnd_status: {
  //     dnd_enabled: true,
  //     next_dnd_start_ts: 1584586995,
  //     next_dnd_end_ts: 1584590595
  //   },
  //   event_ts: '1584586996.075000'
  // }

  console.log(event)
  console.log('Presence Change!')
}

module.exports.refreshSlackMembers = refreshSlackMembers
module.exports.refreshSlackMemberPresence = refreshSlackMemberPresence
module.exports.onSlackEvent = onSlackEvent
