// userRoutes.js
const express = require('express');
const router = express.Router();
const userService = require('./userService');

router.post('/', userService.createUser);
router.get('/', userService.getAllUsers);

module.exports = router;
