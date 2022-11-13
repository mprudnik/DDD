({
	async handler({ id, name, description, startDate, endDate }) {
		logger.info({ id, name, description, startDate, endDate }, 'project/update');
	},
});
