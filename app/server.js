// Import the framework and instantiate it
import Fastify from 'fastify'
// import routes from './routes/routes.js';
import dbConnector from './configs/db-connector.js';
import routes from './routes/routes.js';

const fastify = Fastify({
  logger: true
})

// Declare database connection
fastify.register(dbConnector);

// Declare a route
fastify.register(routes, {prefix: '/api'});

// Run the server!
try {
  await fastify.listen({ port: 3000, host: '0.0.0.0' }) // for docker
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}
