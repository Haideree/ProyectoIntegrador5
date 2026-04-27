 const mysql = require('mysql2');
require('dotenv').config();

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
};

const dbUsuarios = mysql.createPool({ ...config, database: 'servicio_usuarios' });
const dbGeografico = mysql.createPool({ ...config, database: 'servicio_geografico' });
const dbPredial = mysql.createPool({ ...config, database: 'servicio_predial' });
const dbInspecciones = mysql.createPool({ ...config, database: 'servicio_inspecciones' });

module.exports = { dbUsuarios, dbGeografico, dbPredial, dbInspecciones };