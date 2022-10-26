'use strict';

const fsp = require('node:fs').promises;
const path = require('node:path');
const config = require('./config.js');
const logger = require(`./logger/${config.logger}.js`);
const server = require(`./server/${config.framework}-${config.transport}.js`)(logger);
const staticServer = require('./static.js')(logger);
const db = require('./db.js')(config.db);

const apiPath = path.join(process.cwd(), './api');
const diPath = path.join(process.cwd(), config.di.dir);

const loadDeps = async (diPath, options) => {
	const deps = {};

	const files = await fsp.readdir(diPath);
	for (const fileName of files) {
		const filePath = path.join(diPath, fileName);
		const dependencyName = path.basename(fileName, '.js');
		const file = await fsp.stat(filePath);
		const dependencyOptions = options[dependencyName] ?? {};
		const dependency = file.isDirectory() ? await loadDeps(filePath, dependencyOptions) : require(filePath)(dependencyOptions);
		deps[dependencyName] = Object.freeze(dependency);
	}

	return deps;
};

const routing = {};

(async () => {
	const deps = await loadDeps(diPath, config.di.options);
	const sandbox = {
  	logger: Object.freeze(logger),
  	db: Object.freeze(db),
  	...deps,
	};

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

