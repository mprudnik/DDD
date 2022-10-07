'use strict';

module.exports = {
  static: {
    port: 8000,
  },
  api: {
    port: 8001,
  },
  db: {
    host: '127.0.0.1',
    port: 5432,
    database: 'example',
    user: 'marcus',
    password: 'marcus',
  },
  transport: 'http', // http || ws
  framework: 'native', // native || fastify
  logger: 'custom', // custom || pino
};
