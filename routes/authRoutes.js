
const express = require('express');
const { registerController, loginUserController, adminUserRegisterController } = require('../controllers/authController');

const adminauthMiddleware = require('../middleware/adminauthMiddleware');
const router = express.Router();

//register user
//router.post('/register', registerController);

//admin register user
router.post('/user-register-by-admin',adminauthMiddleware,adminUserRegisterController)

//login user
router.post('/login',loginUserController)

module.exports = router;