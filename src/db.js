const Pool = require('pg').Pool;

const pool = new Pool({
  user: 'postgres',
  password: 'sabadell',
  host: 'localhost',
  port: 5432,
  database: 'vef2-2021-v2',
});

module.exports = pool;
