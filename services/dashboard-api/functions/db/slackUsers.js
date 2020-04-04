const { updateItem, scanTable } = require('./crudDyanmodb')
const USERS_TABLE = process.env.USER_TABLE

const updateUser = (userId, user) => {
  const TableName = USERS_TABLE
  const Key = { id: userId }

  const expressions = []
  const ExpressionAttributeValues = {}

  if (user.profile) {
    expressions.push(`profile = :p`)
    ExpressionAttributeValues[':p'] = user.profile
  }

  if (user.accountType) {
    expressions.push(`accountType = :a`)
    ExpressionAttributeValues[':a'] = user.accountType
  }

  if (user.dndStatus) {
    expressions.push(`dndStatus = :d`)
    ExpressionAttributeValues[':d'] = user.dndStatus
  }

  if (user.presence) {
    expressions.push(`presence = :presence`)
    ExpressionAttributeValues[':presence'] = user.presence
  }

  const params = {
    TableName,
    Key,
    UpdateExpression: `set ${expressions.join(', ')}`,
    ExpressionAttributeValues,
  }

  return updateItem(params)
}

const getActiveUsers = () => {
  const params = {
    TableName: USERS_TABLE,
    FilterExpression: 'accountType = :a', // optional
    ExpressionAttributeValues: { ':a': 'active' }, // optional
  }

  return new Promise(async (resolve, reject) => {
    try {
      const data = await scanTable(params)
      resolve(data.Items)
    } catch (e) {
      reject(e)
    }
  })
}

module.exports.updateUser = updateUser
module.exports.getActiveUsers = getActiveUsers
