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
    fastify.register(generateService(service), { prefix: '/' + serviceName });
  }

  fastify.listen({ port }, function (err) {
    if (err) {
      logger.error(err);
      process.exit(1);
    }

    logger.log(`API on port ${port}`);
  })
}

const generateService = (service) => async (fastify) => {
  const methods = Object.keys(service);
  for (const method of methods) {
    const handler = service[method];
    const src = handler.toString();
    const signature = src.substring(0, src.indexOf(')'));
    const requiresId = signature.includes('(id');
    const requiresBody = signature.includes('{');
    let path = '/' + method;
    if (requiresId) path += method === 'read' ? '/:id?' : '/:id';
    fastify.post(path, async (req, reply) => {
      const args = [];
      if (requiresId) args.push(req.params.id);
      if (requiresBody) args.push(...req.body);
      
      const result = await handler(...args);

      reply.statusCode = 200;
      reply.send(result.rows);
    });
  }
}
