'use strict'
const withMiddleware = require('./src/middleware')

const { auth } = require('./src/controllers/auth.controller')
const {
  defaultSocketHandler,
  handleSocketConnect,
  handleSocketDisconnect,
} = require('./src/controllers/websocket.controller')

const {
  refreshSlackMembers,
  refreshSlackMemberPresence,
  onSlackEvent,
} = require('./src/controllers/slackApi.controller')

const { listUsers, sendMessage } = require('./src/controllers/clientApi.controller')

exports.refreshSlackMemberPresence = withMiddleware(refreshSlackMemberPresence)
exports.refreshSlackMembers = withMiddleware(refreshSlackMembers)
exports.onSlackEvent = withMiddleware(onSlackEvent)
exports.sendMessage = withMiddleware(sendMessage)
exports.listUsers = withMiddleware(listUsers)

exports.handleSocketConnect = handleSocketConnect
exports.handleSocketDisconnect = handleSocketDisconnect
exports.defaultSocketHandler = defaultSocketHandler
exports.auth = auth
