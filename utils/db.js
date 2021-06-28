const knex = require("knex")({
  client: "mysql2",
  connection: {
    host: process.env.YOUR_DATABASE_HOST,
    user: process.env.YOUR_DATABASE_USER,
    password: process.env.YOUR_DATABASE_PASSWORD,
    database: process.env.MY_APP_TEST,
    port: process.env.YOUR_DATABASE_PORT,
  },
  pool: {
    min: 0,
    max: 50,
  },
});

module.exports = knex;
