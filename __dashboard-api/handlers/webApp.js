const createError = require('http-errors')
const withMiddleware = require('./middleware')

const { getActiveUsers } = require('../functions/db/slackUsers')

const listUsers = async (event, context, callback) => {
  let users = []
  let error = null

  try {
    users = await getActiveUsers()
  } catch (e) {
    console.error(e)
    error = createError.InternalServerError('Error retrieving user list')
  }

  callback(null, { body: { error, users } })
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

module.exports.listUsers = withMiddleware(listUsers)
