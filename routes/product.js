const express = require('express');
const router = express.Router();
const {purchase} = require('../controller/product');
const {authCheck} = require('../middleware/auth')

router.post('/', authCheck, purchase)


module.exports = router

