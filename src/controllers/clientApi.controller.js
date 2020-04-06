const createError = require('http-errors')
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

module.exports.listUsers = listUsers
