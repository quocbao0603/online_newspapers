const knex = require('knex')({
  client: 'mysql2',
  connection: {
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'qlbh',
    port: 3306
  },
  pool: {
    min: 0,
    max: 50
  }
});

module.exports = knex;