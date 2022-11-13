({
	async handler({ companyId, email, firstName, lastName }) {
		logger.info({ companyId, email, firstName, lastName }, 'company/add-employee');
		return { id: 'employee-id' };
	},
});
