'use strict'
const withMiddleware = require('./src/middleware')

const { defaultSocketHandler, handleSocketConnect, handleSocketDisconnect } = require('./src/controllers/websocket.controller')
const { refreshSlackMembers, refreshSlackMemberPresence, onSlackEvent } = require('./src/controllers/slackApi.controller')
const { listUsers, sendMessage } = require('./src/controllers/clientApi.controller')

module.exports.refreshSlackMemberPresence = withMiddleware(refreshSlackMemberPresence)
module.exports.refreshSlackMembers = withMiddleware(refreshSlackMembers)
module.exports.onSlackEvent = withMiddleware(onSlackEvent)
module.exports.listUsers = withMiddleware(listUsers)
module.exports.sendMessage = withMiddleware(sendMessage)

module.exports.handleSocketConnect = handleSocketConnect
module.exports.handleSocketDisconnect = handleSocketDisconnect
module.exports.defaultSocketHandler = defaultSocketHandler
