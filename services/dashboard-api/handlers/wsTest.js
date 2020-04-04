const helper = require('./helper')

module.exports.wsConnectionHandler = (event, context, callback) => {
  // console.log('*****************')
  // console.log(event.queryStringParameters)
  // console.log('----------------------')

  if (event.requestContext.routeKey === '$connect') {
    const userId = event.queryStringParameters.userId
    const connectionId = event.requestContext.connectionId
    console.log(event)
    helper
      .storeConnection({ userId, connectionId })
      .then(() => {
        callback(null, { statusCode: 200, body: `welcome ${userId}` })
      })
      .catch(error => {
        console.log(error)
        callback(null, JSON.stringify(error))
      })
  } else if (event.requestContext.routeKey === '$disconnect') {
    const connectionId = event.requestContext.connectionId

    helper
      .deleteConnection({ connectionId })
      .then(() => {
        callback(null, { statusCode: 200, body: 'bye!' })
      })
      .catch(error => {
        console.log(error)
        callback(null, {
          statusCode: 500,
          body: JSON.stringify(error),
        })
      })
  }
}

module.exports.wsDefaultHandler = (event, context, callback) => {
  callback(null, {
    statusCode: 200,
    body: 'wsDefaultHandler',
  })
}

module.exports.wsSendMessageHandler = (event, context, callback) => {
  console.log(event)

  helper
    .sendMessage(event)
    .then(() => {
      callback(null, { statusCode: 200, body: 'message sent' })
    })
    .catch(error => {
      console.log(error)
      callback(null, JSON.stringify(error))
    })
}

// ----------------------------------------------------
// const AWS = require('aws-sdk')
// const { getConnections } = require('../functions/db/websocket')

// require('./patch.js')

// let send = undefined

// function init(event) {
//   console.log(event)

//   const apigwManagementApi = new AWS.ApiGatewayManagementApi({
//     apiVersion: '2018-11-29',
//     endpoint:
//       event.requestContext.domainName + '/' + event.requestContext.stage,
//   })

//   send = async (connectionId, data) => {
//     console.log('send ' + connectionId, data)
//     await apigwManagementApi
//       .postToConnection({
//         ConnectionId: connectionId,
//         Data: `Echo: ${data}`,
//       })
//       .promise()
//   }
// }

// exports.handler = (event, context, callback) => {
//   console.log('HANDLE FOO')
//   init(event)
//   let message = JSON.parse(event.body).message
//   getConnections().then(data => {
//     console.log(data.Items)
//     data.Items.forEach(function(connection) {
//       console.log(connection)
//       send(connection.connectionId, message)
//     })
//   })
//   return {}
// }
