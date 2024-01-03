// userRoutes.js
const express = require('express');
const router = express.Router();
const userService = require('../agentsetup/agentbackend');

router.post('/', userService.createUser);
router.get('/', userService.getAllUsers);
router.post('/delete',userService.deleteUser);

module.exports = router;
