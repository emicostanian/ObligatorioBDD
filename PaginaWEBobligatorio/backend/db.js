const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'mysql.reto-ucu.net',
  port: 50006,
  user: 'xr_g9_admin',
  password: 'Bd2025!',
  database: 'XR_Grupo9',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;

