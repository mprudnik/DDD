'use strict';

const fs = require('node:fs').promises;
const vm = require('node:vm');
const path = require('node:path');

const loadRoute = async (filePath, sandbox, options) => {
  const src = await fs.readFile(filePath, 'utf8');
  const code = `'use strict';\n${src}`;
  const script = new vm.Script(code);
  const context = vm.createContext(Object.freeze({ ...sandbox }));
  const exported = script.runInContext(context, options);
  return exported;
};

module.exports.routing = async (path, sandbox, sandboxOptions) => {
	const fullPath = path.join(process.cwd(), apiPath);
	const routing = {};

	const serviceNames = await fs.readdir(fullPath);
	for (const serviceName of serviceNames) {
		const servicePath = path.join(fullPath, serviceName);
		const file = await fs.stat(servicePath);
		if (!file.isDirectory()) continue;

		routing[serviceName] = {};
		const routeFileNames = await fs.readdir(servicePath);
		for (const fileName of routeFileNames) {
			if (!fileName.endsWith('.js')) continue;
			const routePath = path.join(servicePath, fileName);
			const routeName = path.basename(fileName, '.js');
			routing[serviceName][routeName] = await load(routePath, sandbox, sandboxOptions);
		}
	}

	return routing;
}

module.exports.deps = async (
	dependenciesPath,
	options,
	logger,
) => {
	const fullPath = path.join(process.cwd(), dependenciesPath);
	const fileNames = await fs.readdir(fullPath);

	const dependencies = {};
	for (const fileName of fileNames) {
		const filePath = path.join(fullPath, fileName);
		const file = await fs.stat(filePath);
		if (file.isDirectory()) continue;

		const [dependencyName] = fileName.split('.');
		const loadDependency = require(filePath);
		dependencies[dependencyName] = await loadDependency(options[dependencyName] ?? {}, logger);
	}

	return Object.freeze(dependencies);
}

