const express = require('express');
const app = express();
const path = require('path');
const ExpressError = require('./utils/ExpressError');
const asyncCatch = require('./utils/asyncCatch');
const mongoose = require('mongoose');
const { cafeSchema, reviewSchema } = require('./schemas');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Cafe = require('./models/cafe');
const Review = require('./models/review');

mongoose.set('useFindAndModify', false);

mongoose.connect('mongodb://localhost:27017/indie-cafe', {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

const validateCafe = (req, res, next) => {
    const { error } = cafeSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('home')
});

app.get('/cafes', asyncCatch(async(req, res) => {
    const cafes = await Cafe.find({});
    res.render('cafes/index', {cafes})
}));

app.get('/cafes/new', (req, res) => {
    res.render('cafes/new')
});

app.post('/cafes', validateCafe, asyncCatch(async (req, res) => {
    const cafe = new Cafe(req.body.cafe)
    await cafe.save();
    res.redirect(`/cafes/${cafe._id}`);
}));

app.get('/cafes/:id', asyncCatch(async (req, res) => {
    const cafe = await Cafe.findById(req.params.id).populate('reviews')
    res.render('cafes/details', { cafe })
}));

app.get('/cafes/:id/edit', asyncCatch(async (req, res) => {
   const cafe = await Cafe.findById(req.params.id)
   res.render('cafes/edit', { cafe })
}));

app.put('/cafes/:id', validateCafe, asyncCatch(async (req, res) => {
    const { id } = req.params;
    const cafe = await Cafe.findByIdAndUpdate(id, {...req.body.cafe})
    res.redirect(`/cafes/${cafe.id}`)
}));

app.delete('/cafes/:id', asyncCatch(async (req, res) => {
    const { id } = req.params;
    await Cafe.findByIdAndDelete(id);
    res.redirect('/cafes');
}))

app.post('/cafes/:id/reviews', validateReview, asyncCatch(async(req, res) => {
    const cafe = await Cafe.findById(req.params.id);
    const review = new Review (req.body.review);
    cafe.reviews.push(review);
    await review.save();
    await cafe.save()
    res.redirect(`/cafes/${cafe._id}`);
}))

app.delete('/cafes/:id/reviews/:reviewId', asyncCatch(async(req, res) => {
    const { id, reviewId } = req.params;
    await Cafe.findByIdAndUpdate(id, { $pull: { reviews: reviewId }});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/cafes/${id}`)
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = "Oh no...something went wrong!";
    res.status(statusCode).render('error', { err })
});

app.listen(3002, () => {
    console.log('Listening on port 3002!')
});