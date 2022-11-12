const fastify = require('fastify');
const cors = require('@fastify/cors');

const AppError = require('../error.js');

module.exports = async (routing, port, logger) => {
	const server = fastify({ logger });

	server.register(cors, corsOptions);

	server.get('/', async () => 'It works');

	for (const [serviceName, routes] of Object.entries(routing)) {
		server.register(registerRoutes(routes), { prefix: '/' + serviceName });
	}
};

const registerRoutes = (routes) => async (server) => {
	for (const [routeName, route] of Object.entries(routes)) {
		const options = {
			method: 'POST',
			url: '/' + routeName,
			handler: async (req, reply) => {
				try {
					const params = req.body;

					const result = await route.handler(params);

					if (result) reply.code(200).send(result)
					else reply.code(204).send()
				} catch (error) {
					let code, message;

					if (error instanceof AppError) {
						code = 400;
						message = error.message;	
					} else {
						server.log.error(error, routeName);
						code = 500;
						message = 'Internal server error';
					}

					reply.code(code).send(message);
				}
			},
		};

		server.route(options);
	}
};

const corsOptions = {
	origin: '*',
	methods: '*',
	allowedHeaders: '*',
	credentials: true,
};

