
const express = require('express');
const { adminLoginController, adminRegisterController } = require('../controllers/adminController');
const adminauthMiddleware = require('../middleware/adminauthMiddleware');
const router = express.Router();

router.post('/adminlogin', adminLoginController);
router.post('/adminregister',adminauthMiddleware ,adminRegisterController);

module.exports = router;