// userService.js
const connection = require('./dbconn');

const userService = {
  createUser: (req, res) => {
    const userData = req.body;
    // console.log(userData);


    connection.query(
      'INSERT INTO users (username, name, phonenumber, email, password,roles,created,octaid) VALUES (?, ?, ?, ?, ?,?,NOW(),?)',
      [userData.username, userData.name, userData.phonenumber, userData.email, userData.password,userData.roles,userData.identity],
      (error, results) => {
        if (error) {
          console.error('Error saving user:', error);
          return res.status(500).json({ error: 'Failed to save user' });
        }

        // console.log('User added to database:', results.insertId);
        return res.status(201).json({ message: 'User added successfully' });
      }
    );
  },
  getAllUsers: (req, res) => {
    connection.query('SELECT * FROM users', (error, results) => {
      if (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ error: 'Failed to fetch users' });
      }

      return res.status(200).json({ users: results });
    });
  },
};

module.exports = userService;
