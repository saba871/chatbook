const express = require('express');
const {
    registar,
    logIn,
    varifyEmail,
    logout,
    autoLogin,
} = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const authContext = express.Router();

// routes
authContext.post('/signup', registar);
authContext.post('/login', logIn);
authContext.get('/auto-login', protect, autoLogin);
authContext.post('/logout', logout);
authContext.get('/verify/:code', varifyEmail);

module.exports = authContext;
