({
	async handler({ page, limit, sortBy }) {
		logger.info({ page, limit, sortBy }, 'user/list');
		return { count: 10, items: [{ id: '', email: '' }] };
	},
});
