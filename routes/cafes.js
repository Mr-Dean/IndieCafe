const express = require('express');
const router = express.Router();
const asyncCatch = require('../utils/asyncCatch');
const cafes = require('../controllers/cafes');
const { isLoggedIn, isAuthor, validateCafe } = require('../middleware');


router.route('/')
    .get(asyncCatch(cafes.index))
    .post(isLoggedIn, validateCafe, asyncCatch(cafes.createCafe));

router.get('/new', isLoggedIn, cafes.renderNewForm);

router.route('/:id')
    .get(asyncCatch(cafes.showCafe))
    .put(validateCafe, isLoggedIn, isAuthor, asyncCatch(cafes.updateCafe))
    .delete(isLoggedIn, isAuthor, asyncCatch(cafes.deleteCafe));


router.get('/:id/edit', isLoggedIn, isAuthor, asyncCatch(cafes.renderEditCafe));


module.exports = router;