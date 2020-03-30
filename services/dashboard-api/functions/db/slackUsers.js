const { putRecord, updateRecord } = require('./crudDyanmodb')

/**
 *
 * @param {Array} userList array of userId strings ['id_1','id_2...'id_n']
 * @returns {Promise} resolve to true if successul, or throws error on fail.
 */
const updateUserList = userList => {
  const TableName = process.env.USER_TABLE
  const Item = { id: 'activeUsers', userList }
  return putRecord({ TableName, Item })
}

const updateUserProperty = (userId, propName, object) => {
  // const TableName = process.env.USER_TABLE
  const TableName = process.env.USER_PROFILES_TABLE
  const Key = { id: userId }
  const UpdateExpression = `set ${propName} = :n`
  const ExpressionAttributeValues = { ':n': object }
  return updateRecord({
    TableName,
    Key,
    UpdateExpression,
    ExpressionAttributeValues,
  })
}

module.exports.updateUserList = updateUserList
module.exports.updateUserProperty = updateUserProperty
