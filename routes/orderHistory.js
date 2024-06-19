const express = require('express');
const router = express.Router();
const {orderData} = require("../controller/orderHistory")
const {authCheck} = require('../middleware/auth')


router.get('/orders', authCheck, orderData)

module.exports = router;