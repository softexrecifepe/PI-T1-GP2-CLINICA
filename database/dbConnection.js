
require('dotenv').config()

//Conexão com banco de dados no Render e SGBD PostgreSQL:
const { Pool } = require('pg');
const pool = new Pool ({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = { pool };

