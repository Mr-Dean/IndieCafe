const express = require('express');
const router = express.Router({ mergeParams: true });
const asyncCatch = require('../utils/asyncCatch');

const reviews = require('../controllers/reviews');
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware');


router.post('/', isLoggedIn, validateReview, asyncCatch(reviews.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, asyncCatch(reviews.deleteReview));

module.exports = router;