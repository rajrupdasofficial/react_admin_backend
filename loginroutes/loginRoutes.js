const express = require('express');
const router = express.Router();
const loginService = require('../login/loginService')
router.post('/',loginService.loginUser)
module.exports = router;