const { putItem, deleteItem, scanTable } = require('./crudDyanmodb')
const TABLE = process.env.WS_CONNECTIONS_TABLE

const addConnection = connectionId => {
  return putItem({ TableName: TABLE, Item: { connectionId } })
}

const removeConnection = connectionId => {
  return deleteItem({ TableName: TABLE, Key: { connectionId } })
}

const getConnections = () => {
  return scanTable({ TableName: TABLE })
}

module.exports.addConnection = addConnection
module.exports.removeConnection = removeConnection
module.exports.getConnections = getConnections
