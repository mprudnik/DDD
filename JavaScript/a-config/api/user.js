module.exports = ({ db, logger, common, test }) => ({
  async read(id) {
		logger.log({ id, hashed: await common.hash(id), text: test('test') });
    return db('users').read(id, ['id', 'login']);
  },

  async create({ login, password }) {
    const passwordHash = await common.hash(password);
    return db('users').create({ login, password: passwordHash });
  },

  async update(id, { login, password }) {
    const passwordHash = await common.hash(password);
    return db('users').update(id, { login, password: passwordHash });
  },

  delete(id) {
    return db('users').delete(id);
  },

  find(mask) {
    const sql = 'SELECT login from users where login like $1';
    return db('users').query(sql, [mask]);
  },
});
