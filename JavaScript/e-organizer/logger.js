'use strict';

const pino = require('pino');
const util = require('node:util');
const path = require('node:path');

const PinoLevelToSeverityLookup = {
	trace: 'DEBUG',
	debug: 'DEBUG',
	info: 'INFO',
	warn: 'WARNING',
	error: 'ERROR',
	fatal: 'CRITICAL',
}

const options = {
	development: {
		level: 'debug',
		transport: {
			target: 'pino-pretty',
			options: {
				ignore: 'pid,hostname',
			},
		},
	},
	production: {
		messageKey: 'message',
		formatters: {
			level (label, number) {
				return {
					severity: PinoLevelToSeverityLookup[label] || PinoLevelToSeverityLookup.info,
					level: number,
				}
			},
		},
	},
	test: {
		level: 'silent',
	},
}

class Logger {
  constructor() {
    this.logger = pino(options[process.env.NODE_ENV] ?? {});
		this.regexp = new RegExp(path.dirname(process.cwd()), 'g');
  }

  debug(obj, msg) {
    this.logger.debug(obj, msg);
  }

  log(obj, msg) {
    this.logger.info(obj, msg);
  }

	warn(obj, msg) {
		this.logger.warn(obj, msg);
	}

  error(obj, msg) {
		if (obj?.stack) obj.stack = obj.stack.replace(this.regexp, '')
		this.write(obj, msg);
  }
}

module.exports = new Logger();
