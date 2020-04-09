const { WebClient } = require('@slack/web-api')
const userdbConnector = require('../connector/userdb.connector')
const wsGatewayConnector = require('../connector/wsGateway.connector')
const Throttler = require('../util/Throttler')

// Models
const User = require('../model/User')
const UserProfile = require('../model/UserProfile')
const UserPresence = require('../model/UserPresence')
const UserDnDStatus = require('../model/UserDnDStatus')

const CONSTANTS = require('../constants')
const web = new WebClient(CONSTANTS.SLACK_TOKEN)

const refreshSlackMembers = async (event, context, callback) => {
  const slackData = await web.users.list()
  console.log('Get member list')
  const { members } = slackData
  console.log('   Members count ' + members.length)

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
  console.log('Refreshing Member Presence')
  // callback(null, { body: { recordCount: activeMembers.length } })
  return { body: 'Refreshing member list' }
}

const refreshSlackMemberPresence = async (event, context, callback) => {
  users = await userdbConnector.getActiveUsers()

  Promise.all(
    users.map(async (user) => {
      const slackData = await web.users.getPresence({ user: user.id })

      if (presenceIsDifferent(user, slackData)) {
        const record = new User()
        record.presence = new UserPresence().setData(slackData)
        userdbConnector.updateUser(user.id, record)
        wsGatewayConnector.emitToAll({
          event: 'user_presence_change',
          userId: user.id,
          data: record.presence,
        })
      }
    }),
    // .then(result => {
    // })
  )

  // use the throttler class to queue up all the calls
  // and ensure we don't exceed the API rate limit

  // const throttler = new Throttler({
  //   items: users,
  //   requestFunction: updateUserPresenceIfChanged,
  // })

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
  const eventObj = event.body ? event.body.event || event.body : {}
  const type = eventObj.type || null

  let body = {}
  body.event = type

  try {
    switch (type) {
      case 'user_change':
        body.data = onUserChange(eventObj)
        break
      case 'dnd_updated_user':
        body.data = onDndUpdatedUser(eventObj)
        break
      case 'url_verification':
        // overwrite normal body object with specific format
        // required by slack enddpoint validation.
        // see https://api.slack.com/events/url_verification
        body = handleSlackEndpointVerification(eventObj)
        break
      default:
        console.warn(`Ignoring ${type} event from Slack`)
        break
    }
  } catch (e) {
    console.error(e)
  }

  return { body }
}

const handleSlackEndpointVerification = ({ challenge }) => {
  return { challenge }
}

const onUserChange = async (event) => {
  const record = new User()
  record.profile = new UserProfile().setData(event.user.profile)

  try {
    await userdbConnector.updateUser(event.user.id, record)
    wsGatewayConnector.emitToAll({
      event: 'user_profile_change',
      userId: event.user.id,
      data: record.profile,
    })
  } catch (e) {
    console.error(e)
  }

  return { user: event.user.id }
}

const onDndUpdatedUser = async (event) => {
  console.log(`DoNoDisturb updated for ${event.user}`, event)

  const { user, dnd_status } = event
  const record = new User()
  record.dndStatus = new UserDnDStatus().setData(dnd_status)

  try {
    await userdbConnector.updateUser(user, record)
    wsGatewayConnector.emitToAll({
      event: 'user_dnd_change',
      userId: user,
      data: record.dndStatus,
    })
  } catch (e) {
    console.error(e)
  }
  return { user }
}

// const updateUserPresenceIfChanged = async (user) => {
//   if (presenceIsDifferent(user, slackData)) {
//     const record = new User()
//     record.presence = new UserPresence().setData(slackData)
//     userdbConnector.updateUser(user.id, record)
//     wsGatewayConnector.emitToAll({
//       event: 'user_presence_change',
//       userId: user.id,
//       data: record.presence,
//     })
//   }
// }

// const updateUserPresenceIfChanged = async (user) => {
//   try {
//     const slackData = await web.users.getPresence({ user: user.id })

//     if (presenceIsDifferent(user, slackData)) {
//       const record = new User()
//       record.presence = new UserPresence().setData(slackData)
//       userdbConnector.updateUser(user.id, record)
//       wsGatewayConnector.emitToAll({
//         event: 'user_presence_change',
//         userId: user.id,
//         data: record.presence,
//       })
//     }
//   } catch (e) {
//     console.error(`Error fetching presence info from member ${user.id}`, e)
//   }
// }

const presenceIsDifferent = (user, slackData) => {
  const dbState = user.presence ? user.presence.presence : null
  const slackState = slackData.presence
  return dbState !== slackState
}

module.exports.refreshSlackMembers = refreshSlackMembers
module.exports.refreshSlackMemberPresence = refreshSlackMemberPresence
module.exports.onSlackEvent = onSlackEvent
