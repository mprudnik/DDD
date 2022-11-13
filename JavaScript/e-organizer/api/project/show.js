({
	async handler({ id }) {
		logger.info({ id }, 'project/show');
		return { id: '', name: '', description: '', startDate: '', members: [{ id: '' }] };
	},
});
