'use strict';

const fsp = require('node:fs').promises;
const path = require('node:path');
const config = require('./config.js');
const logger = require(`./logger/${config.logger}.js`);
const server = require(`./server/${config.framework}-${config.transport}.js`)(logger);
const staticServer = require('./static.js')(logger);
const hash = require('./hash.js');
const db = require('./db.js')(config.db);

const sandbox = {
  logger: Object.freeze(logger),
  db: Object.freeze(db),
  common: Object.freeze({ hash }),
};
const apiPath = path.join(process.cwd(), './api');
const routing = {};

(async () => {
  const files = await fsp.readdir(apiPath);
  for (const fileName of files) {
    if (!fileName.endsWith('.js')) continue;
    const filePath = path.join(apiPath, fileName);
    const serviceName = path.basename(fileName, '.js');
    routing[serviceName] = require(filePath)(sandbox);
  }

  staticServer('./static', config.static.port);
  server(routing, config.api.port);
})();
