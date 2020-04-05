'use strict'

const CONSTANTS = {
  // DYNAMODB_SOCKETS_TABLE: process.env.DYNAMODB_SOCKETS_TABLE,
  // KEYS_URL: process.env.KEYS_URL,
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  REGION: process.env.REGION,

  USER_TABLE: process.env.USER_TABLE,
  WS_CONNECTIONS_TABLE: process.env.WS_CONNECTIONS_TABLE,
  WEBSOCKET_API_ENDPOINT: process.env.WEBSOCKET_API_ENDPOINT,
  DYNAMODB_OPTIONS: {},

  SLACK_TOKEN: process.env.SLACK_BOT_TOKEN,
}

module.exports = CONSTANTS
