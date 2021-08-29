const express = require('express');
const router = express.Router();
const ExpressError = require('../utils/ExpressError');
const asyncCatch = require('../utils/asyncCatch');
const { cafeSchema } = require('../schemas');
const Cafe = require('../models/cafe');

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
    res.render('cafes/index', {cafes})
}));

router.get('/new', (req, res) => {
    res.render('cafes/new')
});

router.post('/', validateCafe, asyncCatch(async (req, res) => {
    const cafe = new Cafe(req.body.cafe)
    await cafe.save();
    res.redirect(`/cafes/${cafe._id}`);
}));

router.get('/:id', asyncCatch(async (req, res) => {
    const cafe = await Cafe.findById(req.params.id).populate('reviews')
    res.render('cafes/details', { cafe })
}));

router.get('/:id/edit', asyncCatch(async (req, res) => {
   const cafe = await Cafe.findById(req.params.id)
   res.render('cafes/edit', { cafe })
}));

router.put('/:id', validateCafe, asyncCatch(async (req, res) => {
    const { id } = req.params;
    const cafe = await Cafe.findByIdAndUpdate(id, {...req.body.cafe})
    res.redirect(`/cafes/${cafe.id}`)
}));

router.delete('/:id', asyncCatch(async (req, res) => {
    const { id } = req.params;
    await Cafe.findByIdAndDelete(id);
    res.redirect('/cafes');
}))


module.exports = router;