({
	async handler({ companyId, page, limit, sortBy }) {
		logger.info({ companyId, page, limit, sortBy }, 'employee/list');
		return { count: 10, items: [{ id: '', firstName: '', lastName: '' }] };
	},
});
