const express = require('express');
const router = express.Router();
const passport = require('passport');
const users = require('../controllers/users');
const asyncCatch = require('../utils/asyncCatch');

router.get('/register', users.renderRegister);

router.post('/register', asyncCatch(users.register));

router.get('/login', users.renderLogin);

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

router.get('/logout', users.logout)
module.exports = router;