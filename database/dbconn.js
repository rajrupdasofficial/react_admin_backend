require('dotenv').config()

const mysql = require('mysql2')

// Create the connection to the database
const connection = mysql.createConnection(process.env.DATABASE_URL)

module.exports = connection;