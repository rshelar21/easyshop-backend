const express = require('express');
const router = express.Router();
const { webhook } = require('../controller/webhook');

router.post('/', webhook);


module.exports = router;
