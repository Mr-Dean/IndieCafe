const Cafe = require('../models/cafe');

module.exports.index = async(req, res) => {
    const cafes = await Cafe.find({});
    res.render('cafes/index', {cafes});
};

module.exports.renderNewForm = (req, res) => {
    res.render('cafes/new');
};

module.exports.createCafe = async (req, res) => {
    const cafe = new Cafe(req.body.cafe);
    cafe.author = req.user._id; //authorization
    await cafe.save();
    req.flash('success', 'Successfully added a new cafe!');
    res.redirect(`/cafes/${cafe._id}`);
};

module.exports.showCafe = async (req, res) => {
    const cafe = await Cafe.findById(req.params.id).populate({
        path: 'reviews', 
        populate: {
            path: 'author'
        }
    }).populate('author'); //populates reviews and authors
    if(!cafe) {
        req.flash('error', 'Cafe not found!');
        return res.redirect('/cafes');
    }
    res.render('cafes/details', { cafe });
};

module.exports.renderEditCafe = async (req, res) => {
    const cafe = await Cafe.findById(req.params.id);
    if(!cafe) {
     req.flash('error', 'Cafe not found!');
     return res.redirect('/cafes');
 }
    res.render('cafes/edit', { cafe });
 };

 module.exports.updateCafe = async (req, res) => {
    const { id } = req.params;
    const cafe = await Cafe.findByIdAndUpdate(id, {...req.body.cafe});
    req.flash('success', 'Successfully updated!');
    res.redirect(`/cafes/${cafe.id}`);
};

module.exports.deleteCafe = async (req, res) => {
    const { id } = req.params;
    await Cafe.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted cafe!');
    res.redirect('/cafes');
};