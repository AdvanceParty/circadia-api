const AWS = require('aws-sdk')
AWS.config.update({ region: process.env.REGION })
const dynamodb = new AWS.DynamoDB.DocumentClient({})

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

//  = null, userDndStatus = null, userPresence = null

// const updateUserProfile = (userId, userProfile) => {
//     const TableName = process.env.USER_PROFILES_TABLE
//     const Key = {id: userId};
//     const UpdateExpression = 'set profile = :p';
//     const ExpressionAttributeValues = {':p' : userProfile};
//     return updateRecord({TableName, Key, UpdateExpression, ExpressionAttributeValues})
// }

// const updateUserDndStatus = (userId, userDndStatus) => {
//     const TableName = process.env.USER_PROFILES_TABLE
//     const Key = {id: userId};
//     const UpdateExpression = 'set dndStatus = :d';
//     const ExpressionAttributeValues = {':d' : userDndStatus};
//     return updateRecord({TableName, Key, UpdateExpression, ExpressionAttributeValues})
//   }

const putRecord = ({ TableName, Item }) => {
  return new Promise((resolve, reject) => {
    dynamodb.put({ TableName, Item }, (err, data) => {
      err ? reject(err) : resolve(true)
    })
  })
}

const updateRecord = ({
  TableName,
  Key,
  UpdateExpression,
  ExpressionAttributeValues,
}) => {
  return new Promise((resolve, reject) => {
    dynamodb.update(
      { TableName, Key, UpdateExpression, ExpressionAttributeValues },
      (err, data) => {
        err ? reject(err) : resolve(true)
      },
    )
  })
}

module.exports.updateUserList = updateUserList
module.exports.updateUserProperty = updateUserProperty
