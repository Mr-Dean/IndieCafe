const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');


const cafes = require('./routes/cafes');
const reviews = require('./routes/reviews');

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
app.use(express.static(path.join(__dirname, 'public')));


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('home')
});

app.use('/cafes', cafes)
app.use('/cafes/:id/reviews', reviews)

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