({
	async handler({ projectId, userId }) {
		logger.info({ projectId, userId }, 'project/remove-member')
	},
});
