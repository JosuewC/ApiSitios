const sql = require('mssql');
require('dotenv').config();

const config = {
  server: process.env.BDHOST,
  port: parseInt(process.env.BDPORT, 10),
  user: process.env.BDUSER,
  password: process.env.BDPASS,
  database: process.env.BDNAME,
  options: {
    encrypt: true,                // necesario si es conexión remota
    trustServerCertificate: true // para evitar error de certificado
  }
};

const pool = new sql.ConnectionPool(config);

const poolConnect = pool.connect()
  .then(() => console.log('✅ Conexión a SQL Server exitosa'))
  .catch(err => console.error('❌ Error al conectar a SQL Server:', err));

module.exports = {
  sql,
  pool,
  poolConnect
};
