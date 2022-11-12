const { PrismaClient } = require('@prisma/client');

module.exports = async (_options, logger) => {
	const prisma = new PrismaClient({ errorFormat: 'minimal' })

	await prisma.$connect()
	logger.info('DB connected')

	return prisma
}

