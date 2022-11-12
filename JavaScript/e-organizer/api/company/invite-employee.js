({
	async handler({ id, userId }) {
		logger.info({ id, userId }, 'company/invite-employee');
		return { id: 'employee-id' };
	},
});
