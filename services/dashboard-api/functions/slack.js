const { WebClient } = require('@slack/web-api')

module.exports.userList = async (event, context, callback) => {
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
