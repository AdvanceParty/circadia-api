const createError = require('http-errors')
// const { getActiveUsers } = require('../functions/db/slackUsers')
const userdbConnector = require('../connector/userdb.connector')

const listUsers = async (event, context, callback) => {
  let users = []
  let error = null

  try {
    users = await userdbConnector.getActiveUsers()
  } catch (e) {
    console.error(e)
    error = createError.InternalServerError('Error retrieving user list')
  }

  return { body: { error, users } }
}

// const listPresences = async (event, context, callback) => {
// let items = []
// let error = null

// try {
//   // call the func!
// } catch (e) {
//   console.error(e)
//   error = createError.InternalServerError('Error retrieving user list')
// }

// callback(null, { body: { items, error } })
// }

// module.exports.listUsers = withMiddleware(listUsers)
module.exports.listUsers = listUsers
