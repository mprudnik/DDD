'use strict';

const fastify = require('fastify')({ logger: false });
const cors = require('@fastify/cors');

module.exports = (logger) => (routing, port) => {
  fastify.register(cors, { 
    origin: '*',
    methods: 'GET, HEAD, POST',
    allowedHeaders: 'origin, content-type, accept',
    maxAge: 86400
  });

  const serviceNames = Object.keys(routing);
  for (const serviceName of serviceNames) {
    const service = routing[serviceName];
    fastify.register(generateFastifyService(service), { prefix: '/' + serviceName });
  }

  fastify.listen({ port }, function (err) {
    if (err) {
      logger.error(err);
      process.exit(1);
    }

    logger.log(`API on port ${port}`);
  })
}

const generateFastifyService = (service) => async (fastify) => {
  const methods = Object.keys(service);
  for (const method of methods) {
    const handler = service[method];
    fastify.post('/' + method, async (req, reply) => {      
      const result = await handler(...req.body);

      reply.statusCode = 200;
      reply.send(result.rows);
    });
  }
}
