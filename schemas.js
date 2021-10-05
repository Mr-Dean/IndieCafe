const Joi = require('joi');

module.exports.cafeSchema = Joi.object({
    cafe: Joi.object({
        name: Joi.string().required(),
        //image: Joi.string().required(),
        address: Joi.string().required(),
        description: Joi.string().required()
    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required(),
        body: Joi.string().required()
    }).required()
})