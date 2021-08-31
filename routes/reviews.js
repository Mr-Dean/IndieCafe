const express = require('express');
const router = express.Router({ mergeParams: true });
const asyncCatch = require('../utils/asyncCatch');
const Cafe = require('../models/cafe');
const Review = require('../models/review');
const { isLoggedIn, validateReview } = require('../middleware');


router.post('/', isLoggedIn, validateReview, asyncCatch(async(req, res) => {
    const cafe = await Cafe.findById(req.params.id);
    const review = new Review (req.body.review);
    review.author = req.user._id;
    cafe.reviews.push(review);
    await review.save();
    await cafe.save()
    req.flash('success', 'Created new review!');
    res.redirect(`/cafes/${cafe._id}`);
}))

router.delete('/:reviewId', asyncCatch(async(req, res) => {
    const { id, reviewId } = req.params;
    await Cafe.findByIdAndUpdate(id, { $pull: { reviews: reviewId }});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/cafes/${id}`)
}))

module.exports = router;