// module.exports = () => {
//     return {
//       onError: (handler, next) => next(),
//       before: (handler, next) => next(),
//       after: (handler, next) => {
//         const { body } = handler.response
//         if (typeof handler.response !== 'string') {
//           try {
//             stringifiedBody = JSON.stringify(body)
//             handler.response.body = stringifiedBody
//           } catch (e) {
//             const error = new createError.UnprocessableEntity(
//               `Error while attempting to stringify response object`,
//             )
//             error.details = e
//             error.response = handler.response
//             throw error
//           }
//         }
//         return next()
//       },
//     }
//   }

const jwt = require('jsonwebtoken')
const jwksClient = require('jwks-rsa')
// const auth0Domain = process.env.AUTH0_DOMAIN

const util = require('util')

const client = jwksClient({
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 10, // Default value
  jwksUri: process.env.JWKS_URI,
})

module.exports = (event, context, callback) => {
  console.log('AUTH')
  console.log(event)
  console.log('-------------')
  const token = getToken(event)

  const decoded = jwt.decode(token, { complete: true })
  if (!decoded || !decoded.header || !decoded.header.kid) {
    throw new Error('invalid token')
  }

  const getSigningKey = promisify(client.getSigningKey)
  return getSigningKey(decoded.header.kid)
    .then((key) => {
      const signingKey = key.publicKey || key.rsaPublicKey
      return jwt.verify(token, signingKey, jwtOptions)
    })
    .then((decoded) => ({
      principalId: decoded.sub,
      policyDocument: getPolicyDocument('Allow', params.methodArn),
      context: { scope: decoded.scope },
    }))
}

const getPolicyDocument = (effect, resource) => {
  const policyDocument = {
    Version: '2012-10-17', // default version
    Statement: [
      {
        Action: 'execute-api:Invoke', // default action
        Effect: effect,
        Resource: resource,
      },
    ],
  }
  return policyDocument
}

// extract and return the Bearer Token from the Lambda event parameters
const getToken = (params) => {
  if (!params.type || params.type !== 'TOKEN') {
    throw new Error('Expected "event.type" parameter to have value "TOKEN"')
  }

  const tokenString = params.authorizationToken
  if (!tokenString) {
    throw new Error('Expected "event.authorizationToken" parameter to be set')
  }

  const match = tokenString.match(/^Bearer (.*)$/)
  if (!match || match.length < 2) {
    throw new Error(
      `Invalid Authorization token - ${tokenString} does not match "Bearer .*"`,
    )
  }
  return match[1]
}

const jwtOptions = {
  audience: process.env.AUTH0_API_ID,
  issuer: process.env.JWKS_URI,
}

const promisify = (fn) => {
  return (...args) => {
    return new Promise((resolve, reject) => {
      function customCallback(err, ...results) {
        if (err) {
          return reject(err)
        }
        return resolve(results.length === 1 ? results[0] : results)
      }
      args.push(customCallback)
      fn.call(this, ...args)
    })
  }
}
