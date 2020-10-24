require('dotenv').config();
const mysql = require('mysql');
const util = require('util');

// Create connection pool
const pool = mysql.createPool({
  connectionLimit: 3000,
  host: process.env.DB_CONN_HOST,
  user: process.env.DB_CONN_USER,
  password: process.env.DB_CONN_PW,
  database: process.env.DB_CONN_DBNAME,
  multipleStatements: true,
});

// Check connection errors
pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database Error: Connection was closed.');
    } else if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database Error: Database has too many connections.');
    } else if (err.code === 'ECONNREFUSED') {
      console.error('Database Error: Connection was refused.');
    }
  }

  if (connection) connection.release();

  // Return the connection back into the pool so we can use it with query object
  return;
});

// Wrap the query object with util.promisify
// so we can use async/await when running db query
pool.query = util.promisify(pool.query);

module.exports = pool;
