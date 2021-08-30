const express = require('express');
const router = express.Router();
const ExpressError = require('../utils/ExpressError');
const asyncCatch = require('../utils/asyncCatch');
const { cafeSchema } = require('../schemas');
const Cafe = require('../models/cafe');
const { isLoggedIn } = require('../middleware');

const validateCafe = (req, res, next) => {
    const { error } = cafeSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};


router.get('/', asyncCatch(async(req, res) => {
    const cafes = await Cafe.find({});
    res.render('cafes/index', {cafes});
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('cafes/new');
});

router.post('/', isLoggedIn, validateCafe, asyncCatch(async (req, res) => {
    const cafe = new Cafe(req.body.cafe);
    await cafe.save();
    req.flash('success', 'Successfully added a new cafe!');
    res.redirect(`/cafes/${cafe._id}`);
}));

router.get('/:id', asyncCatch(async (req, res) => {
    const cafe = await Cafe.findById(req.params.id).populate('reviews');
    if(!cafe) {
        req.flash('error', 'Cafe not found!');
        return res.redirect('/cafes');
    }
    res.render('cafes/details', { cafe });
}));

router.get('/:id/edit', asyncCatch(async (req, res) => {
   const cafe = await Cafe.findById(req.params.id);
   if(!cafe) {
    req.flash('error', 'Cafe not found!');
    return res.redirect('/cafes');
}
   res.render('cafes/edit', { cafe });
}));

router.put('/:id', validateCafe, asyncCatch(async (req, res) => {
    const { id } = req.params;
    const cafe = await Cafe.findByIdAndUpdate(id, {...req.body.cafe});
    req.flash('success', 'Successfully updated!');
    res.redirect(`/cafes/${cafe.id}`);
}));

router.delete('/:id', asyncCatch(async (req, res) => {
    const { id } = req.params;
    await Cafe.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted cafe!');
    res.redirect('/cafes');
}))


module.exports = router;