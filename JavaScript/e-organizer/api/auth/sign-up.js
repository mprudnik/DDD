({
	async handler({ email, password, firstName, lastName }) {
		logger.info({ email, password, firstName, lastName }, 'auth/sign-up');
		return { id: '', token: '' };
	},
});
