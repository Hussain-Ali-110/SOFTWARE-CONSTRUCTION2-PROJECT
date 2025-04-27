const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { submitPayment, getPayments } = require('../controllers/paymentController');

router.post('/', auth, submitPayment);
router.get('/', auth, getPayments);

module.exports = router;