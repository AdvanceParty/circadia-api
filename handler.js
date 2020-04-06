'use strict'
const withMiddleware = require('./src/middleware')

const { sendMessage } = require('./src/controllers/clientWsApi.controller')
const { defaultSocketHandler, handleSocketConnect, handleSocketDisconnect } = require('./src/controllers/websocket.controller')

const { refreshSlackMembers, refreshSlackMemberPresence } = require('./src/controllers/slackApi.controller')
const { listUsers } = require('./src/controllers/clientApi.controller')

module.exports.refreshSlackMemberPresence = withMiddleware(refreshSlackMemberPresence)
module.exports.refreshSlackMembers = withMiddleware(refreshSlackMembers)
module.exports.listUsers = withMiddleware(listUsers)
module.exports.sendMessage = withMiddleware(sendMessage)

module.exports.handleSocketConnect = handleSocketConnect
module.exports.handleSocketDisconnect = handleSocketDisconnect
module.exports.defaultSocketHandler = defaultSocketHandler

// module.exports.greeting = greeting
