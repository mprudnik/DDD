'use strict';

const logger = require('./logger.js');
const config = require('./config.js');
const load = require('./load.js');
const transport = require(`./transport/${config.api.transport}.js`);
const staticServer = require('./static.js');
const AppError = require('./error.js');

const start = async () => {
	const deps = await load.deps(config.deps.path, config.deps.options, logger);
	
	const sandbox = Object.freeze({
		logger: Object.freeze(logger),
		Error: AppError,
		...deps,
	});

  const routing = await load.routing(config.api.path, sandbox, config.sandbox);

  staticServer(config.static.path, config.static.port, logger);
  await transport(routing, config.api.port, logger);
};

start();

module.exports = { start };
