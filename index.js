// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./usersetup/userRoutes');
const loginRoutes = require('./login/loginRoutes')

const app = express();

app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
}));

// user information gateway
app.use('/api/users', userRoutes);
// user login gateway
app.use('/login',loginRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
