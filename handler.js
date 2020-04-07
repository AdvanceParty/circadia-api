'use strict'
const withMiddleware = require('./src/middleware')

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

const { listUsers, sendMessage, ping } = require('./src/controllers/clientApi.controller')

exports.refreshSlackMemberPresence = withMiddleware(refreshSlackMemberPresence)
exports.refreshSlackMembers = withMiddleware(refreshSlackMembers)
exports.onSlackEvent = withMiddleware(onSlackEvent)
exports.sendMessage = withMiddleware(sendMessage)

exports.handleSocketConnect = handleSocketConnect
exports.handleSocketDisconnect = handleSocketDisconnect
exports.defaultSocketHandler = defaultSocketHandler

exports.listUsers = withMiddleware(listUsers)
exports.ping = withMiddleware(ping)
