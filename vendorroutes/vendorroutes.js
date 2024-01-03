const express = require('express');
const router = express.Router();
const vendorService = require('../vendorsetup/vendorbackend')

router.post('/',vendorService.createVendor);
router.get('/',vendorService.getAllVendor);
module.exports = router;