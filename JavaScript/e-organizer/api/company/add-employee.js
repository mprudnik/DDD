({
	async handler({ id, email, firstName, lastName }) {
		logger.info({ id, userId }, 'company/add-employee');
		return { id: 'employee-id' };
	},
});
