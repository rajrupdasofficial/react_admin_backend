// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./agentroutes/agentroutes');
const loginRoutes = require('./loginroutes/loginRoutes');
const vendorRoutes =  require('./vendorroutes/vendorroutes');

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

// vendor api gateway

app.use('/api/vendor',vendorRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
