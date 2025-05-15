import fastifyPlugin from 'fastify-plugin'
import fastifyMongo from '@fastify/mongodb'

async function dbConnector (fastify, options) {
  fastify.register(fastifyMongo, {
    url: 'mongodb://mongodb:27017/dns',
    forceClose: true,
    auth: {
      username: "user",
      password: "user-secret"
    }
  })
}

export default fastifyPlugin(dbConnector)
