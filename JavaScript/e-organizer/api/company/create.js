({
	async handler({ ownerId, ...rest }) {
		logger.info({ ownerId, rest }, 'company/create');
		return { id: 'id-of-created-company' };
	},
});
