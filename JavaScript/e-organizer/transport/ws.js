'use strict';

const { App } = require('uWebSockets.js');

module.exports = (routing, port, logger) => {
  const app = new App();

	app.ws('/*', {
		async message(ws, msgBuff, isBinary) {
			const ip = ab2str(ws.getRemoteAddressAsText());
			const message = ab2str(msgBuff);
      const obj = JSON.parse(message);
      const { name, method, args = [] } = obj;
      const entity = routing[name];
      if (!entity) return ws.send('"Not found"', isBinary);
      const route = entity[method];
      if (!route) return ws.send('"Not found"', isBinary);
      const json = JSON.stringify(args);
      const parameters = json.substring(1, json.length - 1);
      logger.info(`${ip} ${name}.${method}(${parameters})`);
      try {
        const result = await route.handler(args);
        ws.send(JSON.stringify(result), isBinary);
      } catch (err) {
        console.error(err);
        ws.send('"Server error"', isBinary);
      }
		},
	});

	app.listen(port, (socket) => {
		if (socket) logger.info(`API on port ${port}`);
	});
};

const ab2str = (ab) => Buffer.from(ab).toString('utf-8');
