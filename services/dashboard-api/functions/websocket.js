'use strict'

module.exports.socket = async (event, context) => {
  const {
    requestContext: { routeKey },
  } = event
  switch (routeKey) {
    case '$connect':
      //
      break

    case '$disconnect':
      //
      break

    case 'routeA':
      //
      break

    case '$default':
    default:
    //
  }

  // Return a 200 status to tell API Gateway the message was processed
  // successfully.
  // Otherwise, API Gateway will return a 500 to the client.
  return { statusCode: 200 }
}
