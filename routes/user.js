const express = require('express');
const router = express.Router();
const { login, register, accountDetails, userLogout } = require('../controller/user');
const {authCheck} = require('../middleware/auth')


router.post('/register', register);
router.post('/login', login);
router.get('/account-details', authCheck,  accountDetails);
router.get('/logout', userLogout);

module.exports = router;