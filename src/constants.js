'use strict'

const CONSTANTS = {
  OFFLINE: process.env.OFFLINE,
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  REGION: process.env.REGION,
  USER_TABLE: process.env.USER_TABLE,
  WS_CONNECTIONS_TABLE: process.env.WS_CONNECTIONS_TABLE,
  WEBSOCKET_API_ENDPOINT: process.env.WEBSOCKET_API_ENDPOINT,
  DYNAMODB_OPTIONS: {},
  SLACK_TOKEN: process.env.SLACK_BOT_TOKEN,
  RESPONSE_HEADERS: {
    // 'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Headers': 'X-Requested-With',
  },
  SLACK_MAX_REQUESTS_PER_MINUTE: 48,
}

module.exports = CONSTANTS
