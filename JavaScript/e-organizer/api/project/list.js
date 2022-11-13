({
	async handler({ companyId, page, limit, sortBy }) {
		logger.info({ companyId, page, limit, sortBy }, 'project/list');
		return { count: 10, items: [{ id: '', name: '', description: '' }] };
	},
});
