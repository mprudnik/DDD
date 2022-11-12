'use strict';

module.exports = {
  static: {
		path: 'static',
    port: 8000,
  },
  api: {
		path: 'api',
    port: 8001,
    transport: 'http',
  },
  sandbox: {
    timeout: 5000,
    displayErrors: false,
  },
	deps: {
		path: 'dependencies',
		options: {},
	},
}
