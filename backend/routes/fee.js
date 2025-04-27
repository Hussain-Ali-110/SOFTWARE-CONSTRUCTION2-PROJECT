 
const express = require('express');
const router = express.Router();
const { createFee, updateFee } = require('../controllers/feeController');
const auth = require('../middleware/auth');

router.post('/create', auth, createFee);
router.put('/update/:id', auth, updateFee);

module.exports = router;