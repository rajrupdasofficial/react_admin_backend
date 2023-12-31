const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const mysql = require('mysql2');
const connection = require('./dbconn');
const port = require('./port')

const app = express();

app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
}));
connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    // console.log('Connected to MySQL database');
  });
  
  // POST route to save user data
  app.post('/api/users', (req, res) => {
    const userData = req.body;
    console.log(userData.name);
  
    connection.query(
      'INSERT INTO users (username, name, phonenumber, email, password) VALUES (?, ?, ?, ?, ?)',
      [userData.username, userData.name, userData.phone, userData.email, userData.password],
      (error, results) => {
        if (error) {
          console.error('Error saving user:', error);
          return res.status(500).json({ error: 'Failed to save user' });
        }
  
        console.log('User added to database:', results.insertId);
        return res.status(201).json({ message: 'User added successfully' });
      }
    );
  });
  app.get('/api/userdata', (req, res) => {
    connection.query('SELECT * FROM users', (error, results) => {
      if (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ error: 'Failed to fetch users' });
      }
  
      // Assuming results contains the data fetched from the database
      return res.status(200).json({ users: results });
    });
  });
port();