const express = require('express');
const router = express.Router();
const asyncCatch = require('../utils/asyncCatch');
const cafes = require('../controllers/cafes');
const reviews = require('../controllers/reviews');
const { isLoggedIn, isAuthor, validateCafe } = require('../middleware');


router.get('/', asyncCatch(cafes.index));

router.get('/new', isLoggedIn, cafes.renderNewForm);

router.post('/', isLoggedIn, validateCafe, asyncCatch(cafes.createCafe));

router.get('/:id', asyncCatch(cafes.showCafe));

router.get('/:id/edit', isLoggedIn, isAuthor, asyncCatch(cafes.renderEditCafe));

router.put('/:id', validateCafe, isLoggedIn, isAuthor, asyncCatch(cafes.updateCafe));

router.delete('/:id', isLoggedIn, isAuthor, asyncCatch(cafes.deleteCafe));


module.exports = router;