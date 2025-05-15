import dnsRoutes from './dnsRoutes.js';

export default async function routes(fastify, options) {
  fastify.register(dnsRoutes, { prefix: '/dns' });
}