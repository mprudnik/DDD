({
	async handler({ email, password }) {
		logger.info({ email, password }, 'auth/sign-in');
		return { token: 'no-token-provided' }
	},
});
