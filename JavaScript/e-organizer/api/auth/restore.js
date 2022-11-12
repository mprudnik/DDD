({
	async handler({ token }) {
		logger.info('auth/restore', { token });
	},
});
