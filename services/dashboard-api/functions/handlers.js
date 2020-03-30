const createError = require('http-errors')
const middy = require('middy')
const { stringifyResponse } = require('../middleware')
const {
  httpHeaderNormalizer,
  httpErrorHandler,
  jsonBodyParser,
  cors,
} = require('middy/middlewares')

const { scanTable } = require('./db/crudDyanmodb')

const listUsers = async (event, context, callback) => {
  let items = []
  let error = null

  try {
    const data = await scanTable({ TableName: process.env.USER_PROFILES_TABLE })
    items = data.Items.map(item => ({ id: item.id, item }))
  } catch (e) {
    console.error(e)
    error = createError.InternalServerError('Error retrieving user list')
  }

  callback(null, { body: { items, error } })
}

module.exports.listUsers = middy(listUsers)
  .use(cors())
  .use(jsonBodyParser())
  .use(httpHeaderNormalizer())
  .use(stringifyResponse())
  .use(httpErrorHandler()) // must be last middleware
