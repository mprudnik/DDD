({
	async handler({ login, password }) {
		logger.info('auth/sign-in', { login, password });
		return { token: 'no-token-provided' }
	},
});
