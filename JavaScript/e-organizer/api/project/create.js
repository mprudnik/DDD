({
	async handler({ name, description, companyId }) {
		logger.info({ name, description, companyId }, 'project/create');
		return { id: '' };
	},
});
