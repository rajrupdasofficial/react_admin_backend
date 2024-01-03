const express = require('express');
const router = express.Router();
const vendorService = require('../vendorsetup/vendorbackend')

// crud vendor
router.post('/',vendorService.createVendor);
router.get('/getvendor',vendorService.getAllVendor);
router.post('/getsinglevendor',vendorService.getsingleVendor);
router.post('/editvendor',vendorService.editVendor);
router.post('/deletevendor',vendorService.deleteVendor);

module.exports = router;