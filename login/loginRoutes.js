const express = require('express');
const router = express.Router();
const loginService = require('./loginService')
router.post('/',loginService.loginUser)
module.exports = router;