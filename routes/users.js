const express = require('express');
const User = require('../models/user');
const router = express.Router();
const asyncCatch = require('../utils/asyncCatch');

router.get('/register', (req, res) => {
    res.render('users/register');
})

router.post('/register', asyncCatch(async(req, res) => {
    try {
        const { email, username, password} = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.flash('success', 'Welcome to Indie Cafe!');
        res.redirect('/cafes');
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}))
module.exports = router;