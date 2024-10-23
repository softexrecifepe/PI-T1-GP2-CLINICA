require('dotenv').config()

//Conexão com banco de dados na nuvem e SGBD PostgreSQL:
const { Pool } = require('pg');
const pool = new Pool ({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = { pool };


/* 
Conexão com banco de dados local e SGBD MySQL:

const mysql = require('mysql2');

const dbConnection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: 'veterinary_clinic'
});

module.exports = dbConnection;
*/
