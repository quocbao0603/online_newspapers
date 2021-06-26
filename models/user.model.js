const db = require('../utils/db');

module.exports = {
  all() {
    return db('users');
  },

  add(user) {
    return db('users').insert(user);
  },

  async findByUsername(username) {
    const rows = await db('users').where('username', username);
    if (rows.length === 0)
      return null;

    return rows[0];
  },
};
