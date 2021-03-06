const Cafe = require('../models/cafe');
const cloudinary = require('../cloudinary');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async(req, res) => {
    const cafes = await Cafe.find({});
    res.render('cafes/index', {cafes});
};

module.exports.all = async(req, res) => {
    const cafes = await Cafe.find({});
    res.render('cafes/all', {cafes});
};

module.exports.renderNewForm = (req, res) => {
    res.render('cafes/new');
};

module.exports.createCafe = async (req, res) => {
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.cafe.address,
        limit: 1
    }).send()
    const cafe = new Cafe(req.body.cafe);
    cafe.geometry = geoData.body.features[0].geometry;
    cafe.images = req.files.map(f => ({ url: f.path, filename: f.filename })); //storing cloudinary links into mongo.
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
    const images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    cafe.images.push(...images);
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await cafe.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages} } } })
    }
    await cafe.save()
    req.flash('success', 'Successfully updated!');
    res.redirect(`/cafes/${cafe.id}`);
};

module.exports.deleteCafe = async (req, res) => {
    const { id } = req.params;
    await Cafe.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted cafe!');
    res.redirect('/cafes');
};