module.exports = ({ db, logger }) => {
  const country = db('country');

  return {
    read(id) {
      logger.log({ db });
      return country.read(id);
    },
  
    find(mask) {
      const sql = 'SELECT * from country where name like $1';
      return country.query(sql, [mask]);
    },
  };
}

