require('dotenv').config()

const mysql = require('mysql2')

// Create the connection to the database
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    // optional
    ssl:{"rejectUnauthorized":true}
  });

module.exports = connection;