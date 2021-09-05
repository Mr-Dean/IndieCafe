const express = require('express');
const router = express.Router();
const passport = require('passport');
const users = require('../controllers/users');
const asyncCatch = require('../utils/asyncCatch');

router.route('/register')
    .get(users.renderRegister)
    .post(asyncCatch(users.register));

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);


router.get('/logout', users.logout);

module.exports = router;