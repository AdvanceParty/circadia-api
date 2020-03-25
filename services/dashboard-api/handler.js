'use strict'

const { WebClient } = require('@slack/web-api')

// import authenticateRequest from './_utils/authenticateRequest';
// import { forbidden } from './_responses/forbidden';

// module.exports.getUsers = async event => {
//   const token = process.env.SLACK_BOT_TOKEN
//   const web = new WebClient(token)
//   const result = await web.users.list()

//   return {
//     statusCode: 200,
//     body: JSON.stringify(result, null, 2),
//   }
// }

module.exports.users = async (event, context, callback) => {
  const token = process.env.SLACK_BOT_TOKEN
  const web = new WebClient(token)
  const result = await web.users.list()
  const users = result.members.filter(
    member => !member.is_bot && !member.deleted,
  )

  console.log(users.length)

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
    },
    body: JSON.stringify({
      ok: true,
      users,
    }),
  }
  callback(null, response)
}
