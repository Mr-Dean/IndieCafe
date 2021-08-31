const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const asyncCatch = require('../utils/asyncCatch');

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', asyncCatch(async(req, res) => {
    try {
        const { email, username, password} = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success', 'Welcome to Indie Cafe!');
            res.redirect('/cafes');
        })} catch(e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome Back!');
    const redirectUrl = req.session.returnTo || '/cafes';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Successfully logged out!');
    res.redirect('/cafes');
})
module.exports = router;